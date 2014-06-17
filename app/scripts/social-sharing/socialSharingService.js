'use strict';

var geotrekApp = angular.module('geotrekMobileApp');

/**
 * Cordova social sharing API
 * Angular wrapper for https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin/
 */
geotrekApp.factory('socialSharingService', function ($rootScope, $window) {
    if (!$window.cordova) {
        return;
    }

    var cordova = window.cordova;

    function SocialSharing() {
    }

    // Override this method to set the location where you want the iPad popup arrow to appear.
    // If not overridden with different values, the popup is not used. Example:
    //
    //   window.plugins.socialsharing.iPadPopupCoordinates = function() {
    //     return '100,100,200,300';
    //   };
    SocialSharing.prototype.iPadPopupCoordinates = function () {
      // left,top,width,height
        return '-1,-1,-1,-1';
    };

    SocialSharing.prototype.available = function (callback) {
        window.cordova.exec(function (avail) {
            callback(avail ? true : false);
        }, null, 'SocialSharing', 'available', []);
    };

    SocialSharing.prototype.share = function (message, subject, fileOrFileArray, url, successCallback, errorCallback) {
        cordova.exec(successCallback, this._getErrorCallback(errorCallback, 'share'), 'SocialSharing', 'share', [message, subject, this._asArray(fileOrFileArray), url]);
    };

    SocialSharing.prototype.shareViaTwitter = function (message, file /* multiple not allowed by twitter */, url, successCallback, errorCallback) {
        var fileArray = this._asArray(file);
        var ecb = this._getErrorCallback(errorCallback, 'shareViaTwitter');
        if (fileArray.length > 1) {
            ecb('shareViaTwitter supports max one file');
        } else {
            cordova.exec(successCallback, ecb, 'SocialSharing', 'shareViaTwitter', [message, null, fileArray, url]);
        }
    };

    SocialSharing.prototype.shareViaFacebook = function (message, fileOrFileArray, url, successCallback, errorCallback) {
        cordova.exec(successCallback, this._getErrorCallback(errorCallback, 'shareViaFacebook'), 'SocialSharing', 'shareViaFacebook', [message, null, this._asArray(fileOrFileArray), url]);
    };

    SocialSharing.prototype.shareViaWhatsApp = function (message, fileOrFileArray, url, successCallback, errorCallback) {
        cordova.exec(successCallback, this._getErrorCallback(errorCallback, 'shareViaWhatsApp'), 'SocialSharing', 'shareViaWhatsApp', [message, null, this._asArray(fileOrFileArray), url]);
    };

    SocialSharing.prototype.shareViaSMS = function (message, phonenumbers, successCallback, errorCallback) {
        cordova.exec(successCallback, this._getErrorCallback(errorCallback, 'shareViaSMS'), 'SocialSharing', 'shareViaSMS', [message, phonenumbers]);
    };

    SocialSharing.prototype.shareViaEmail = function (message, subject, toArray, ccArray, bccArray, fileOrFileArray, successCallback, errorCallback) {
        cordova.exec(successCallback, this._getErrorCallback(errorCallback, 'shareViaEmail'), 'SocialSharing', 'shareViaEmail', [message, subject, this._asArray(toArray), this._asArray(ccArray), this._asArray(bccArray), this._asArray(fileOrFileArray)]);
    };

    SocialSharing.prototype.canShareVia = function (via, message, subject, fileOrFileArray, url, successCallback, errorCallback) {
        cordova.exec(successCallback, this._getErrorCallback(errorCallback, 'canShareVia'), 'SocialSharing', 'canShareVia', [message, subject, this._asArray(fileOrFileArray), url, via]);
    };

    SocialSharing.prototype.canShareViaEmail = function (successCallback, errorCallback) {
        cordova.exec(successCallback, this._getErrorCallback(errorCallback, 'canShareViaEmail'), 'SocialSharing', 'canShareViaEmail', []);
    };

    SocialSharing.prototype.shareVia = function (via, message, subject, fileOrFileArray, url, successCallback, errorCallback) {
        cordova.exec(successCallback, this._getErrorCallback(errorCallback, 'shareVia'), 'SocialSharing', 'shareVia', [message, subject, this._asArray(fileOrFileArray), url, via]);
    };

    SocialSharing.prototype._asArray = function (param) {
        if (param === null) {
            param = [];
        } else if (typeof param === 'string') {
            param = new Array(param);
        }
        return param;
    };

    SocialSharing.prototype._getErrorCallback = function (ecb, functionName) {
        if (typeof ecb === 'function') {
            return ecb;
        } else {
            return function (result) {
                console.log('The injected error callback of "' + functionName + '" received: ' + JSON.stringify(result));
            };
        }
    };

    SocialSharing.install = function () {
        if (!window.plugins) {
            window.plugins = {};
        }

        window.plugins.socialsharing = new SocialSharing();
        return window.plugins.socialsharing;
    };

    cordova.addConstructor(SocialSharing.install);

    return window.plugins.socialsharing;
});