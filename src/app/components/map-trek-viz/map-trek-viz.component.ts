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
import { PopoverController, AlertController, ModalController } from '@ionic/angular';
import { SelectPoiComponent } from '@app/components/select-poi/select-poi.component';
import { Feature, GeoJsonProperties, Geometry, Point } from 'geojson';
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
import { TranslateService } from '@ngx-translate/core';
import { throttle } from 'lodash';

const mapboxgl = require('mapbox-gl');

@Component({
  selector: 'app-map-trek-viz',
  templateUrl: './map-trek-viz.component.html',
  styleUrls: ['./map-trek-viz.component.scss'],
})
export class MapTrekVizComponent extends UnSubscribe implements OnDestroy, OnChanges {
  private map: Map;
  private markerPosition: Marker | undefined;
  private poisType: DataSetting | undefined;
  private touristicsContentCategory: DataSetting | undefined;

  @Input() currentTrek: HydratedTrek | null = null;
  @Input() currentPois: Pois;
  @Input() touristicCategoriesWithFeatures: TouristicCategoryWithFeatures[];
  @Input() public dataSettings: DataSetting[];
  @Input() public mapConfig: any;
  @Input() private commonSrc: string;
  @Output() presentPoiDetails = new EventEmitter<any>();
  @Output() presentInformationDeskDetails = new EventEmitter<any>();
  @Output() mapIsLoaded = new EventEmitter<any>();
  @Output() navigateToChildren = new EventEmitter<any>();

  constructor(
    private screenOrientation: ScreenOrientation,
    private platform: Platform,
    private geolocate: GeolocateService,
    public popoverController: PopoverController,
    private translate: TranslateService,
    private alertController: AlertController,
    private modalController: ModalController,
  ) {
    super();
    if (environment && environment.mapbox && environment.mapbox.accessToken) {
      mapboxgl.accessToken = environment.mapbox.accessToken;
    }

    this.flyToUserLocation = throttle(this.flyToUserLocation, 3000);
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
      this.map = new Map({
        ...this.mapConfig,
        container: 'map-trek',
      });

      this.map.fitBounds(this.mapConfig.trekBounds, environment.map.TrekfitBoundsOptions);
      this.map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-left');

      this.map.addControl(
        new mapboxgl.ScaleControl({
          unit: 'metric',
        }),
      );

      this.map.addControl(
        new mapboxgl.AttributionControl({
          compact: false,
          customAttribution: environment.map.attributionText,
        }),
      );

      this.geolocate.startTracking(this.currentTrek ? this.currentTrek.properties.name : '');

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
        const childrenTreks = this.map.queryRenderedFeatures(e.point, {
          layers: [`children-treks-circle`],
        });

        if (!!e.features && e.features.length > 0 && (!childrenTreks || !(childrenTreks.length > 0))) {
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

      this.map.on('click', 'children-treks-circle', (e: MapLayerMouseEvent) => {
        if (!!e.features && e.features.length > 0) {
          const childrenTrek = { ...e.features[0] };
          if (childrenTrek.properties && childrenTrek.properties.id) {
            // go to trek
            this.navigateToChildren.emit(childrenTrek.properties.id);
          }
        }
      });

      this.handleClustersInteraction();

      // on browser only
      // this.map.on('mouseenter', 'pois-icon', () => {
      //   this.map.getCanvas().style.cursor = 'pointer';
      // });

      // this.map.on('mouseleave', 'pois-icon', () => {
      //   this.map.getCanvas().style.cursor = '';
      // });

      // this.map.on('mouseenter', 'information-desk-icon', () => {
      //   this.map.getCanvas().style.cursor = 'pointer';
      // });

      // this.map.on('mouseleave', 'information-desk-icon', () => {
      //   this.map.getCanvas().style.cursor = '';
      // });

      // this.map.on('mouseenter', 'touristics-content-icon', () => {
      //   this.map.getCanvas().style.cursor = 'pointer';
      // });

      // this.map.on('mouseleave', 'touristics-content-icon', () => {
      //   this.map.getCanvas().style.cursor = '';
      // });

      this.map.on('load', () => {
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

        const loadImages: Observable<any> = Observable.create((observer: any) => {
          const imagesToLoad: any[] = [];
          this.poisType = this.dataSettings.find(data => data.id === 'poi_types');

          if (this.poisType) {
            this.poisType.values.forEach(poiType => {
              if (poiType.pictogram) {
                imagesToLoad.push({ id: `pois${poiType.id}`, pictogram: poiType.pictogram });
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
                this.map.addImage(imageToLoad.id.toString(), image);
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
                this.markerPosition.setLngLat(coordinates as any);
              } else {
                const el = document.createElement('div');
                el.className = 'pulse';
                this.markerPosition = new mapboxgl.Marker({ element: el }).setLngLat(coordinates);
                if (this.markerPosition) {
                  this.markerPosition.addTo(this.map);
                }
              }
            } else {
              if (this.markerPosition) {
                this.markerPosition.remove();
                this.markerPosition = undefined;
              }
            }
          }),
          loadImages.subscribe({
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
      cluster: true,
      clusterRadius: 50,
    });

    this.map.addSource('touristics-content', {
      type: 'geojson',
      data,
      maxzoom: this.mapConfig.maxZoom ? this.mapConfig.maxZoom + 1 : 18,
      cluster: true,
      clusterRadius: 50,
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

    this.map.addSource('children-treks', {
      type: 'geojson',
      data,
    });
  }

  private initializeLayers(): void {
    // Itinerancy hide POIs by default
    const visibility: 'none' | 'visible' | undefined =
      this.currentTrek &&
      this.currentTrek.properties.children &&
      this.currentTrek.properties.children.features.length > 0
        ? 'none'
        : 'visible';

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
      filter: ['!', ['has', 'point_count']],
      layout: {
        'icon-image': ['concat', 'pois', ['get', 'type']],
        'icon-size': environment.map.poisLayersProperties.iconSize,
        'icon-allow-overlap': true,
        visibility:
          visibility === 'visible'
            ? (environment.map.poisLayersProperties.visibility as 'visible' | 'none' | undefined)
            : visibility,
      },
    });

    this.map.addLayer({
      id: 'clusters-circle-pois',
      type: 'circle',
      source: 'pois',
      filter: ['has', 'point_count'],
      paint: environment.map.clusterPaint,
      layout: {
        visibility:
          visibility === 'visible'
            ? (environment.map.poisLayersProperties.visibility as 'visible' | 'none' | undefined)
            : visibility,
      },
    });

    this.map.addLayer({
      id: 'cluster-text-count-pois',
      type: 'symbol',
      source: 'pois',
      filter: ['has', 'point_count'],
      paint: {
        'text-color': '#fff',
      },
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['Roboto Regular'],
        'text-size': 18,
        'text-offset': [0, 0.1],
        'text-ignore-placement': true,
        'text-allow-overlap': true,
        visibility:
          visibility === 'visible'
            ? (environment.map.poisLayersProperties.visibility as 'visible' | 'none' | undefined)
            : visibility,
      },
    });

    this.touristicsContentCategory = this.dataSettings.find(data => data.id === 'touristiccontent_categories');

    const circleColorExpression: any[] = [];

    if (this.touristicsContentCategory) {
      circleColorExpression.push('match');
      circleColorExpression.push(['get', 'category']);
      this.touristicsContentCategory.values.forEach(category => {
        circleColorExpression.push(category.id);
        circleColorExpression.push(category.color);
      });
      circleColorExpression.push(environment.map.clusterPaint['circle-color']);
    }

    this.map.addLayer({
      id: 'touristics-content-circle',
      type: 'circle',
      source: 'touristics-content',
      filter: ['!', ['has', 'point_count']],
      paint: {
        ...environment.map.touristicContentLayersProperties.circle.paint,
        'circle-color': this.touristicsContentCategory ? (circleColorExpression as any) : '#000000',
      },
      layout: {
        visibility:
          visibility === 'visible'
            ? (environment.map.touristicContentLayersProperties.visibility as 'visible' | 'none' | undefined)
            : visibility,
      },
    });

    this.map.addLayer({
      id: 'touristics-content-icon',
      type: 'symbol',
      source: 'touristics-content',
      filter: ['!', ['has', 'point_count']],
      layout: {
        visibility:
          visibility === 'visible'
            ? (environment.map.touristicContentLayersProperties.visibility as 'visible' | 'none' | undefined)
            : visibility,
        ...(environment.map.touristicContentLayersProperties.icon.layout as any),
      },
    });

    this.map.addLayer({
      id: 'clusters-circle-touristics-content',
      type: 'circle',
      source: 'touristics-content',
      filter: ['has', 'point_count'],
      paint: environment.map.clusterPaint,
      layout: {
        visibility:
          visibility === 'visible'
            ? (environment.map.touristicContentLayersProperties.visibility as 'visible' | 'none' | undefined)
            : visibility,
      },
    });

    this.map.addLayer({
      id: 'cluster-text-count-touristics-content',
      type: 'symbol',
      source: 'touristics-content',
      filter: ['has', 'point_count'],
      paint: {
        'text-color': '#fff',
      },
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['Roboto Regular'],
        'text-size': 18,
        'text-offset': [0, 0.1],
        'text-allow-overlap': true,
        'text-ignore-placement': true,
        visibility:
          visibility === 'visible'
            ? (environment.map.touristicContentLayersProperties.visibility as 'visible' | 'none' | undefined)
            : visibility,
      },
    });

    this.map.addLayer({
      id: 'information-desk-icon',
      type: 'symbol',
      source: 'information-desk',
      layout: {
        'icon-image': ['concat', 'informationDesk', ['get', 'id', ['object', ['get', 'type']]]],
        'icon-size': environment.map.informationIconSize,
        'icon-allow-overlap': true,
      },
    });

    this.map.addLayer({
      id: 'parking-icon',
      type: 'symbol',
      source: 'parking',
      layout: {
        'icon-image': 'parking',
        'icon-size': environment.map.parkingIconSize,
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
        'icon-size': environment.map.departureArrivalIconSize,
      },
    });

    this.map.addLayer({
      id: 'children-treks-circle',
      type: 'circle',
      source: 'children-treks',
      paint: environment.map.stagePaint,
    });

    this.map.addLayer({
      id: 'children-treks-index',
      type: 'symbol',
      source: 'children-treks',
      paint: {
        'text-color': '#000000',
      },
      layout: {
        'text-field': '{index}',
        'text-font': ['Roboto Regular'],
        'text-size': 18,
        'text-offset': [0, 0.1],
        'text-allow-overlap': true,
        'text-ignore-placement': true,
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

      if (
        departureArrivalSource &&
        (!this.currentTrek.properties.children ||
          !this.currentTrek.properties.children.features ||
          !(this.currentTrek.properties.children.features.length > 0))
      ) {
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

      const informationDeskSource = this.map.getSource('information-desk') as GeoJSONSource;
      if (
        informationDeskSource &&
        this.currentTrek.properties.information_desks &&
        this.currentTrek.properties.information_desks.length > 0
      ) {
        const informationDesks: FeatureCollection = {
          type: 'FeatureCollection',
          features: [],
        };

        this.currentTrek.properties.information_desks.forEach(information_desk_property => {
          if (information_desk_property.longitude && information_desk_property.latitude) {
            informationDesks.features.push({
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

        informationDeskSource.setData(informationDesks);
      }

      const pointsReferenceSource = this.map.getSource('points-reference') as GeoJSONSource;
      if (
        pointsReferenceSource &&
        this.currentTrek.properties.points_reference &&
        this.currentTrek.properties.points_reference.length > 0
      ) {
        const pointsReference: FeatureCollection = {
          type: 'FeatureCollection',
          features: [],
        };

        this.currentTrek.properties.points_reference.forEach((point_reference, index) => {
          pointsReference.features.push({
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
        pointsReferenceSource.setData(pointsReference);
      }

      const childrenTreksSource = this.map.getSource('children-treks') as GeoJSONSource;
      if (
        childrenTreksSource &&
        this.currentTrek.properties.children &&
        this.currentTrek.properties.children.features.length > 0
      ) {
        const childrenTreks: FeatureCollection = { ...this.currentTrek.properties.children };

        childrenTreks.features.forEach((children, index) => {
          if (children.properties) {
            children.properties.index = index + 1;
          }
        });

        childrenTreksSource.setData(childrenTreks);
      }
    }
  }

  /**
   * Fly to user location else fitbounds to trek
   */
  public async flyToUserLocation() {
    const userLocation = await this.geolocate.getCurrentPosition();
    if (userLocation) {
      this.map.flyTo({
        center: [userLocation.longitude, userLocation.latitude],
        animate: false,
        zoom: environment.trekZoom.zoom,
      });
    } else {
      const errorTranslation: any = await this.translate.get('geolocate.error').toPromise();
      // Inform user about problem
      const alertLocation = await this.alertController.create({
        header: errorTranslation['header'],
        subHeader: errorTranslation['subHeader'],
        message: errorTranslation['message'],
        buttons: [errorTranslation['confirmButton']],
      });

      await alertLocation.present();
    }
  }

  /**
   * Fit to trek bounds
   */
  public FitToTrekBounds(): void {
    this.map.fitBounds(this.mapConfig.trekBounds, environment.map.TrekfitBoundsOptions);
  }

  async showLayersVisibility(event: any) {
    const layers: { name: string; visibility: boolean; layersName: string }[] = [
      {
        name: await this.translate.get('trek.details.poi.name').toPromise(),
        visibility: this.map.getLayoutProperty('pois-icon', 'visibility') === 'visible',
        layersName: ['pois-icon', 'cluster-text-count-pois', 'clusters-circle-pois'].toString(),
      },
      {
        name: await this.translate.get('trek.details.touristicContent.name').toPromise(),
        visibility: this.map.getLayoutProperty('touristics-content-circle', 'visibility') === 'visible',
        layersName: [
          'touristics-content-circle',
          'touristics-content-icon',
          'cluster-text-count-touristics-content',
          'clusters-circle-touristics-content',
        ].toString(),
      },
    ];

    const popover = await this.popoverController.create({
      component: LayersVisibilityComponent,
      event: event,
      translucent: true,
      componentProps: {
        changeLayerVisibility: (checked: boolean, layersName: string) =>
          this.changeLayerVisibility(checked, layersName),
        layers,
      },
    });
    return await popover.present();
  }

  public changeLayerVisibility(checked: boolean, layersName: string): void {
    layersName
      .split(',')
      .forEach(layerName => this.map.setLayoutProperty(layerName, 'visibility', checked ? 'visible' : 'none'));
  }

  public handleClustersInteraction(): void {
    [
      { id: 'pois', translateId: 'trek.details.poi.name' },
      { id: 'touristics-content', translateId: 'trek.details.touristicContent.name' },
    ].forEach(clusterSource => {
      this.map.on('click', `clusters-circle-${clusterSource.id}`, (e: any) => {
        const features = this.map.queryRenderedFeatures(e.point, {
          layers: [`clusters-circle-${clusterSource.id}`],
        });

        const featureProperties = features[0].properties;
        if (!!featureProperties) {
          const clusterId = featureProperties.cluster_id;

          if (this.map.getZoom() === this.mapConfig.maxZoom) {
            // no more zoom, display features inside cluster
            (this.map.getSource(clusterSource.id) as GeoJSONSource).getClusterLeaves(
              featureProperties.cluster_id,
              Infinity,
              0,
              (err: any, featuresInCluster: Feature<Geometry, GeoJsonProperties>[]) => {
                if (err) {
                  throw err;
                }
                this.presentConfirmFeatures(
                  featuresInCluster as Feature<Geometry, { [name: string]: any }>[],
                  clusterSource,
                );
              },
            );
          } else {
            // zoom to next cluster expansion
            (this.map.getSource(clusterSource.id) as GeoJSONSource).getClusterExpansionZoom(
              clusterId,
              (err: any, zoom: number) => {
                if (err) {
                  return;
                }
                const coordinates = (features[0].geometry as Point).coordinates;
                this.map.easeTo({
                  center: [coordinates[0], coordinates[1]],
                  zoom: zoom,
                });
              },
            );
          }
        }
      });

      // on browser only
      // this.map.on('mouseenter', `clusters-circle-${clusterSource.id}`, () => {
      //   this.map.getCanvas().style.cursor = 'pointer';
      // });
      // this.map.on('mouseleave', `clusters-circle-${clusterSource.id}`, () => {
      //   this.map.getCanvas().style.cursor = '';
      // });
    });
  }

  async presentConfirmFeatures(
    features: Feature<Geometry, { [name: string]: any }>[],
    clusterSource: { id: string; translateId: string },
  ) {
    const radioPois: {
      id: number;
      name: string;
      imgTypePoi: { src: string | undefined; color: string | undefined };
    }[] = [];

    if (clusterSource.id === 'pois') {
    } else {
    }

    features.forEach(feature => {
      let currentType;
      if (this.poisType && feature.properties.type && clusterSource.id === 'pois') {
        currentType = this.poisType.values.find(poiType => poiType.id === feature.properties.type);
      } else if (
        this.touristicsContentCategory &&
        feature.properties.category &&
        clusterSource.id === 'touristics-content'
      ) {
        currentType = this.touristicsContentCategory.values.find(
          category => category.id === feature.properties.category,
        );
      }
      console.log(currentType);
      const poi = {
        id: feature.properties.id,
        name: feature.properties.name,
        imgTypePoi: {
          src: currentType && currentType.pictogram ? this.commonSrc + currentType.pictogram : undefined,
          color: currentType && currentType.color ? currentType.color : undefined,
        },
      };

      radioPois.push(poi);
    });

    const modal = await this.modalController.create({
      component: SelectPoiComponent,
      componentProps: { radioPois, themePois: clusterSource.translateId },
      cssClass: 'full-size',
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data && data.selectedPoiId) {
      const selectedFeature = features.find(feature => feature.properties.id === data.selectedPoiId);
      if (selectedFeature) {
        this.presentPoiDetails.emit(selectedFeature);
      }
    }
  }
}
