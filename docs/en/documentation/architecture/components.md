## Technical architecture

The **Geotrek-mobile** application is built on a modern, modular architecture designed to be high-performing, maintainable, and compatible with most mobile devices.

### Main technical components

* **Frameworks**:

  * Development is based on **[Angular](https://angular.dev/)**, combined with **[Ionic](https://ionicframework.com/)** for managing the mobile interface
  * **[Capacitor](https://capacitorjs.com/)** is used to package the application into a native environment (Android / iOS)

* **Language**:

  * The code is written in **[TypeScript](https://www.typescriptlang.org/)**, allowing for better **maintainability** and reduced risk of bugs thanks to static typing

* **Mapping**:

  * Maps are integrated using **[Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/api/)**, enabling smooth, interactive, and vector-based rendering of geographic data

* **Basemaps**:

  * By default, the app uses **[OpenStreetMap](https://www.openstreetmap.org/about)** (OSM) basemaps, but other basemaps can be integrated depending on the territory's rights and preferences (OpenTopoMap, IGN, etc.)

