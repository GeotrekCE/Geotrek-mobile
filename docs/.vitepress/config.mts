import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Geotrek-mobile documentation",
  description: "A VitePress Site",
  themeConfig: {

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Introduction', link: '/documentation/introduction/overview' }
    ],

    docFooter: { prev: 'Page précédente', next: 'Page suivante' },
    darkModeSwitchLabel: 'Apparence',
    lightModeSwitchTitle: "Passer au thème clair",
    darkModeSwitchTitle: "Passer au thème sombre",
    outlineTitle: "Sur cette page",
    notFound: {
      title: "PAGE NON TROUVÉE",
      quote: "Mais si vous ne changez pas de direction et si vous continuez à chercher, vous risquez de vous retrouver là où vous vous dirigez.",
      linkLabel: "retour à l'accueil.",
      linkText: "Retourner à l'accueil",
      code: "404"
    },

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Présentation', link: '/documentation/introduction/overview' },
          { text: 'Installation', link: '/documentation/introduction/get-started' }
        ]
      },
      {
        text: 'Fonctionnalités',
        items: [
          { text: 'Online', link: '/documentation/fonctionnalites/online' },
          { text: 'Offline', link: '/documentation/fonctionnalites/offline' }
        ]
      },
      {
        text: 'Architecture',
        items: [
          { text: 'Composants', link: '/documentation/architecture/composants' },
        ]
      },
      {
        text: 'Contribution',
        items: [
          { text: 'Développement', link: '/documentation/contribution/development' },
          { text: 'Documentation', link: '/documentation/contribution/documentation' }
        ]
      },
      {
        text: 'A propos',
        items: [
          {
            text: 'Geotrek',
            link: '/documentation/apropos/geotrek/what-is-geotrek',
            items: [
              { text: "Qu'est-ce que Geotrek ?", link: '/documentation/apropos/geotrek/what-is-geotrek', items: [] },
              { text: 'Les projets', link: '/documentation/apropos/geotrek/projects', items: [] },
            ],
          },
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/GeotrekCE/Geotrek-mobile' }
    ]
  }
})
