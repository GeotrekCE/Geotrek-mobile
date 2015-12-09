'use strict';

var geotrekTouristics = angular.module('geotrekTouristics', []);

/**
 * Service that persists and retrieves treks from data source
 */
geotrekTouristics.factory('touristicsFactory',
    ['$injector', '$window', '$rootScope', '$q', 'logging', 'treksFactory',
    function ($injector, $window, $rootScope, $q, logging, treksFactory) {

    var touristicsFactory;

    if (angular.isDefined($window.cordova)) {
        touristicsFactory = $injector.get('touristicsFileSystemService');
    }
    else {
        touristicsFactory = $injector.get('touristicsRemoteService');
    }


    touristicsFactory.getAllTouristicsContents = function() {

        return treksFactory.getTreks().then(function(treks) {
            var promises = [],
                deferred = $q.defer();

            angular.forEach(treks.features, function(trek) {
                promises.push(touristicsFactory.getTouristicContentsFromTrek(trek.id));
                promises.push(touristicsFactory.getTouristicEventsFromTrek(trek.id));
            });

            $q.all(promises).then(function(datas) {
                var touristics = [];
                angular.forEach(datas, function(data) {
                    angular.forEach(data.features, function(touristicContent) {
                        touristics.push(touristicContent);
                    });
                });
                deferred.resolve(touristics);
            });

            return deferred.promise;

        });
    };

    touristicsFactory.getAllTouristicsContentsFromATrek = function(trekId) {

        var promises = [],
            deferred = $q.defer(),
            touristicEvents,
            touristicContents,
            touristicCategories;

        promises.push(touristicsFactory.getTouristicCategories().then(
            function (categories) {
                touristicCategories = angular.copy(categories);
            }
        ));
        promises.push(touristicsFactory.getTouristicContentsFromTrek(trekId).then(
            function (contents) {
                touristicContents = contents;
            }
        ));
        promises.push(touristicsFactory.getTouristicEventsFromTrek(trekId).then(
            function (events) {
                touristicEvents = events;
            },
            function (events){
                //no events
            }
        ));

        $q.all(promises).then(function() {
            var touristics;
            if (touristicEvents !== undefined) {
                touristics = touristicContents.features.concat(touristicEvents.features);
            } else {
                touristics = touristicContents.features
            }

            angular.forEach(touristics, function(touristic) {
                angular.forEach(touristicCategories, function(category) {
                    if (touristic.properties.category.id === category.id) {
                        if (!category.values) {
                            category.values = [];
                        }

                        category.values.push(touristic);
                    }
                });
            });
            deferred.resolve(touristicCategories);
        });

        return deferred.promise;
    };

    touristicsFactory.getTouristicCategories = function() {
        var deferred = $q.defer();

        if (touristicsFactory.touristicsCategories) {
            deferred.resolve(touristicsFactory.touristicsCategories);
        } else {
            touristicsFactory.getTouristicCategoriesData()
            .then(
                function (touristicCategories) {
                    var convertedData = touristicsFactory.replaceCategoriesImgURLs(touristicCategories);
                    // convertedData = touristicsFactory.addEventCategory(convertedData);
                    touristicsFactory.touristicsCategories = convertedData;
                    deferred.resolve(convertedData);
                },
                function (err) {
                    console.error('error: ', err);
                }
            );
        }

        return deferred.promise;
    };

    return touristicsFactory;
}]);