import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { of, forkJoin, from } from 'rxjs';
import { first, catchError } from 'rxjs/operators';
import {
  HydratedTrek,
  Poi,
  Pois,
  InformationDesk,
  TouristicCategoryWithFeatures,
  TreksService,
  TreksServiceOffline,
  SensitiveAreas
} from '@app/interfaces/interfaces';
import { PoiDetailsComponent } from '@app/components/poi-details/poi-details.component';
import { InformationDeskDetailsComponent } from '@app/components/information-desk-details/information-desk-details.component';
import { SettingsService } from '@app/services/settings/settings.service';
import { OnlineTreksService } from '@app/services/online-treks/online-treks.service';
import { OfflineTreksService } from '@app/services/offline-treks/offline-treks.service';
import { HttpResponse } from '@capacitor/core';

@Component({
  selector: 'app-trek-map',
  templateUrl: './trek-map.page.html',
  styleUrls: ['./trek-map.page.scss']
})
export class TrekMapPage implements OnInit {
  public currentTrek: HydratedTrek | null = null;
  public currentPois!: Pois;
  public currentSensitiveAreas!: SensitiveAreas;
  public touristicCategoriesWithFeatures!: TouristicCategoryWithFeatures[];
  public trekUrl = '';
  public connectionError = false;
  public mapConfig: any;
  public commonSrc!: string;
  public offline = false;
  private treksTool!: TreksService | TreksServiceOffline;
  public canDisplayMap = false;
  public notificationsModeIsActive = false;

  constructor(
    private modalController: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    public settings: SettingsService,
    private onlineTreks: OnlineTreksService,
    private offlineTreks: OfflineTreksService
  ) {}

  ngOnInit(): void {
    this.loadTrek();
  }

  loadTrek() {
    const offline = !!this.route.snapshot.data['offline'];
    const isStage = !!this.route.snapshot.data['isStage'];
    const trekId = +(<string>this.route.snapshot.paramMap.get('trekId'));
    const stageId = +(<string>this.route.snapshot.paramMap.get('stageId'));
    const currentTrekId = isStage ? stageId : trekId;
    const parentId: number | undefined = isStage ? trekId : undefined;

    const treksService: TreksService | TreksServiceOffline = offline
      ? this.offlineTreks
      : this.onlineTreks;

    const sensitiveAreasRequest$ = from(
      treksService.getSensitiveAreasForTrekById(
        currentTrekId,
        parentId
      ) as Promise<HttpResponse | SensitiveAreas | undefined>
    ).pipe(
      catchError(() => {
        return of(null);
      })
    );

    const requests = offline
      ? [
          treksService.getTrekById(currentTrekId, parentId),
          treksService.getPoisForTrekById(currentTrekId, parentId),
          treksService.getTouristicContentsForTrekById(currentTrekId, parentId),
          sensitiveAreasRequest$,
          isStage && parentId ? treksService.getTrekById(parentId) : of(null)
        ]
      : [
          from(treksService.getTrekById(currentTrekId, parentId)),
          from(treksService.getPoisForTrekById(currentTrekId, parentId)),
          from(
            treksService.getTouristicContentsForTrekById(
              currentTrekId,
              parentId
            )
          ),
          sensitiveAreasRequest$,
          isStage && parentId
            ? from(treksService.getTrekById(parentId))
            : of(null)
        ];
    forkJoin(requests)
      .pipe(first())
      .subscribe(
        async ([
          trek,
          pois,
          touristicContents,
          sensitiveAreas,
          parentTrek
        ]): Promise<any> => {
          this.connectionError = false;

          const mapConfig: any = await treksService.getMapConfigForTrekById(
            isStage && parentId
              ? offline
                ? !isStage
                  ? parentTrek
                  : (trek as HttpResponse).data
                : (parentTrek as HttpResponse).data
              : offline
              ? trek
              : (trek as HttpResponse).data,
            offline
          );
          const commonSrc = await treksService.getCommonImgSrc();
          const hydratedTrek: HydratedTrek = this.settings.getHydratedTrek(
            offline && !isStage ? trek : (trek as HttpResponse).data,
            commonSrc
          );
          const touristicCategoriesWithFeatures =
            this.settings.getTouristicCategoriesWithFeatures(
              offline
                ? touristicContents
                : (touristicContents as HttpResponse).data
            );

          this.offline = offline;
          this.currentTrek = hydratedTrek;
          this.currentPois = offline ? pois! : (pois as HttpResponse).data;

          if (
            (sensitiveAreas &&
              (sensitiveAreas as HttpResponse).status === 200) ||
            (offline && sensitiveAreas)
          ) {
            this.currentSensitiveAreas = offline
              ? sensitiveAreas
              : (sensitiveAreas as HttpResponse).data;
          }

          this.touristicCategoriesWithFeatures =
            touristicCategoriesWithFeatures;
          this.mapConfig = mapConfig;
          this.treksTool = treksService;
          this.commonSrc = await treksService.getCommonImgSrc();
          this.trekUrl = treksService.getTrekDetailsUrl(
            (this.currentTrek as any).properties.id
          );
        },
        () => {
          this.connectionError = true;
        }
      );
  }

  ionViewWillEnter() {
    this.canDisplayMap = true;
  }

  public async presentPoiDetails(poi: Poi): Promise<void> {
    const modal = await this.modalController.create({
      component: PoiDetailsComponent,
      componentProps: { poi, offline: this.offline, commonSrc: this.commonSrc }
    });

    return await modal.present();
  }

  public async presentInformationDeskDetails(
    informationDesk: InformationDesk
  ): Promise<void> {
    const modal = await this.modalController.create({
      component: InformationDeskDetailsComponent,
      componentProps: { informationDesk, offline: this.offline }
    });
    return await modal.present();
  }

  public refresh() {
    this.loadTrek();
  }

  public navigateToChildren(id: number) {
    if (this.currentTrek) {
      this.router.navigate([
        this.treksTool.getTrekDetailsUrl(id, this.currentTrek.properties.id)
      ]);
    }
  }

  public notificationModeChange(event: any) {
    this.notificationsModeIsActive = event;
  }
}
