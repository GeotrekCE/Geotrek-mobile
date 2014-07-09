'use strict';

var geotrekGlobalization = angular.module('geotrekGlobalization');

// App translatable strings (.po/.mo equivalent)
geotrekGlobalization.constant('locales', {
    'fr': {
        'nav_trek_map.ways': 'Itinéraires',
        'nav_trek_map.map': 'Carte',
        'nav_trek_map.cancel': 'Annuler',
        'nav_trek_map.city': 'Commune',
        'nav_trek_map.reset': 'Réinitialiser',
        'nav_trek_map.search': 'Rechercher',
        'static_page.cancel': 'Annuler',
        'static_page.back': 'Retour',
        'trek_detail.description': 'Description',
        'trek_detail.cities': 'Communes',
        'trek_detail.on_road': 'En chemin',
        'trek_list.departure': 'Départ',
        'trek_list.distance': 'Distance'
    },
    'en': {
        'nav_trek_map.ways': 'Ways',
        'nav_trek_map.map': 'Map',
        'nav_trek_map.cancel': 'Cancel',
        'nav_trek_map.city': 'City',
        'nav_trek_map.reset': 'Reset',
        'nav_trek_map.search': 'Search',
        'static_page.cancel': 'Cancel',
        'static_page.back': 'Back',
        'trek_detail.description': 'Description',
        'trek_detail.cities': 'Cities',
        'trek_detail.on_road': 'On road',
        'trek_list.departure': 'Departure',
        'trek_list.distance': 'Distance'        
    }
});

// Locale settings to allow user to change app locale
geotrekGlobalization.constant('localeSettings',
    [{
        text: 'Français',
        locale: 'fr'
    },
    {
        text: 'English',
        locale: 'en'
    }]
);
