'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">geotrek-mobile documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-d9c784be8e55e1909d3b305b069bad00"' : 'data-target="#xs-components-links-module-AppModule-d9c784be8e55e1909d3b305b069bad00"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-d9c784be8e55e1909d3b305b069bad00"' :
                                            'id="xs-components-links-module-AppModule-d9c784be8e55e1909d3b305b069bad00"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InformationDeskDetailsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">InformationDeskDetailsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LayersVisibilityComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LayersVisibilityComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PoiDetailsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PoiDetailsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProgressComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProgressComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TreksOrderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TreksOrderComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CustomPipesModule.html" data-type="entity-link">CustomPipesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-CustomPipesModule-972485d300f03f6ad573eac86fda11c1"' : 'data-target="#xs-pipes-links-module-CustomPipesModule-972485d300f03f6ad573eac86fda11c1"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-CustomPipesModule-972485d300f03f6ad573eac86fda11c1"' :
                                            'id="xs-pipes-links-module-CustomPipesModule-972485d300f03f6ad573eac86fda11c1"' }>
                                            <li class="link">
                                                <a href="pipes/LowerRoundPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LowerRoundPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/FiltersComponentModule.html" data-type="entity-link">FiltersComponentModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MoreItemPageModule.html" data-type="entity-link">MoreItemPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-MoreItemPageModule-6eae40a91bca8aac8cbcf4c020cd4ca3"' : 'data-target="#xs-components-links-module-MoreItemPageModule-6eae40a91bca8aac8cbcf4c020cd4ca3"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MoreItemPageModule-6eae40a91bca8aac8cbcf4c020cd4ca3"' :
                                            'id="xs-components-links-module-MoreItemPageModule-6eae40a91bca8aac8cbcf4c020cd4ca3"' }>
                                            <li class="link">
                                                <a href="components/MoreItemPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MoreItemPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/MorePageModule.html" data-type="entity-link">MorePageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-MorePageModule-d80234104ca155fc5ba8b66f17c46269"' : 'data-target="#xs-components-links-module-MorePageModule-d80234104ca155fc5ba8b66f17c46269"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MorePageModule-d80234104ca155fc5ba8b66f17c46269"' :
                                            'id="xs-components-links-module-MorePageModule-d80234104ca155fc5ba8b66f17c46269"' }>
                                            <li class="link">
                                                <a href="components/MorePage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MorePage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SharedFiltersModule.html" data-type="entity-link">SharedFiltersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SharedFiltersModule-d0f84f83a3f8d2e545b911a2e198175f"' : 'data-target="#xs-components-links-module-SharedFiltersModule-d0f84f83a3f8d2e545b911a2e198175f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedFiltersModule-d0f84f83a3f8d2e545b911a2e198175f"' :
                                            'id="xs-components-links-module-SharedFiltersModule-d0f84f83a3f8d2e545b911a2e198175f"' }>
                                            <li class="link">
                                                <a href="components/FilterComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FilterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FilterValueComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FilterValueComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FiltersComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FiltersComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InAppDisclosureComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">InAppDisclosureComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SearchComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SearchComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SelectFilterComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SelectFilterComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link">SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SharedModule-1c24da97afd407e25b6f0b37f16c5b78"' : 'data-target="#xs-components-links-module-SharedModule-1c24da97afd407e25b6f0b37f16c5b78"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedModule-1c24da97afd407e25b6f0b37f16c5b78"' :
                                            'id="xs-components-links-module-SharedModule-1c24da97afd407e25b6f0b37f16c5b78"' }>
                                            <li class="link">
                                                <a href="components/GeolocateNotificationsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GeolocateNotificationsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MapTrekVizComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MapTrekVizComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MapTreksVizComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MapTreksVizComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SharedTreksModule.html" data-type="entity-link">SharedTreksModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SharedTreksModule-0c69db032dc790ad98a3d0f73bebcef8"' : 'data-target="#xs-components-links-module-SharedTreksModule-0c69db032dc790ad98a3d0f73bebcef8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedTreksModule-0c69db032dc790ad98a3d0f73bebcef8"' :
                                            'id="xs-components-links-module-SharedTreksModule-0c69db032dc790ad98a3d0f73bebcef8"' }>
                                            <li class="link">
                                                <a href="components/PoiComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PoiComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TrekCardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TrekCardComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SharedUiModule.html" data-type="entity-link">SharedUiModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SharedUiModule-a8ed2679de41d6b19b79675b3c833dd8"' : 'data-target="#xs-components-links-module-SharedUiModule-a8ed2679de41d6b19b79675b3c833dd8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedUiModule-a8ed2679de41d6b19b79675b3c833dd8"' :
                                            'id="xs-components-links-module-SharedUiModule-a8ed2679de41d6b19b79675b3c833dd8"' }>
                                            <li class="link">
                                                <a href="components/CollapsibleListComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CollapsibleListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConnectErrorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConnectErrorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoaderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoaderComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TabsPageModule.html" data-type="entity-link">TabsPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TabsPageModule-3f4080d59939e4996fb8aab9e25be959"' : 'data-target="#xs-components-links-module-TabsPageModule-3f4080d59939e4996fb8aab9e25be959"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TabsPageModule-3f4080d59939e4996fb8aab9e25be959"' :
                                            'id="xs-components-links-module-TabsPageModule-3f4080d59939e4996fb8aab9e25be959"' }>
                                            <li class="link">
                                                <a href="components/TabsPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TabsPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TabsPageRoutingModule.html" data-type="entity-link">TabsPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/TrekDetailsPageModule.html" data-type="entity-link">TrekDetailsPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TrekDetailsPageModule-3146332fe39f94b4769627ac15cc59d0"' : 'data-target="#xs-components-links-module-TrekDetailsPageModule-3146332fe39f94b4769627ac15cc59d0"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TrekDetailsPageModule-3146332fe39f94b4769627ac15cc59d0"' :
                                            'id="xs-components-links-module-TrekDetailsPageModule-3146332fe39f94b4769627ac15cc59d0"' }>
                                            <li class="link">
                                                <a href="components/TrekDetailsPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TrekDetailsPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TrekMapPageModule.html" data-type="entity-link">TrekMapPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TrekMapPageModule-950506bcb8010fb481258146c4a09217"' : 'data-target="#xs-components-links-module-TrekMapPageModule-950506bcb8010fb481258146c4a09217"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TrekMapPageModule-950506bcb8010fb481258146c4a09217"' :
                                            'id="xs-components-links-module-TrekMapPageModule-950506bcb8010fb481258146c4a09217"' }>
                                            <li class="link">
                                                <a href="components/SelectPoiComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SelectPoiComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TrekMapPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TrekMapPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TreksMapPageModule.html" data-type="entity-link">TreksMapPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TreksMapPageModule-337913c22df59ee8d1b8b232e4a7014e"' : 'data-target="#xs-components-links-module-TreksMapPageModule-337913c22df59ee8d1b8b232e4a7014e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TreksMapPageModule-337913c22df59ee8d1b8b232e4a7014e"' :
                                            'id="xs-components-links-module-TreksMapPageModule-337913c22df59ee8d1b8b232e4a7014e"' }>
                                            <li class="link">
                                                <a href="components/SelectTrekComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SelectTrekComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TreksMapPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TreksMapPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TreksPageModule.html" data-type="entity-link">TreksPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TreksPageModule-cfe6161eda9475f8832736b98c415ab4"' : 'data-target="#xs-components-links-module-TreksPageModule-cfe6161eda9475f8832736b98c415ab4"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TreksPageModule-cfe6161eda9475f8832736b98c415ab4"' :
                                            'id="xs-components-links-module-TreksPageModule-cfe6161eda9475f8832736b98c415ab4"' }>
                                            <li class="link">
                                                <a href="components/TreksPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TreksPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/CollapsibleListComponent.html" data-type="entity-link">CollapsibleListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ConnectErrorComponent.html" data-type="entity-link">ConnectErrorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FilterComponent.html" data-type="entity-link">FilterComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FiltersComponent.html" data-type="entity-link">FiltersComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FilterValueComponent.html" data-type="entity-link">FilterValueComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GeolocateNotificationsComponent.html" data-type="entity-link">GeolocateNotificationsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/InAppDisclosureComponent.html" data-type="entity-link">InAppDisclosureComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/InformationDeskDetailsComponent.html" data-type="entity-link">InformationDeskDetailsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LayersVisibilityComponent.html" data-type="entity-link">LayersVisibilityComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoaderComponent.html" data-type="entity-link">LoaderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MapTreksVizComponent.html" data-type="entity-link">MapTreksVizComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MapTrekVizComponent.html" data-type="entity-link">MapTrekVizComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PoiComponent.html" data-type="entity-link">PoiComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PoiDetailsComponent.html" data-type="entity-link">PoiDetailsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProgressComponent.html" data-type="entity-link">ProgressComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SearchComponent.html" data-type="entity-link">SearchComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SelectFilterComponent.html" data-type="entity-link">SelectFilterComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SelectPoiComponent.html" data-type="entity-link">SelectPoiComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SelectTrekComponent.html" data-type="entity-link">SelectTrekComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TrekCardComponent.html" data-type="entity-link">TrekCardComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/UnSubscribe.html" data-type="entity-link">UnSubscribe</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/CacheService.html" data-type="entity-link">CacheService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FilterTreksService.html" data-type="entity-link">FilterTreksService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GeolocateService.html" data-type="entity-link">GeolocateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoadingService.html" data-type="entity-link">LoadingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MoreInformationsService.html" data-type="entity-link">MoreInformationsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OfflineTreksService.html" data-type="entity-link">OfflineTreksService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OnlineTreksService.html" data-type="entity-link">OnlineTreksService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SearchTreksService.html" data-type="entity-link">SearchTreksService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SettingsService.html" data-type="entity-link">SettingsService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interceptors-links"' :
                            'data-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/LoadingInterceptor.html" data-type="entity-link">LoadingInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/MoreItemResolver.html" data-type="entity-link">MoreItemResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/MoreResolver.html" data-type="entity-link">MoreResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/TrekContextResolver.html" data-type="entity-link">TrekContextResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/TreksContextResolver.html" data-type="entity-link">TreksContextResolver</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ContainsFilter.html" data-type="entity-link">ContainsFilter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataSetting.html" data-type="entity-link">DataSetting</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Filter.html" data-type="entity-link">Filter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FilterValue.html" data-type="entity-link">FilterValue</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HydratedTrek.html" data-type="entity-link">HydratedTrek</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HydratedTrekProperties.html" data-type="entity-link">HydratedTrekProperties</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/InformationDesk.html" data-type="entity-link">InformationDesk</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/InformationIntro.html" data-type="entity-link">InformationIntro</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/InformationItem.html" data-type="entity-link">InformationItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IntervalFilter.html" data-type="entity-link">IntervalFilter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MinimalTrek.html" data-type="entity-link">MinimalTrek</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MinimalTrekProperties.html" data-type="entity-link">MinimalTrekProperties</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MinimalTreks.html" data-type="entity-link">MinimalTreks</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Picture.html" data-type="entity-link">Picture</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Poi.html" data-type="entity-link">Poi</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Pois.html" data-type="entity-link">Pois</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Property.html" data-type="entity-link">Property</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Settings.html" data-type="entity-link">Settings</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TouristicCategorie.html" data-type="entity-link">TouristicCategorie</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TouristicCategoryWithFeatures.html" data-type="entity-link">TouristicCategoryWithFeatures</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TouristicContent.html" data-type="entity-link">TouristicContent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TouristicContents.html" data-type="entity-link">TouristicContents</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TouristicEvent.html" data-type="entity-link">TouristicEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TouristicEvents.html" data-type="entity-link">TouristicEvents</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Trek.html" data-type="entity-link">Trek</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TrekContext.html" data-type="entity-link">TrekContext</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TrekProperties.html" data-type="entity-link">TrekProperties</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Treks.html" data-type="entity-link">Treks</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TreksContext.html" data-type="entity-link">TreksContext</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TreksService.html" data-type="entity-link">TreksService</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});