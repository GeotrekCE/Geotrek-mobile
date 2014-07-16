'use strict';

var geotrekGlobalization = angular.module('geotrekGlobalization');

// App translatable strings (.po/.mo equivalent)
geotrekGlobalization.constant('locales', {
    'fr': {
        'nav_trek_map.ways': 'Itinéraires',
        'nav_trek_map.map': 'Carte',
        'nav_trek_map.cancel': 'Annuler',
        'nav_trek_map.theme': 'Thème',
        'nav_trek_map.use': 'Usage',
        'nav_trek_map.route': 'Parcours',
        'nav_trek_map.valley': 'Vallée',
        'nav_trek_map.city': 'Commune',
        'nav_trek_map.reset': 'Réinitialiser',
        'nav_trek_map.search': 'Rechercher',
        'static_page.cancel': 'Annuler',
        'static_page.back': 'Retour',
        'trek_detail.description': 'Description',
        'trek_detail.cities': 'Communes',
        'trek_detail.on_road': 'En chemin',
        'trek_list.departure': 'Départ',
        'trek_list.distance': 'Distance',
        'user_parameters.parameters': 'Paramètres',
        'user_parameters.back': 'Retour',
        'user_parameters.language': 'Langage',
        'user_parameters.synchronization_mode': 'Sync. des données',
        'user_parameters.poi_alert': 'Alerte près d\'un POI (si GPS)'
    },
    'en': {
        'nav_trek_map.ways': 'Ways',
        'nav_trek_map.map': 'Map',
        'nav_trek_map.cancel': 'Cancel',
        'nav_trek_map.theme': 'Thematic',
        'nav_trek_map.use': 'Uses',
        'nav_trek_map.route': 'Route',
        'nav_trek_map.valley': 'Valleys',        
        'nav_trek_map.city': 'Municipalities',
        'nav_trek_map.reset': 'Reset',
        'nav_trek_map.search': 'Search',
        'static_page.cancel': 'Cancel',
        'static_page.back': 'Back',
        'trek_detail.description': 'Description',
        'trek_detail.cities': 'Cities',
        'trek_detail.on_road': 'On road',
        'trek_list.departure': 'Departure',
        'trek_list.distance': 'Distance',
        'user_parameters.parameters': 'Parameters',
        'user_parameters.back': 'Back',
        'user_parameters.language': 'Language',
        'user_parameters.synchronization_mode': 'Synchronization mode',
        'user_parameters.poi_alert': 'POI alert (GPS only)'        
    }
})

// Locale settings to allow user to change app locale
.constant('localeSettings', {
    'fr': {
        label: 'Français',
        locale: 'fr'
    },
    'en': {
        label: 'English',
        locale: 'en'
    }
});
