import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { GeolocateService } from '@app/services/geolocate/geolocate.service';
import { Platform, ModalController, AlertController } from '@ionic/angular';
import { Feature, Geometry, Point } from 'geojson';
import { GeoJSONSource, Map, Marker } from 'maplibre-gl';
import { Observable, Subscription } from 'rxjs';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { SelectTrekComponent } from '@app/components/select-trek/select-trek.component';
import { InAppDisclosureComponent } from '@app/components/in-app-disclosure/in-app-disclosure.component';
import { MinimalTrek, DataSetting, Trek } from '@app/interfaces/interfaces';
import { environment } from '@env/environment';
import { SettingsService } from '@app/services/settings/settings.service';
import { TranslateService } from '@ngx-translate/core';
import { throttle } from 'lodash';
import maplibregl from 'maplibre-gl/dist/maplibre-gl.js';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { OfflineTreksService } from '@app/services/offline-treks/offline-treks.service';

@Component({
  selector: 'app-map-treks-viz',
  templateUrl: './map-treks-viz.component.html',
  styleUrls: ['./map-treks-viz.component.scss']
})
export class MapTreksVizComponent implements OnChanges, OnDestroy {
  private map!: Map;
  private markerPosition: Marker | undefined;
  private practices!: DataSetting;
  private currentPositionSubscription!: Subscription;
  private currentHeadingSubscription!: Subscription;
  private loadImagesSubscription!: Subscription;
  public flyToUserLocationThrottle: any;

  @ViewChild('mapViz', { static: false }) mapViz: any;

  @Input() public filteredTreks: MinimalTrek[] | null = null;
  @Input() public mapConfig: any;
  @Input() public dataSettings!: DataSetting[];
  @Input() public commonSrc!: string;
  @Input() public offline!: Boolean;

  @Output() public navigateToTrek = new EventEmitter<any>();

  constructor(
    private settings: SettingsService,
    private platform: Platform,
    private geolocate: GeolocateService,
    private modalController: ModalController,
    private alertController: AlertController,
    private translate: TranslateService,
    private offlineTreks: OfflineTreksService
  ) {
    this.flyToUserLocationThrottle = throttle(this.flyToUserLocation, 3000);
  }

  ngOnChanges(changes: SimpleChanges) {
    const changesCurrentTreks: SimpleChange = changes['filteredTreks'];
    if (changesCurrentTreks) {
      if (
        changesCurrentTreks.currentValue &&
        !changesCurrentTreks.previousValue
      ) {
        this.createMap();
      } else {
        if (this.map) {
          const treksSource = this.map.getSource(
            'treks-points'
          ) as GeoJSONSource;
          if (treksSource && this.filteredTreks) {
            treksSource.setData({
              type: 'FeatureCollection',
              features: this.filteredTreks
            });
          }
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.geolocate.stopOnMapTracking();

    if (this.currentPositionSubscription) {
      this.currentPositionSubscription.unsubscribe();
    }

    if (this.currentHeadingSubscription) {
      this.currentHeadingSubscription.unsubscribe();
    }

    if (this.loadImagesSubscription) {
      this.loadImagesSubscription.unsubscribe();
    }
  }

  async createMap() {
    if (this.mapConfig && this.mapConfig.style && this.filteredTreks) {
      if (
        this.offline &&
        (this.platform.is('ios') || this.platform.is('android'))
      ) {
        (this.mapConfig.style as any).sources[
          'tiles-background'
        ].tiles[0] = `${Capacitor.convertFileSrc(
          (
            await Filesystem.getUri({
              path: 'offline',
              directory: Directory.Data
            })
          ).uri
        )}/tiles/{z}/{x}/{y}.png`;
      }

      const coordinates: number[][] = [];

      this.filteredTreks.forEach((feature) => {
        if (
          feature &&
          feature.geometry &&
          feature.geometry.coordinates &&
          feature.geometry.coordinates[0] &&
          feature.geometry.coordinates[1]
        ) {
          coordinates.push(feature.geometry.coordinates);
        }
      });

      const bounds: any = coordinates.reduce(
        (bounds, coord: any) => bounds.extend(coord),
        new maplibregl.LngLatBounds(coordinates[0], coordinates[0])
      );

      this.map = new maplibregl.Map({
        ...this.mapConfig,
        container: 'map-treks'
      });

      if (bounds && bounds._ne && bounds._sw) {
        this.map.fitBounds(bounds, environment.map.TreksfitBoundsOptions);
      }

      this.map.addControl(
        new maplibregl.NavigationControl({ showCompass: false }),
        'top-left'
      );

      this.map.addControl(
        new maplibregl.ScaleControl({
          unit: 'metric'
        })
      );

      this.map.addControl(
        new maplibregl.AttributionControl({
          compact: false,
          customAttribution: environment.map.attributionText
        })
      );

      if (!environment.map.enableRotation) {
        this.map.dragRotate.disable();
        this.map.touchZoomRotate.disableRotation();
      }

      const loadImages: Observable<any> = Observable.create((observer: any) => {
        const practices: DataSetting | undefined = this.dataSettings.find(
          (data) => data.id === 'practice'
        );
        if (practices) {
          this.practices = practices;
          practices.values.forEach(async (practice, index: number) => {
            this.map.loadImage(
              await this.offlineTreks.getTrekImageSrc(
                {} as any,
                { url: practice.pictogram } as any
              ),
              (error: any, image: any) => {
                if (!error) {
                  this.map.addImage(practice.id.toString(), image);
                  if (index + 1 === practices.values.length) {
                    observer.complete();
                  }
                } else {
                  this.map.loadImage(
                    `${this.commonSrc}${practice.pictogram}`,
                    (error: any, image: any) => {
                      if (!error) {
                        this.map.addImage(practice.id.toString(), image);
                      }
                      if (index + 1 === practices.values.length) {
                        observer.complete();
                      }
                    }
                  );
                }
              }
            );
          });
        }
      });

      const el = document.createElement('div');
      const currentHeading = await this.geolocate.checkIfCanGetCurrentHeading();
      el.className = currentHeading ? 'pulse-and-view' : 'pulse';
      el['style'].display = 'none';

      this.markerPosition = new maplibregl.Marker({
        element: el
      }).setLngLat([0, 0]);
      this.markerPosition.addTo(this.map);

      this.currentPositionSubscription = this.geolocate.currentPosition$
        .pipe(
          filter((currentPosition) => currentPosition !== null),
          distinctUntilChanged()
        )
        .subscribe(async (location: any) => {
          const coordinates: any = [location.longitude, location.latitude];
          this.markerPosition!.getElement()['style'].display = 'block';
          this.markerPosition!.setLngLat(coordinates);
        });

      this.currentHeadingSubscription =
        this.geolocate.currentHeading$.subscribe((heading) => {
          if (heading) {
            this.markerPosition!.setRotation(heading);
          }
        });

      this.loadImagesSubscription = loadImages.subscribe({
        complete: async () => {
          this.addSourcesLayersEvents();

          const shouldShowInAppDisclosure =
            await this.geolocate.shouldShowInAppDisclosure();
          if (shouldShowInAppDisclosure) {
            await this.presentInAppDisclosure();
          }
          this.geolocate.startOnMapTracking();
        }
      });
    }
  }

  async addSourcesLayersEvents() {
    this.map.addSource('treks-points', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: this.filteredTreks
      },
      maxzoom: this.mapConfig.maxZoom ? this.mapConfig.maxZoom + 1 : 18,
      cluster: true,
      clusterRadius: 50
    });

    this.map.addSource('zone', {
      type: 'geojson',
      data: await this.settings.getZoneFromStorage()
    });

    this.map.addLayer({
      id: 'zone',
      source: 'zone',
      ...(environment.map.zoneLayerProperties as any)
    });

    this.map.addLayer({
      id: 'zone-outline',
      source: 'zone',
      ...(environment.map.zoneOutlineLayerProperties as any)
    });

    this.map.addLayer({
      id: 'clusters-circle',
      type: 'circle',
      source: 'treks-points',
      filter: ['has', 'point_count'],
      paint: environment.map.clusterPaint
    });

    this.map.addLayer({
      id: 'cluster-text-count',
      type: 'symbol',
      source: 'treks-points',
      filter: ['has', 'point_count'],
      paint: environment.map.clusterTextPaint,
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['Roboto Regular'],
        'text-size': 16,
        'text-offset': [0, 0.1]
      }
    });

    const circleColorExpression: any[] = [];
    circleColorExpression.push('match');
    circleColorExpression.push(['get', 'practice']);
    this.practices.values.forEach((practice) => {
      circleColorExpression.push(practice.id);
      circleColorExpression.push(practice.color);
    });
    circleColorExpression.push(environment.map.clusterPaint['circle-color']);

    this.map.addLayer({
      id: 'trek-point',
      type: 'circle',
      source: 'treks-points',
      filter: ['!', ['has', 'point_count']],
      paint: {
        ...environment.map.clusterPaint,
        'circle-color': circleColorExpression as any,
        'circle-radius': 16
      }
    });

    this.map.addLayer({
      id: 'trek-point-icon',
      type: 'symbol',
      source: 'treks-points',
      filter: ['!', ['has', 'point_count']],
      layout: {
        'icon-image': ['get', 'practice'],
        'icon-size': environment.map.globalMapIconSize
      }
    });

    this.map.on('click', 'clusters-circle', (e) => {
      const features = this.map.queryRenderedFeatures(e.point, {
        layers: ['clusters-circle']
      });

      const featureProperties = features[0].properties;
      if (!!featureProperties) {
        const clusterId = featureProperties['cluster_id'];

        if (this.map.getZoom() === this.mapConfig.maxZoom) {
          (
            this.map.getSource('treks-points') as GeoJSONSource
          ).getClusterLeaves(
            featureProperties['cluster_id'],
            Infinity,
            0,
            (err: any, featuresInCluster: any) => {
              if (err) {
                throw err;
              }
              this.presentConfirmFeatures(
                featuresInCluster as Feature<
                  Geometry,
                  { [name: string]: any }
                >[]
              );
            }
          );
        } else {
          (
            this.map.getSource('treks-points') as GeoJSONSource
          ).getClusterExpansionZoom(clusterId, (err: any, zoom: any) => {
            if (err) {
              return;
            }
            const coordinates = (features[0].geometry as Point).coordinates;
            this.map.easeTo({
              center: [coordinates[0], coordinates[1]],
              zoom: zoom
            });
          });
        }
      }
    });

    this.map.on('click', 'trek-point', (e) => {
      const feature = this.map.queryRenderedFeatures(e.point, {
        layers: ['trek-point']
      })[0];
      if (!!feature.properties) {
        this.navigateToTrek.emit(feature.properties['id']);
      }
    });

    this.mapViz.nativeElement.mapInstance = this.map;
  }

  async presentConfirmFeatures(
    features: Feature<Geometry, { [name: string]: any }>[]
  ) {
    const radioTreks: {
      id: number;
      name: string;
      imgPractice: { src: string; color: string | undefined };
    }[] = [];

    features.forEach((feature) => {
      const hydratedTrek = this.settings.getHydratedTrek(
        feature as Trek,
        this.commonSrc
      );
      const trek = {
        id: hydratedTrek.properties.id,
        name: hydratedTrek.properties.name,
        imgPractice: {
          src: hydratedTrek.properties.practice.pictogram!,
          color: hydratedTrek.properties.practice.color
        }
      };
      radioTreks.push(trek);
    });

    const modal = await this.modalController.create({
      component: SelectTrekComponent,
      componentProps: { radioTreks },
      cssClass: 'full-size'
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data && data.selectedTrekId) {
      this.navigateToTrek.emit(data.selectedTrekId);
    }
  }

  private async flyToUserLocation() {
    const userLocation = this.geolocate.currentPosition$.getValue();
    if (userLocation) {
      const coordinates: any = [userLocation.longitude, userLocation.latitude];
      this.markerPosition!.setLngLat(coordinates);
      this.map.flyTo({
        center: coordinates,
        animate: false,
        zoom: environment.trekZoom.zoom
      });
    } else {
      const errorTranslation: any = await this.translate
        .get('geolocate.error')
        .toPromise();
      const alertLocation = await this.alertController.create({
        header: errorTranslation['header'],
        subHeader: errorTranslation['subHeader'],
        message: errorTranslation['message'],
        buttons: [errorTranslation['confirmButton']]
      });
      await alertLocation.present();
    }
  }

  public async presentInAppDisclosure(): Promise<void> {
    const modal = await this.modalController.create({
      component: InAppDisclosureComponent,
      componentProps: {},
      cssClass: 'full-size'
    });

    await modal.present();

    await modal.onDidDismiss();
  }
}
