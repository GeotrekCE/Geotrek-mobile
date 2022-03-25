import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/tabs/tabs.module').then((m) => m.TabsPageModule)
  },
  {
    path: 'treks-map',
    loadChildren: () =>
      import('./pages/treks-map/treks-map.module').then(
        (m) => m.TreksMapPageModule
      )
  },
  {
    path: 'treks-offline-map',
    loadChildren: () =>
      import('./pages/treks-map/treks-map.module').then(
        (m) => m.TreksMapPageModule
      ),
    data: { offline: true }
  },
  {
    path: 'trek-details/:trekId',
    loadChildren: () =>
      import('./pages/trek-details/trek-details.module').then(
        (m) => m.TrekDetailsPageModule
      )
  },
  {
    path: 'trek-details/:trekId/:stageId',
    loadChildren: () =>
      import('./pages/trek-details/trek-details.module').then(
        (m) => m.TrekDetailsPageModule
      ),
    data: { isStage: true }
  },
  {
    path: 'trek-details-offline/:trekId',
    loadChildren: () =>
      import('./pages/trek-details/trek-details.module').then(
        (m) => m.TrekDetailsPageModule
      ),
    data: { offline: true }
  },
  {
    path: 'trek-details-offline/:trekId/:stageId',
    loadChildren: () =>
      import('./pages/trek-details/trek-details.module').then(
        (m) => m.TrekDetailsPageModule
      ),
    data: { offline: true, isStage: true }
  },
  {
    path: 'map/:trekId',
    loadChildren: () =>
      import('./pages/trek-map/trek-map.module').then(
        (m) => m.TrekMapPageModule
      )
  },
  {
    path: 'map/:trekId/:stageId',
    loadChildren: () =>
      import('./pages/trek-map/trek-map.module').then(
        (m) => m.TrekMapPageModule
      ),
    data: { isStage: true }
  },
  {
    path: 'map-offline/:trekId',
    loadChildren: () =>
      import('./pages/trek-map/trek-map.module').then(
        (m) => m.TrekMapPageModule
      ),
    data: { offline: true }
  },
  {
    path: 'map-offline/:trekId/:stageId',
    loadChildren: () =>
      import('./pages/trek-map/trek-map.module').then(
        (m) => m.TrekMapPageModule
      ),
    data: { offline: true, isStage: true }
  },
  {
    path: 'more/:moreItemId',
    loadChildren: () =>
      import('./pages/more/more-item/more-item.module').then(
        (m) => m.MoreItemPageModule
      )
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      onSameUrlNavigation: 'reload'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
