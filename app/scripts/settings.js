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
        DEBUG = true;

    var leaflet_dev_conf = {
        GLOBAL_MAP_CENTER_LATITUDE: 42.77,
        GLOBAL_MAP_CENTER_LONGITUDE: 1.37,
        GLOBAL_MAP_DEFAULT_ZOOM: 12,
        GLOBAL_MAP_ATTRIBUTION: '<a href="http://www.makina-corpus.com" target="_blank">Makina Corpus</a> | &copy; Contributeurs <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a>'
    };

    var ecrin_conf = {
        GLOBAL_MAP_CENTER_LATITUDE: 44.8,
        GLOBAL_MAP_CENTER_LONGITUDE: 6.2,
        GLOBAL_MAP_DEFAULT_ZOOM: 9,
        GLOBAL_MAP_ATTRIBUTION: '&copy; IGN Geoportail'
    };

    var leaflet_conf = leaflet_dev_conf;

    /* Variables for filesystem tree on device
     * FileSystem is created as follows:
     * <GEOTREK_DIR>
     *  |-- trek.geojson
     *  |-- <TREK_DIR>
     *      |-- <trek_1> (ex: 2)
     *          |-- <picture1.jpg>
     *          |-- <usage1.jpg>
     *          |-- pois.geojson
     *      |-- <trek_2> (ex: 2854)
     *      ...
     *  |-- <POI_DIR>
     *      |-- <PICTOGRAM_DIR>
     *          |-- <picto1.jpg>
     *          ...
     *      |-- <poi_1>
     *          |-- <thumbnail.jpg> (if exists)
     *          |-- <picture1.jpg>
     *          ...
     *  |-- <TILES_DIR>
     *      |-- global.mbtiles
     *      |-- <trek-X.mbtiles> (ex: trek-1)
     *      |-- <trek-Y.mbtiles> (ex: trek-1)
     *  |-- <STATIC_DIR>
     *      |-- pages.json
     *      |-- images
     *          |-- <picture1.jpg>
     *          |-- <picture2.jpg>
     */

    var POI_FILE_NAME = 'pois.geojson',
        TREKS_FILE_NAME = 'trek.geojson',
        TILES_FILE_NAME = 'global.mbtiles';

    var GEOTREK_DIR = 'geotrek',
        TILES_DIR = 'tiles',
        TREK_DIR = 'trek',
        POI_DIR = 'poi',
        STATIC_PAGES_DIR = 'staticpages',
        STATIC_PAGES_FILE = 'pages.json',
        STATIC_PAGES_IMAGES_DIR = 'images',
        PICTOGRAM_DIR = 'pictogram',
        CDV_ROOT = 'cdvfile://localhost/persistent',

        RELATIVE_ROOT = GEOTREK_DIR,
        RELATIVE_TREK_ROOT = GEOTREK_DIR + '/' + TREK_DIR,
        RELATIVE_TREK_ROOT_FILE = GEOTREK_DIR + '/' + TREKS_FILE_NAME,
        RELATIVE_POI_ROOT = GEOTREK_DIR + '/' + POI_DIR,
        RELATIVE_PICTO_ROOT = RELATIVE_POI_ROOT + '/' + PICTOGRAM_DIR,
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
            TREK_REMOTE_FILE_URL_BASE: DOMAIN_NAME + '/fr/files/api/trek',
            TREK_REMOTE_FILE_URL: DOMAIN_NAME + '/fr/files/api/trek/trek.geojson',
            TILES_REMOTE_PATH_URL: DOMAIN_NAME + '/files/tiles',
            MAP_GLOBAL_BACKGROUND_REMOTE_FILE_URL: DOMAIN_NAME + '/files/tiles/global.mbtiles',
            STATIC_PAGES_URL: DOMAIN_NAME + '/fr/files/api/pages/pages.json'
        },
        device: {
            CDV_ROOT: CDV_ROOT,
            CDV_TREK_ROOT: CDV_ROOT + '/' + RELATIVE_TREK_ROOT,
            CDV_TREK_ROOT_FILE: CDV_ROOT + '/' + RELATIVE_TREK_ROOT_FILE,
            CDV_POI_ROOT: CDV_ROOT + '/' + RELATIVE_POI_ROOT,
            CDV_PICTO_ROOT: CDV_ROOT + '/' + RELATIVE_PICTO_ROOT,
            CDV_TILES_ROOT: CDV_ROOT + '/' + RELATIVE_TILES_ROOT,
            CDV_TILES_ROOT_FILE: CDV_ROOT + '/' + RELATIVE_TILES_ROOT_FILE,
            CDV_STATIC_PAGES_ROOT: CDV_ROOT + '/' + RELATIVE_STATIC_PAGES_ROOT,
            CDV_STATIC_PAGES_ROOT_FILE: CDV_ROOT + '/' + RELATIVE_STATIC_PAGES_ROOT_FILE,
            CDV_STATIC_PAGES_IMG_ROOT: CDV_ROOT + '/' + RELATIVE_STATIC_PAGES_IMG_ROOT,
            RELATIVE_ROOT: RELATIVE_ROOT,
            RELATIVE_TREK_ROOT: RELATIVE_TREK_ROOT,
            RELATIVE_TREK_ROOT_FILE: RELATIVE_TREK_ROOT_FILE,
            RELATIVE_POI_ROOT: RELATIVE_POI_ROOT,
            RELATIVE_PICTO_ROOT: RELATIVE_PICTO_ROOT,
            RELATIVE_TILES_ROOT: RELATIVE_TILES_ROOT,
            RELATIVE_TILES_ROOT_FILE: RELATIVE_TILES_ROOT_FILE,
            RELATIVE_STATIC_PAGES_ROOT: RELATIVE_STATIC_PAGES_ROOT,
            RELATIVE_STATIC_PAGES_ROOT_FILE: RELATIVE_STATIC_PAGES_ROOT_FILE,
            RELATIVE_STATIC_PAGES_IMG_ROOT: RELATIVE_STATIC_PAGES_IMG_ROOT
        },
        leaflet: leaflet_conf
    };
});
