

const BASE_URL = 'https://api.tomorrow.io/v4/'
const getTimelineURL = 'https://api.tomorrow.io/v4/'
const apikey = 'QX5jHmzWfoGvZBPZk7oFzJsbPuZWa8RK'

export const API_TYPE = {
  SINGLE: 'single',
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
  VUP: 'vup',
  DAY: 'day',
};

const STATUS = {
  DAY: 'day',
  DUSK: 'dusk',
  NIGHT: 'night',
};

const fields = [
  "temperature",
  "temperatureApparent",
  "weatherCode",
];

const units = "metric";

const timesteps = ["current", "1h", "1d"];

// configure the time frame up to 6 hours back and 15 days out
// const now = moment.utc();
// const startTime = moment.utc(now).add(0, "minutes").toISOString();
// const endTime = moment.utc(now).add(1, "days").toISOString();

// specify the timezone, using standard IANA timezone format
const timezone = "America/New_York";

const composeUrl = () => {
  return BASE_URL + getTimelineParameters
}

const fetchData = (handleErr) => {
  let composeUrl = `https://api.tomorrow.io/v4/timelines?location=40.75872069597532,-73.98529171943665&fields=windDirection&fields=weatherCode&fields=windSpeed&fields=uvIndex&fields=humidity&fields=temperature&fields=precipitationIntensity&fields=temperatureApparent&timesteps=1h&units=imperial&apikey=QX5jHmzWfoGvZBPZk7oFzJsbPuZWa8RK`
  return fetch(composeUrl)
    .then(res => res.json())
    .catch(err => {
      console.log('fetchData error => ', err);
      if (handleErr) handleErr();
    });
};

export const setFallback = () => {
  // document.querySelector('#fallback').style.display = 'block';
};

export const getWeatherData = (lat, lon) => {
  return fetchData(setFallback).then(
    data => data.data
  );
};



// --------------------------------------------------------------------------


// import { fetchData } from '../app';

// // const BASE_URL = 'https://api.climacell.co/v3/weather/';
// const BASE_URL = 'https://api.tomorrow.io/v4/';
// // const API_KEY = 'fytHP6dyBi7TfXM8mOji5jZteZU0DUko';
// const API_KEY = 'QX5jHmzWfoGvZBPZk7oFzJsbPuZWa8RK';
// export const API_TYPE = {
//   SINGLE: 'single',
//   LEFT: 'left',
//   CENTER: 'center',
//   RIGHT: 'right',
//   VUP: 'vup',
//   DAY: 'day',
// };

// const STATUS = {
//   DAY: 'day',
//   DUSK: 'dusk',
//   NIGHT: 'night',
// };

// // get dayparting based on sunrise and sunset
// export const getDaypart = (time, sunrise, sunset) => {
//   // let time = new Date();
//   const offset = 15 * 60 * 1000; // 15 mins
//   // console.log('sunset => ', sunset);
//   let period = '';
//   if (
//     (time > sunrise - offset && time < sunrise + offset) ||
//     (time > sunset - offset && time < sunset + offset)
//   ) {
//     period = STATUS.DUSK;
//   } else if (time > sunrise + offset && time < sunset - offset) {
//     period = STATUS.DAY;
//   } else {
//     period = STATUS.NIGHT;
//   }
//   return period;
// };

// const composeUrl = (lat, lon, type) => {
//   switch (type) {
//     case API_TYPE.SINGLE:
//       return (
//         BASE_URL +
//         `timelines?location=${lat}%2C${lon}&units=imperial&fields=temperature&fields=temperatureApparent&fields=weatherCode&timesteps=current,1h&startTime=${new Date().toISOString()}&endTime=${new Date().addHours(
//           6
//         )}&apikey=${API_KEY}`
//       );
//     case API_TYPE.LEFT:
//       return (
//         BASE_URL +
//         `timelines?location=${lat}%2C${lon}&units=imperial&fields=temperature&fields=temperatureApparent&fields=weatherCode&timesteps=current&apikey=${API_KEY}`
//       );
//     case API_TYPE.CENTER:
//       return (
//         BASE_URL +
//         `timelines?location=${lat}%2C${lon}&units=imperial&fields=temperature&fields=temperatureApparent&fields=weatherCode&timesteps=1h&startTime=${new Date().toISOString()}&endTime=${new Date().addHours(
//           6
//         )}&apikey=${API_KEY}`
//       );
//     case API_TYPE.RIGHT:
//       return (
//         BASE_URL +
//         `timelines?location=${lat}%2C${lon}&units=imperial&fields=temperature&fields=temperatureApparent&fields=humidity&fields=windSpeed&fields=windDirection&fields=weatherCode&fields=uvIndex&fields=epaIndex&fields=epaHealthConcern&timesteps=current,1h&startTime=${new Date().toISOString()}&endTime=${new Date().addHours(
//           6
//         )}&apikey=${API_KEY}`
//       );
//     case API_TYPE.VUP:
//       return (
//         BASE_URL +
//         `timelines?location=${lat}%2C${lon}&units=imperial&fields=temperature&fields=temperatureApparent&fields=weatherCode&timesteps=current&apikey=${API_KEY}`
//       );
//     case API_TYPE.DAY:
//       return (
//         BASE_URL +
//         `timelines?location=${lat}%2C${lon}&units=imperial&fields=sunriseTime&fields=sunsetTime&timesteps=1d&startTime=${new Date().toISOString()}&endTime=${new Date().addHours(
//           25
//         )}&apikey=${API_KEY}`
//       );

//     default:
//       return '';
//   }
// };

// export const setFallback = () => {
//   document.querySelector('#fallback').style.display = 'block';
// };

// // forecast time info display
// export const getForecastTime = timeStr => {
//   return new Date(timeStr)
//     .toLocaleTimeString([], { hour: 'numeric' })
//     .toLocaleLowerCase();
// };

// // parse weather code for setting icons
// export const parseWeatherCode = (weatherCode, period) => {
//   const isDay = period !== STATUS.NIGHT;
//   switch (weatherCode) {
//     case 1000:
//     case 1100:
//     case 1101:
//       return isDay ? `${weatherCode}_day` : `${weatherCode}_night`;
//     default:
//       return weatherCode;
//   }
// };

// // parse sunrise/sunset info
// export const getSunTime = (sunriseStr, sunsetStr) => {
//   const offset = 15 * 60 * 1000; // 15 mins
//   const sunrise = new Date(sunriseStr);
//   const sunset = new Date(sunsetStr);
//   const timeStr = new Date() - sunrise < offset ? sunrise : sunset;
//   const title = new Date() - sunrise < offset ? 'Sunrise' : 'Sunset';
//   return {
//     title,
//     time: timeStr
//       .toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
//       .toLowerCase(),
//   };
// };

// export const parseMoonPhase = str => {
//   return str.split('_').join(' ');
// };

// // round hours - 7:10 => 7; 7:40 => 8
// export const getForecastIndex = startTime => {
//   return new Date() - new Date(startTime) >= 1000 * 60 * 30 ? 3 : 2;
// };

// export const getWeatherData = (lat, lon, type) => {
//   return fetchData(composeUrl(lat, lon, type), setFallback).then(
//     data => data.data
//   );
// };
