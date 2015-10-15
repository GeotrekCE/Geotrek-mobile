'use strict';

var geotrekTreks = angular.module('geotrekTreks');

geotrekTreks.service('treksFileSystemService',
    function ($resource, $rootScope, $window, $q, $cordovaFile, settings, globalSettings, utils, globalizationSettings, mapFactory) {
    var _treks;

    this.getTrekSubdir = function(trekId) {
        return settings.device.CDV_TREK_ROOT + '/' + trekId.toString();
    };

    this.replaceImgURLs = function() {
        var deferred = $q.defer();
        var filePath = settings.device.RELATIVE_TREK_ROOT_FILE,
            _this = this;
        console.log(filePath);
        $cordovaFile.readAsText(filePath)
        .then(
            function(data) {
                var data = JSON.parse(data);
                console.log(data);
                angular.forEach(data.features, function(trek) {
                    angular.forEach(trek.properties.usages, function(usage) {
                        usage.pictogram = settings.device.CDV_APP_ROOT + usage.pictogram;
                    });
                    angular.forEach(trek.properties.accessibilities, function(accessibility) {
                        accessibility.pictogram = settings.device.CDV_APP_ROOT + accessibility.pictogram;
                    });
                    angular.forEach(trek.properties.themes, function(theme) {
                        theme.pictogram = settings.device.CDV_APP_ROOT + theme.pictogram;
                    });
                    angular.forEach(trek.properties.networks, function(network) {
                        network.pictogram = settings.device.CDV_APP_ROOT + network.pictogram;
                    });
                    if(trek.properties.difficulty && trek.properties.difficulty.pictogram){
                        trek.properties.difficulty.pictogram = settings.device.CDV_APP_ROOT + trek.properties.difficulty.pictogram;
                    }
                    if(trek.properties.category && trek.properties.category.pictogram) {
                        trek.properties.category.pictogram = settings.CDV_APP_ROOT + trek.properties.category.pictogram;
                    }
                    if(trek.properties['length']){
                        trek.properties.eLength = trek.properties['length'];
                    }
                    if(trek.properties.altimetric_profile){
                        var filename = trek.properties.altimetric_profile.replace(".json", ".png");
                        trek.properties.altimetric_profile = settings.device.CDV_APP_ROOT + filename;
                    }
                    if(trek.properties.route){
                        trek.properties.route.pictogram = settings.device.CDV_APP_ROOT + trek.properties.route.pictogram;
                    }
                    if(trek.properties.thumbnail) {
                        trek.properties.thumbnail = settings.device.CDV_APP_ROOT + trek.properties.thumbnail;
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
                    picture.url = settings.device.CDV_APP_ROOT + picture.url;
                });
                if(copy.properties.information_desks){
                    angular.forEach(copy.properties.information_desks, function(information_desk) {
                        if(information_desk.photo_url){
                            information_desk.photo_url = settings.device.CDV_APP_ROOT + information_desk.photo_url;
                        }
                    });
                }
            }else {
                angular.forEach(copy.properties.pictures, function(picture) {
                    picture.url = globalSettings.DOMAIN_NAME + picture.url;
                });
                if(copy.properties.information_desks){
                    angular.forEach(copy.properties.information_desks, function(information_desk) {
                        if(information_desk.photo_url) {
                            information_desk.photo_url = globalSettings.DOMAIN_NAME + information_desk.photo_url;
                        }
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
    };


    // Download of trek and pois images for offline use
    this.downloadTrekDetails = function(trekId) {
        var url = globalizationSettings.TREK_REMOTE_FILE_URL_BASE + utils.getTrekFilename(trekId);
        return utils.downloadAndUnzip(url, settings.device.CDV_APP_ROOT);
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
                }
            });

            $q.all(promises)
            .then(function(images) {
                defered.resolve(images);
            });

        }, function(error) {
            logging.error(error);
            deferred.reject({message: 'Couldnt access trek folder', data: path});
        });

        return defered.promise;

    };

    this.removeDownloadedImages = function() {

        var deferred = $q.defer(),
            promise = [],
            _this = this;

        $q.all([
            $cordovaFile.listDir(settings.device.RELATIVE_PAPERCLIP_DIR)
            .then(function(listFiles) {
                var promises = [];
                angular.forEach(listFiles, function(mediaFolder) {
                    // Remove Media Folder
                    if (mediaFolder.name != settings.MEDIA_TREK_DIR) {
                        promises.push(utils.removeDir(settings.device.RELATIVE_PAPERCLIP_DIR + "/" + mediaFolder.name));
                    }
                });

                $q.all(promises)
                .then(function(folder) {
                    promise.push(folder);
                });

            }, function(error) {
                logging.error(error);
                deferred.reject({message: 'Couldnt delete media', data: error});
            }),
            $cordovaFile.listDir(settings.device.RELATIVE_ROOT)
            .then(function(listFiles) {
                var promises = [];

                angular.forEach(listFiles, function(rootFile) {
                    // Remove the zip file
                    if (rootFile.name.match(/\.zip$/i) && rootFile.name != settings.TREKS_ZIP_NAME) {
                        promises.push($cordovaFile.removeFile(settings.device.RELATIVE_ROOT + "/" + rootFile.name));
                    }
                });

                $q.all(promises)
                .then(function(trekZip) {
                    promise.push(trekZip);
                });

            }, function(error) {
                logging.error(error);
                deferred.reject({message: 'Couldnt delete treks zip', data: error});
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