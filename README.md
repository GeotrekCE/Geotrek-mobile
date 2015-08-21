**Geotrek mobile**, mobile app of *Geotrek Rando* (http://geotrek.fr).


OVERVIEW
========
Geotrek mobile is a mobile hybride app. This repository contain the source files but not the cordova project. Please follow the README to know how to use it.

Note: Geotrek mobile v1.X is compatible only with v1.X of Geotrek Rando and Geotrek mobile v2.X is compatible only with v2.X of Geotrek Admin



INSTALLATION
===================

### Install Node
See https://gist.github.com/isaacs/579814 depending on your environment. 
(Read last comments as some links may change over time)

### Install grunt-cli
`npm install -g grunt-cli` - tasks automnation

### Install bower
`npm install -g bower` - package manager to manage project js dependencies

### Install Sass for Node
`npm install -g node-sass` - Stylesheets preprocessor
sass (version > 3.3, we use <b></b>ourbon lib on v4.0.1 : https://github.com/thoughtbot/bourbon/issues/419, https://github.com/thoughtbot/bourbon/issues/404)

### Clone the current repository

### Download and install dependencies :
* `npm install`
* `bower install`

### Generate compiled files
`grunt build`



CONFIGURATION
===================

Each time you change a script file like the following one, remember to run this command in order to regenerate the compiled files.
`grunt build`

Configurations of the app are available in the file `app/scripts/settings.js`.

Here are the main things you need to configure :
* `DEFAULT_LANGUAGE: 'en'` - defines the fallback language in case the user's favorite is not available. (it needs to be present in the available languages).
* `AVAILABLE_LANGUAGES: ['fr', 'en', 'it']` - defines available languages for the app interface. (please be aware that de translation of the data only depends of the API)
* `GOOGLE_ANALYTICS_ID: 'UA-1234567-8'` - you can link your app to a Google Analytics account. You just need to put your GA ID. (this account needs to be an App type account and not a web one)
* `APP_NAME: 'Geotrek Rando'` - the app name that will be displayed on the top bar of the app
* `DOMAIN_NAME = 'http://api-url.com'` - This parameters tells the app where to get the data it will use. 
Note: If you're using Geotrek suite (Geotrek Admin and Geotrek Rando), it's the url of your Geotrek Rando website + `/data`. Geotrek mobile V1.X is compatible with Geotrek Admin 0.XX and 1.X. Geotrek mobile v2.X is compatible with Geotrek Admin 2.XX
* `GEOTREK_DIR = 'geotrek-rando'` - The name of the folder containing your app on the filesystem
* `LOGS_FILENAME = 'geotrek-rando.log'` - The name of the app log file

*More options available in this file to be documented...*



CUSTOMISATION
=================================

Each time you change a style file like the following, remember to run this command in order to regenerate the compiled styles files.
`grunt sass`

### Change app colors

You can edit the sass file `app/styles/_variables_customs.scss` in which you can override the colors variables present in `app/styles/_variables_default.scss`.
This will allows you to customize the main colors used in the app.


### Advanced style customisation

You can also add your custom style to the app by adding custom sass and css in the file `app/styles/customisation.scss`.
This will be applyed last and override default app rules.


### Use customs images in app

You can use custom images in the app (for exemple use your favorite bakground for the loading page of the app). We dedicated a folder `app/images/custom` to this. It's not mandatory but advised.


Once you have the app ready you are going to create a Cordova project and use the `www` folder as the app sources. Let's see this.



CREATING CORDOVA PROJECT
========================

### Requirements

* npm (version > 1.2.10)
* cordova (`npm install -g cordova`)

Once you're ready, be sure to be in the folder where you want your project to be (for example the same parent folder as this repo clone)

### Create project
```
cordova create cordovaFolderName com.idYouWant.forYourApp App-Name
```

### Go into Cordova project folder
```
cd cordovaFolderName
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
To install a plugin, be sure to be in the folder of your Cordova Project

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


### Cordova geolocation plugin

```bash
cordova plugin add org.apache.cordova.geolocation
```


### Cordova globalization plugin

```bash
cordova plugin add org.apache.cordova.globalization
```


### Phonegap social sharing

```bash
cordova plugin add nl.x-services.plugins.socialsharing
```


### Cordova local notification plugin

```bash
cordova plugin add de.appplant.cordova.plugin.local-notification
```


### Cordova zip plugin

```bash
cordova plugin add https://github.com/MobileChromeApps/zip.git
```


### Cordova inappbrowser plugin

```bash
cordova plugin add org.apache.cordova.inappbrowser
```


### Cordova dialogs plugin

```bash
cordova plugin add org.apache.cordova.dialogs
```


### Cordova google analytics plugin

```bash
cordova plugin add https://github.com/danwilson/google-analytics-plugin.git
```


### (OPTIONAL) Custom url scheme plugin

If you want a scheme url on your app (replace mySchemeURL with the one desired)
```bash
cordova plugin add https://github.com/EddyVerbruggen/LaunchMyApp-PhoneGap-Plugin.git --variable URL_SCHEME=mySchemeURL
```



APP CONFIGURATION
============================
In order to customise and configure your app you need to edit and add few files

### Config.xml
Copy the `config.xml.default` file in your Cordova project folder and rename it `config.xml`. Inside you need to change at least the following fields :
* `<widget id="com.makinacorpus.geotrek" >` - This id is your package name. Chose it wisely as you will not be able to change it later (once you've uploaded your app on the store). It's the app unique identifier.
* `<name>` - The name of your app
* `<description>` - The description of your app

### Icons and splashscreens
They should be placed inside the `images` folder of your Cordova project folder. You have the list of all the required files in the config.xml file and their names.



GENERATING PATFORMS VERSIONS
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

You can now add the Android platform to your project
(As always be sur to be in your Cordova project folder)

```
cordova platform add android
```

now if you go in `platforms`, you should see an `android` folder


iOS
---

### Requirements

- XCode
- ant (version ?)

You can now add the IOS platform to your project
(As always be sur to be in your Cordova project folder)

```
cordova platform add ios
```

now if you go in `platforms`, you should see an `ios` folder



BUILDING CORDOVA PROJECT
========================

Android
-------

From your cordova project folder
```
cordova build android
```


iOS
---

From your cordova project folder
```
cordova build ios
```

Then in XCode
- Open `platforms/ios/project-name.xcodeproj` with XCode.
- Just do 'Play', it will compile and run.



RUNNING CORDOVA PROJECT
=======================

Android
-------

From cordova cli
```
cordova run android
```

But before running, you must already have downloaded an emulator, or connected a device to deploy on.


### Emulator
To download an emulator :
```
android sdk
```
(android executable must be in your PATH, as its a part of android sdk, in platform-tools subdirectory)
The Android SDK Manager appears, and you just have to choose some "System Image" to download and install it.

Note: You can also use Android Studio
- 'Tools/Android/SDK Manager'


### Devices
connect your device then check if it's recognize with :
```
adb devices
```

It will launch a deamon and display a list of connected devices. (usually represented by really long numbers)

Note: If your phone use MTP connection, it's possible it's not listed.
In that case, use the following command to reconnect your phone in another compatible mode.
```
adb usb
```


iOS
---

Both emulators and devices are referenced on the top bar of XCode.
From XCode :
- You can connect an iOS device or use emulators that come with XCode. You just have to hit play and it will launch on the selected device.



DEVELOPMENT AND LIVE-RELOAD
===============================
In order to simplify develoment we also provide a grunt tasks that will serve the app in the browser and reload the page each time you modify a file.
`$ grunt serve`

It will launch a node server. It's IP will be displayed in the terminal.
Usually a tab will open automativcaly in your brower, but if it doesn't, you can juste use the given IP to access it.



UPDATE YOUR APP
===============================
### minor versions (ex: 1.2 -> 1.6)
You just need to pull changes and then use:

* `grunt build` in the git clone folder
* move to the cordova Folder (ex: `cd MyCordovaFolder`)
* `cordova build android` and/or `cordova build ios` depending on the platforms you want to upgrade.

### major versions (ex: 1.X -> 2.X)
Be aware that majors versions change means that you may need to change your config and change your API.

For this you just need to :
* `git checkout v2.X` where v2.X is the branch name.
* `grunt build` in the git clone folder
* move to the cordova Folder (ex: `cd MyCordovaFolder`)
* `cordova build android` and/or `cordova build ios` depending on the platforms you want to upgrade.



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
