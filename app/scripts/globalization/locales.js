'use strict';

var geotrekGlobalization = angular.module('geotrekGlobalization');

// App translatable strings (.po/.mo equivalent)
geotrekGlobalization.constant('locales', {
    'fr': {
        'map_trek_detail.more_details': ' + de détails',
        'map_trek_detail.usages': 'Usages : ',
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
        'user_parameters.global': 'Général',
        'user_parameters.back': 'Retour',
        'user_parameters.language': 'Langage',
        'user_parameters.synchronization_mode': 'Sync. des données',
        'user_parameters.poi_alert': 'Alerte près d\'un POI (si GPS)',
        'user_parameters.map': 'Carte',
        'user_parameters.clean_maps': 'Nettoyer les cartes',
        'user_parameters.clean': 'Suppression',
        'user_parameters.network': 'Réseau',
        'user_parameters.is_connected': 'Connecté ?',
        'user_parameters.network_reachable': 'Oui',
        'user_parameters.network_not_reachable': 'Non'
    },
    'en': {
        'map_trek_detail.more_details': ' more details',
        'map_trek_detail.usages': 'Usages: ',
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
        'user_parameters.global': 'Global',
        'user_parameters.back': 'Back',
        'user_parameters.language': 'Language',
        'user_parameters.synchronization_mode': 'Synchronization mode',
        'user_parameters.poi_alert': 'POI alert (GPS only)',
        'user_parameters.map': 'Map settings',
        'user_parameters.clean_maps': 'Clean maps',
        'user_parameters.clean': 'Delete',
        'user_parameters.network': 'Network',
        'user_parameters.is_connected': 'Online ?',
        'user_parameters.network_reachable': 'Yes',
        'user_parameters.network_not_reachable': 'No'
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
