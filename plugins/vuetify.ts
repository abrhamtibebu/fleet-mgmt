import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
    theme: {
      defaultTheme: 'customTheme',
      themes: {
        customTheme: {
          colors: {
            primary: '#f3d70e', // Safety Yellow
            secondary: '#040707', // Rich Black
            accent: '#f5e35e', // Minion Yellow
            error: '#ff5252',
            info: '#fbb339', // Honey Yellow
            success: '#43A047',
            warning: '#fbb339', // Honey Yellow
            background: '#ffffff', // White
            surface: '#ffffff', // White
            'on-primary': '#040707', // Rich Black on Safety Yellow
            'on-secondary': '#f3d70e', // Safety Yellow on Rich Black
            'on-accent': '#040707', // Rich Black on Minion Yellow
            'text-primary': '#040707', // Rich Black
            'text-secondary': '#6c757d',
            'border-color': '#e9ecef',
            'sidebar-bg': '#ffffff', // White
            'active-nav-bg': '#f3d70e', // Safety Yellow for active nav
            'active-nav-text': '#040707', // Rich Black on Safety Yellow
          },
        },
      },
    },
    defaults: {
      VCard: {
        flat: true,
        elevation: 0,
        rounded: 'lg', // Apply a subtle border-radius to cards
      },
      VBtn: {
        rounded: 'lg',
      },
      VTextField: {
        variant: 'outlined',
        density: 'comfortable',
        color: 'primary',
      },
      VSelect: {
        variant: 'outlined',
        density: 'comfortable',
        color: 'primary',
      },
      VDataTable: {
        flat: true,
        elevation: 0,
        rounded: 'lg',
      },
      VTab: {
        selectedClass: 'font-weight-bold',
      },
    },
  })

  app.vueApp.use(vuetify)
}) 