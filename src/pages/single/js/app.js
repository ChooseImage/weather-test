import 'regenerator-runtime/runtime'; // for parcel bug - to use async await
import { getCurrentTime, degToDir, getDayData } from '../../../js/app';
import {
  icons,
  parseWeatherCode,
  getForecastTime,
  getDaypart,
  getForecastIndex,
  getWeatherData,
} from '../../../js/weatherApi';
import { getStationInfo } from '../../../js/board.js';
import { WEATHER_CONDITIONS, REALTIME_INTERVAL } from '../../../js/constants';
import { API_TYPE, setFallback } from '../../../js/apis/climacell';

const setRealtimeData = realtime => {
  // console.log(realtime);

  // current weather
  document.querySelector('#now h2 .temp').innerHTML = `${Math.round(
    realtime.temperature
  )}˚`;
  document.querySelector('#now .subh .temp').innerHTML = `${Math.round(
    realtime.temperatureApparent
  )}˚`;
  document.querySelector('#now h3').innerHTML =
    WEATHER_CONDITIONS[realtime.weatherCode];
};

const setForecastData = forecast => {
  const idx = getForecastIndex(forecast[0].startTime);
  // forecast + 2 hours
  document.querySelector('#forecast-1 h2 .temp').innerHTML = `${Math.round(
    forecast[idx].values.temperature
  )}˚`;
  document.querySelector('#forecast-1 .subh .temp').innerHTML = `${Math.round(
    forecast[idx].values.temperatureApparent
  )}˚`;
  document.querySelector('#forecast-1 h3').innerHTML =
    WEATHER_CONDITIONS[forecast[idx].values.weatherCode];
  document.querySelector('#forecast-1 .time').innerHTML = getForecastTime(
    forecast[idx].startTime
  );

  // forecast + 4 hours
  document.querySelector('#forecast-2 h2 .temp').innerHTML = `${Math.round(
    forecast[idx + 2].values.temperature
  )}˚`;
  document.querySelector('#forecast-2 .subh .temp').innerHTML = `${Math.round(
    forecast[idx + 2].values.temperatureApparent
  )}˚`;
  document.querySelector('#forecast-2 h3').innerHTML =
    WEATHER_CONDITIONS[forecast[idx + 2].values.weatherCode];
  document.querySelector('#forecast-2 .time').innerHTML = getForecastTime(
    forecast[idx + 2].startTime
  );
};

const setIconBg = (realtime, forecast, dayInfo) => {
  // set icons and backgrounds
  const sunriseTime = new Date(dayInfo.sunriseTime).getTime();
  const sunsetTime = new Date(dayInfo.sunsetTime).getTime();
  // console.log(new Date(day.sunsetTime));

  const daypartNow = getDaypart(new Date(), sunriseTime, sunsetTime);
  document.querySelector('#now img').src =
    icons[parseWeatherCode(realtime.weatherCode, daypartNow)];
  document.querySelector('#now').classList = daypartNow;

  const idx = getForecastIndex(forecast[0].startTime);
  const daypartF1 = getDaypart(
    new Date(forecast[idx].startTime),
    sunriseTime,
    sunsetTime
  );
  document.querySelector('#forecast-1 img').src =
    icons[parseWeatherCode(forecast[idx].values.weatherCode, daypartF1)];
  document.querySelector('#forecast-1').classList = daypartF1;

  const daypartF2 = getDaypart(
    new Date(forecast[idx + 2].startTime),
    sunriseTime,
    sunsetTime
  );
  document.querySelector('#forecast-2 img').src =
    icons[parseWeatherCode(forecast[idx + 2].values.weatherCode, daypartF2)];
  document.querySelector('#forecast-2').classList = daypartF2;
};

document.addEventListener('DOMContentLoaded', ready);
async function ready() {
  const stationInfo = getStationInfo();
  if (stationInfo) {
    document.querySelector('#station-title').innerHTML = stationInfo.name;
  }
  // get cache
  let lastUpdatedSingle = localStorage.getItem('lastUpdatedSingle');
  let singleData = JSON.parse(localStorage.getItem('singleData'));
  let stationID = localStorage.getItem('stationID');

  // set current time
  document.querySelector('#today').innerHTML = new Date().toLocaleDateString(
    'en-US',
    {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }
  );
  document.querySelector('#now .time').innerHTML = getCurrentTime();

  try {
    const dayData = await getDayData(stationInfo);

    // get single data
    if (
      !singleData ||
      stationID !== stationInfo.id ||
      Date.now() - lastUpdatedSingle * 1 > REALTIME_INTERVAL
    ) {
      const newSingleData = await getWeatherData(
        stationInfo.lat,
        stationInfo.lon,
        API_TYPE.SINGLE
      );

      // console.log('single => ', data);
      const { timelines } = newSingleData;
      if (timelines) {
        const tCurrent = timelines.find(t => t.timestep === 'current');
        const t1h = timelines.find(t => t.timestep === '1h');
        const realtimeData = tCurrent.intervals[0].values;
        const forecastData = t1h.intervals;
        // const dayData = timelines[2].intervals[0].values;
        setRealtimeData(realtimeData);
        setForecastData(forecastData);
        setIconBg(realtimeData, forecastData, dayData);
        localStorage.setItem(
          'singleData',
          JSON.stringify({
            realtimeData,
            forecastData,
          })
        );
        localStorage.setItem('lastUpdatedSingle', Date.now());
      }
    } else {
      setRealtimeData(singleData.realtimeData);
      setForecastData(singleData.forecastData);
      setIconBg(singleData.realtimeData, singleData.forecastData, dayData);
    }
  } catch (err) {
    console.log(err);
    setFallback();
  }
}
