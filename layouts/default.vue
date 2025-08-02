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
        <div class="brand-icon">
          <v-icon icon="mdi-car" size="28" class="text-primary" />
        </div>
        <div v-show="!collapsed" class="brand-text">
          <div class="text-h6 font-weight-bold text-primary">FleetPro</div>
          <div class="text-caption text-medium-emphasis">Management System</div>
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
  border-right: 1px solid #e9ecef;
  min-height: 100vh;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  background: white;
  transition: width 0.3s ease;
}

.sidebar-header {
  background: white;
  padding: 24px 16px;
  transition: all 0.3s ease;
}

.brand-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f3d70e 0%, #fbb339 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.brand-text {
  flex: 1;
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
  background: linear-gradient(135deg, #f3d70e 0%, #fbb339 100%) !important;
  color: #040707 !important;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(243, 215, 14, 0.3);
  border-radius: 12px;
  margin: 4px 8px;
}

.v-list-item {
  transition: all 0.3s ease;
  border-radius: 12px;
  margin: 4px 8px;
}

.v-list-item:hover {
  background: rgba(243, 215, 14, 0.1) !important;
  color: #f3d70e !important;
  transform: translateX(4px);
}

.v-list-subheader {
  transition: opacity 0.3s ease;
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