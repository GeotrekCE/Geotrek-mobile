'use strict';

var geotrekApp = angular.module('geotrekMobileApp');

/**
 * Service that gives project constants
 *
 * FileSystem on device is as follows:
 * <GEOTREK_DIR>
 *  |-- trek.geojson
 *  |-- <TREK_DIR>
 *      |-- <trek_1> (ex: 2)
 *          |-- <picture1.jpg>
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
 */

geotrekApp.factory('settings', function () {
    
    var DOMAIN_NAME = 'http://rando.makina-corpus.net',
        POI_FILE_NAME = 'pois.geojson',
        TREKS_FILE_NAME = 'trek.geojson',
        GEOTREK_DIR = 'geotrek',
        TREK_DIR = 'trek',
        POI_DIR = 'poi',
        PICTOGRAM_DIR = 'pictogram',
        CDV_ROOT = 'cdvfile://localhost/persistent';
    
    var RELATIVE_ROOT = GEOTREK_DIR,
        RELATIVE_TREK_ROOT = GEOTREK_DIR + '/' + TREK_DIR,
        RELATIVE_TREK_ROOT_FILE = GEOTREK_DIR + '/' + TREKS_FILE_NAME,
        RELATIVE_POI_ROOT = GEOTREK_DIR + '/' + POI_DIR,
        RELATIVE_PICTO_ROOT = RELATIVE_POI_ROOT + '/' + PICTOGRAM_DIR;

    return {
        DOMAIN_NAME: DOMAIN_NAME,
        POI_FILE_NAME: POI_FILE_NAME,
        remote: {
            TREK_REMOTE_FILE_URL_BASE: DOMAIN_NAME + '/fr/files/api/trek',
            TREK_REMOTE_FILE_URL: DOMAIN_NAME + '/fr/files/api/trek/trek.geojson'
        },
        device: {
            CDV_ROOT: CDV_ROOT + '/' + RELATIVE_ROOT,
            CDV_TREK_ROOT: CDV_ROOT + '/' + RELATIVE_TREK_ROOT,
            CDV_TREK_ROOT_FILE: CDV_ROOT + '/' + RELATIVE_TREK_ROOT_FILE,
            CDV_POI_ROOT: CDV_ROOT + '/' + RELATIVE_POI_ROOT,
            CDV_PICTO_ROOT: CDV_ROOT + '/' + RELATIVE_PICTO_ROOT,
            RELATIVE_ROOT: RELATIVE_ROOT,
            RELATIVE_TREK_ROOT: RELATIVE_TREK_ROOT,
            RELATIVE_TREK_ROOT_FILE: RELATIVE_TREK_ROOT_FILE,
            RELATIVE_POI_ROOT: RELATIVE_POI_ROOT,
            RELATIVE_PICTO_ROOT: RELATIVE_PICTO_ROOT
        }
    };
});
