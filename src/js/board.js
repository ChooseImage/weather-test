import { DEFAULT, localTags, TAG_TYPE, transitKey } from './constants';
import mta from '../data/transit/mta-geo.json';
import mbta from '../data/transit/mbta-geo.json';
import lirr from '../data/transit/lirr-geo.json';
import mnr from '../data/transit/mnr-geo.json';
import other from '../data/transit/others.json';
import { setFallback } from './apis/climacell';
const stations = {
  MBTA: mbta,
  NYCT: mta,
  LIRR: lirr,
  MNR: mnr,
  OTHER: other,
};

/*********************************************
	 mraid API Helpers
*********************************************/
// get tags from the board
const getBoardTags = () => {
  // check for mraid api
  let mraid = null;
  if (parent && parent.parent && parent.parent.mraid)
    mraid = parent.parent.mraid;
  if (!mraid) {
    console.log('ERROR: No mraid API');
    return null;
  }
  const tags = JSON.parse(mraid.getTags()).tags;
  return tags;
};

const getAllTags = () => {
  let tags = getBoardTags();
  if (!tags) {
    // to show something when devloping locally
    tags = localTags.tags;
    // console.log('local sample tags => ');
    // console.log(tags);
  } else {
    console.log('all board tags => ');
    console.log(tags);
  }
  return tags;
};

const getTagsByType = (allTags, tagType) => {
  const tag =
    allTags &&
    allTags.find(tag => {
      return tag.name === tagType;
    });
  if (tag) {
    return tag.value;
  } else {
    console.log('get tag: ');
    console.log(tagType);
    console.log('ERROR: No tags with that name');
    return null;
  }
};

// get station info
const getStationByTag = (transitTag, stationTag) => {
  let sTag = transitTag === 'NYCT' ? stationTag.slice(0, 3) : stationTag;
  const station = stations[transitTag].find(item => {
    return item[transitKey[transitTag].id] + '' === sTag;
  });

  if (station) {
    return station;
  } else {
    console.log('No station with that ID');
    return null;
  }
};

const getStationInfo = () => {
  const allTags = getAllTags();

  // get current transit_authority type
  const taTag = getTagsByType(allTags, TAG_TYPE.TA);
  let rawTag = taTag && taTag[0];
  // console.log('TA tag => ');
  // console.log(rawTag);
  let transitTag;
  if (rawTag) {
    transitTag = Object.keys(stations).includes(rawTag) ? rawTag : 'OTHER';
    const stationTag =
      transitTag &&
      getTagsByType(allTags, TAG_TYPE[transitTag]) &&
      getTagsByType(allTags, TAG_TYPE[transitTag])[0];
    // console.log('Station tag => ');
    // console.log(stationTag);

    // get the first 3 characters of ID (NYCT)
    const station = stationTag && getStationByTag(transitTag, stationTag + '');
    // console.log('station => ');
    // console.log(station);
    if (stationTag && station) {
      return {
        name: station[transitKey[transitTag].name],
        lat: station[transitKey[transitTag].lat],
        lon: station[transitKey[transitTag].lon],
        id: station[transitKey[transitTag].id] + '',
      };
    } else {
      let defaultStation = DEFAULT.STATION[rawTag];
      if (defaultStation) {
        console.log('~~~ show default station => ');
        console.log(defaultStation);
        return DEFAULT.STATION[rawTag];
      } else {
        console.log('### no default station');
        setFallback();
      }
    }
  } else {
    console.log('### no TA tag');
    setFallback();
  }
};

export { getStationInfo };
