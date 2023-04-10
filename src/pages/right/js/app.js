import 'regenerator-runtime/runtime'; // for parcel bug - to use async await
import { API_TYPE, setFallback } from '../../../js/apis/climacell.js';
import { degToDir, getDayData, getUVIndex } from '../../../js/app.js';
import {
  WEATHER_CONDITIONS,
  FORECAST_INTERVAL,
  AIR_QUALITY,
} from '../../../js/constants';
import {
  getWeatherData,
  icons,
  parseWeatherCode,
  getSunTime,
  getForecastTime,
  getDaypart,
  getForecastIndex,
} from '../../../js/weatherApi';
import { getStationInfo } from '../../../js/board.js';

const setRealtimeData = realtime => {
  // set humidity
  document.querySelector('#humidity').innerHTML = `${Math.round(
    realtime.humidity
  )}%`;

  // set wind data
  document.querySelector('#wind').innerHTML = `${Math.round(
    realtime.windSpeed
  )} MPH ${degToDir(realtime.windDirection)}`;

  // set uv index
  document.querySelector('#uv-index').innerHTML = `${
    realtime.uvIndex
  } ${getUVIndex(+realtime.uvIndex)}`;

  // set air quality
  document.querySelector('#air-quality').innerHTML = `${realtime.epaIndex} ${
    AIR_QUALITY[+realtime.epaHealthConcern]
  }`;
};

const setForecastData = forecast => {
  const idx = getForecastIndex(forecast[0].startTime) + 2;
  // set temp
  document.querySelector('#forecast-2 h2.temp').innerHTML = `${Math.round(
    forecast[idx].values.temperature
  )}˚`;

  // set feels like temp
  document.querySelector('#forecast-2 .subh .temp').innerHTML = `${Math.round(
    forecast[idx].values.temperatureApparent
  )}˚`;

  // set weather description
  document.querySelector('#forecast-2 h3').innerHTML =
    WEATHER_CONDITIONS[forecast[idx].values.weatherCode];

  // set forecast time
  document.querySelector('#forecast-2 h2.time').innerHTML = getForecastTime(
    forecast[idx].startTime
  );
};

const setDayData = (forecast, dayInfo) => {
  // set sunrise/sunset info
  const sunriseTime = new Date(dayInfo.sunriseTime).getTime();
  const sunsetTime = new Date(dayInfo.sunsetTime).getTime();

  const sunInfo = getSunTime(dayInfo.sunriseTime, dayInfo.sunsetTime);
  document.querySelector('#sun-title').innerHTML = sunInfo.title;
  document.querySelector('#sun-time').innerHTML = sunInfo.time;

  // set icon and background
  const idx = getForecastIndex(forecast[0].startTime) + 2;
  const daypart = getDaypart(
    new Date(forecast[idx].startTime),
    sunriseTime,
    sunsetTime
  );
  document.querySelector('#forecast-2 img').src =
    icons[parseWeatherCode(forecast[idx].values.weatherCode, daypart)];
  document.querySelector('#forecast-2').classList = `${daypart} tri`;
};

document.addEventListener('DOMContentLoaded', ready);
async function ready() {
  const stationInfo = getStationInfo();

  // get cache
  let lastUpdatedRight = localStorage.getItem('lastUpdatedRight');
  let rightData = JSON.parse(localStorage.getItem('rightData'));
  let stationID = localStorage.getItem('stationID');

  try {
    const dayData = await getDayData(stationInfo);

    // get right data
    if (
      !rightData ||
      stationID !== stationInfo.id ||
      Date.now() - lastUpdatedRight * 1 > FORECAST_INTERVAL
    ) {
      const newRightData = await getWeatherData(
        stationInfo.lat,
        stationInfo.lon,
        API_TYPE.RIGHT
      );

      // console.log('right => ', data);
      const { timelines } = newRightData;
      if (timelines) {
        const tCurrent = timelines.find(t => t.timestep === 'current');
        const t1h = timelines.find(t => t.timestep === '1h');
        const realtimeData = tCurrent.intervals[0].values;
        const forecastData = t1h.intervals;

        setRealtimeData(realtimeData);
        setForecastData(forecastData);
        setDayData(forecastData, dayData);
        localStorage.setItem(
          'rightData',
          JSON.stringify({ realtimeData, forecastData })
        );
        localStorage.setItem('lastUpdatedRight', Date.now());
      }
    } else {
      setRealtimeData(rightData.realtimeData);
      setForecastData(rightData.forecastData);
      setDayData(rightData.forecastData, dayData);
    }
  } catch (err) {
    console.log(err);
    setFallback();
  }
}
