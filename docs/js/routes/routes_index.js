var ROUTES_INDEX = {"name":"<root>","kind":"module","className":"AppModule","children":[{"name":"routes","filename":"src/app/app-routing.module.ts","module":"AppRoutingModule","children":[{"path":"","redirectTo":"app","pathMatch":"full"},{"path":"app","loadChildren":"./pages/tabs/tabs.module#TabsPageModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/pages/more/more.module.ts","module":"MorePageModule","children":[{"path":"","runGuardsAndResolvers":"always","component":"MorePage","resolve":{"items":"MoreResolver"}}],"kind":"module"},{"name":"routes","filename":"src/app/pages/tabs/tabs.routing.module.ts","module":"TabsPageRoutingModule","children":[{"path":"tabs","component":"TabsPage","children":[{"path":"treks","children":[{"path":"","component":"TreksPage","resolve":{"context":"TreksContextResolver"}},{"path":"trek-details/:trekId","loadChildren":"../trek-details/trek-details.module#TrekDetailsPageModule","children":[{"kind":"module","children":[],"module":"TrekDetailsPageModule"}]},{"path":"trek-details/:trekId/:stageId","loadChildren":"../trek-details/trek-details.module#TrekDetailsPageModule","data":{"isStage":true},"children":[{"kind":"module","children":[],"module":"TrekDetailsPageModule"}]},{"path":"treks-map","loadChildren":"../treks-map/treks-map.module#TreksMapPageModule","children":[{"kind":"module","children":[],"module":"TreksMapPageModule"}]}]},{"path":"treks-offline","children":[{"path":"","component":"TreksPage","data":{"offline":true},"resolve":{"context":"TreksContextResolver"}},{"path":"trek-details/:trekId","loadChildren":"../trek-details/trek-details.module#TrekDetailsPageModule","data":{"offline":true},"children":[{"kind":"module","children":[],"module":"TrekDetailsPageModule"}]},{"path":"trek-details/:trekId/:stageId","loadChildren":"../trek-details/trek-details.module#TrekDetailsPageModule","data":{"offline":true,"isStage":true},"children":[{"kind":"module","children":[],"module":"TrekDetailsPageModule"}]},{"path":"treks-map","loadChildren":"../treks-map/treks-map.module#TreksMapPageModule","data":{"offline":true},"children":[{"kind":"module","children":[],"module":"TreksMapPageModule"}]}]},{"path":"more","children":[{"path":"","loadChildren":"../more/more.module#MorePageModule"},{"path":":moreItemId","loadChildren":"../more/more-item/more-item.module#MoreItemPageModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/pages/more/more-item/more-item.module.ts","module":"MoreItemPageModule","children":[{"path":"","component":"MoreItemPage","runGuardsAndResolvers":"always","resolve":{"item":"MoreItemResolver"}}],"kind":"module"}],"module":"MoreItemPageModule"}]}]}]},{"path":"","redirectTo":"/app/tabs/treks","pathMatch":"full"}],"kind":"module"}],"module":"TabsPageModule"}]},{"path":"app/map/:trekId","loadChildren":"./pages/trek-map/trek-map.module#TrekMapPageModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/pages/trek-map/trek-map.module.ts","module":"TrekMapPageModule","children":[{"path":"","component":"TrekMapPage","runGuardsAndResolvers":"always","resolve":{"context":"TrekContextResolver"}}],"kind":"module"}],"module":"TrekMapPageModule"}]},{"path":"app/map/:trekId/:stageId","loadChildren":"./pages/trek-map/trek-map.module#TrekMapPageModule","data":{"isStage":true},"children":[{"kind":"module","children":[],"module":"TrekMapPageModule"}]},{"path":"app/map-offline/:trekId","loadChildren":"./pages/trek-map/trek-map.module#TrekMapPageModule","data":{"offline":true},"children":[{"kind":"module","children":[],"module":"TrekMapPageModule"}]},{"path":"app/map-offline/:trekId/:stageId","loadChildren":"./pages/trek-map/trek-map.module#TrekMapPageModule","data":{"offline":true,"isStage":true},"children":[{"kind":"module","children":[],"module":"TrekMapPageModule"}]}],"kind":"module"}]}
