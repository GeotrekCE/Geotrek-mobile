'use strict';

var geotrekAppSettings = angular.module('geotrekAppSettings', []);

/**
 * Service that gives project constants
 *
 */

// settings is a factory, we cannot use it in other modules config part,
// so we put in globalSettings some project constants.
geotrekAppSettings.constant('globalSettings', {
    DEFAULT_LANGUAGE: 'en',
    AVAILABLE_LANGUAGES: ['fr', 'en'],
    DOMAIN_NAME: '',
    ZIP_URL_PREFIX: '',
    GOOGLE_ANALYTICS_ID: '',
    APP_NAME: 'Geotrek Rando'
})
.factory('settings', function (globalSettings) {

    // Variables that user can change
    var PUBLIC_WEBSITE = '',
        API_FOLDER = 'api',
        FORCE_DOWNLOAD = false,
        DEBUG = false,
        ACTIVE_ELEVATION = false,
        LOGS = true,  // if true, console logs are also saved in a file (device only)
        // logs are moved each LOG_POOL_TIME ms from local storage to file (device only)
        LOG_POOL_TIME = 6000,  // in ms
        POI_ALERT_RADIUS = 0.05;  // in km

    var leaflet_conf = {
        GLOBAL_MAP_CENTER_LATITUDE: 44.83,
        GLOBAL_MAP_CENTER_LONGITUDE: 6.34,
        GLOBAL_MAP_DEFAULT_ZOOM: 12,
        GLOBAL_MAP_DL_TILES_ZOOM: 12,
        GLOBAL_MAP_DEFAULT_MIN_ZOOM: 8,
        GLOBAL_MAP_DEFAULT_MAX_ZOOM: 16,
        BACKGROUND_URL: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        GLOBAL_MAP_ATTRIBUTION: '(c) osm',
        TREK_COLOR: '#aec900',
        HIGHLIGHT_DETAIL_LINEAR: false,
        HIGHLIGHT_COLOR: '#000000'
    };

    var DETAIL_COLLAPSER_DEFAULT_OPENED = []; // can contains 'children', 'parent', 'poi', 'touristic' or be empty;

    /* Variables for filesystem tree on device
     * FileSystem is created as follows:
     * <GEOTREK_DIR>
     *  |-- <LOGS_FILENAME>
     *  |-- trek.geojson
     *  |-- <TREK_DIR>
     *      |-- <trek_1> (ex: 2)
     *          |-- <picture1.jpg>
     *          |-- <usage1.jpg>
     *          |-- pois.geojson
     *      |-- <trek_2> (ex: 2854)
     *      ...
     *      |-- <PICTOGRAM_DIR>
     *          |-- <picto1.jpg>
     *          ...
     *  |-- <POI_DIR>
     *      |-- <PICTOGRAM_DIR>
     *          |-- <picto1.jpg>
     *          ...
     *      |-- <poi_1>
     *          |-- <thumbnail.jpg> (if exists)
     *          |-- <picture1.jpg>
     *          ...
     *  |-- <TILES_DIR>
     *  |-- <STATIC_DIR>
     *      |-- pages.json
     *      |-- images
     *          |-- <picture1.jpg>
     *          |-- <picture2.jpg>
     */

    var POI_FILE_NAME = 'pois.geojson',
        TOURISTIC_CATEGORIES_FILE_NAME = 'touristiccategories.json',
        TOURISTIC_CONTENTS_FILE_NAME = 'touristiccontents.geojson',
        TOURISTIC_EVENTS_FILE_NAME = 'touristicevents.geojson',
        TREKS_FILE_NAME = 'treks.geojson',
        TREKS_ZIP_NAME = 'global.zip',
        TILES_FILE_NAME = 'global.zip';

    var GEOTREK_DIR = 'geotrek-rando',
        API_DIR = 'api',
        LANG_DIR = 'fr',
        MEDIA_DIR = 'media',
        UPLOAD_DIR = 'upload',
        PAPERCLIP_DIR = 'paperclip',
        MEDIA_TREK_DIR = 'trekking_trek',
        MEDIA_POI_DIR = 'trekking_poi',
        MEDIA_TOURISTIC_CONTENTS_DIR = 'trekking_touristiccontent',
        MEDIA_TOURISTIC_EVENTS_DIR = 'trekking_touristicevent',
        LOGS_FILENAME = 'geotrek-rando.log',
        TILES_DIR = 'tiles',
        TREK_DIR = 'treks',
        POI_DIR = 'poi',
        STATIC_PAGES_DIR = 'staticpages',
        STATIC_PAGES_FILE = 'flatpages.geojson',
        STATIC_PAGES_IMAGES_DIR = 'images',
        PICTOGRAM_DIR = 'pictogram',
        CDV_ROOT = 'cdvfile://localhost/persistent',

        RELATIVE_ROOT = GEOTREK_DIR,
        RELATIVE_API_DIR = GEOTREK_DIR + '/' + API_DIR + '/' + LANG_DIR,
        RELATIVE_MEDIA_DIR = GEOTREK_DIR + '/' + MEDIA_DIR,
        RELATIVE_PAPERCLIP_DIR = GEOTREK_DIR + '/' + MEDIA_DIR + '/' + PAPERCLIP_DIR,
        RELATIVE_LOGS_FILE = GEOTREK_DIR + '/' + LOGS_FILENAME,
        RELATIVE_TREK_ROOT_FILE = RELATIVE_API_DIR + '/' + TREKS_FILE_NAME,
        RELATIVE_TREK_ROOT = RELATIVE_API_DIR + '/' + TREK_DIR,
        RELATIVE_TREK_MEDIA = RELATIVE_MEDIA_DIR + '/' + PAPERCLIP_DIR + '/' + MEDIA_TREK_DIR,
        RELATIVE_POI_ROOT = RELATIVE_API_DIR + '/' + TREK_DIR,
        RELATIVE_POI_MEDIA = RELATIVE_MEDIA_DIR + '/' + PAPERCLIP_DIR + '/' + MEDIA_POI_DIR,
        RELATIVE_TOURISTIC_CONTENTS_ROOT = RELATIVE_API_DIR + '/' + TREK_DIR,
        RELATIVE_TOURISTIC_CONTENTS_MEDIA = RELATIVE_MEDIA_DIR + '/' + PAPERCLIP_DIR + '/' + MEDIA_TOURISTIC_CONTENTS_DIR,
        RELATIVE_TOURISTIC_EVENTS_ROOT = RELATIVE_API_DIR + '/' + TREK_DIR,
        RELATIVE_TOURISTIC_EVENTS_MEDIA = RELATIVE_MEDIA_DIR + '/' + PAPERCLIP_DIR + '/' + MEDIA_TOURISTIC_EVENTS_DIR,
        RELATIVE_PICTO_TREK_ROOT = RELATIVE_MEDIA_DIR + '/' + UPLOAD_DIR,
        RELATIVE_PICTO_POI_ROOT = RELATIVE_MEDIA_DIR + '/' + UPLOAD_DIR,
        RELATIVE_PICTO_TOURISTIC_CONTENTS_ROOT = RELATIVE_MEDIA_DIR + '/' + UPLOAD_DIR,
        RELATIVE_PICTO_TOURISTIC_EVENTS_ROOT = RELATIVE_MEDIA_DIR + '/' + UPLOAD_DIR,
        RELATIVE_TILES_ROOT = GEOTREK_DIR + '/' + TILES_DIR,
        RELATIVE_TILES_ROOT_FILE = RELATIVE_TILES_ROOT + '/' + TILES_FILE_NAME,
        RELATIVE_TOURISTIC_CATEGORIES_ROOT = RELATIVE_API_DIR + '/' + TOURISTIC_CATEGORIES_FILE_NAME,
        RELATIVE_STATIC_PAGES_ROOT = RELATIVE_API_DIR + '/' + STATIC_PAGES_DIR,
        RELATIVE_STATIC_PAGES_ROOT_FILE = RELATIVE_API_DIR + '/' + STATIC_PAGES_FILE,
        RELATIVE_STATIC_PAGES_IMG_ROOT = RELATIVE_STATIC_PAGES_ROOT + '/' + STATIC_PAGES_IMAGES_DIR;

    return {
        PUBLIC_WEBSITE: PUBLIC_WEBSITE,
        API_FOLDER: API_FOLDER,
        POI_FILE_NAME: POI_FILE_NAME,
        TOURISTIC_CATEGORIES_FILE_NAME: TOURISTIC_CATEGORIES_FILE_NAME,
        TOURISTIC_CONTENTS_FILE_NAME: TOURISTIC_CONTENTS_FILE_NAME,
        TOURISTIC_EVENTS_FILE_NAME: TOURISTIC_EVENTS_FILE_NAME,
        MEDIA_TREK_DIR: MEDIA_TREK_DIR,
        TREKS_FILE_NAME: TREKS_FILE_NAME,
        PICTOGRAM_DIR: PICTOGRAM_DIR,
        LOGS_FILENAME: LOGS_FILENAME,
        TREKS_ZIP_NAME: TREKS_ZIP_NAME,
        TILES_FILE_NAME: TILES_FILE_NAME,
        FORCE_DOWNLOAD: FORCE_DOWNLOAD,
        DEBUG: DEBUG,
        ACTIVE_ELEVATION: ACTIVE_ELEVATION,
        remote: {
            TILES_REMOTE_PATH_URL: globalSettings.DOMAIN_NAME + '/' + globalSettings.ZIP_URL_PREFIX + '/zip/tiles',
            //TILES_REMOTE_PATH_URL: "http://192.168.100.18:8888/files/tiles",
            MAP_GLOBAL_BACKGROUND_REMOTE_FILE_URL: globalSettings.DOMAIN_NAME + '/' + globalSettings.ZIP_URL_PREFIX + '/zip/tiles/global.zip',
            //MAP_GLOBAL_BACKGROUND_REMOTE_FILE_URL: "http://192.168.100.18:8888/files/tiles/global.zip",
            //FULL_DATA_REMOTE_FILE_URL: "http://192.168.100.18:8888/fr/files/api/trek/trek.zip",
            LEAFLET_BACKGROUND_URL: leaflet_conf.BACKGROUND_URL
        },
        device: {
            CDV_ROOT: CDV_ROOT,
            CDV_APP_ROOT: CDV_ROOT + '/' + RELATIVE_ROOT,
            CDV_TREK_ROOT: CDV_ROOT + '/' + RELATIVE_TREK_ROOT,
            CDV_TREK_ROOT_FILE: CDV_ROOT + '/' + RELATIVE_TREK_ROOT_FILE,
            CDV_TREK_MEDIA: CDV_ROOT + '/' + RELATIVE_TREK_MEDIA,
            CDV_PICTO_TREK_ROOT: CDV_ROOT + '/' + RELATIVE_PICTO_TREK_ROOT,
            CDV_POI_ROOT: CDV_ROOT + '/' + RELATIVE_POI_ROOT,
            CDV_POI_MEDIA: CDV_ROOT + '/' + RELATIVE_POI_MEDIA,
            CDV_TOURISTIC_CONTENTS_ROOT: CDV_ROOT + '/' + RELATIVE_TOURISTIC_CONTENTS_ROOT,
            CDV_TOURISTIC_CONTENTS_MEDIA: CDV_ROOT + '/' + RELATIVE_TOURISTIC_CONTENTS_MEDIA,
            CDV_TOURISTIC_EVENTS_ROOT: CDV_ROOT + '/' + RELATIVE_TOURISTIC_EVENTS_ROOT,
            CDV_TOURISTIC_EVENTS_MEDIA: CDV_ROOT + '/' + RELATIVE_TOURISTIC_EVENTS_MEDIA,
            CDV_PICTO_POI_ROOT: CDV_ROOT + '/' + RELATIVE_PICTO_POI_ROOT,
            CDV_PICTO_TOURISTIC_CONTENTS_ROOT: CDV_ROOT + '/' + RELATIVE_PICTO_TOURISTIC_CONTENTS_ROOT,
            CDV_PICTO_TOURISTIC_EVENTS_ROOT: CDV_ROOT + '/' + RELATIVE_PICTO_TOURISTIC_EVENTS_ROOT,
            CDV_TILES_ROOT: CDV_ROOT + '/' + RELATIVE_TILES_ROOT,
            CDV_TILES_ROOT_FILE: CDV_ROOT + '/' + RELATIVE_TILES_ROOT_FILE,
            CDV_TOURISTIC_CATEGORIES_ROOT: CDV_ROOT + '/' + RELATIVE_TOURISTIC_CATEGORIES_ROOT,
            CDV_STATIC_PAGES_ROOT: CDV_ROOT + '/' + RELATIVE_STATIC_PAGES_ROOT,
            CDV_STATIC_PAGES_ROOT_FILE: CDV_ROOT + '/' + RELATIVE_STATIC_PAGES_ROOT_FILE,
            CDV_STATIC_PAGES_IMG_ROOT: CDV_ROOT + '/' + RELATIVE_STATIC_PAGES_IMG_ROOT,
            RELATIVE_ROOT: RELATIVE_ROOT,
            RELATIVE_PAPERCLIP_DIR: RELATIVE_PAPERCLIP_DIR,
            RELATIVE_TREK_ROOT: RELATIVE_TREK_ROOT,
            RELATIVE_TREK_ROOT_FILE: RELATIVE_TREK_ROOT_FILE,
            RELATIVE_TREK_MEDIA: RELATIVE_TREK_MEDIA,
            RELATIVE_POI_ROOT: RELATIVE_POI_ROOT,
            RELATIVE_POI_MEDIA: RELATIVE_POI_MEDIA,
            RELATIVE_PICTO_TREK_ROOT: RELATIVE_PICTO_TREK_ROOT,
            RELATIVE_PICTO_POI_ROOT: RELATIVE_PICTO_POI_ROOT,
            RELATIVE_TILES_ROOT: RELATIVE_TILES_ROOT,
            RELATIVE_TILES_ROOT_FILE: RELATIVE_TILES_ROOT_FILE,
            RELATIVE_STATIC_PAGES_ROOT: RELATIVE_STATIC_PAGES_ROOT,
            RELATIVE_STATIC_PAGES_ROOT_FILE: RELATIVE_STATIC_PAGES_ROOT_FILE,
            RELATIVE_STATIC_PAGES_IMG_ROOT: RELATIVE_STATIC_PAGES_IMG_ROOT,
            RELATIVE_LOGS_FILE: RELATIVE_LOGS_FILE,
            LOG_POOL_TIME: LOG_POOL_TIME,
            LOGS: LOGS,
            POI_ALERT_RADIUS : POI_ALERT_RADIUS,
            LEAFLET_BACKGROUND_URL: CDV_ROOT + '/' + RELATIVE_TILES_ROOT + '/{z}/{x}/{y}.png'
        },
        leaflet: leaflet_conf,
        filters: {
            durations : [
                { id: 4, name: '<1/2 J', interval: [0, 4]},
                { id: 10, name: '1/2 - 1', interval: [4, 10] },
                { id: 24, name: '> 1 J', interval: [10, 99999]},
            ],
            elevations :  [
                { id: 0, name: '<300m', interval: [0, 300] },
                { id: 300, name: '300-600', interval: [301, 600] },
                { id: 600, name: '600-1000', interval: [601, 1000] },
                { id: 1000, name: '>1000m', interval: [1001, 99999] },
            ],
            eLength :  [
                { id: 0, name: '<10km', interval: [0, 10000] },
                { id: 5000, name: '10km-20km', interval: [10001, 20000] },
                { id: 10000, name: '20km-30km', interval: [20001, 30000] },
                { id: 15000, name: '30km-40km', interval: [30001, 40000] },
                { id: 40000, name: '>40km', interval: [40001, 99999] },
            ]
        },
        DETAIL_COLLAPSER_DEFAULT_OPENED: DETAIL_COLLAPSER_DEFAULT_OPENED
    };
}).service('globalizationSettings', [ 'globalizationFactory', 'globalSettings', '$q', function(globalizationFactory, globalSettings, $q){
    var self = this;

    self.I18N_PREFIX;
    self.TREK_REMOTE_FILE_URL;
    self.TREK_REMOTE_FILE_URL_BASE;
    self.FULL_DATA_REMOTE_FILE_URL;

    this.setPrefix = function(i18n_prefix){
        self.I18N_PREFIX = i18n_prefix
        self.TREK_REMOTE_FILE_URL = globalSettings.DOMAIN_NAME + '/api/' + self.I18N_PREFIX + '/treks.geojson';
        self.TREK_REMOTE_FILE_URL_BASE = globalSettings.DOMAIN_NAME + '/' + globalSettings.ZIP_URL_PREFIX + '/' + 'zip/treks' + '/' + self.I18N_PREFIX;
        self.REMOTE_API_FILE_URL_BASE = globalSettings.DOMAIN_NAME + '/' + 'api/' + self.I18N_PREFIX;
        self.TREK_REMOTE_API_FILE_URL_BASE = self.REMOTE_API_FILE_URL_BASE + '/treks';
        self.FULL_DATA_REMOTE_FILE_URL = globalSettings.DOMAIN_NAME + '/' + globalSettings.ZIP_URL_PREFIX + '/' + 'zip/treks' + '/' + self.I18N_PREFIX + '/global.zip';
    }

    this.setDefaultPrefix = function(){
        return globalizationFactory.detectLanguage().then(function(i18n_prefix){
            self.setPrefix(i18n_prefix);
        });
    }
}]);
