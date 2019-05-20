import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { GeolocateService } from '@app/services/geolocate/geolocate.service';
import { Observable } from 'rxjs';
import { PopoverController } from '@ionic/angular';

import { UnSubscribe } from '@app/components/abstract/unsubscribe';
import {
  Pois,
  DataSetting,
  HydratedTrek,
  TouristicCategoryWithFeatures,
  TouristicContent,
} from '@app/interfaces/interfaces';
import { environment } from '@env/environment';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Platform } from '@ionic/angular';
import { FeatureCollection } from 'geojson';
import { GeoJSONSource, Map, MapLayerMouseEvent, Marker } from 'mapbox-gl';
import { LayersVisibilityComponent } from '@app/components/layers-visibility/layers-visibility.component';

const mapboxgl = require('mapbox-gl');

@Component({
  selector: 'app-map-trek-viz',
  templateUrl: './map-trek-viz.component.html',
  styleUrls: ['./map-trek-viz.component.scss'],
})
export class MapTrekVizComponent extends UnSubscribe implements OnDestroy, OnChanges {
  private map: Map;
  private markerPosition: Marker;

  @Input() currentTrek: HydratedTrek | null = null;
  @Input() currentPois: Pois;
  @Input() touristicCategoriesWithFeatures: TouristicCategoryWithFeatures[];
  @Input() public dataSettings: DataSetting[];
  @Input() public mapConfig: any;
  @Input() private commonSrc: string;
  @Output() presentPoiDetails = new EventEmitter<any>();
  @Output() presentInformationDeskDetails = new EventEmitter<any>();
  @Output() mapIsLoaded = new EventEmitter<any>();

  constructor(
    private screenOrientation: ScreenOrientation,
    private platform: Platform,
    private geolocate: GeolocateService,
    public popoverController: PopoverController,
  ) {
    super();
    if (environment && environment.mapbox && environment.mapbox.accessToken) {
      mapboxgl.accessToken = environment.mapbox.accessToken;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const changesCurrentTrek: SimpleChange = changes.currentTrek;
    const changesCurrentPois: SimpleChange = changes.currentPois;
    const touristicCategoriesWithFeatures: SimpleChange = changes.touristicCategoriesWithFeatures;
    if (
      !!this.currentTrek &&
      !!this.currentPois &&
      !!this.touristicCategoriesWithFeatures &&
      ((changesCurrentTrek && !changesCurrentTrek.previousValue) ||
        (changesCurrentPois && !changesCurrentPois.previousValue) ||
        (touristicCategoriesWithFeatures && !touristicCategoriesWithFeatures.previousValue))
    ) {
      this.createMap();
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }

    this.geolocate.stopTracking();

    super.ngOnDestroy();
  }

  createMap(): void {
    if (this.mapConfig && this.mapConfig.style) {
      const { addSoustractMaxBounds } = environment.map;
      const maxBounds = [
        this.mapConfig.bounds[0] - addSoustractMaxBounds,
        this.mapConfig.bounds[1] - addSoustractMaxBounds,
        this.mapConfig.bounds[2] + addSoustractMaxBounds,
        this.mapConfig.bounds[3] + addSoustractMaxBounds,
      ];
      this.map = new Map({
        ...this.mapConfig,
        container: 'map-trek',
        maxBounds,
      });

      this.geolocate.startTracking(this.currentTrek ? this.currentTrek.properties.name : '');

      if (this.platform.is('ios') || this.platform.is('android')) {
        this.subscriptions$$.push(
          this.screenOrientation.onChange().subscribe(() => {
            // Need to delay before resize ...
            window.setTimeout(() => {
              this.map.resize();
            }, 50);
          }),
        );
      }

      this.map.on('click', 'pois-icon', (e: MapLayerMouseEvent) => {
        if (!!e.features && e.features.length > 0) {
          const poi = { ...e.features[0] };
          if (poi.properties && poi.properties.pictures) {
            poi.properties.pictures = JSON.parse(poi.properties.pictures);
          }
          this.presentPoiDetails.emit(poi);
        }
      });

      this.map.on('click', 'information-desk-icon', (e: MapLayerMouseEvent) => {
        if (!!e.features && e.features.length > 0) {
          if (e.features[0] && e.features[0].properties && e.features[0].properties.id && this.currentTrek) {
            const informationDesk = this.currentTrek.properties.information_desks.find(
              informationDeskProperty => informationDeskProperty.id === (e as any).features[0].properties.id,
            );
            this.presentInformationDeskDetails.emit(informationDesk);
          }
        }
      });

      this.map.on('click', 'touristics-content-icon', (e: MapLayerMouseEvent) => {
        if (!!e.features && e.features.length > 0) {
          const touristicContent = { ...e.features[0] };
          if (touristicContent.properties && touristicContent.properties.pictures) {
            touristicContent.properties.pictures = JSON.parse(touristicContent.properties.pictures);
          }
          this.presentPoiDetails.emit(touristicContent);
        }
      });

      this.map.on('mouseenter', 'pois-icon', () => {
        this.map.getCanvas().style.cursor = 'pointer';
      });

      this.map.on('mouseleave', 'pois-icon', () => {
        this.map.getCanvas().style.cursor = '';
      });

      this.map.on('mouseenter', 'information-desk-icon', () => {
        this.map.getCanvas().style.cursor = 'pointer';
      });

      this.map.on('mouseleave', 'information-desk-icon', () => {
        this.map.getCanvas().style.cursor = '';
      });

      this.map.on('mouseenter', 'touristics-content-icon', () => {
        this.map.getCanvas().style.cursor = 'pointer';
      });

      this.map.on('mouseleave', 'touristics-content-icon', () => {
        this.map.getCanvas().style.cursor = '';
      });

      this.map.on('load', () => {
        const loadImages: Observable<any> = Observable.create((observer: any) => {
          const imagesToLoad: any[] = [];
          const typePois: DataSetting | undefined = this.dataSettings.find(data => data.id === 'poi_types');

          if (typePois) {
            typePois.values.forEach(typePoi => {
              if (typePoi.pictogram) {
                imagesToLoad.push({ id: `pois${typePoi.id}`, pictogram: typePoi.pictogram });
              }
            });
          }

          const typeInformationDesks: DataSetting | undefined = this.dataSettings.find(
            data => data.id === 'information_desk_types',
          );

          if (typeInformationDesks) {
            typeInformationDesks.values.forEach(typeInformationDesk => {
              if (typeInformationDesk.pictogram) {
                imagesToLoad.push({
                  id: `informationDesk${typeInformationDesk.id}`,
                  pictogram: typeInformationDesk.pictogram,
                });
              }
            });
          }

          const touristicsContent: DataSetting | undefined = this.dataSettings.find(
            data => data.id === 'touristiccontent_categories',
          );

          if (touristicsContent) {
            touristicsContent.values.forEach(touristicContent => {
              if (touristicContent.pictogram) {
                imagesToLoad.push({
                  id: `touristicContent${touristicContent.id}`,
                  pictogram: touristicContent.pictogram,
                });
              }
            });
          }

          imagesToLoad.push({ id: 'arrival', pictogram: './assets/map/icons/departure.png', fromAssets: true });
          imagesToLoad.push({ id: 'departure', pictogram: './assets/map/icons/arrival.png', fromAssets: true });
          imagesToLoad.push({
            id: 'departureArrival',
            pictogram: './assets/map/icons/departureArrival.png',
            fromAssets: true,
          });
          imagesToLoad.push({ id: 'parking', pictogram: './assets/map/icons/parking.png', fromAssets: true });
          imagesToLoad.push({ id: 'arrow', pictogram: './assets/map/icons/arrow.png', fromAssets: true });

          imagesToLoad.forEach((imageToLoad: any, index: number) => {
            this.map.loadImage(
              imageToLoad.fromAssets ? imageToLoad.pictogram : `${this.commonSrc}${imageToLoad.pictogram}`,
              (error: any, image: any) => {
                observer.next({ id: imageToLoad.id.toString(), image });
                if (index + 1 === imagesToLoad.length) {
                  observer.complete();
                }
              },
            );
          });
        });

        this.subscriptions$$.push(
          this.geolocate.currentPosition$.subscribe(coordinates => {
            if (coordinates) {
              if (this.markerPosition) {
                this.markerPosition.setLngLat(coordinates);
              } else {
                const el = document.createElement('div');
                el.className = 'pulse';
                this.markerPosition = new mapboxgl.Marker({ element: el }).setLngLat(coordinates);
                this.markerPosition.addTo(this.map);
              }
            }
          }),
          loadImages.subscribe({
            next: value => this.map.addImage(value.id, value.image),
            complete: () => {
              this.initializeSources();
              this.initializeLayers();
              this.updateSources();
              this.mapIsLoaded.emit(true);
            },
          }),
        );
      });
    }
  }

  private initializeSources(): void {
    const data: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    this.map.addSource('zone', {
      type: 'geojson',
      data: 'assets/map/zone/zone.geojson',
    });

    this.map.addSource('trek', {
      type: 'geojson',
      data,
    });

    this.map.addSource('departure-arrival', {
      type: 'geojson',
      data,
    });

    this.map.addSource('pois', {
      type: 'geojson',
      data,
      maxzoom: this.mapConfig.maxZoom ? this.mapConfig.maxZoom + 1 : 18,
    });

    this.map.addSource('touristics-content', {
      type: 'geojson',
      data,
      maxzoom: this.mapConfig.maxZoom ? this.mapConfig.maxZoom + 1 : 18,
    });

    this.map.addSource('information-desk', {
      type: 'geojson',
      data,
    });

    this.map.addSource('parking', {
      type: 'geojson',
      data,
    });

    this.map.addSource('points-reference', {
      type: 'geojson',
      data,
    });
  }

  private initializeLayers(): void {
    this.map.addLayer({
      id: 'zone',
      source: 'zone',
      ...(environment.map.zoneLayerProperties as any),
    });

    this.map.addLayer({
      id: 'zone-outline',
      source: 'zone',
      ...(environment.map.zoneOutlineLayerProperties as any),
    });

    this.map.addLayer({
      id: 'trek-line',
      type: 'line',
      source: 'trek',
      ...(environment.map.trekLineLayerProperties as any),
    });

    this.map.addLayer({
      id: 'arrow-layer',
      type: 'symbol',
      source: 'trek',
      layout: {
        'icon-image': 'arrow',
        ...(environment.map.trekArrowLayerProperties.layout as any),
      },
    });

    this.map.addLayer({
      id: 'points-reference-circle',
      type: 'circle',
      source: 'points-reference',
      ...(environment.map.pointReferenceLayersProperties.circle as any),
    });

    this.map.addLayer({
      id: 'points-reference-text',
      type: 'symbol',
      source: 'points-reference',
      ...(environment.map.pointReferenceLayersProperties.text as any),
    });

    this.map.addLayer({
      id: 'pois-icon',
      type: 'symbol',
      source: 'pois',
      layout: {
        'icon-image': ['concat', 'pois', ['get', 'type']],
        'icon-size': environment.map.iconSize,
        'icon-allow-overlap': true,
      },
    });

    this.map.addLayer({
      id: 'touristics-content-circle',
      type: 'circle',
      source: 'touristics-content',
      ...(environment.map.touristicContentLayersProperties.circle as any),
    });

    this.map.addLayer({
      id: 'touristics-content-icon',
      type: 'symbol',
      source: 'touristics-content',
      ...(environment.map.touristicContentLayersProperties.icon as any),
    });

    this.map.addLayer({
      id: 'information-desk-icon',
      type: 'symbol',
      source: 'information-desk',
      layout: {
        'icon-image': ['concat', 'informationDesk', ['get', 'id', ['object', ['get', 'type']]]],
        'icon-size': 0.5,
        'icon-allow-overlap': true,
      },
    });

    this.map.addLayer({
      id: 'parking-icon',
      type: 'symbol',
      source: 'parking',
      layout: {
        'icon-image': 'parking',
        'icon-size': 0.6,
        'icon-allow-overlap': true,
      },
    });

    this.map.addLayer({
      id: 'departure-arrival-icon',
      type: 'symbol',
      source: 'departure-arrival',
      layout: {
        'icon-image': [
          'case',
          ['==', ['get', 'type'], 'departure'],
          'departure',
          ['==', ['get', 'type'], 'arrival'],
          'arrival',
          'departureArrival',
        ],
        'icon-size': 0.8,
      },
    });
  }

  private updateSources(): void {
    if (!!this.map && !!this.currentTrek) {
      const trekSource = this.map.getSource('trek') as GeoJSONSource;
      if (trekSource) {
        trekSource.setData(this.currentTrek);
      }
      const departureArrivalSource = this.map.getSource('departure-arrival') as GeoJSONSource;
      if (departureArrivalSource) {
        const departure = this.currentTrek.geometry.coordinates[0];
        const arrival = this.currentTrek.geometry.coordinates.slice(-1)[0];
        const departureArrivalData: FeatureCollection = {
          type: 'FeatureCollection',
          features: [],
        };
        if (departure[0] === arrival[0] && departure[1] === arrival[1]) {
          // same departure arrival
          departureArrivalData.features.push({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: departure },
            properties: {
              type: 'departure-arrival',
            },
          });
        } else {
          departureArrivalData.features.push({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: departure },
            properties: {
              type: 'departure',
            },
          });
          departureArrivalData.features.push({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: arrival },
            properties: {
              type: 'arrival',
            },
          });
        }
        departureArrivalSource.setData(departureArrivalData);
      }
      const poisSource = this.map.getSource('pois') as GeoJSONSource;
      if (poisSource) {
        poisSource.setData(this.currentPois);
      }

      const touristicsContent = this.map.getSource('touristics-content') as GeoJSONSource;
      if (touristicsContent) {
        let touristicsContentFeatures: TouristicContent[] = [];
        this.touristicCategoriesWithFeatures.forEach(touristicCategoryWithFeatures => {
          touristicsContentFeatures = touristicsContentFeatures.concat(touristicCategoryWithFeatures.features);
        });

        const touristics_content: FeatureCollection = {
          type: 'FeatureCollection',
          features: touristicsContentFeatures,
        };
        touristicsContent.setData(touristics_content);
      }

      const parkingSource = this.map.getSource('parking') as GeoJSONSource;
      if (parkingSource && this.currentTrek.properties.parking_location) {
        const parking: FeatureCollection = {
          type: 'FeatureCollection',
          features: [],
        };
        parking.features.push({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: this.currentTrek.properties.parking_location },
          properties: {},
        });
        parkingSource.setData(parking);
      }

      const information_desk = this.map.getSource('information-desk') as GeoJSONSource;
      if (
        information_desk &&
        this.currentTrek.properties.information_desks &&
        this.currentTrek.properties.information_desks.length > 0
      ) {
        const information_desks: FeatureCollection = {
          type: 'FeatureCollection',
          features: [],
        };

        this.currentTrek.properties.information_desks.forEach(information_desk_property => {
          if (information_desk_property.longitude && information_desk_property.latitude) {
            information_desks.features.push({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [information_desk_property.longitude, information_desk_property.latitude],
              },
              properties: {
                type: information_desk_property.type,
                id: information_desk_property.id,
              },
            });
          }
        });

        information_desk.setData(information_desks);
      }

      const points_referenceSource = this.map.getSource('points-reference') as GeoJSONSource;
      if (
        points_referenceSource &&
        this.currentTrek.properties.points_reference &&
        this.currentTrek.properties.points_reference.length > 0
      ) {
        const points_reference: FeatureCollection = {
          type: 'FeatureCollection',
          features: [],
        };

        this.currentTrek.properties.points_reference.forEach((point_reference, index) => {
          points_reference.features.push({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [point_reference[0], point_reference[1]],
            },
            properties: {
              index: index + 1,
            },
          });
        });
        points_referenceSource.setData(points_reference);
      }
    }
  }

  /**
   * Fly to user location else fitbounds to trek
   */
  public flyToUserLocation(): void {
    const userLocation = this.geolocate.currentPosition$.getValue();
    if (userLocation) {
      this.map.flyTo({
        center: userLocation,
        animate: false,
      });
    }
  }

  /**
   * Fit to trek bounds
   */
  public FitToTrekBounds(): void {
    this.map.fitBounds(this.mapConfig.bounds, {
      ...this.mapConfig.fitBoundsOptions,
      animate: false,
    });
  }

  async showLayersVisibility(event: any) {
    const popover = await this.popoverController.create({
      component: LayersVisibilityComponent,
      event: event,
      translucent: true,
      componentProps: {
        changeLayerVisibility: (checked: boolean, layers: string) => this.changeLayerVisibility(checked, layers),
      },
    });
    return await popover.present();
  }

  public changeLayerVisibility(checked: boolean, layers: string): void {
    layers
      .split(',')
      .forEach(layerName => this.map.setLayoutProperty(layerName, 'visibility', checked ? 'visible' : 'none'));
  }
}
