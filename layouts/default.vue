<template>
  <v-app>
    <!-- Sidebar Navigation -->
    <v-navigation-drawer app permanent width="260" class="sidebar" color="#fff">
      <div class="sidebar-header d-flex align-center px-4 py-3">
        <v-icon icon="mdi-car" size="32" class="mr-2 text-primary" />
        <div>
          <div class="text-h6 font-weight-bold">FleetPro</div>
          <div class="text-caption text-medium-emphasis">ISP Fleet Management</div>
        </div>
      </div>
      <v-divider></v-divider>
      <v-list nav density="compact" class="mt-2">
        <v-list-subheader class="text-overline">Main Navigation</v-list-subheader>
        <v-list-item v-for="item in mainNav" :key="item.title" :to="item.to" :prepend-icon="item.icon" :title="item.title" active-class="active-nav" class="rounded-r-xl my-1 ml-2 font-weight-medium" />
        <v-list-subheader class="text-overline mt-4">Management</v-list-subheader>
        <v-list-item v-for="item in managementNav" :key="item.title" :to="item.to" :prepend-icon="item.icon" :title="item.title" active-class="active-nav" class="rounded-r-xl my-1 ml-2 font-weight-medium" />
      </v-list>
      <template v-slot:append>
        <div class="pa-4 text-caption text-medium-emphasis sidebar-footer">
          <div>Fleet Management v2.0</div>
          <div>NOC Integration Active</div>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Top Bar -->
    <v-app-bar app color="#fff" elevation="0" class="topbar">
      <div class="d-flex align-center w-100 justify-space-between">
        <div class="d-flex align-center">
          <v-icon icon="mdi-menu" class="mr-2 d-md-none" />
          <span class="text-h6 font-weight-bold text-primary">Fleet Management System</span>
        </div>
        <div class="d-flex align-center">
          <v-btn icon variant="text"><v-icon>mdi-bell-outline</v-icon></v-btn>
          <v-btn icon variant="text"><v-icon>mdi-account-circle-outline</v-icon></v-btn>
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
const mainNav = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard-outline', to: '/' },
  { title: 'Fleet Overview', icon: 'mdi-car-multiple', to: '/vehicles' },
  { title: 'Live Tracking', icon: 'mdi-map-marker-radius-outline', to: '/tracking' },
  { title: 'Fuel Management', icon: 'mdi-fuel', to: '/fuel-management' },
  { title: 'Maintenance', icon: 'mdi-wrench-outline', to: '/maintenance' },
  { title: 'Reports', icon: 'mdi-file-chart-outline', to: '/reports' },
]
const managementNav = [
  { title: 'Alerts', icon: 'mdi-bell-alert-outline', to: '/alerts' },
  { title: 'Analytics', icon: 'mdi-chart-line', to: '/analytics' },
]
</script>

<style scoped>
.sidebar {
  border-right: 1px solid #f0f1f3;
  min-height: 100vh;
  box-shadow: 2px 0 8px 0 rgba(80, 80, 80, 0.04);
  background: var(--v-theme-sidebar-bg);
}
.sidebar-header {
  background: var(--v-theme-sidebar-bg);
  padding-top: 32px;
  padding-bottom: 24px;
}
.sidebar-footer {
  border-top: 1px solid #f0f1f3;
  margin-top: 24px;
}
.active-nav {
  background: var(--v-theme-active-nav-bg) !important;
  color: var(--v-theme-active-nav-text) !important;
  font-weight: 600;
  box-shadow: 0 2px 8px 0 rgba(255, 214, 0, 0.08);
}
.v-list-item {
  transition: background 0.2s, color 0.2s;
}
.v-list-item:hover {
  background: #f5f7fa !important;
  color: var(--v-theme-primary) !important;
}
.topbar {
  border-bottom: 1px solid #f0f1f3;
  background: #fff !important;
  box-shadow: 0 2px 8px 0 rgba(80, 80, 80, 0.04);
}
.main-bg {
  background: var(--v-theme-background);
  min-height: 100vh;
  border-radius: 18px;
  box-shadow: 0 2px 16px 0 rgba(80, 80, 80, 0.04);
}
</style> 