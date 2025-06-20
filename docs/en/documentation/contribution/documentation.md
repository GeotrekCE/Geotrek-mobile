# Documentation

## Development mode installation

### Prerequisites

**1. Clone the repository**

```bash
git clone git@github.com:GeotrekCE/Geotrek-mobile.git
```

**2. Install npm modules**

```bash
npm install
```

### Start the application

Start the development server by running the following command:

```bash
npm run docs:dev
```

Then open your browser and go to this URL:

```bash
http://localhost:5173/
```

# Contributing

**1. Contribute to existing files**

You can start contributing to the Geotrek-mobile documentation by editing the markdown files located in the `docs/documentation` folder:

```bash
cd /docs/documentation
```

Each subfolder in `/docs` corresponds to a section of the documentation (Introduction, Theme, Components, etc.).

**2. Add new sections**

To add a new section, create a new folder and update the markdown structure in `docs/.vitepress/config/fr.ts`:

```bash
cd /docs/.vitepress/config/fr.ts
```

Example of creating a new section:

```js
{
  text: 'New Section',
  collapsed: true,
  items: [
    { text: 'Part 1', link: '/documentation/newsection/partie1' },
    { text: 'Part 2', link: '/documentation/newsection/partie2' },
  ],
}
```

# Translating the documentation

Translating user documentation into a language other than French offers several advantages:

* **Improved accessibility**: translating the Geotrek-mobile documentation helps make the product accessible to a wider audience worldwide.
* **Better user experience**: providing documentation in users' native language improves understanding and usability, enhancing the overall product experience.
* **Facilitated collaboration**: if Geotrek-mobile is used by an international team, having English documentation simplifies collaboration, support, and communication.

## Adding english content

To translate existing documentation content, update the markdown files in the `/docs/en/documentation/` folder.

## Adding a menu section in english

When creating a new menu entry in the documentation, you need to:

**1. Create the markdown file**

Example: `/docs/en/documentation/features/new-file.md`

::: info
For consistency, it's best to keep the same folder structure as the original language (French).

All markdown documentation files are located in `/docs/**en**/documentation/`.
:::

**2. Update the index**

In this example, update the `/docs/.vitepress/config/en.ts` file by adding the highlighted line:

```js
{
  text: 'Features',
  items: [
    { text: 'Online', link: '/en/documentation/features/online' },
    { text: 'Offline', link: '/en/documentation/features/offline' },
    { text: 'New file', link: '/en/documentation/features/new-file' }, // [!code focus]
  ]
},
```

## Adding a new language

To add support for a new language (e.g., *Italian*), follow these steps:

**1. Create the folder `/docs/it/documentation/`**

**2. Create all necessary subfolders and markdown files**

For simplicity, the folder and file names do not need to be translated:

* `/docs/it/documentation/features`

  * online.md
  * offline.md
  * new-file.md
* etc.

**3. Create the `it.ts` file in `/docs/.vitepress/config/`**

This file defines the menu structure in the new language. Menu labels also need to be translated.

::: tip
For convenience, you can copy the content of `en.ts` and adapt it to the new language.
:::

**4. Include the new language in `/docs/.vitepress/config/index.ts`**

The final step is to include the new language in the `index.ts` file:

```js
export default defineConfig({
  ...shared,
  locales: {
    root: {
      label: 'Français',
      ...fr,
    },
    en: {
      label: 'English',
      ...en,
    },
    it: {
      label: 'Italiano', // [!code focus]
      ...it,
    },
  },
});
```
