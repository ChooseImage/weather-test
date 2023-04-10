// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/apis/climacell.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setFallback = exports.getWeatherData = exports.API_TYPE = void 0;
var BASE_URL = 'https://api.tomorrow.io/v4/';
var getTimelineURL = 'https://api.tomorrow.io/v4/';
var apikey = 'QX5jHmzWfoGvZBPZk7oFzJsbPuZWa8RK';
var API_TYPE = {
  SINGLE: 'single',
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
  VUP: 'vup',
  DAY: 'day'
};
exports.API_TYPE = API_TYPE;
var STATUS = {
  DAY: 'day',
  DUSK: 'dusk',
  NIGHT: 'night'
};
var fields = ["temperature", "temperatureApparent", "weatherCode"];
var units = "metric";
var timesteps = ["current", "1h", "1d"]; // configure the time frame up to 6 hours back and 15 days out
// const now = moment.utc();
// const startTime = moment.utc(now).add(0, "minutes").toISOString();
// const endTime = moment.utc(now).add(1, "days").toISOString();
// specify the timezone, using standard IANA timezone format

var timezone = "America/New_York";

var composeUrl = function composeUrl() {
  return BASE_URL + getTimelineParameters;
};

var fetchData = function fetchData(handleErr) {
  var composeUrl = "https://api.tomorrow.io/v4/timelines?location=40.75872069597532,-73.98529171943665&fields=windDirection&fields=weatherCode&fields=windSpeed&fields=uvIndex&fields=humidity&fields=temperature&fields=precipitationIntensity&fields=temperatureApparent&timesteps=1h&units=imperial&apikey=QX5jHmzWfoGvZBPZk7oFzJsbPuZWa8RK";
  return fetch(composeUrl).then(function (res) {
    return res.json();
  }).catch(function (err) {
    console.log('fetchData error => ', err);
    if (handleErr) handleErr();
  });
};

var setFallback = function setFallback() {// document.querySelector('#fallback').style.display = 'block';
};

exports.setFallback = setFallback;

var getWeatherData = function getWeatherData(lat, lon) {
  return fetchData(setFallback).then(function (data) {
    return data.data;
  });
}; // --------------------------------------------------------------------------
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


exports.getWeatherData = getWeatherData;
},{}],"js/constants.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transitKey = exports.localTags = exports.WEEKBOARD = exports.WEATHER_CONDITIONS = exports.WASHINGTON_DC = exports.UV_PROPERTIES = exports.TAG_TYPE = exports.REALTIME_INTERVAL = exports.MONTHBOARD = exports.FORECAST_INTERVAL = exports.DEFAULT = exports.DAY_INTERVAL = exports.BOSTON = exports.AIR_QUALITY = void 0;
var WEATHER_CONDITIONS = {
  0: 'Unknown',
  1000: 'Clear, Sunny',
  1100: 'Mostly Clear',
  1101: 'Partly Cloudy',
  1102: 'Mostly Cloudy',
  1001: 'Cloudy',
  2000: 'Fog',
  2100: 'Light Fog',
  4000: 'Drizzle',
  4001: 'Rain',
  4200: 'Light Rain',
  4201: 'Heavy Rain',
  5000: 'Snow',
  5001: 'Flurries',
  5100: 'Light Snow',
  5101: 'Heavy Snow',
  6000: 'Freezing Drizzle',
  6001: 'Freezing Rain',
  6200: 'Light Freezing Rain',
  6201: 'Heavy Freezing Rain',
  7000: 'Ice Pellets',
  7101: 'Heavy Ice Pellets',
  7102: 'Light Ice Pellets',
  8000: 'Thunderstorm'
};
exports.WEATHER_CONDITIONS = WEATHER_CONDITIONS;
var UV_PROPERTIES = {
  0: ["#89e665", "Low"],
  1: ["#89e665", "Low"],
  2: ["#89e665", "Low"],
  3: ["#f7d84a", "Moderate"],
  4: ["#f7d84a", "Moderate"],
  5: ["#f7d84a", "Moderate"],
  6: ["#ed912f", "High"],
  7: ["#ed912f", "High"],
  8: ["#ed462f", "Very High"],
  9: ["#ed462f", "Very High"],
  10: ["#ed462f", "Very High"],
  11: ["#d239ed", "Extreme"]
};
exports.UV_PROPERTIES = UV_PROPERTIES;
var AIR_QUALITY = {
  0: 'Good',
  1: 'Moderate',
  2: 'Unhealthy for Sensitive Groups',
  3: 'Unhealthy',
  4: 'Very Unhealthy',
  5: 'Hazardous'
};
exports.AIR_QUALITY = AIR_QUALITY;
var FORECAST_INTERVAL = 45 * 60 * 1000; // 45 minutes

exports.FORECAST_INTERVAL = FORECAST_INTERVAL;
var REALTIME_INTERVAL = 20 * 60 * 1000; // 20 minutes

exports.REALTIME_INTERVAL = REALTIME_INTERVAL;
var DAY_INTERVAL = 24 * 60 * 60 * 1000; // 24 hour

exports.DAY_INTERVAL = DAY_INTERVAL;
var BOSTON = {
  LAT: 42.3601,
  LON: -71.0589
};
exports.BOSTON = BOSTON;
var WASHINGTON_DC = {
  LAT: 38.9072,
  LON: -77.0369
}; // tag type on the boards

exports.WASHINGTON_DC = WASHINGTON_DC;
var TAG_TYPE = {
  TA: 'Transit_authority',
  NYCT: 'mta_subway_stop',
  LIRR: 'mta_subway_stop',
  MNR: 'mta_subway_stop',
  MBTA: 'Station',
  OTHER: 'Station'
}; // sample tag data

exports.TAG_TYPE = TAG_TYPE;
var localTags = {
  tags: [{
    name: 'Transit_authority',
    value: ['NYCT'] // NYCT, MBTA, other...

  }, {
    name: 'mta_subway_stop',
    value: ['R28'] // G06

  }, {
    name: 'Station',
    value: ['Airport']
  }]
};
exports.localTags = localTags;
var transitKey = {
  NYCT: {
    name: 'Stop Name',
    lat: 'GTFS Latitude',
    lon: 'GTFS Longitude',
    id: 'GTFS Stop ID'
  },
  MBTA: {
    name: 'description',
    lat: 'latitude',
    lon: 'longitude',
    id: 'station'
  },
  LIRR: {
    name: 'stop_name',
    lat: 'stop_lat',
    lon: 'stop_lon',
    id: 'stop_id'
  },
  MNR: {
    name: 'stop_name',
    lat: 'stop_lat',
    lon: 'stop_lon',
    id: 'stop_id'
  },
  OTHER: {
    name: 'description',
    lat: 'latitude',
    lon: 'longitude',
    id: 'station'
  }
};
exports.transitKey = transitKey;
var DEFAULT = {
  STATION: {
    MBTA: {
      name: 'Boston',
      lat: 42.3601,
      lon: -71.0589,
      id: 'Boston'
    },
    NYCT: {
      name: 'New York',
      lat: 40.7128,
      lon: -74.006,
      id: 'New York'
    },
    LIRR: {
      name: 'New York',
      lat: 40.7128,
      lon: -74.006,
      id: 'New York'
    },
    MNR: {
      name: 'New York',
      lat: 40.7128,
      lon: -74.006,
      id: 'New York'
    },
    MARTA: {
      name: 'Atlanta',
      lat: 33.749,
      lon: -84.388,
      id: 'Atlanta'
    },
    Caltrain: {
      name: '4th & King Station',
      lat: 37.77605,
      lon: -122.3944,
      id: '4thKing'
    },
    BART: {
      name: 'San Francisco',
      lat: 37.7749,
      lon: -122.4194,
      id: 'San Francisco'
    },
    'BART-VTA': {
      name: 'San Francisco',
      lat: 37.7749,
      lon: -122.4194,
      id: 'San Francisco'
    },
    WMATA: {
      name: 'Washington, D.C.',
      lat: 38.9072,
      lon: -77.0369,
      id: 'Washington, D.C.'
    },
    Citylites: {
      name: 'Minneapolis',
      lat: 44.9778,
      lon: -93.265,
      id: 'Minneapolis'
    },
    Brightline: {
      name: 'Miami',
      lat: 25.78009,
      lon: -80.195312,
      id: 'Miami'
    }
  }
};
exports.DEFAULT = DEFAULT;
var MONTHBOARD = {
  0: "Janurary",
  1: "Feburary",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December"
};
exports.MONTHBOARD = MONTHBOARD;
var WEEKBOARD = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednsday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday"
};
exports.WEEKBOARD = WEEKBOARD;
},{}],"pages/single/js/building.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeWindow = exports.drawUnit = exports.drawStuff = exports.drawLink = exports.drawBuildings = void 0;

var _sketch = require("../sketch.js");

//Building
var w = 1080;
var h = 1920;
var woff = w * 0.1;
var hoff = h * 0.06;
var off = 0.3; // front building

var x1 = 400;
var y1 = 400;
var w1 = 120;
var d1 = 100; // rear building 

var x2 = 400;
var y2 = 400;
var w2 = 120;
var d2 = 100;
var xGap = 10;
var yGap = 10;
var sizeX = 200;
var sizeY = 30;
var sizeZ = 80;
var numCols;
var numRows;
var winSize = 8; // BUILDING

var drawBuildings = function drawBuildings() {
  var AposX, BposX, Aheight, Bheight, Adepth, Bdepth, Awidth, Bwidth;
  AposX = -100;
  Aheight = 1300;
  Adepth = 129;
  Awidth = 220;
  var index = Math.random();

  for (var i = 0; i < 6; i++) {
    var offx = _sketch.myp5.noise(200 * i) * _sketch.myp5.width * 2;
    var offy = (_sketch.myp5.noise(40 * i) - 0.5) * 600;
    var offw = (_sketch.myp5.noise(2000 * i) - 0.5) * 140;
    var offd = (_sketch.myp5.noise(2000 * i) - 0.5) * 140;
    drawUnit(AposX + offx, Aheight + offy, Awidth + offw, Adepth + offd);
  }
};

exports.drawBuildings = drawBuildings;

var drawStuff = function drawStuff() {
  var outofBoundsA = 60;
  var outofBoundsB = 70; //fill(PARAMS.squareColor);

  _sketch.myp5.noStroke();

  _sketch.myp5.rect(0, 0, 600);

  off = 0.3; //Rear
  //drawUnit(100, 500, 300, 120);
  // BRIDGES
  //Front

  var AposX, BposX, Aheight, Bheight, Adepth, Bdepth, Awidth, Bwidth;
  AposX = 700;
  Aheight = 1200;
  Adepth = 129;
  Awidth = 220;
  BposX = 610;
  Bheight = 1600;
  Bdepth = 110;
  Bwidth = 140;
  drawUnit(AposX, Aheight, Awidth, Adepth);
  drawUnit(BposX, Bheight, Bwidth, Bdepth); //drawUnit(PARAMS.BposX, PARAMS.BHeight, PARAMS.Bwidth, PARAMS.Bdepth);

  numCols = 100;
  numRows = 200;
  winSize = 20; //makeWindow(PARAMS.AposX, PARAMS.AHeight,PARAMS.AWindowColumns, PARAMS.AWindowRows, PARAMS.AWindowSize, 1, PARAMS.AWindowsPosX, PARAMS.AWindowsPosY);
};

exports.drawStuff = drawStuff;

var drawUnit = function drawUnit(x1, y1, w1
/*width*/
, w2
/*depth*/
) {
  var h1 = h;

  _sketch.myp5.noStroke();

  var X1, X2, Y1, Y2, Y3, Y4;
  X1 = x1;
  X2 = x1 + w1;
  Y1 = y1;
  Y2 = y1 + h;
  Y3 = y1 + h + w1 * off;
  Y4 = y1 + w1 * off;
  var offr = Math.random(-40, 40);
  var offg = Math.random(-40, 40);
  var offb = Math.random(-40, 40); // RIGHT FACING SIDE

  var pink = _sketch.myp5.color('#fcedeb');

  _sketch.myp5.fill(252 + offr, 237 + offg, 235 + offb);

  _sketch.myp5.beginShape();

  _sketch.myp5.vertex(X1, Y1); // TOP LEFT


  _sketch.myp5.vertex(X1, Y2); // BOT LEFT


  _sketch.myp5.vertex(X2, Y3); // BOT RIGHT


  _sketch.myp5.vertex(X2, Y4); // TOP RIGHT


  _sketch.myp5.endShape(); // LEFT FACING SIDE


  var I1, I2, J1, J2, J3, J4;
  I1 = x1;
  I2 = x1 - w2;
  J1 = y1;
  J2 = y1 + h;
  J3 = y1 + h + w2 * off;
  J4 = y1 + w2 * off; //push();

  _sketch.myp5.fill('ffcdb2');

  _sketch.myp5.beginShape();

  _sketch.myp5.vertex(I1, J1);

  _sketch.myp5.vertex(I1, J2);

  _sketch.myp5.vertex(I2, J3);

  _sketch.myp5.vertex(I2, J4);

  _sketch.myp5.endShape(); //pop();


  _sketch.myp5.push();

  _sketch.myp5.fill(0, 60);

  _sketch.myp5.beginShape();

  _sketch.myp5.vertex(I1, J1);

  _sketch.myp5.vertex(I1, J2);

  _sketch.myp5.vertex(I2, J3);

  _sketch.myp5.vertex(I2, J4);

  _sketch.myp5.endShape();

  _sketch.myp5.pop();
};

exports.drawUnit = drawUnit;

var drawLink = function drawLink(x, y, xGap, yGap, sizeX, sizeY, sizeZ) {
  _sketch.myp5.fill(40, 50, 140);

  x = 30; // RIGHT FACING SIDE

  var newX = x - xGap;
  var newY = y + yGap + sizeY;
  var U1, U2, V1, V2, V3, V4;
  U1 = x - xGap;
  U2 = U1 - sizeX;
  V1 = y + yGap + sizeY;
  V2 = y + yGap;
  V3 = y + yGap - sizeX * off;
  V4 = y + yGap + sizeY - sizeX * off;

  _sketch.myp5.beginShape();

  _sketch.myp5.vertex(U1, V1); // BOT RIGHT


  _sketch.myp5.vertex(U1, V2); // TOP RIGHT


  _sketch.myp5.vertex(U2, V3); // TOP LEFT


  _sketch.myp5.vertex(U2, V4); // BOT LEFT


  _sketch.myp5.endShape(); // DOWN FACING SIDE


  var N1, N2, N3, N4, M1, M2, M3, M4;

  _sketch.myp5.fill(50, 50, 50);

  N1 = x - xGap;
  N2 = x - xGap - sizeZ;
  N3 = x - xGap - sizeX - sizeZ;
  N4 = x - xGap - sizeX;
  M1 = y + yGap + sizeY;
  M2 = y + yGap + sizeY + sizeZ * off;
  M3 = y + yGap + sizeY - sizeX * off + sizeZ * off;
  M4 = y + yGap + sizeY - sizeX * off;

  _sketch.myp5.beginShape();

  _sketch.myp5.vertex(N1, M1); // TOP RIGHT


  _sketch.myp5.vertex(N2, M2); // BOT RIGHT


  _sketch.myp5.vertex(N3, M3); // BOT LEFT


  _sketch.myp5.vertex(N4, M4); // TOP LEFT


  _sketch.myp5.endShape();

  _sketch.myp5.push();

  _sketch.myp5.fill(0, 40);

  _sketch.myp5.beginShape();

  _sketch.myp5.vertex(N1, M1); // TOP RIGHT


  _sketch.myp5.vertex(N2, M2); // BOT RIGHT


  _sketch.myp5.vertex(N3, M3); // BOT LEFT


  _sketch.myp5.vertex(N4, M4); // TOP LEFT


  _sketch.myp5.endShape();

  _sketch.myp5.pop();
};

exports.drawLink = drawLink;

var makeWindow = function makeWindow(x, y, numCols, numRows, winSize, margin, firstCol, offY) {
  var winEdgeX = margin;
  var winEdgeY = offY; //print(outofBounds);

  _sketch.myp5.push();

  _sketch.myp5.fill(70, 20, 240);

  _sketch.myp5.noStroke(); //stroke(200);


  for (var col = firstCol; col < numCols; col++) {
    for (var row = 0; row < numRows; row++) {
      var u1 = void 0,
          o1 = void 0,
          u2 = void 0,
          o2 = void 0,
          o3 = void 0,
          o4 = void 0;
      u1 = x + winEdgeX + winSize * col;
      o1 = y + winEdgeY + winSize * row + winSize * col * off;
      u2 = u1 + winSize;
      o2 = o1 + winSize;
      o4 = o1 + winSize * off;
      o3 = o4 + winSize;

      _sketch.myp5.beginShape();

      _sketch.myp5.vertex(u1, o1);

      _sketch.myp5.vertex(u1, o2 - margin);

      _sketch.myp5.vertex(u2 - margin, o3 - margin);

      _sketch.myp5.vertex(u2 - margin, o4);

      _sketch.myp5.endShape();
    }
  }

  _sketch.myp5.pop();
};

exports.makeWindow = makeWindow;
},{"../sketch.js":"pages/single/sketch.js"}],"pages/single/js/rain.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawRipple = exports.drawRainDrop = exports.drawRain = void 0;

var _sketch = require("../sketch");

var drawRain = function drawRain(spd, dense, dir) {
  for (var n = 0; n < 10 + 10 * dense; n++) {
    var posX = _sketch.myp5.randomGaussian(_sketch.myp5.width / 2, _sketch.myp5.width / 2);

    var posY = _sketch.myp5.random(_sketch.myp5.height + spd * 10 * 10) + _sketch.myp5.height * 0.22;
    drawRainDrop(posX, posY, spd, dir);
  }
};

exports.drawRain = drawRain;

var drawRainDrop = function drawRainDrop(x, y, spd, dir) {
  _sketch.myp5.push();

  _sketch.myp5.translate(x, y);

  _sketch.myp5.rotate(dir);

  for (var l = 0; l < 5 + spd * 10; l++) {
    _sketch.myp5.stroke(250, _sketch.myp5.map(l, 0, 5 + spd * 10, 40, 250));

    _sketch.myp5.line(0, (l - 6 - spd * 10) * 7, 0, (l - 5 - spd * 10) * 7);
  }

  _sketch.myp5.pop(); // draw ripple on the ground


  if (y > _sketch.myp5.height - _sketch.myp5.height * 0.2) {
    drawRipple(x + _sketch.myp5.random(-50, 50), y + _sketch.myp5.random(-20, 20), spd);
  }
};

exports.drawRainDrop = drawRainDrop;

var drawRipple = function drawRipple(x, y, spd) {
  _sketch.myp5.push();

  _sketch.myp5.stroke(255, 220);

  _sketch.myp5.strokeWeight(0.4);

  var scale = _sketch.myp5.random(0.08, 0.2);

  var width = (15 + spd * 12) * scale;
  var height = (5 + spd * 3) * scale;

  _sketch.myp5.arc(x, y, width, height, -60, 240);

  _sketch.myp5.pop();
};

exports.drawRipple = drawRipple;
},{"../sketch":"pages/single/sketch.js"}],"pages/single/js/wind.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawWind = void 0;

var _sketch = require("../sketch.js");

var d = 55;
var l = 10;

var drawWind = function drawWind(windDirection, windSpeed, bgColor) {
  var c = _sketch.myp5.color('grey');

  _sketch.myp5.push();

  _sketch.myp5.strokeWeight(3);

  l = _sketch.myp5.map(windSpeed, 0, 5, 30, 50);

  var stroleW = _sketch.myp5.map(windSpeed, 0, 5, 2, 7);

  _sketch.myp5.angleMode(_sketch.myp5.DEGREES);

  var offX = l * _sketch.myp5.cos(windDirection);

  var offY = l * _sketch.myp5.sin(windDirection);

  _sketch.myp5.strokeWeight(stroleW);

  for (var i = 0; i < _sketch.myp5.width + _sketch.myp5.width / d; i += d) {
    for (var j = 0; j < _sketch.myp5.height + _sketch.myp5.height / d; j += d) {
      c.setAlpha(255 * _sketch.myp5.pow(_sketch.myp5.noise(i * 2000, j * 100), 1.3));

      _sketch.myp5.stroke(c);

      _sketch.myp5.line(i, j, i + offX, j + offY);
    }
  }

  _sketch.myp5.fill(bgColor);

  _sketch.myp5.noStroke();

  _sketch.myp5.rect(0, 0, 300 - 1, 1921);

  _sketch.myp5.rect(1080 - 300, 0, 1080, 1920);

  _sketch.myp5.rect(0, 0, 1080, 900);

  _sketch.myp5.rect(0, 1920 - 530, 1080, 1920);

  _sketch.myp5.pop();
};

exports.drawWind = drawWind;
},{"../sketch.js":"pages/single/sketch.js"}],"pages/single/sketch.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.myp5 = void 0;

var _climacell = require("../../js/apis/climacell");

var _constants = require("../../js/constants.js");

var _building = require("./js/building.js");

var _rain = require("./js/rain.js");

var _wind = require("./js/wind.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var text;
var windDir = 0;
var windSpeed = 0;
var temp1, temp2, temp3;
var tFeel1, tFeel2, tFeel3;
var weatherCode1, weatherCode2, weatherCode3, weatherCode;
var humidity;
var uvColorCode, colorUv, uvText;
var backgroundColor;
var bgIndex;
var colorDay, colorNight;
var weatherConColor;
var fontRegular, fontItalic, fontBold;
var timeCurent = new Date();
var dayCur = "".concat(_constants.WEEKBOARD[timeCurent.getDay()], " ").concat(_constants.MONTHBOARD[timeCurent.getMonth()], " ").concat(timeCurent.getDate());
var timeCurrent = ""; //let timeCur = moment().format('h:mm a')

var timeCur = '12:34'; //let hourCur = Number(moment().format('H'))

var hourCur = 13;
console.log(dayCur);
console.log(timeCur);
console.log(hourCur); //console.dir(today)
// Rain

var speed = 0.5;
var density = 5;
var direction = 10;
var t, dim;
var Y_AXIS = 1;
var X_AXIS = 2;
var b1, b2, c1, c2;
var img;
var myp5 = new p5(function (p5) {
  p5.preload = function () {
    fontRegular = p5.loadFont('https://github.com/ChooseImage/Reflection/blob/main/fonts/SourceCodePro-Bold.ttf?raw=true');
    fontItalic = p5.loadFont('https://github.com/ChooseImage/Reflection/blob/main/fonts/SourceCodePro-Bold.ttf?raw=true');
    fontBold = p5.loadFont('https://github.com/ChooseImage/Reflection/blob/main/fonts/SourceCodePro-Bold.ttf?raw=true');
  };

  p5.setup = function () {
    p5.blendMode(p5.SCREEN);
    p5.createCanvas(1080, 1920);
    t = 0;
    b1 = p5.color(255);
    b2 = p5.color(0);
    c1 = p5.color(204, 102, 0);
    c2 = p5.color(0, 102, 153);
    p5.angleMode(p5.DEGREES);
    colorDay = p5.color('#ffd445');
    colorNight = p5.color('#221b70');
  };

  p5.draw = function () {
    // -------------------------- Gradient Param ------------------------------
    var r = p5.width / 2.2;
    r = r * 3.2;
    var red = 255 * p5.noise(t + 10);
    var g = 255 * p5.noise(t + 15);
    var b = 255 * p5.noise(t + 20);
    var pink = p5.color('#ffcdb2');
    var colorWarm = p5.color('#ff4800');
    var colorCold = p5.color('#004cff');
    var colorRain = p5.color('#52559e');
    var colorClear = p5.color('#f5d856');
    var colorDry = p5.color('#ab873a');
    var colorWet = p5.color('#201dad'); // UV color 

    colorUv = p5.color("".concat(uvColorCode)); // Temperture
    //temp1 = 90 Debug for visual values

    var tempInter = p5.map(temp1, 20, 95, 0, 1);
    var colorTemp = p5.lerpColor(colorCold, colorWarm, tempInter); // Humidity
    // humidity = 0.5 Debug for visual values

    var colorHum = p5.lerpColor(colorDry, colorWet, humidity);
    p5.stroke(235, 89, 147, 20);
    p5.strokeWeight(100);
    p5.noFill();
    t += 0.001; // -------------------------- Set Background Color according to current hour ------------------------------

    if (2 <= hourCur < 14) {
      bgIndex = p5.map(hourCur, 2, 14, 0, 1);
      backgroundColor = p5.lerpColor(colorNight, colorDay, bgIndex);
    } else {
      if (hourCur < 2) {
        hourCur += 24;
      }

      bgIndex = p5.map(hourCur, 14, 25, 1, 0);
      backgroundColor = p5.lerpColor(colorDay, colorNight, bgIndex);
    }

    r = r / 3.2;
    p5.background(backgroundColor); //p5.background(pink)
    // ----------------------- Wind -----------------------
    //drawWind(42, windSpeed, backgroundColor)
    //p5.fill('blue')
    // ----------------------- Buildings -----------------------
    //drawStuff();
    //drawBuildings();
    // ----------------------- Weather / Station text -----------------------

    setGradient(p5.width / 2 - r / 2, p5.height / 2 - r / 2 + p5.height * 0.1, r, r, backgroundColor, colorTemp, Y_AXIS);
    setGradient(p5.width / 2 - r / 2, p5.height / 2 - r / 2 + p5.height * 0.1, r / 2, r, backgroundColor, colorHum, X_AXIS);
    setGradient(p5.width / 2 - r / 2, p5.height / 2 - r / 2 + p5.height * 0.1, r / 2, r / 2, backgroundColor, colorUv, Y_AXIS);

    if (p5.frameCount % 1 === 0) {
      speed = 0.0001;
      density = 1;
      direction = 10;
      p5.strokeWeight(4); //drawRain(speed, density, direction);
    } // ----------------------- Weather / Station text -----------------------


    displayWeather(p5);
  };
});
exports.myp5 = myp5;

var displayWeather = function displayWeather(p5) {
  p5.noStroke(); // Top Background

  p5.fill(10);
  p5.rect(0, 0, p5.width, p5.height * 0.2); // Current Forecast
  // p5.textFont(fontBold);

  p5.textSize(50);
  p5.fill(255, 240);
  p5.text("Current Forecast", 30, 90); // Station Name

  p5.fill(100, 250, 255); // p5.textFont(fontRegular);

  p5.textSize(102);
  p5.text("14 St-Union Sqare", 30, 220); // Date

  var date = 'Tuesday, December 10';
  date = dayCur;
  p5.fill(255, 240);
  p5.textSize(50);
  p5.text(date, 30, 310); // Forecast 1

  p5.textSize(100);
  p5.fill(255, 240); // p5.textFont(fontBold)

  p5.text(timeCur, 40, 530);
  p5.fill(255, 140);
  p5.text(Math.trunc(temp1) + "°", 520, 533);
  p5.textSize(50);
  p5.text('Feels like ' + Math.trunc(tFeel1) + "°", 40, 720);
  p5.fill(255, 240);
  p5.text(weatherCode, 40, 790);
};

document.addEventListener('DOMContentLoaded', ready);

function ready() {
  return _ready.apply(this, arguments);
}

function _ready() {
  _ready = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var weatherData, timelines, uv;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _climacell.getWeatherData)(20, 20);

          case 2:
            weatherData = _context.sent;
            timelines = weatherData.timelines;
            console.log(timelines);
            temp1 = timelines[0].intervals[0].values.temperature;
            tFeel1 = timelines[0].intervals[0].values.temperatureApparent;
            windDir = timelines[0].intervals[0].values.windDirection;
            windSpeed = timelines[0].intervals[0].values.windSpeed;
            weatherCode1 = timelines[0].intervals[0].values.weatherCode;
            weatherCode1 = _constants.WEATHER_CONDITIONS[weatherCode1].split(',');
            weatherCode = weatherCode1[0];
            humidity = timelines[0].intervals[0].values.humidity * 0.01;
            uv = timelines[0].intervals[0].values.uvIndex;
            uvColorCode = _constants.UV_PROPERTIES[uv][0];
            uvText = _constants.UV_PROPERTIES[uv][1];
            console.log(uvText);

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _ready.apply(this, arguments);
}

var setGradient = function setGradient(x, y, w, h, c1, c2, axis) {
  myp5.noFill();

  if (axis === Y_AXIS) {
    // Top to bottom gradients
    for (var i = y; i <= y + h; i++) {
      var inter = myp5.map(i, y, y + h, 0, 1);
      var c = myp5.lerpColor(c1, c2, myp5.pow(inter, 1.5));
      myp5.stroke(c);
      myp5.line(x, i, x + w, i);
    }
  } else if (axis === X_AXIS) {
    // Left to right gradient
    for (var _i = x; _i <= x + w; _i++) {
      var _inter = myp5.map(_i, x, x + w, 0, 1);

      var _c = myp5.lerpColor(c1, c2, myp5.pow(_inter, 1.5));

      myp5.stroke(_c);
      myp5.line(_i, y, _i, y + h);
    }
  }
};
},{"../../js/apis/climacell":"js/apis/climacell.js","../../js/constants.js":"js/constants.js","./js/building.js":"pages/single/js/building.js","./js/rain.js":"pages/single/js/rain.js","./js/wind.js":"pages/single/js/wind.js"}],"../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54518" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel/src/builtins/hmr-runtime.js","pages/single/sketch.js"], null)
//# sourceMappingURL=/sketch.bc8bb9b7.js.map