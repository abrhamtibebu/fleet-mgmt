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
            primary: '#FFD600', // Brighter, modern yellow
            secondary: '#212121', // Deep gray for contrast
            accent: '#536DFE', // Indigo accent for modern touch
            error: '#FF5252',
            info: '#2196F3',
            success: '#43A047',
            warning: '#FFC107',
            background: '#F8FAFB', // Softer background
            surface: '#FFFFFF',
            'on-primary': '#212121',
            'on-secondary': '#FFFFFF',
            'on-accent': '#FFFFFF',
            'text-primary': '#212121',
            'text-secondary': '#757575',
            'border-color': '#E0E0E0',
            'sidebar-bg': '#FFFFFF',
            'active-nav-bg': '#FFFDE7', // Softer yellow for active nav
            'active-nav-text': '#212121',
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