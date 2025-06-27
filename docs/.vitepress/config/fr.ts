import { defineConfig, type DefaultTheme } from 'vitepress'

export const fr = defineConfig({
  lang: 'fr',
  themeConfig: {
    nav: nav(),
    sidebar: sidebar(),
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
    }
  }
})

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: 'Home', link: '/' },
    { text: 'Introduction', link: '/documentation/introduction/overview' }
  ]
}

function sidebar(): DefaultTheme.SidebarItem[] {
  return [
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
          { text: 'Online', link: '/documentation/features/online' },
          { text: 'Offline', link: '/documentation/features/offline' }
        ]
      },
      {
        text: 'Configuration',
        items: [
          { text: 'Configuration', link: '/documentation/configuration/configuration' }
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
            link: '/documentation/about/geotrek/what-is-geotrek',
            items: [
              { text: "Qu'est-ce que Geotrek ?", link: '/documentation/about/geotrek/what-is-geotrek', items: [] },
              { text: 'Les projets', link: '/documentation/about/geotrek/projects', items: [] },
            ],
          },
        ]
      }
    ]
  }
