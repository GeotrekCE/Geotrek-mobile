'use strict';

var geotrekGlobalization = angular.module('geotrekGlobalization');

// App translatable strings (.po/.mo equivalent)
geotrekGlobalization.constant('locales', {
    'fr': {
        'init.loading': 'Chargement des données en cours...',
        'init.data': 'Randonnées',
        'init.map': 'Carte',
        'init.error_loading': 'Problème lors du chargement des données. Si c\'est la première fois que vous utilisez Geotrek-Mobile, veuillez avoir une connexion Internet active.',
        'map_trek_detail.more_details': ' + de détails',
        'map_trek_detail.usages': 'Usages : ',
        'nav_trek_map.ways': 'Itinéraires',
        'nav_trek_map.map': 'Carte',
        'nav_trek_map.cancel': 'Annuler',
        'nav_trek_map.theme': 'Tous les thèmes',
        'nav_trek_map.use': 'Toutes les pratiques',
        'nav_trek_map.route': 'Tous les parcours',
        'nav_trek_map.valley': 'Toutes les vallées',
        'nav_trek_map.city': 'Toutes les communes',
        'nav_trek_map.reset': 'Réinitialiser',
        'nav_trek_map.search': 'Rechercher',
        'nav_trek_map.offline': 'Carte détaillée déjà téléchargée',
        'static_page.cancel': 'Annuler',
        'static_page.back': 'Retour',
        'trek_detail.description': 'Description',
        'trek_detail.cities': 'Communes',
        'trek_detail.on_road': 'En chemin',
        'trek_detail.themes': 'Thématiques : ',
        'trek_detail.advice': 'Recommandation',
        'trek_detail.transport': 'Transport',
        'trek_detail.advised_parking': 'Parking conseillé',
        'trek_detail.public_transport': 'Transport public',
        'trek_detail.park_centered': 'Cet itinéraire est dans le coeur du parc national, veuillez consulter la réglementation.',
        'trek_detail.networks': 'Balisage : ',
        'trek_detail.elevation': 'Profil altimétrique',
        'trek_detail.min_elevation': 'Altitude minimum',
        'trek_detail.max_elevation': 'Altitude maximum',
        'trek_detail.disabled_infrastructure': 'Aménagements pour handicapés',
        'trek_detail.information_desks': 'Lieux de renseignement',
        'trek_detail.website': 'Site web',
        'trek_detail.at': 'à',
        'trek_list.departure': 'Départ',
        'trek_list.distance': 'Distance',
        'trek_controller_no_network_title': 'Réseau inaccessible',
        'trek_controller_no_network_label': 'Vérifiez votre connexion, elle est nécessaire pour obtenir la carte détaillée de l\'itinéraire.',
        'trek_controller_download_confirm_title': 'Télécharger la carte de l\'itinéraire',
        'trek_controller_download_confirm_message': 'Vous allez télécharger la carte détaillée de ce itinéraire. Êtes-vous sûr ?',
        'trek_controller_donwload_warning_title': 'Attention',
        'trek_controller_donwload_warning_message': 'vous n\'êtes pas connecté en Wifi, veuillez noter que le volume de données transféré sera important.',
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
        'user_parameters.network_not_reachable': 'Non',
        'user_parameters.exit': 'Quitter l\'application',
        'user_parameters.exit_button': 'Quitter',
        'usersettings_controller_cleanmaps_confirm_title': 'Supprimer les cartes détaillées',
        'usersettings_controller_cleanmaps_confirm_label': 'Êtes-vous sûr ?',
        'image.connect': 'Veuillez vous connecter pour voir cette image',
        'error_message': 'Une erreur est survenue',
        'error_title': 'Erreur',
        'cancel': 'Retour',
        'maj_title': 'Données mises à jour',
        'maj_message': 'Les données concernant les randonnées ont été mises à jour. Si vous avez téléchargé des contenus détaillés, veuillez les supprimer puis les re-télécharger pour mettre à jours leurs images et leurs fond de carte.'
    },
    'en': {
        'init.loading': 'Loading data...',
        'init.data': 'Treks',
        'init.map': 'Map',
        'init.error_loading': 'Problem while loading data. If you start Geotrek-Mobile for the first time, please have an active Internet connection.',
        'map_trek_detail.more_details': ' more details',
        'map_trek_detail.usages': 'Usages: ',
        'nav_trek_map.ways': 'Ways',
        'nav_trek_map.map': 'Map',
        'nav_trek_map.cancel': 'Cancel',
        'nav_trek_map.theme': 'All thematics',
        'nav_trek_map.use': 'All uses',
        'nav_trek_map.route': 'All routes',
        'nav_trek_map.valley': 'All valleys',        
        'nav_trek_map.city': 'All municipalities',
        'nav_trek_map.reset': 'Reset',
        'nav_trek_map.search': 'Search',
        'nav_trek_map.offline': 'Trek map already downloaded',
        'static_page.cancel': 'Cancel',
        'static_page.back': 'Back',
        'trek_detail.description': 'Description',
        'trek_detail.cities': 'Cities',
        'trek_detail.on_road': 'On road',
        'trek_detail.themes': 'Themes: ',
        'trek_detail.advice': 'Advice',
        'trek_detail.transport': 'Transport',
        'trek_detail.advised_parking': 'Advised parking',
        'trek_detail.public_transport': 'Public transport',
        'trek_detail.park_centered': 'This trek is within park center, please read access rules.',
        'trek_detail.networks': 'Markings: ',
        'trek_detail.elevation': 'Elevation',
        'trek_detail.min_elevation': 'Minimum elevation',
        'trek_detail.max_elevation': 'Maximum elevation',
        'trek_detail.disabled_infrastructure': 'Disabled-friendly infrastructures',
        'trek_detail.information_desks': 'Information desks',
        'trek_detail.website': 'Website',
        'trek_detail.at': 'at',
        'trek_list.departure': 'Departure',
        'trek_list.distance': 'Distance',
        'trek_controller_no_network_title': 'Network cannot be reached',
        'trek_controller_no_network_label': 'Check your network connection, needed to download trek precise maps',
        'trek_controller_download_confirm_title': 'Download trek map',
        'trek_controller_download_confirm_message': 'You will download precise map for this trek. Are you sure ?',
        'trek_controller_donwload_warning_title': 'Warning',
        'trek_controller_donwload_warning_message': 'you are not WiFi connected, be aware the transfered data volume might be important.',
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
        'user_parameters.network_not_reachable': 'No',
        'user_parameters.exit': 'Exit application',
        'user_parameters.exit_button': 'Exit',
        'usersettings_controller_cleanmaps_confirm_title': 'Remove detailled maps',
        'usersettings_controller_cleanmaps_confirm_label': 'Are you sure?',
        'image.connect': 'You need network connexion in order to see this image',
        'error_message': 'An error occured',
        'error_title': 'Error',
        'cancel': 'Cancel',
        'maj_title': 'Data updated',
        'maj_message': 'Treks data where updated. If you had downloaded details informations on a trek, please remove them and download again in order to have updated pictures and detailed map layers'
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
