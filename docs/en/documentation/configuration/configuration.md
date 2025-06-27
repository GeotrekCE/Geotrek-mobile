# Main configuration options

This page presents the main configuration options that can be modified in the following file:

`mobile/config/src/environments/environment.prod.ts`

## Enable the home page

By default, the application displays treks in a list or grid view. To display a **home page** with a menu:

Edit the following line:

```diff
- navigation: 'tabs',
+ navigation: 'menu',
```

## Display shortcuts to outdoor practices

To enable the display of **outdoor practices** (via ferrata, climbing, paragliding, etc.) on the home page:

Edit the following line:

```diff
- enableOutdoorPracticesShortcuts: false,
+ enableOutdoorPracticesShortcuts: { portals: [] },
```

**Tip**:
If you want to enable this feature only for certain portals, add their IDs to the `portals` array.

Example:

```ts
enableOutdoorPracticesShortcuts: { portals: ['2,5'] },
```

## Set the initial treks sorting order

The default display order of treks can be set to one of the following options:

* `alphabetical` (alphabetical order, default)
* `random` (random order)
* `location` (by geographical proximity)

Example for sorting by **geographical proximity**:

```ts
initialOrder: 'location',
```

## Set the notification distance for POIs

The app can notify users when approaching a Point of Interest (POI).

To change the distance (in meters) at which the notification is triggered:

```ts
metersToNotify: 200,
```

Example: to trigger the notification at 300 meters:

```ts
metersToNotify: 300,
```

## Change the map background

Here is an example configuration to display the **IGN Plan V2** map background:

```ts
sources: {
  'tiles-background': {
    type: 'raster',
    tiles: [
      'https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}'
    ],
    tileSize: 256
  }
}
```

**Note**:

* You can use other raster or vector tile sources compatible with Mapbox GL JS by adapting the `sources` and `layers` parameters.
* Offline map tiles must be configured in Geotrek-admin (see the `MOBILE_TILES_URL` setting in the [geotrek/settings/base.py](https://github.com/GeotrekCE/Geotrek-admin/blob/master/geotrek/settings/base.py) file).

# Available Configuration Parameters

You can find all available parameters for customizing the mobile app in the following file: [/main/src/environments/environment.prod.ts](https://github.com/GeotrekCE/Geotrek-mobile/blob/main/src/environments/environment.prod.ts)

