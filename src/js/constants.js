export const WEATHER_CONDITIONS = {
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
  8000: 'Thunderstorm',
};

export const UV_PROPERTIES = {
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
}


export const AIR_QUALITY = {
  0: 'Good',
  1: 'Moderate',
  2: 'Unhealthy for Sensitive Groups',
  3: 'Unhealthy',
  4: 'Very Unhealthy',
  5: 'Hazardous',
};

export const FORECAST_INTERVAL = 45 * 60 * 1000; // 45 minutes
export const REALTIME_INTERVAL = 20 * 60 * 1000; // 20 minutes
export const DAY_INTERVAL = 24 * 60 * 60 * 1000; // 24 hour

export const BOSTON = {
  LAT: 42.3601,
  LON: -71.0589,
};
export const WASHINGTON_DC = {
  LAT: 38.9072,
  LON: -77.0369,
};

// tag type on the boards
export const TAG_TYPE = {
  TA: 'Transit_authority',
  NYCT: 'mta_subway_stop',
  LIRR: 'mta_subway_stop',
  MNR: 'mta_subway_stop',
  MBTA: 'Station',
  OTHER: 'Station',
};

// sample tag data
export const localTags = {
  tags: [
    {
      name: 'Transit_authority',
      value: ['NYCT'], // NYCT, MBTA, other...
    },
    {
      name: 'mta_subway_stop',
      value: ['R28'], // G06
    },
    {
      name: 'Station',
      value: ['Airport'],
    },
  ],
};

export const transitKey = {
  NYCT: {
    name: 'Stop Name',
    lat: 'GTFS Latitude',
    lon: 'GTFS Longitude',
    id: 'GTFS Stop ID',
  },
  MBTA: {
    name: 'description',
    lat: 'latitude',
    lon: 'longitude',
    id: 'station',
  },
  LIRR: {
    name: 'stop_name',
    lat: 'stop_lat',
    lon: 'stop_lon',
    id: 'stop_id',
  },
  MNR: {
    name: 'stop_name',
    lat: 'stop_lat',
    lon: 'stop_lon',
    id: 'stop_id',
  },
  OTHER: {
    name: 'description',
    lat: 'latitude',
    lon: 'longitude',
    id: 'station',
  },
};

export const DEFAULT = {
  STATION: {
    MBTA: {
      name: 'Boston',
      lat: 42.3601,
      lon: -71.0589,
      id: 'Boston',
    },
    NYCT: {
      name: 'New York',
      lat: 40.7128,
      lon: -74.006,
      id: 'New York',
    },
    LIRR: {
      name: 'New York',
      lat: 40.7128,
      lon: -74.006,
      id: 'New York',
    },
    MNR: {
      name: 'New York',
      lat: 40.7128,
      lon: -74.006,
      id: 'New York',
    },
    MARTA: {
      name: 'Atlanta',
      lat: 33.749,
      lon: -84.388,
      id: 'Atlanta',
    },
    Caltrain: {
      name: '4th & King Station',
      lat: 37.77605,
      lon: -122.3944,
      id: '4thKing',
    },
    BART: {
      name: 'San Francisco',
      lat: 37.7749,
      lon: -122.4194,
      id: 'San Francisco',
    },
    'BART-VTA': {
      name: 'San Francisco',
      lat: 37.7749,
      lon: -122.4194,
      id: 'San Francisco',
    },
    WMATA: {
      name: 'Washington, D.C.',
      lat: 38.9072,
      lon: -77.0369,
      id: 'Washington, D.C.',
    },
    Citylites: {
      name: 'Minneapolis',
      lat: 44.9778,
      lon: -93.265,
      id: 'Minneapolis',
    },
    Brightline: {
      name: 'Miami',
      lat: 25.78009,
      lon: -80.195312,
      id: 'Miami',
    },
  },
};

export const MONTHBOARD = {
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
} 

export const WEEKBOARD = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednsday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday"
} 
