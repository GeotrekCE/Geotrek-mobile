'use strict';

var geotrekTreks = angular.module('geotrekTreks');

geotrekTreks.service('treksFileSystemService', function ($resource, $rootScope, $window, $q, $cordovaFile, settings, utils) {
    var _treks;

    this.getTrekSubdir = function(trekId) {
        return settings.device.CDV_TREK_ROOT + '/' + trekId.toString();
    };

    this.replaceImgURLs = function() {
        var deferred = $q.defer();
        var filePath = settings.device.RELATIVE_TREK_ROOT_FILE,
            _this = this;

        $cordovaFile.readAsText(filePath)
        .then(
            function(data) {
                var data = JSON.parse(data);
                angular.forEach(data.features, function(trek) {
                    var currentTrekId = trek.id;
                    angular.forEach(trek.properties.pictures, function(picture) {
                        var pictureUrl = picture.url;
                        var filename = pictureUrl.substr(pictureUrl.lastIndexOf('/') + 1);
                        picture.url = settings.device.CDV_TREK_ROOT + '/' + currentTrekId.toString() + '/' + filename;
                    });
                    angular.forEach(trek.properties.usages, function(usage) {
                        var usageUrl = usage.pictogram;
                        var filename = usageUrl.substr(usageUrl.lastIndexOf('/') + 1);
                        usage.pictogram = settings.device.CDV_PICTO_TREK_ROOT + '/' + filename;
                    });
                    angular.forEach(trek.properties.themes, function(theme) {
                        var themeUrl = theme.pictogram;
                        var filename = themeUrl.substr(themeUrl.lastIndexOf('/') + 1);
                        theme.pictogram = settings.device.CDV_PICTO_TREK_ROOT + '/' + filename;
                    });
                    angular.forEach(trek.properties.networks, function(network) {
                        var networkUrl = network.pictogram;
                        var filename = networkUrl.substr(networkUrl.lastIndexOf('/') + 1);
                        network.pictogram = settings.device.CDV_PICTO_TREK_ROOT + '/' + filename;
                    });
                    if(angular.isDefined(trek.properties.information_desks)){
                        angular.forEach(trek.properties.information_desks, function(information_desk) {
                            if(angular.isDefined(information_desk.photo_url) && information_desk.photo_url !== null){
                                var informationUrl = information_desk.photo_url;
                                var filename = informationUrl.substr(informationUrl.lastIndexOf('/') + 1);
                                information_desk.photo_url = settings.device.CDV_TREK_ROOT + '/' + currentTrekId.toString() + '/' + filename;
                            };
                        });
                    };
                    if(angular.isDefined(trek.properties.difficulty)){
                        var difficultyUrl = trek.properties.difficulty.pictogram;
                        var filename = difficultyUrl.substr(difficultyUrl.lastIndexOf('/') + 1);
                        trek.properties.difficulty.pictogram = settings.device.CDV_PICTO_TREK_ROOT + '/' + filename;
                    }
                    if(angular.isDefined(trek.properties.altimetric_profile)){
                        var altimetric_profileUrl = trek.properties.altimetric_profile;
                        var filename = altimetric_profileUrl.substr(altimetric_profileUrl.lastIndexOf('/') + 1).replace(".json", ".svg");
                        trek.properties.altimetric_profile = settings.device.CDV_TREK_ROOT + '/' + currentTrekId.toString() + '/' + filename;
                    }
                });
                $cordovaFile.writeFile(filePath, JSON.stringify(data), {append: false})
                .then(deferred.resolve, deferred.reject);
            },
            deferred.reject
        );

        return deferred.promise;
    };

    // Getting treks used for mobile purpose
    // Image urls are converted to cdv://localhost/persistent/... ones
    this.getTreks = function() {
        return this._getTreks();
    };

    this._getTreks = function() {
        var deferred = $q.defer();
        if(!_treks) {
            var filePath = settings.device.RELATIVE_TREK_ROOT_FILE,
                _this = this;

            $cordovaFile.readAsText(filePath)
            .then(
                function(data) {
                    _treks = JSON.parse(data);
                    deferred.resolve(_treks);
                },
                deferred.reject
            );
        } else {
            deferred.resolve(_treks);
        }

        return deferred.promise;
    };

});