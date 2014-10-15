'use strict';

var geotrekAppSettings = angular.module('geotrekAppSettings', []);

/**
 * Service that gives project constants
 *
 */

// settings is a factory, we cannot use it in other modules config part,
// so we put in globalSettings some project constants.
geotrekAppSettings.constant('globalSettings', {
    DEFAULT_LANGUAGE: 'fr'
})
.factory('settings', function () {
    
    // Variables that user can change
    var DOMAIN_NAME = 'http://prod-rando-fr.makina-corpus.net',
        FORCE_DOWNLOAD = false,
        DEBUG = false,
        LOGS = true,  // if true, console logs are also saved in a file (device only)
        // logs are moved each LOG_POOL_TIME ms from local storage to file (device only)
        LOG_POOL_TIME = 6000,  // in ms
        POI_ALERT_RADIUS = 0.5;  // in km

    var leaflet_conf = {
        GLOBAL_MAP_CENTER_LATITUDE: 42.77,
        GLOBAL_MAP_CENTER_LONGITUDE: 1.37,
        GLOBAL_MAP_DEFAULT_ZOOM: 12,
        GLOBAL_MAP_ATTRIBUTION: '<a href="http://www.makina-corpus.com" target="_blank">Makina Corpus</a> | &copy; Contributeurs <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a>',
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
        TREKS_FILE_NAME = 'trek.geojson',
        TILES_FILE_NAME = 'global.zip';

    var GEOTREK_DIR = 'geotrek',
        LOGS_FILENAME = 'geotrek.log',
        TILES_DIR = 'tiles',
        TREK_DIR = 'trek',
        POI_DIR = 'poi',
        STATIC_PAGES_DIR = 'staticpages',
        STATIC_PAGES_FILE = 'pages.json',
        STATIC_PAGES_IMAGES_DIR = 'images',
        PICTOGRAM_DIR = 'pictogram',
        CDV_ROOT = 'cdvfile://localhost/persistent',

        RELATIVE_ROOT = GEOTREK_DIR,
        RELATIVE_LOGS_FILE = GEOTREK_DIR + '/' + LOGS_FILENAME,
        RELATIVE_TREK_ROOT = GEOTREK_DIR + '/' + TREK_DIR,
        RELATIVE_TREK_ROOT_FILE = GEOTREK_DIR + '/' + TREKS_FILE_NAME,
        RELATIVE_POI_ROOT = GEOTREK_DIR + '/' + POI_DIR,
        RELATIVE_PICTO_TREK_ROOT = RELATIVE_TREK_ROOT + '/' + PICTOGRAM_DIR,
        RELATIVE_PICTO_POI_ROOT = RELATIVE_POI_ROOT + '/' + PICTOGRAM_DIR,
        RELATIVE_TILES_ROOT = GEOTREK_DIR + '/' + TILES_DIR,
        RELATIVE_TILES_ROOT_FILE = RELATIVE_TILES_ROOT + '/' + TILES_FILE_NAME,
        RELATIVE_STATIC_PAGES_ROOT = GEOTREK_DIR + '/' + STATIC_PAGES_DIR,
        RELATIVE_STATIC_PAGES_ROOT_FILE = RELATIVE_STATIC_PAGES_ROOT + '/' + STATIC_PAGES_FILE,
        RELATIVE_STATIC_PAGES_IMG_ROOT = RELATIVE_STATIC_PAGES_ROOT + '/' + STATIC_PAGES_IMAGES_DIR;

    return {
        DOMAIN_NAME: DOMAIN_NAME,
        POI_FILE_NAME: POI_FILE_NAME,
        TREKS_FILE_NAME: TREKS_FILE_NAME,
        TILES_FILE_NAME: TILES_FILE_NAME,
        FORCE_DOWNLOAD: FORCE_DOWNLOAD,
        DEBUG: DEBUG,
        remote: {
            TILES_REMOTE_PATH_URL: DOMAIN_NAME + '/files/tiles',
            //TILES_REMOTE_PATH_URL: "http://192.168.100.18:8888/files/tiles",
            MAP_GLOBAL_BACKGROUND_REMOTE_FILE_URL: DOMAIN_NAME + '/files/tiles/global.zip',
            //MAP_GLOBAL_BACKGROUND_REMOTE_FILE_URL: "http://192.168.100.18:8888/files/tiles/global.zip",
            //FULL_DATA_REMOTE_FILE_URL: "http://192.168.100.18:8888/fr/files/api/trek/trek.zip",
            LEAFLET_BACKGROUND_URL: 'http://{s}.livembtiles.makina-corpus.net/makina/OSMTopo/{z}/{x}/{y}.png'
        },
        device: {
            CDV_ROOT: CDV_ROOT,
            CDV_TREK_ROOT: CDV_ROOT + '/' + RELATIVE_TREK_ROOT,
            CDV_TREK_ROOT_FILE: CDV_ROOT + '/' + RELATIVE_TREK_ROOT_FILE,
            CDV_POI_ROOT: CDV_ROOT + '/' + RELATIVE_POI_ROOT,
            CDV_PICTO_TREK_ROOT: CDV_ROOT + '/' + RELATIVE_PICTO_TREK_ROOT,
            CDV_PICTO_POI_ROOT: CDV_ROOT + '/' + RELATIVE_PICTO_POI_ROOT,
            CDV_TILES_ROOT: CDV_ROOT + '/' + RELATIVE_TILES_ROOT,
            CDV_TILES_ROOT_FILE: CDV_ROOT + '/' + RELATIVE_TILES_ROOT_FILE,
            CDV_STATIC_PAGES_ROOT: CDV_ROOT + '/' + RELATIVE_STATIC_PAGES_ROOT,
            CDV_STATIC_PAGES_ROOT_FILE: CDV_ROOT + '/' + RELATIVE_STATIC_PAGES_ROOT_FILE,
            CDV_STATIC_PAGES_IMG_ROOT: CDV_ROOT + '/' + RELATIVE_STATIC_PAGES_IMG_ROOT,
            RELATIVE_ROOT: RELATIVE_ROOT,
            RELATIVE_TREK_ROOT: RELATIVE_TREK_ROOT,
            RELATIVE_TREK_ROOT_FILE: RELATIVE_TREK_ROOT_FILE,
            RELATIVE_POI_ROOT: RELATIVE_POI_ROOT,
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
        }
    };
}).service('globalizationSettings', [ 'globalizationFactory', 'settings', '$q', function(globalizationFactory, settings, $q){
    var self = this;

    self.I18N_PREFIX;
    self.TREK_REMOTE_FILE_URL;
    self.TREK_REMOTE_FILE_URL_BASE;

    this.setPrefix = function(i18n_prefix){
        self.I18N_PREFIX = i18n_prefix
        self.TREK_REMOTE_FILE_URL = settings.DOMAIN_NAME  + '/' + self.I18N_PREFIX + '/files/api/trek/trek.geojson';
        self.TREK_REMOTE_FILE_URL_BASE = settings.DOMAIN_NAME  + '/' + self.I18N_PREFIX + '/files/api/trek';
        self.FULL_DATA_REMOTE_FILE_URL = settings.DOMAIN_NAME + '/' + self.I18N_PREFIX + '/files/api/trek/trek.zip';
    }

    this.setDefaultPrefix = function(){
        return globalizationFactory.detectLanguage().then(function(i18n_prefix){
            self.setPrefix(i18n_prefix);
        });
    }
}]);
