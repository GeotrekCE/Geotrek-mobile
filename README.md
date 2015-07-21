**Geotrek mobile**, mobile app of *Geotrek Rando* (http://geotrek.fr).


OVERVIEW
========
Geotrek mobile is a mobile hybride app. This repository contain the source files but not the cordova project. Please follow the README to know how to use it.



INSTALLATION
===================

### Install Node
See https://gist.github.com/isaacs/579814 depending on your environment. 
(Read last comments as some links may change over time)

### Install grunt-cli
`npm install -g grunt-cli`

### Clone the current repository



CONFIGURATION
===================

Configurations of the app are available in the file `app/scripts/settings.js`.

Here are the main things you need to configure :
* `DEFAULT_LANGUAGE: 'en'` - defines the fallback language in case the user's favorite is not available. (it needs to be present in the available languages).
* `AVAILABLE_LANGUAGES: ['fr', 'en', 'it']` - defines available languages for the app interface. (please be aware that de translation of the data only depends of the API)
* `GOOGLE_ANALYTICS_ID: 'UA-1234567-8'` - you can link your app to a Google Analytics account. You just need to put your GA ID. (this account needs to be an App type account and not a web one)
* `APP_NAME: 'Geotrek Rando'` - the app name that will be displayed on the top bar of the app
* `DOMAIN_NAME = 'http://api-url.com'` - This parameters tells the app where to get the data it will use.



CUSTOMISATION
=================================

### Change app colors

You can edit the sass file `app/styles/_variables_customs.scss` in which you can override the colors variables present in `app/styles/_variables_default.scss`.
This will allows you to customize the main colors used in the app.


### Advanced style customisation

You can also add your custom style to the app by adding custom sass and css in the file `app/styles/customisation.scss`.
This will be applyed last and override default app rules.


### Use customs images in app

You can use custom images in the app (for exemple use your favorite bakground for the loading page of the app). We dedicated a folder `app/images/custom` to this. It's not mandatory but advised.


### More options available in this file to be documented...


Once you have the app ready you are going to create a Cordova project and use the `www` folder as the app sources. Let's see this.



CREATING CORDOVA PROJECT
========================

### Requirements

* npm (version > 1.2.10)
* cordova (`npm install -g cordova`)

Once you're ready, be sure to be in the folder where you want your project to be (for example the same parent folder as this repo clone)

### Create project
```
cordova create folderName com.idYouWant.forYourApp App-Name
```

### Go into project folder
```
cd folderName
```
In the created folder you can find :
* `www` - where the source code, which will be deployed on each platform, lives.
* `plugins` - where plugins live, and will also be deployed with source code on each platform build.
* `platforms` - contains each cordova platform dependant code (for android, ios, ...)

### Link your cordova project and your clone of this repository
Be sure to be in your cordova project folder
```
rm -r www
ln -s ~/Absolute/Path/To/Github-clone www
```


Now that you have created the project and linked it to the app core, you need to add plugins to be sure that it will works on real devices.



APP PLUGINS REQUIREMENTS
===========================

### Cordova files plugin

```bash
cordova plugin add org.apache.cordova.file@1.2.0
cordova plugin add org.apache.cordova.file-transfer@0.4.4
```


### Cordova network information plugin

```bash
cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-network-information.git
(cordova plugin add cordova-plugin-network-information crashes on android, due to https://git-wip-us.apache.org/repos/asf?p=cordova-plugin-network-information.git;a=commit;h=a5e9631258691890f08d94bc784f96aa304c2868)
```


### CORDOVA GEOLOCATION PLUGIN

```bash
cordova plugin add org.apache.cordova.geolocation
```


### CORDOVA GLOBALIZATION PLUGIN

```bash
cordova plugin add org.apache.cordova.globalization
```


### PHONEGAP SOCIAL SHARING

```bash
cordova plugin add nl.x-services.plugins.socialsharing
```


### CORDOVA LOCAL NOTIFICATION PLUGIN

```bash
cordova plugin add de.appplant.cordova.plugin.local-notification
```


### CORDOVA ZIP PLUGIN

```bash
cordova plugin add https://github.com/MobileChromeApps/zip.git
```


### CORDOVA INAPPBROWSER PLUGIN

```bash
cordova plugin add org.apache.cordova.inappbrowser
```


### CORDOVA DIALOGS PLUGIN

```bash
cordova plugin add org.apache.cordova.dialogs
```


### CORDOVA GOOGLE ANALYTICS PLUGIN

```bash
cordova plugin add https://github.com/danwilson/google-analytics-plugin.git
```



GENERATING CORDOVA PROJECT
========================

On build, cordova will take our source code and generate corresponding code to be compiled on each platform we want.
This generated code is a bridge between our html/css/js app, cordova js code and native platform code.
To build this project on each OS (android, ios...), we need to configure them.

Android
-------
There is some ways to configure Android platform, but the core component is always android sdk.

### Requirements 

- Android Studio (http://developer.android.com/sdk/installing/studio.html)
- JDK (6+)
- ant (version ?)

Set your `JAVA_HOME` environment variable to JDK root path, so that Android Studio can now be launched.

As you have installed Android Studio (we assume in `/home/toto/android-studio`), you also have an android sdk.

```
$ pwd
/home/toto/android-studio
$ ls
bin  build.txt  Install-Linux-tar.txt  lib  license  LICENSE.txt  NOTICE.txt  plugins  sdk
```

Then add sdk subdirectories `tools` and `platform-tools` to your `PATH` environment variable.

You are ready to build your first android project !

```
$ pwd
/home/toto/cordova_root/geotrek_dir
$ cordova platform add android
$ ls platforms
android
$ ls platforms/android
AndroidManifest.xml build.xml CordovaLib libs platform_www project.properties src assets cordova custom_rules.xml local.properties proguard-project.txt res
```

Cordova has generated lot of files, and your source code lives now in `assets` directory.


iOS
---

### Requirements

- XCode
- ant (version ?)

You are ready to build your first iOS project !

```
$ pwd
/home/toto/cordova_root/geotrek_dir
$ cordova platform add ios
$ ls platforms
ios
$ ls platforms/ios
CordovaLib cordova geotrek-mobile.xcodeproj www build geotrek-mobile platform_www
```

Cordova has generated lot of files, and your source code lives now in `www` directory.



BUILDING CORDOVA PROJECT
========================

Android
-------

To build it, 2 choices :

From cordova cli
```
cordova build android
```

From Android Studio
- 'Open/Import project' (on first time, choose 'Import Project', select `/home/toto/cordova_root` dir, and next/next/.../finish).
- 'Build/Rebuild Project'

iOS
---

From cordova cli
```
cordova build ios
```

From XCode
- Open geotrek-mobile.xcodeproj with XCode.
- Just do 'Play', it will compile and run.



RUNNING CORDOVA PROJECT
=======================

Android
-------

You also have 2 choices to run cordova project.

From cordova cli
```
cordova run android
```

From Android Studio
- 'Run/Run'


But before running, you must already have downloaded an emulator, or connected a device to deploy on.
To download an emulator :
```
android sdk
```
(android executable must be in your PATH, as its a part of android sdk, in platform-tools subdirectory)
The Android SDK Manager appears, and you just have to choose some "System Image" to download and install it.

Note: You can also use Android Studio
- 'Tools/Android/SDK Manager'

iOS
---

From XCode :
- You can connect an iOS device or use emulators that come with XCode.



CORDOVA SOURCE CODE DEVELOPMENT
===============================
This part is only for source code deployment process

This project is generated using Yeoman (http://yeoman.io/)

### Requirements

- npm (version > 1.2.10) : package manager to get `bower` and `grunt` Node.js scripts
- bower (`npm install -g bower`) : package manager to manage project js dependencies
- grunt (`npm install -g grunt-cli`)
- sass (version > 3.3, we use bourbon lib on v4.0.1 : https://github.com/thoughtbot/bourbon/issues/419, https://github.com/thoughtbot/bourbon/issues/404)

    - `$ npm install`
    - `$ bower install`
    - `$ grunt build`
    - `$ grunt serve`
    - look your browser



AUTHORS
=======

* Adrien Denat
* Mathieu Leplatre
* Romain Garrigues
* Éric Bréhault
* Frédéric Bonifas
* Simon Bats

[<img src="http://depot.makina-corpus.org/public/logo.gif">](http://www.makina-corpus.com)



LICENCE
=======

* OpenSource - BSD
* Copyright (c) Parc National des Écrins - Makina Corpus

[<img src="http://geotrek.fr/images/logo-pne.png">](http://www.ecrins-parcnational.fr)

[<img src="http://depot.makina-corpus.org/public/logo.gif">](http://www.makina-corpus.com)
