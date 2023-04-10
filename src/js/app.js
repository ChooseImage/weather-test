/**
 * Global js file
 */

import { API_TYPE, getWeatherData } from './apis/climacell';
import { DAY_INTERVAL } from './constants';

/*********************
 * Common Functions
 *********************/

const fetchData = (url, handleErr) => {
  return fetch(url)
    .then(res => res.json())
    .catch(err => {
      console.log('fetchData error => ', err);
      if (handleErr) handleErr();
    });
};

// get day/night state for assets
const isDay = hur => {
  return hur < 19;
};

// for calculating forecast hour
Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this.toISOString();
};

// get the start/end time of the day
const getDayTimeStr = hur => {
  return new Date(new Date().setHours(hur)).toISOString();
};

const createTempText = temp => temp + '°';

const setElementContent = (id, content) => {
  document.getElementById(id).innerHTML = content;
};

const degToDir = num => {
  var val = Math.floor(num / 22.5 + 0.5);
  var arr = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW',
  ];
  return arr[val % 16];
};

const getCurrentTime = () => {
  return new Date()
    .toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    .toLowerCase();
};
const hideFallback = ()=>{
  document.getElementById('fallback').style.display = 'none'
}
const getDayData = stationInfo => {
  let lastUpdatedDay = localStorage.getItem('lastUpdatedDay');
  let dayData = JSON.parse(localStorage.getItem('dayData'));
  let stationID = localStorage.getItem('stationID');

  const parseDayData = dataArr => {
    hideFallback()
    return Date.now() > new Date(dataArr[0].values.sunsetTime)
      ? dataArr[1].values
      : dataArr[0].values;
  };

  if (
    !dayData ||
    stationID !== stationInfo.id ||
    Date.now() - lastUpdatedDay * 1 > DAY_INTERVAL
  ) {
    return getWeatherData(stationInfo.lat, stationInfo.lon, API_TYPE.DAY).then(
      data => {
        const { timelines } = data;
        let newDayData;
        if (timelines) {
          newDayData = timelines[0].intervals;
          localStorage.setItem('lastUpdatedDay', Date.now());
          localStorage.setItem('dayData', JSON.stringify(newDayData));
          localStorage.setItem('stationID', stationInfo.id);
          // TODO: hide fallback
        }
        return parseDayData(newDayData);
      }
    );
  } else {
    return parseDayData(dayData);
  }
};

const getUVIndex = index => {
  if (index <= 2) {
    return 'Low';
  } else if (index <= 5) {
    return 'Moderate';
  } else if (index <= 7) {
    return 'High';
  } else if (index <= 10) {
    return 'Very High';
  } else if (index >= 11) {
    return 'Extreme';
  } else {
    return '--';
  }
};

export {
  createTempText,
  setElementContent,
  getDayTimeStr,
  fetchData,
  isDay,
  getCurrentTime,
  degToDir,
  getDayData,
  getUVIndex,
};
