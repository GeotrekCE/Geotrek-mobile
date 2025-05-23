import { primaryColor, sensitiveAreaColors } from './variables';

export const environment = {
  production: true,
  appName: 'Geotrek mobile',
  mobileApiUrl: '',
  adminApiUrl: '',
  randoUrl: '',
  randoVersion: 3,
  emergencyNumber: '112',
  availableLanguage: ['fr', 'en'],
  navigation: 'tabs',
  showGoToPoi: false,
  enableOutdoorPracticesShortcuts: false,
  onlineMapConfig: {
    attributionControl: false,
    style: {
      version: 8,
      glyphs: './assets/map/{fontstack}/{range}.pbf',
      sources: {
        'tiles-background': {
          type: 'raster',
          tiles: [
            'https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}'
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
    minZoom: 13,
    maxZoom: 16,
    zoom: 13
  },
  map: {
    attributionText: '© IGN',
    TreksfitBoundsOptions: { animate: false, padding: 50 },
    TrekfitBoundsOptions: { animate: false, padding: 75 },
    globalMapIconSize: 1,
    informationIconSize: 1,
    parkingIconSize: 0.6,
    departureArrivalIconSize: 0.8,
    poisLayersProperties: {
      visibility: 'visible',
      iconSize: 1
    },
    clusterPaint: {
      'circle-color': primaryColor,
      'circle-stroke-color': '#fff',
      'circle-radius': 18,
      'circle-stroke-width': 1
    },
    clusterTextPaint: {
      'text-color': '#fff'
    },
    stagePaint: {
      'circle-color': '#fff',
      'circle-stroke-color': '#000000',
      'circle-radius': 14,
      'circle-stroke-width': 1
    },
    zoneLayerProperties: {
      type: 'fill',
      paint: {
        'fill-color': primaryColor,
        'fill-outline-color': '#625b5d',
        'fill-opacity': 0
      }
    },
    zoneOutlineLayerProperties: {
      type: 'line',
      paint: {
        'line-color': primaryColor,
        'line-opacity': 1,
        'line-width': 4
      }
    },
    sensitiveAreasLayersProperties: {
      type: 'fill',
      paint: {
        'fill-color': [
          'step',
          ['%', ['get', 'id'], sensitiveAreaColors.length],
          sensitiveAreaColors[0],
          ...sensitiveAreaColors.map((color, index) => [index, color]).flat()
        ],
        'fill-opacity': 0.2
      },
      layout: {
        visibility: 'visible'
      }
    },
    sensitiveAreasOutlineLayersProperties: {
      type: 'line',
      paint: {
        'line-color': [
          'step',
          ['%', ['get', 'id'], sensitiveAreaColors.length],
          sensitiveAreaColors[0],
          ...sensitiveAreaColors.map((color, index) => [index, color]).flat()
        ],
        'line-opacity': 1,
        'line-width': 4
      },
      layout: {
        visibility: 'visible'
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
  treksByStep: 15,
  metersToNotify: 200,
  poiCollapseInitialSize: 5,
  touristicContentCollapseInitialSize: 5,
  containsFilterShouldUseSelectAbove: 7,
  trekDetails: {
    showImgRulesIfParkCentered: true
  },
  colSize: 12,
  initialOrder: 'alphabetical'
};
