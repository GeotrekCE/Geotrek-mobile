**Geotrek mobile**, mobile app of *Geotrek Rando* (http://geotrek.fr).


OVERVIEW
========
This repository only contains source code for geotrek mobile cordova app.
Before using it, you have to configure your cordova environment.


CREATING CORDOVA PROJECT
========================

### Requirements

- npm (version > 1.2.10)
- cordova (`npm install -g cordova`)

```
$ pwd
/home/toto/cordova_root
$ cordova create geotrek_dir com.makinacorpus.geotrekmobile Geotrek-mobile
$ ls geotrek_dir
config.xml  hooks  merges  platforms  plugins  www
```

The most important parts are :
- `www` is where the source code, which will be deployed on each platform, lives.
- `plugins` is where plugins live, and will also be deployed with source code on each platform build.
- `platforms` contains each cordova platform dependant code (for android, ios, ...)


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


GEOTREK-MOBILE REQUIREMENTS
===========================

CORDOVA FILES PLUGIN
====================
```bash
$ cordova plugin add org.apache.cordova.file@1.2.0
$ cordova plugin add org.apache.cordova.file-transfer@0.4.4
```

CORDOVA NETWORK INFORMATION PLUGIN
==================================
```bash
$ cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-network-information.git
(cordova plugin add cordova-plugin-network-information crashes on android, due to https://git-wip-us.apache.org/repos/asf?p=cordova-plugin-network-information.git;a=commit;h=a5e9631258691890f08d94bc784f96aa304c2868)
```

CORDOVA GEOLOCATION PLUGIN
==================================
```bash
$ cordova plugin add org.apache.cordova.geolocation
```

CORDOVA GLOBALIZATION PLUGIN
==================================
```bash
$ cordova plugin add org.apache.cordova.globalization
```

CORDOVA LOCAL NOTIFICATION PLUGIN
==================================
```bash
cordova plugin add de.appplant.cordova.plugin.local-notification
```

CORDOVA ZIP PLUGIN
==================================
```bash
cordova plugin add https://github.com/MobileChromeApps/zip.git
```

ANGULAR-LEAFLET-DIRECTIVE
=========================
Source files are available at https://github.com/Natsu-/angular-leaflet-directive
A callback has been added on geojson directive to fit map bounds with geojson bounds

CREDITS
=======



AUTHORS
=======

    * Adrien Denat
    * Mathieu Leplatre
    * Romain Garrigues

![Makina Logo][1]

LICENSE
=======

    * OpenSource - BSD
    * Copyright (c) Parc National des Écrins - Parc National du Mercantour - Parco delle Alpi Marittime - Makina Corpus

![http://www.ecrins-parcnational.fr][2]

![http://www.mercantour.eu][3]

![http://www.parcoalpimarittime.it][4]

![enter image description here][5]


  [1]: http://depot.makina-corpus.org/public/logo.gif "Makina logo"
  [2]: http://depot.makina-corpus.org/public/geotrek/logo-pne.png
  [3]: http://depot.makina-corpus.org/public/geotrek/logo-pnm.png
  [4]: http://depot.makina-corpus.org/public/geotrek/logo-pnam.png
  [5]: http://depot.makina-corpus.org/public/logo.gif
