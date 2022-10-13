import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '@env/environment';
import { TabsPage } from './tabs.page';

const tabsRoutes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'treks',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../treks/treks.module').then((m) => m.TreksPageModule)
          }
        ]
      },
      {
        path: 'treks-offline',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../treks/treks.module').then((m) => m.TreksPageModule),
            data: { offline: true }
          }
        ]
      },
      {
        path: 'more',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../more/more.module').then((m) => m.MorePageModule)
          }
        ]
      }
    ]
  }
];

const menuRoutes = [
  {
    path: 'home',
    loadChildren: () =>
      import('../home/home.module').then((m) => m.HomePageModule)
  },
  {
    path: 'treks',
    loadChildren: () =>
      import('../treks/treks.module').then((m) => m.TreksPageModule)
  },
  {
    path: 'treks-offline',
    loadChildren: () =>
      import('../treks/treks.module').then((m) => m.TreksPageModule),
    data: { offline: true }
  },
  {
    path: 'more',
    loadChildren: () =>
      import('../more/more.module').then((m) => m.MorePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(
      (environment.navigation === 'tabs' ? tabsRoutes : menuRoutes) as any
    )
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
