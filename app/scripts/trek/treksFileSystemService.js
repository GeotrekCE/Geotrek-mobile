'use strict';

var geotrekTreks = angular.module('geotrekTreks');

geotrekTreks.service('treksFileSystemService',
    function ($resource, $rootScope, $window, $q, $cordovaFile, settings, utils, globalizationSettings, mapFactory) {
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
                    if(trek.properties.difficulty){
                        var difficultyUrl = trek.properties.difficulty.pictogram;
                        var filename = difficultyUrl.substr(difficultyUrl.lastIndexOf('/') + 1);
                        trek.properties.difficulty.pictogram = settings.device.CDV_PICTO_TREK_ROOT + '/' + filename;
                    }
                    if(trek.properties.altimetric_profile){
                        var altimetric_profileUrl = trek.properties.altimetric_profile;
                        var filename = altimetric_profileUrl.substr(altimetric_profileUrl.lastIndexOf('/') + 1).replace(".json", ".png");
                        trek.properties.altimetric_profile = settings.device.CDV_TREK_ROOT + '/' + currentTrekId.toString() + '/' + filename;
                    }
                    if(trek.properties.thumbnail) {
                        var thumbUrl = trek.properties.thumbnail;
                        var filename = thumbUrl.substr(thumbUrl.lastIndexOf('/') + 1);
                        trek.properties.thumbnail = settings.device.CDV_TREK_ROOT + '/' + currentTrekId.toString() + '/' + filename;
                    }
                });
                $cordovaFile.writeFile(filePath, JSON.stringify(data), {append: false})
                .then(deferred.resolve, deferred.reject);
            },
            deferred.reject
        );

        return deferred.promise;
    };

    this.replaceGalleryURLs = function(trekData) {
        var copy = angular.copy(trekData, {}),
            _this = this,
            deferred = $q.defer();

        mapFactory.hasTrekPreciseBackground(trekData.id)
        .then(function(isLocal) {
            // Parse trek gallery pictures, and change their URL
            if (isLocal) {
                angular.forEach(copy.properties.pictures, function(picture) {
                    var pictureUrl = picture.url;
                    var filename = pictureUrl.substr(pictureUrl.lastIndexOf('/') + 1);
                    picture.url = settings.device.CDV_TREK_ROOT + '/' + trekData.id.toString() + '/' + filename;
                });
                if(angular.isDefined(copy.properties.information_desks)){
                    angular.forEach(copy.properties.information_desks, function(information_desk) {
                        if(angular.isDefined(information_desk.photo_url) && information_desk.photo_url !== null){
                            var informationUrl = information_desk.photo_url;
                            var filename = informationUrl.substr(informationUrl.lastIndexOf('/') + 1);
                            information_desk.photo_url = settings.device.CDV_TREK_ROOT + '/' + trekData.id.toString() + '/' + filename;
                        };
                    });
                }
            }else {
                angular.forEach(copy.properties.pictures, function(picture) {
                    picture.url = settings.DOMAIN_NAME + picture.url;
                });
                if(angular.isDefined(copy.properties.information_desks)){
                    angular.forEach(copy.properties.information_desks, function(information_desk) {
                        if(angular.isDefined(information_desk.photo_url) && information_desk.photo_url !== null){
                            information_desk.photo_url = settings.DOMAIN_NAME + information_desk.photo_url;
                        };
                    });
                }
            }
            deferred.resolve(copy);
        });

        return deferred.promise;

    };

    // Getting treks used for mobile purpose
    // Image urls are converted to cdv://localhost/persistent/... ones
    /*this.getTreks = function() {
        return this._getTreks();
    };*/

    this.getTreks = function() {
        var self = this,
            deferred = $q.defer();
        if(!_treks) {
            var filePath = settings.device.RELATIVE_TREK_ROOT_FILE,
                _this = this;

            $cordovaFile.readAsText(filePath)
            .then(
                function(data) {
                    _treks = JSON.parse(data);
                    self.updateDownloadedTreks(_treks)
                    .then(
                        function(trekCollection) {
                            deferred.resolve(trekCollection);
                        }, function(error) {
                            deferred.reject(error);
                        }
                    );
                },
                function(error){
                    if(error.code === 1){
                        error.message = "treks_file_not_found";
                    }
                    deferred.reject(error)
                }
            );
        } else {
            self.updateDownloadedTreks(_treks)
            .then(
                function(trekCollection) {
                    deferred.resolve(trekCollection);
                }, function(error) {
                    deferred.reject(error);
                }
            );

        }

        return deferred.promise;
    };

    this.updateDownloadedTreks = function(treks) {
        var defered = $q.defer(),
            promises = [],
            treksList = treks.features;

        angular.forEach(treksList, function(trek) {
            promises.push(mapFactory.hasTrekPreciseBackground(trek.id));
        });

        $q.all(promises)
        .then(
            function(isDownloadedList) {
                for(var i=0; i<isDownloadedList.length; i++) {
                    treksList[i].tiles = {
                        'isDownloaded': isDownloadedList[i]
                    };
                }
                defered.resolve(treks);
            }
        );

        return defered.promise;
    }


    // Download of trek and pois images for offline use
    this.downloadTrekDetails = function(trekId) {
        var url = globalizationSettings.TREK_REMOTE_FILE_URL_BASE + utils.getTrekFilename(trekId);
        return utils.downloadAndUnzip(url, settings.device.CDV_ROOT + "/" + settings.device.RELATIVE_ROOT);
    };

    this.removeTrekDownloadedFiles = function(path) {

        var defered = $q.defer();
        $cordovaFile.listDir(path)
        .then(function(listFiles) {
            var promises = [];

            angular.forEach(listFiles, function(trekImages) {
                // Remove the zip file
                var currentFilesName = trekImages.name;

                if (currentFilesName.toLowerCase().match(/^\S*(800x800+|150x150+)\S*\.(jpg|png|gif|jpeg)$/ig) ) {
                    promises.push($cordovaFile.removeFile(path + "/" + currentFilesName));
                };
            });

            $q.all(promises)
            .then(function(images) {
                defered.resolve(images);
            })

        }, function(error) {
            logging.error(error);
            deferred.reject({message: 'Couldnt access trek folder', data: path});
        })

        return defered.promise;

    };

    this.removeDownloadedImages = function() {

        var deferred = $q.defer(),
            promise = [],
            _this = this;

        $q.all([
            $cordovaFile.listDir(settings.device.RELATIVE_POI_ROOT)
            .then(function(listFiles) {
                var promises = [];

                angular.forEach(listFiles, function(poiFile) {
                    // Remove pois
                    if (poiFile.name != settings.PICTOGRAM_DIR) {
                        promises.push(utils.removeDir(settings.device.RELATIVE_POI_ROOT + "/" + poiFile.name));
                    };
                });

                $q.all(promises)
                .then(function(pois) {
                    promise.push(pois);
                })

            }, function(error) {
                logging.error(error);
                deferred.reject({message: 'Couldnt delete pois', data: error});
            }),
            $cordovaFile.listDir(settings.device.RELATIVE_ROOT)
            .then(function(listFiles) {
                var promises = [];

                angular.forEach(listFiles, function(trekFile) {
                    // Remove the zip file
                    if (trekFile.name != settings.TREKS_FILE_NAME && trekFile.name != settings.TREKS_ZIP_NAME && trekFile.name != settings.LOGS_FILENAME ) {
                        promises.push($cordovaFile.removeFile(settings.device.RELATIVE_ROOT + "/" + trekFile.name));
                    };
                });

                $q.all(promises)
                .then(function(trekZip) {
                    promise.push(trekZip);
                })

            }, function(error) {
                logging.error(error);
                deferred.reject({message: 'Couldnt delete treks zip', data: error});
            }),
            $cordovaFile.listDir(settings.device.RELATIVE_TREK_ROOT)
            .then(function(listFiles) {
                var promises = [];

                angular.forEach(listFiles, function(trekFile) {
                    // Remove the zip file
                    if (trekFile.name != settings.TREKS_FILE_NAME) {
                        promises.push(_this.removeTrekDownloadedFiles(settings.device.RELATIVE_TREK_ROOT + "/" + trekFile.name));
                    };
                });

                $q.all(promises)
                .then(function(layers) {
                    promise.push(layers);
                })

            }, function(error) {
                logging.error(error);
                deferred.reject({message: 'Couldnt delete treks images', data: error});
            })
        ])
        .then(
            function(deletedPromises) {
                deferred.resolve(deletedPromises);
            }
        );



        return deferred.promise;

    };

});