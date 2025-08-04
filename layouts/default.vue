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
          <img 
            src="/WS yellow logo-16.png" 
            alt="WebSprix Logo" 
            class="brand-logo"
            width="55" 
            height="55"
          />
        </div>
        <div v-show="!collapsed" class="brand-text">
          <div class="text-h6 font-weight-bold text-primary">WebSprix</div>
          <div class="text-caption text-medium-emphasis">Fleet Management System</div>
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
        <div class="d-flex align-center justify-space-between pa-4 sidebar-footer-row">
          <div v-show="!collapsed" class="text-caption text-medium-emphasis sidebar-footer">
            <div>Fleet Management v1.0</div>
          </div>
          <v-btn
            :icon="collapsed ? 'mdi-chevron-right' : 'mdi-chevron-left'" 
            variant="elevated"
            color="primary"
            size="small"
            @click="toggleCollapse"
            class="collapse-btn fancy-collapse-btn ml-2"
            :class="{ 'rotated': !collapsed }"
            elevation="8"
            style="border-radius: 50%; box-shadow: 0 2px 8px rgba(243, 215, 14, 0.25); transition: background 0.3s, box-shadow 0.3s;"
          ></v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    </client-only>



    <!-- Main Content -->
    <v-main>
      <!-- Top App Bar -->
      <v-app-bar 
        app 
        elevation="0" 
        color="white" 
        class="top-app-bar"
        :class="{ 'app-bar-collapsed': collapsed }"
      >

        
        <v-spacer></v-spacer>
        
        <!-- User Menu -->
        <!-- <div class="user-menu">
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                variant="text"
                class="user-menu-btn"
                prepend-icon="mdi-account-circle"
              >
                <span class="user-name">{{ currentUser?.first_name || 'User' }}</span>
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            
            <v-list class="user-menu-list">
              <v-list-item>
                <v-list-item-title class="text-subtitle-2">
                  {{ currentUser?.first_name }} {{ currentUser?.last_name }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  {{ currentUser?.role || 'User' }}
                </v-list-item-subtitle>
              </v-list-item>
              
              <v-divider></v-divider>
              
                            <v-list-item @click="showLogoutDialog = true" prepend-icon="mdi-logout">
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div> -->
      </v-app-bar>
      
      <!-- Logout Confirmation Dialog -->
      <!-- <v-dialog v-model="showLogoutDialog" max-width="400">
        <v-card class="logout-dialog">
          <v-card-title class="text-h6 d-flex align-center">
            <v-icon color="warning" class="me-3">mdi-logout</v-icon>
            Confirm Logout
          </v-card-title>
          <v-card-text>
            Are you sure you want to logout from the Fleet Management System?
          </v-card-text>
          <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <v-btn 
              variant="text" 
              @click="showLogoutDialog = false"
            >
              Cancel
            </v-btn>
            <v-btn 
              color="error" 
              variant="elevated"
              prepend-icon="mdi-logout"
              @click="confirmLogout"
              :loading="logoutLoading"
            >
              Logout
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog> -->
      
      <v-container fluid class="main-bg pa-6">
        <NuxtPage />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Auth composables
const { logout } = useAuth()
const { currentUser } = useAuthState()

// Reactive drawer state
const drawer = ref(true)
const collapsed = ref(false)

// Logout dialog state
const showLogoutDialog = ref(false)
const logoutLoading = ref(false)

// Computed drawer width
const drawerWidth = computed(() => {
  return collapsed.value ? 64 : 260
})

// Navigation items
const mainNav = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard-outline', to: '/' },
  { title: 'Fleet Overview', icon: 'mdi-car-multiple', to: '/vehicles' },
  // { title: 'Live Tracking', icon: 'mdi-map-marker-radius-outline', to: '/tracking' },
  { title: 'Fuel Management', icon: 'mdi-fuel', to: '/fuel' },
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

const handleLogout = async () => {
  try {
    await logout()
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

const confirmLogout = async () => {
  logoutLoading.value = true
  try {
    await logout()
    showLogoutDialog.value = false
  } catch (error) {
    console.error('Logout failed:', error)
  } finally {
    logoutLoading.value = false
  }
}
</script>

<style scoped>
.sidebar {
  border-right: 1px solid #e9ecef;
  min-height: 100vh;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  background: white;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-header {
  background: white;
  padding: 24px 16px;
  transition: all 0.3s ease;
}

.brand-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  /* background: linear-gradient(135deg, #f3d70e 0%, #fbb339 100%); */
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
  transition: all 0.3s ease;
  color: #6b7280;
}

.collapse-btn:hover {
  transform: scale(1.1);
  color: #1976d2;
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

/* Top App Bar Styles */
.top-app-bar {
  border-bottom: 1px solid #e9ecef;
  background: white !important;
  transition: margin-left 0.3s ease;
}

.app-bar-collapsed {
  margin-left: 64px;
}

.user-menu {
  display: flex;
  align-items: center;
}

.user-menu-btn {
  text-transform: none;
  font-weight: 500;
  color: #495057;
}

.user-name {
  margin-right: 8px;
  font-weight: 500;
}

.user-menu-list {
  min-width: 200px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.logout-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.logout-dialog .v-card-title {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  color: #856404;
  border-bottom: 1px solid #ffeaa7;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .sidebar {
    position: fixed;
    z-index: 1000;
  }
  
  .app-bar-collapsed {
    margin-left: 0;
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
  
  .user-name {
    display: none;
  }
}

/* Brand Logo Styles */
.brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.brand-logo {
  border-radius: 0;
  object-fit: contain;
  transition: transform 0.3s ease;
  background: transparent;
}

.brand-logo:hover {
  transform: scale(1.1);
}
</style> 