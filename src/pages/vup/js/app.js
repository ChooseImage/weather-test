import 'regenerator-runtime/runtime'; // for parcel bug - to use async await
import { API_TYPE, setFallback } from '../../../js/apis/climacell.js';
import { getDayData } from '../../../js/app.js';
import { WEATHER_CONDITIONS, REALTIME_INTERVAL } from '../../../js/constants';
import { getStationInfo } from '../../../js/board.js';
import {
  getWeatherData,
  icons,
  parseWeatherCode,
  getSunTime,
  getDaypart,
} from '../../../js/weatherApi';
import debug from '../../../js/debug.js';

const setRealtimeData = (realtime, dayInfo) => {
  // set sunrise/sunset info
  const sunriseTime = new Date(dayInfo.sunriseTime).getTime();
  const sunsetTime = new Date(dayInfo.sunsetTime).getTime();

  const sunInfo = getSunTime(dayInfo.sunriseTime, dayInfo.sunsetTime);
  // set icon and background
  const daypart = getDaypart(new Date(), sunriseTime, sunsetTime);

  // console.log(daypart);
  document.querySelector('#forecast img').src =
    icons[parseWeatherCode(realtime.weatherCode, daypart)];
  document.querySelector('#now').classList = daypart;

  document.querySelector('#forecast h2.temp').innerHTML = `${Math.round(
    realtime.temperature
  )}˚`;

  // set feels like temp
  document.querySelector('#forecast .subh .temp').innerHTML = `${Math.round(
    realtime.temperatureApparent
  )}˚`;

  // set weather description
  document.querySelector('#forecast h3').innerHTML =
    WEATHER_CONDITIONS[realtime.weatherCode];
};

document.addEventListener('DOMContentLoaded', ready);
async function ready() {
  // debug(true);
  const stationInfo = getStationInfo();

  // set date
  document.querySelector('#today').innerHTML = new Date().toLocaleDateString(
    'en-US',
    {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }
  );

  // get cache
  let lastUpdatedVup = localStorage.getItem('lastUpdatedVup');
  let vupData = JSON.parse(localStorage.getItem('vupData'));
  let stationID = localStorage.getItem('stationID');

  const title = document.querySelector('#station-title');
  title.innerHTML = stationInfo && stationInfo.name;
  if (stationInfo && stationInfo.name.length > 26)
    title.classList.add('long-text');

  try {
    const dayData = await getDayData(stationInfo);

    // get vup data
    if (
      !vupData ||
      stationID !== stationInfo.id ||
      Date.now() - lastUpdatedVup * 1 > REALTIME_INTERVAL
    ) {
      const newVupData = await getWeatherData(
        stationInfo.lat,
        stationInfo.lon,
        API_TYPE.VUP
      );

      const { timelines } = newVupData;
      if (timelines) {
        const realtimeData = timelines[0].intervals[0].values;
        setRealtimeData(realtimeData, dayData);
        localStorage.setItem(
          'vupData',
          JSON.stringify({
            realtimeData,
          })
        );
        localStorage.setItem('lastUpdatedVup', Date.now());
      }
    } else {
      setRealtimeData(vupData.realtimeData, dayData);
    }
  } catch (err) {
    console.log(err);
    setFallback();
  }
}
