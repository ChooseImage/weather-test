import 'regenerator-runtime/runtime'; // for parcel bug - to use async await
import { API_TYPE, setFallback } from '../../../js/apis/climacell.js';
import { WEATHER_CONDITIONS, FORECAST_INTERVAL } from '../../../js/constants';
import { getStationInfo } from '../../../js/board.js';
import {
  getWeatherData,
  icons,
  parseWeatherCode,
  getForecastTime,
  getDaypart,
  getForecastIndex,
} from '../../../js/weatherApi';
import { getDayData } from '../../../js/app.js';

const setCenterData = (forecast, dayInfo) => {
  const idx = getForecastIndex(forecast[0].startTime);
  // set temp
  document.querySelector('#forecast-1 h2.temp').innerHTML = `${Math.round(
    forecast[idx].values.temperature
  )}˚`;

  // set feels like temp
  document.querySelector('#forecast-1 .subh .temp').innerHTML = `${Math.round(
    forecast[idx].values.temperatureApparent
  )}˚`;

  // set weather description
  document.querySelector('#forecast-1 h3').innerHTML =
    WEATHER_CONDITIONS[forecast[idx].values.weatherCode];

  // set forecast time
  document.querySelector('#forecast-1 h2.time').innerHTML = getForecastTime(
    forecast[idx].startTime
  );

  // set icon and background
  const daypart = getDaypart(
    new Date(forecast[idx].startTime),
    new Date(dayInfo.sunriseTime).getTime(),
    new Date(dayInfo.sunsetTime).getTime()
  );
  document.querySelector('#forecast-1 img').src =
    icons[parseWeatherCode(forecast[idx].values.weatherCode, daypart)];
  document.querySelector('#forecast-1').classList = `${daypart} tri`;
};

document.addEventListener('DOMContentLoaded', ready);
async function ready() {
  const stationInfo = getStationInfo();
  document.querySelector('#station-title').innerHTML = stationInfo.name;
  // set date
  document.querySelector('#today').innerHTML = new Date().toLocaleDateString(
    'en-US',
    {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }
  );

  let lastUpdatedCenter = localStorage.getItem('lastUpdatedCenter');
  let centerData = JSON.parse(localStorage.getItem('centerData'));
  let stationID = localStorage.getItem('stationID');

  try {
    const dayData = await getDayData(stationInfo);

    if (
      !centerData ||
      stationID !== stationInfo.id ||
      Date.now() - lastUpdatedCenter * 1 > FORECAST_INTERVAL
    ) {
      const newCenterData = await getWeatherData(
        stationInfo.lat,
        stationInfo.lon,
        API_TYPE.CENTER
      );

      // console.log('center => ', data);
      const { timelines } = newCenterData;
      if (timelines) {
        const forecastData = timelines[0].intervals;
        setCenterData(forecastData, dayData);
        localStorage.setItem(
          'centerData',
          JSON.stringify({
            forecastData,
          })
        );
        localStorage.setItem('lastUpdatedCenter', Date.now());
      }
    } else {
      setCenterData(centerData.forecastData, dayData);
    }
  } catch (err) {
    console.log(err);
    setFallback();
  }
}
