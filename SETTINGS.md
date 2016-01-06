# GEOTREK MOBILE V2 - Settings

Those customisations can be set in the `app/scripts/settings.js`.


## Global settings

Option     | Type      | Default   | Description
--------|----------|-----------|------------
DOMAIN_NAME | String | `''` | Url of the endpoint for mobile data
AVAILABLE_LANGUAGES | Array of string (lang codes) | `[]` | list of the available languages for the app. Actuallt only fr, en, and it translations are available.
DEFAULT_LANGUAGE | String | `''` | fallback language if the phone's lang is not in the available languages array.
APP_NAME | String | `'Geotrek rando` | Name of the app, displayed on the nav bar.
GOOGLE_ANALYTICS_ID | String (GA code) | `''` | Code of the google analytics you want the app to be linked to. (it should be an app type account)



## Interface parameters

### Details options

Option     | Type      | Default   | Description
--------|----------|-----------|------------
DETAIL_COLLAPSER_DEFAULT_OPENED | Array of string | `[]` | Tell geotrek mobile which collapser should be opene by default on detail page. The array can contains 'children', 'parent', 'poi', or be empty.
SHOW_COLLASPABLE_COUNTER | Boolean | `false` | Display elements counter on collapsable title in detail page.