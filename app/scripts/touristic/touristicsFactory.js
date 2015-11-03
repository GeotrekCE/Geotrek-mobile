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
            }
        ));

        $q.all(promises).then(function() {
            var touristics = touristicContents.features.concat(touristicEvents.features);
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

    touristicsFactory.addEventCategory = function (categories) {
        var result = categories;
        var eventCategory = {
            id: "E",
            label: "Evennements",
            pictogram: "/static/tourism/touristicevent.svg",
            slug: "events"
        };

        if (typeof result !== 'object') {
            result = [result];
        }

        result.push(eventCategory);

        return result;
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
                    convertedData = touristicsFactory.addEventCategory(convertedData);
                    touristicsFactory.touristicsCategories = convertedData;
                    deferred.resolve(convertedData);
                },
                function () {
                    var testData = [
                        {
                            id: "C1",
                            label: "H\u00e9bergement",
                            type1_label: "Type d'usage",
                            type2_label: "Label",
                            pictogram: "/media/upload/touristiccontent-accommodation.svg",
                            order: null,
                            slug: "contenu-touristique"
                        },
                        {
                            id: "C8",
                            label: "Mus\u00e9e",
                            type1_label: "Type d'usage",
                            type2_label: "",
                            pictogram: "/media/upload/touristiccontent-museum.svg",
                            order: null,
                            slug: "contenu-touristique"
                        },
                        {
                            id: "C2",
                            label: "Pleine Nature",
                            type1_label: "Type d'usage",
                            type2_label: "",
                            pictogram: "/media/upload/touristiccontent-outdoor.svg",
                            order: null,
                            slug: "contenu-touristique"
                        },
                        {
                            id: "C6",
                            label: "Produits",
                            type1_label: "Type d'usage",
                            type2_label: "",
                            pictogram: "/media/upload/touristiccontent-products.svg",
                            order: null,
                            slug: "contenu-touristique"
                        },
                        {
                            id: "C5",
                            label: "Restaurants",
                            type1_label: "Type d'usage",
                            type2_label: "",
                            pictogram: "/media/upload/touristiccontent-restaurants.svg",
                            order: null,
                            slug: "contenu-touristique"
                        },
                        {
                            id: "C7",
                            label: "S\u00e9jours",
                            type1_label: "Th\u00e9matique",
                            type2_label: "",
                            pictogram: "/media/upload/touristiccontent-destination.svg",
                            order: null,
                            slug: "contenu-touristique"
                        },
                        {
                            id: "C4",
                            label: "Sites recommand\u00e9s",
                            type1_label: "Type d'usage",
                            type2_label: "",
                            pictogram: "/media/upload/touristiccontent-sites.svg",
                            order: null,
                            slug: "contenu-touristique"
                        },
                        {
                            id: "C3",
                            label: "Sorties",
                            type1_label: "Type d'usage",
                            type2_label: "Service",
                            pictogram: "/media/upload/touristiccontent-visits.svg",
                            order: null,
                            slug: "contenu-touristique"
                        }
                    ];

                    var convertedData = touristicsFactory.replaceCategoriesImgURLs(testData);
                    convertedData = touristicsFactory.addEventCategory(convertedData);
                    touristicsFactory.touristicsCategories = convertedData;
                    deferred.resolve(convertedData);
                }
            );
        }

        return deferred.promise;
    };

    return touristicsFactory;
}]);