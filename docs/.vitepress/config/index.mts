import { defineConfig } from 'vitepress';
import { shared } from '../config/shared';
import { fr } from '../config/fr';
import { en } from '../config/en';

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
  },
});
