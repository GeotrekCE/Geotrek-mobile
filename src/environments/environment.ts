import { primaryColor } from './variables';

export const environment = {
  appName: 'Geotrek Starter', // app name used for app header
  production: false,
  useFirebase: false,
  availableLanguage: ['fr', 'en', 'it'], // we assume that availableLanguage[0] is default language, or 'fr' if array is empty
  mapbox: {
    accessToken: null // only if you use mapbox vector tiles
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
            'https://c.tile.opentopomap.org/{z}/{x}/{y}.png'
          ],
          tileSize: 256
        }
      },
      layers: [
        {
          id: 'tiles-background',
          type: 'raster',
          source: 'tiles-background',
          minzoom: 0,
          maxzoom: 17
        }
      ]
    },
    minZoom: 0,
    maxZoom: 16,
    maxPitch: 0
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
          tileSize: 256
        }
      },
      layers: [
        {
          id: 'tiles-background',
          type: 'raster',
          source: 'tiles-background',
          minzoom: 0,
          maxzoom: 13
        }
      ]
    },
    minZoom: 0,
    maxZoom: 12,
    maxPitch: 0
  },
  trekZoom: {
    // zoom config for trek layer map
    minZoom: 13,
    maxZoom: 17,
    zoom: 13
  },
  map: {
    attributionText:
      '<a href="https://openstreetmap.org/copyright">© OpenStreetMap contributors</a> | <a href="https://opentopomap.org">© OpenTopoMap </a>',
    TreksfitBoundsOptions: { animate: false, padding: 50 },
    TrekfitBoundsOptions: { animate: false, padding: 75 },
    globalMapIconSize: 1, // check your icon size, ideally it would be 48px*48px
    informationIconSize: 1,
    parkingIconSize: 0.6,
    departureArrivalIconSize: 0.8,
    poisLayersProperties: {
      visibility: 'visible',
      iconSize: 1
    },
    clusterPaint: {
      // cluster style on map treks
      'circle-color': primaryColor,
      'circle-stroke-color': '#fff',
      'circle-radius': 18,
      'circle-stroke-width': 1
    },
    clusterTextPaint: {
      'text-color': '#fff'
    },
    stagePaint: {
      // style stage circle on parent map
      'circle-color': '#fff',
      'circle-stroke-color': '#000000',
      'circle-radius': 14,
      'circle-stroke-width': 1
    },
    zoneLayerProperties: {
      // src/assets/map/zone/zone.geojson
      // optionnal geojson to display on map
      type: 'fill',
      paint: {
        'fill-color': primaryColor,
        'fill-outline-color': '#625b5d',
        'fill-opacity': 0.3
      }
    },
    zoneOutlineLayerProperties: {
      type: 'line',
      paint: {
        'line-color': primaryColor,
        'line-opacity': 1,
        'line-width': 8
      }
    },
    trekLineLayerProperties: {
      type: 'line',
      paint: {
        'line-width': 6,
        'line-color': '#61B22F'
      }
    },
    trekArrowLayerProperties: {
      layout: {
        'symbol-placement': 'line',
        'symbol-spacing': 250,
        'icon-size': 0.5
      }
    },
    pointReferenceLayersProperties: {
      text: {
        paint: {
          'text-color': '#fff'
        },
        layout: {
          'text-ignore-placement': true,
          'text-allow-overlap': true,
          'text-field': ['get', 'index'],
          'text-font': ['Roboto Regular'],
          'text-size': 12,
          'text-offset': [0, 0.1]
        }
      },
      circle: {
        paint: {
          'circle-color': '#f04141',
          'circle-radius': 12
        }
      }
    },
    touristicContentLayersProperties: {
      visibility: 'visible',
      icon: {
        layout: {
          'icon-image': ['concat', 'touristicContent', ['get', 'category']],
          'icon-size': 1,
          'icon-allow-overlap': true,
          'icon-ignore-placement': true
        }
      },
      circle: {
        paint: {
          'circle-color': primaryColor,
          'circle-stroke-color': '#fff',
          'circle-radius': 16,
          'circle-stroke-width': 1
        }
      }
    },
    enableRotation: false
  },
  treksByStep: 15, // default number of treks to display on treks list
  metersToNotify: 20, // notify poi within user position and [metersToNotify]
  backgroundGeolocation: {
    // native background geolocation options
    desiredAccuracy: 10,
    stationaryRadius: 3,
    distanceFilter: 5,
    interval: 3000
  },
  poiCollapseInitialSize: 5,
  touristicContentCollapseInitialSize: 5,
  containsFilterShouldUseSelectAbove: 7,
  trekDetails: {
    showImgRulesIfParkCentered: true
  },
  colSize: 12,
  initialOrder: 'alphabetical'
};
