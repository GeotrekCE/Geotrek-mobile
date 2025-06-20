import { defineConfig, type DefaultTheme } from 'vitepress'

export const en = defineConfig({
  lang: 'en',
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
    { text: 'Introduction', link: '/en/documentation/introduction/overview' }
  ]
}

function sidebar(): DefaultTheme.SidebarItem[] {
  return [
      {
        text: 'Introduction',
        items: [
          { text: 'Overview', link: '/en/documentation/introduction/overview' },
          { text: 'Get started', link: '/en/documentation/introduction/get-started' }
        ]
      },
      {
        text: 'Features',
        items: [
          { text: 'Online', link: '/en/documentation/features/online' },
          { text: 'Offline', link: '/en/documentation/features/offline' }
        ]
      },
      {
        text: 'Architecture',
        items: [
          { text: 'Components', link: '/en/documentation/architecture/components' },
        ]
      },
      {
        text: 'Contribution',
        items: [
          { text: 'Development', link: '/en/documentation/contribution/development' },
          { text: 'Documentation', link: '/en/documentation/contribution/documentation' }
        ]
      },
      {
        text: 'About',
        items: [
          {
            text: 'Geotrek',
            link: '/en/documentation/about/geotrek/what-is-geotrek',
            items: [
              { text: "What is Geotrek ?", link: '/en/documentation/about/geotrek/what-is-geotrek', items: [] },
              { text: 'Projects', link: '/en/documentation/about/geotrek/projects', items: [] },
            ],
          },
        ]
      }
    ]
  }
