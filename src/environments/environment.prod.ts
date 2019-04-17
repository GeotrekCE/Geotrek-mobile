export const environment = {
  appName: 'Geotrek Starter', // app name used for app header
  production: true,
  availableLanguage: ['fr', 'en'], // we assume that availableLanguage[0] is default language, or 'fr' if array is empty
  mapbox: {
    accessToken: null, // only if you use mapbox vector tiles
  },
  onlineBaseUrl: 'https://my-rando-domain.fr/mobile', // api url for app
  onlineMapConfig: {
    // default online map config, for this starter we use raster tiles from open topo map
    attributionControl: false,
    style: {
      version: 8,
      glyphs: './assets/map/{fontstack}/{range}.pbf',
      sources: {
        'tiles-background': {
          type: 'raster',
          tiles: [
            'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
            'https://b.tile.opentopomap.org/{z}/{x}/{y}.png',
            'https://c.tile.opentopomap.org/{z}/{x}/{y}.png',
          ],
          tileSize: 256,
        },
      },
      layers: [
        {
          id: 'tiles-background',
          type: 'raster',
          source: 'tiles-background',
          minzoom: 0,
          maxzoom: 17,
        },
      ],
    },
    minZoom: 0,
    maxZoom: 16,
    zoom: 8,
    center: [0.705824, 44.410157],
  },
  offlineMapConfig: {
    // offline map default config
    attributionControl: false,
    style: {
      version: 8,
      glyphs: './assets/map/{fontstack}/{range}.pbf',
      sources: {
        'tiles-background': {
          type: 'raster',
          tiles: ['/tiles/{z}/{x}/{y}.png'],
          tileSize: 256,
        },
      },
      layers: [
        {
          id: 'tiles-background',
          type: 'raster',
          source: 'tiles-background',
          minzoom: 0,
          maxzoom: 17,
        },
      ],
    },
    minZoom: 0,
    maxZoom: 16,
    zoom: 8,
    center: [0.705824, 44.410157],
  },
  trekZoom: {
    // zoom config for trek layer map
    minZoom: 13,
    maxZoom: 16,
    zoom: 13,
  },
  map: {
    iconSize: 0.8, // check your icon size, ideally it would be 48px*48px
    globalMapIconSize: 0.5,
    clusterPaint: {
      // cluster style on map treks
      'circle-color': '#8e44ad',
      'circle-stroke-color': '#fff',
      'circle-radius': 23,
      'circle-stroke-width': 1,
    },
    zoneLayerProperties: {
      // src/assets/map/zone/zone.geojson
      // optionnal geojson to display on map
      type: 'fill',
      paint: {
        'fill-color': '#833569',
        'fill-outline-color': '#898083',
        'fill-opacity': 0.6,
      },
    },
    zoneOutlineLayerProperties: {
      type: 'line',
      paint: {
        'line-color': '#833569',
        'line-opacity': 1,
        'line-width': 8,
      },
    },
    trekLineLayerProperties: {
      type: 'line',
      paint: {
        'line-width': 6,
        'line-color': '#61B22F',
      },
    },
  },
  treksByStep: 15, // default number of treks to display on treks list
  metersToNotify: 20, // notify poi within user position and [metersToNotify]
  backgroundGeolocation: {
    // native background geolocation options
    desiredAccuracy: 10,
    stationaryRadius: 3,
    distanceFilter: 5,
    interval: 3000,
  },
};
