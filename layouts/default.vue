<template>
  <v-app>
    <!-- Sidebar Navigation -->
    <client-only>
    <v-navigation-drawer 
      v-model="drawer" 
      app 
      :width="drawerWidth" 
      class="sidebar" 
      color="#fff"
      :temporary="$vuetify.display.mdAndDown"
      :permanent="$vuetify.display.lgAndUp"
    >
      <div class="sidebar-header d-flex align-center px-4 py-3">
        <v-icon icon="mdi-car" size="32" class="mr-2 text-primary" />
        <div v-show="!collapsed">
          <div class="text-h6 font-weight-bold">WebSprix</div>
          <div class="text-caption text-medium-emphasis">Fleet Management</div>
        </div>
      </div>
      <v-divider></v-divider>
      <v-list nav density="compact" class="mt-2">
        <v-list-subheader v-show="!collapsed" class="text-overline">Main Navigation</v-list-subheader>
        <v-list-item 
          v-for="item in mainNav" 
          :key="item.title" 
          :to="item.to" 
          :prepend-icon="item.icon" 
          :title="collapsed ? '' : item.title" 
          active-class="active-nav" 
          class="rounded-r-xl my-1 ml-2 font-weight-medium"
          :class="{ 'collapsed-item': collapsed }"
        />
        <v-list-subheader v-show="!collapsed" class="text-overline mt-4">Management</v-list-subheader>
        <v-list-item 
          v-for="item in managementNav" 
          :key="item.title" 
          :to="item.to" 
          :prepend-icon="item.icon" 
          :title="collapsed ? '' : item.title" 
          active-class="active-nav" 
          class="rounded-r-xl my-1 ml-2 font-weight-medium"
          :class="{ 'collapsed-item': collapsed }"
        />
      </v-list>
      <template v-slot:append>
        <div v-show="!collapsed" class="pa-4 text-caption text-medium-emphasis sidebar-footer">
          <div>Fleet Management v1.0</div>
        </div>
        <div v-show="collapsed" class="pa-2 text-center">
          <v-btn
            icon="mdi-chevron-right"
            variant="text"
            size="small"
            @click="toggleCollapse"
            class="collapse-btn"
          ></v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    </client-only>

    <!-- Top Bar -->
    <v-app-bar app color="#fff" elevation="0" class="topbar">
      <div class="d-flex align-center w-100 justify-space-between">
        <div class="d-flex align-center">
          <v-btn 
            icon="mdi-menu" 
            variant="text"
            @click="toggleDrawer"
            class="mr-2"
          ></v-btn>
          <span class="text-h6 font-weight-bold text-primary">Fleet Management System</span>
        </div>
        <div class="d-flex align-center">
          <!-- <v-btn 
            v-show="$vuetify.display.lgAndUp"
            icon="mdi-chevron-left" 
            variant="text"
            @click="toggleCollapse"
            class="mr-2"
            :class="{ 'rotated': collapsed }"
          ></v-btn> -->
          <v-btn icon variant="text"><v-icon>mdi-bell-outline</v-icon></v-btn>
          <!-- <v-btn icon variant="text"><v-icon>mdi-account-circle-outline</v-icon></v-btn> -->
          <v-menu offset-y>
  <template >
    <v-btn icon variant="text">
      <v-icon>mdi-account-circle-outline</v-icon>
    </v-btn>
  </template>
  <v-list>
    <!-- Logout item -->
    <v-list-item @click="handleLogout">
      <v-list-item-title>Logout</v-list-item-title>
    </v-list-item>
  </v-list>
</v-menu>

        </div>
      </div>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-container fluid class="main-bg pa-6">
        <NuxtPage />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Reactive drawer state
const drawer = ref(true)
const collapsed = ref(false)

// Computed drawer width
const drawerWidth = computed(() => {
  return collapsed.value ? 64 : 260
})

// Navigation items
const mainNav = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard-outline', to: '/' },
  { title: 'Fleet Overview', icon: 'mdi-car-multiple', to: '/vehicles' },
  // { title: 'Live Tracking', icon: 'mdi-map-marker-radius-outline', to: '/tracking' },
  { title: 'Fuel Management', icon: 'mdi-fuel', to: '/fuel-management' },
  { title: 'Maintenance', icon: 'mdi-wrench-outline', to: '/maintenance' },
  { title: 'Analytics & Reports', icon: 'mdi-chart-box', to: '/analytics-reports' },
]
const managementNav = [
  { title: 'Vendor Management', icon: 'mdi-store', to: '/vendor-management' },
  { title: 'Alerts', icon: 'mdi-bell-alert-outline', to: '/alerts' },
]

// Methods
const toggleDrawer = () => {
  drawer.value = !drawer.value
}

const toggleCollapse = () => {
  collapsed.value = !collapsed.value
}
</script>

<style scoped>
.sidebar {
  border-right: 1px solid #dee2e6;
  min-height: 100vh;
  box-shadow: 2px 0 8px 0 rgba(0, 0, 0, 0.08);
  background: var(--v-theme-sidebar-bg);
  transition: width 0.3s ease;
}

.sidebar-header {
  background: var(--v-theme-sidebar-bg);
  padding-top: 32px;
  padding-bottom: 24px;
  transition: all 0.3s ease;
}

.sidebar-footer {
  border-top: 1px solid #dee2e6;
  margin-top: 24px;
  transition: all 0.3s ease;
}

.collapsed-item {
  justify-content: center;
  min-width: 48px;
  margin: 4px 8px;
  border-radius: 8px;
}

.collapsed-item .v-list-item__prepend {
  margin-right: 0;
}

.collapse-btn {
  transition: transform 0.3s ease;
}

.collapse-btn:hover {
  transform: scale(1.1);
}

.rotated {
  transform: rotate(180deg);
}

.active-nav {
  background: var(--v-theme-active-nav-bg) !important;
  color: var(--v-theme-active-nav-text) !important;
  font-weight: 600;
  box-shadow: 0 2px 8px 0 rgba(255, 193, 7, 0.15);
}

.v-list-item {
  transition: all 0.3s ease;
}

.v-list-item:hover {
  background: #e9ecef !important;
  color: var(--v-theme-primary) !important;
  transform: translateX(4px);
}

.v-list-subheader {
  transition: opacity 0.3s ease;
}

.topbar {
  border-bottom: 1px solid #dee2e6;
  background: #fff !important;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
}

.main-bg {
  background: var(--v-theme-background);
  min-height: 100vh;
  border-radius: 18px;
  box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.08);
  transition: margin-left 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .sidebar {
    position: fixed;
    z-index: 1000;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 260px !important;
  }
  
  .collapsed-item {
    justify-content: flex-start;
    min-width: auto;
    margin: 4px 16px;
  }
}
</style> 