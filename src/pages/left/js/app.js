import 'regenerator-runtime/runtime'; // for parcel bug - to use async await
import { API_TYPE, setFallback } from '../../../js/apis/climacell.js';
import { getCurrentTime, getDayData } from '../../../js/app.js';
import { WEATHER_CONDITIONS, REALTIME_INTERVAL } from '../../../js/constants';
import { getStationInfo } from '../../../js/board.js';
import {
  icons,
  parseWeatherCode,
  getDaypart,
  getWeatherData,
} from '../../../js/weatherApi';

const setLeftData = (realtime, dayInfo) => {
  // set temp
  document.querySelector('#now h2.temp').innerHTML = `${Math.round(
    realtime.temperature
  )}˚`;

  // set feels like temp
  document.querySelector('#now .subh .temp').innerHTML = `${Math.round(
    realtime.temperatureApparent
  )}˚`;

  // set weather description
  document.querySelector('#now h3').innerHTML =
    WEATHER_CONDITIONS[realtime.weatherCode];

  // set icon and background
  const daypart = getDaypart(
    new Date(),
    new Date(dayInfo.sunriseTime).getTime(),
    new Date(dayInfo.sunsetTime).getTime()
  );
  // console.log(daypart);
  document.querySelector('#now img').src =
    icons[parseWeatherCode(realtime.weatherCode, daypart)];
  document.querySelector('#now').classList = `${daypart} tri`;
};

document.addEventListener('DOMContentLoaded', ready);
async function ready() {
  const stationInfo = getStationInfo();

  // set current time
  document.querySelector('#now .time').innerHTML = getCurrentTime();

  // get cache
  let lastUpdatedLeft = localStorage.getItem('lastUpdatedLeft');
  let leftData = JSON.parse(localStorage.getItem('leftData'));
  let stationID = localStorage.getItem('stationID');

  try {
    const dayData = await getDayData(stationInfo);

    if (
      !leftData ||
      stationID !== stationInfo.id ||
      Date.now() - lastUpdatedLeft * 1 > REALTIME_INTERVAL
    ) {
      const newLeftData = await getWeatherData(
        stationInfo.lat,
        stationInfo.lon,
        API_TYPE.LEFT
      );

      // console.log('left => ', data);
      const { timelines } = newLeftData;
      if (timelines) {
        const realtimeData = timelines[0].intervals[0].values;
        setLeftData(realtimeData, dayData);

        localStorage.setItem('leftData', JSON.stringify({ realtimeData }));
        localStorage.setItem('lastUpdatedLeft', Date.now());
      }
    } else {
      setLeftData(leftData.realtimeData, dayData);
    }
  } catch (err) {
    console.log(err);
    setFallback();
  }
}
