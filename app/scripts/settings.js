'use strict';

var geotrekAppSettings = angular.module('geotrekAppSettings', []);

/**
 * Service that gives project constants
 *
 */

// settings is a factory, we cannot use it in other modules config part,
// so we put in globalSettings some project constants.
geotrekAppSettings.constant('globalSettings', {
    DEFAULT_LANGUAGE: 'fr',
    AVAILABLE_LANGUAGES: ['fr'],
    DOMAIN_NAME: 'http://qa-rando-cg44.makina-corpus.net/data',
    GOOGLE_ANALYTICS_ID: 'UA-46270573-6'
})
.factory('settings', function () {

    // Variables that user can change
    var DOMAIN_NAME = /*'http://geotrek-admin.alpesrando.net',*/'http://qa-rando-cg44.makina-corpus.net/data',
        PUBLIC_WEBSITE = /*'http://itinerance.alpesrando.net',*/'http://qa-rando-cg44.makina-corpus.net',
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
        GLOBAL_MAP_ATTRIBUTION: '(c) IGN Geoportail',
        TREK_COLOR: '#aec900',
        HIGHLIGHT_DETAIL_LINEAR: true,
        HIGHLIGHT_COLOR: '#000000'
    };

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
        TREKS_FILE_NAME = 'treks.geojson',
        TREKS_ZIP_NAME = 'global.zip',
        TILES_FILE_NAME = 'global.zip';

    var GEOTREK_DIR = 'rando-loire-atlantique',
        API_DIR = 'api',
        LANG_DIR = 'fr',
        MEDIA_DIR = 'media',
        UPLOAD_DIR = 'upload',
        PAPERCLIP_DIR = 'paperclip',
        MEDIA_TREK_DIR = 'trekking_trek',
        MEDIA_POI_DIR = 'trekking_poi',
        LOGS_FILENAME = 'rando-loire-atlantique.log',
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
        RELATIVE_PICTO_TREK_ROOT = RELATIVE_MEDIA_DIR + '/' + UPLOAD_DIR,
        RELATIVE_PICTO_POI_ROOT = RELATIVE_MEDIA_DIR + '/' + UPLOAD_DIR,
        RELATIVE_TILES_ROOT = GEOTREK_DIR + '/' + TILES_DIR,
        RELATIVE_TILES_ROOT_FILE = RELATIVE_TILES_ROOT + '/' + TILES_FILE_NAME,
        RELATIVE_STATIC_PAGES_ROOT = RELATIVE_API_DIR + '/' + STATIC_PAGES_DIR,
        RELATIVE_STATIC_PAGES_ROOT_FILE = RELATIVE_API_DIR + '/' + STATIC_PAGES_FILE,
        RELATIVE_STATIC_PAGES_IMG_ROOT = RELATIVE_STATIC_PAGES_ROOT + '/' + STATIC_PAGES_IMAGES_DIR;

    return {
        DOMAIN_NAME: DOMAIN_NAME,
        PUBLIC_WEBSITE: PUBLIC_WEBSITE,
        API_FOLDER: API_FOLDER,
        POI_FILE_NAME: POI_FILE_NAME,
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
            TILES_REMOTE_PATH_URL: DOMAIN_NAME + '/zip/tiles',
            //TILES_REMOTE_PATH_URL: "http://192.168.100.18:8888/files/tiles",
            MAP_GLOBAL_BACKGROUND_REMOTE_FILE_URL: DOMAIN_NAME + '/zip/tiles/global.zip',
            //MAP_GLOBAL_BACKGROUND_REMOTE_FILE_URL: "http://192.168.100.18:8888/files/tiles/global.zip",
            //FULL_DATA_REMOTE_FILE_URL: "http://192.168.100.18:8888/fr/files/api/trek/trek.zip",
            LEAFLET_BACKGROUND_URL: 'http://rando.loire-atlantique.fr/tiles?LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-EXPRESS.CLASSIQUE&EXCEPTIONS=text/xml&FORMAT=image/jpeg&SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={    z}&TILEROW={y}&TILECOL={x}'//'http://gpp3-wxs.ign.fr/mt31gongul3grvjwuhfur21a/geoportail/wmts?LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-EXPRESS.CLASSIQUE&EXCEPTIONS=text/xml&FORMAT=image/jpeg&SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={    z}&TILEROW={y}&TILECOL={x}'
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
            CDV_PICTO_POI_ROOT: CDV_ROOT + '/' + RELATIVE_PICTO_POI_ROOT,
            CDV_TILES_ROOT: CDV_ROOT + '/' + RELATIVE_TILES_ROOT,
            CDV_TILES_ROOT_FILE: CDV_ROOT + '/' + RELATIVE_TILES_ROOT_FILE,
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
                { id: 0, name: '<5km', interval: [0, 5000] },
                { id: 5000, name: '5km-10km', interval: [5001, 10000] },
                { id: 10000, name: '10km-15km', interval: [10001, 15000] },
                { id: 15000, name: '15km-20km', interval: [15001, 20000] },
                { id: 20000, name: '20km-25km', interval: [20001, 25000] },
                { id: 25000, name: '25km-30km', interval: [25001, 30000] },
                { id: 30000, name: '30km-35km', interval: [30001, 35000] },
                { id: 35000, name: '35km-40km', interval: [35001, 40000] },
                { id: 40000, name: '40km-45km', interval: [40001, 45000] },
                { id: 45000, name: '>45km', interval: [45001, 99999] },
            ]
        }
    };
}).service('globalizationSettings', [ 'globalizationFactory', 'settings', '$q', function(globalizationFactory, settings, $q){
    var self = this;

    self.I18N_PREFIX;
    self.TREK_REMOTE_FILE_URL;
    self.TREK_REMOTE_FILE_URL_BASE;
    self.FULL_DATA_REMOTE_FILE_URL;

    this.setPrefix = function(i18n_prefix){
        self.I18N_PREFIX = i18n_prefix
        self.TREK_REMOTE_FILE_URL = settings.DOMAIN_NAME + '/api/' + self.I18N_PREFIX + '/treks.geojson';
        self.TREK_REMOTE_FILE_URL_BASE = settings.DOMAIN_NAME + '/' + 'zip/treks' + '/' + self.I18N_PREFIX;
        self.TREK_REMOTE_API_FILE_URL_BASE = settings.DOMAIN_NAME + '/' + 'api/' + self.I18N_PREFIX + '/treks';
        self.FULL_DATA_REMOTE_FILE_URL = settings.DOMAIN_NAME + '/' + 'zip/treks' + '/' + self.I18N_PREFIX + '/global.zip';
    }

    this.setDefaultPrefix = function(){
        return globalizationFactory.detectLanguage().then(function(i18n_prefix){
            self.setPrefix(i18n_prefix);
        });
    }
}]);
