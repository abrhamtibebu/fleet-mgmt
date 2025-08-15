<template>
  <v-app>
    <!-- Modern Sidebar Navigation -->
    <client-only>
    <v-navigation-drawer 
      v-model="drawer" 
      app 
      :width="drawerWidth" 
      class="modern-sidebar" 
      :temporary="$vuetify.display.mdAndDown"
      :permanent="$vuetify.display.lgAndUp"
    >
      <!-- Elegant Header -->
      <div class="sidebar-header">
        <div class="brand-section" :class="{ 'brand-section-collapsed': collapsed }">
          <div class="brand-icon-wrapper">
            <img 
              src="/WS yellow logo-16.png" 
              alt="WebSprix Logo" 
              class="brand-logo"
              width="48" 
              height="48"
            />
          </div>
          <div v-show="!collapsed" class="brand-text-section">
            <div class="brand-title">WebSprix</div>
            <div class="brand-subtitle">Fleet Management</div>
          </div>
        </div>
      </div>

      <!-- Navigation Menu -->
      <div class="nav-menu">
        <div class="nav-section">
          <div v-show="!collapsed" class="nav-section-title">
            <span class="section-label">Main Navigation</span>
          </div>
          <div class="nav-items">
            <div 
              v-for="item in mainNav" 
              :key="item.title"
              class="nav-item"
              :class="{ 
                'nav-item-active': $route.path === item.to,
                'nav-item-collapsed': collapsed 
              }"
              @click="navigateTo(item.to)"
            >
              <div class="nav-item-icon">
                <v-icon :icon="item.icon" size="20"></v-icon>
              </div>
              <div v-show="!collapsed" class="nav-item-text">
                {{ item.title }}
              </div>
              <div v-show="!collapsed && $route.path === item.to" class="nav-item-indicator"></div>
            </div>
          </div>
        </div>

        <div class="nav-section">
          <div v-show="!collapsed" class="nav-section-title">
            <span class="section-label">Management</span>
          </div>
          <div class="nav-items">
            <div 
              v-for="item in managementNav" 
              :key="item.title"
              class="nav-item"
              :class="{ 
                'nav-item-active': $route.path === item.to,
                'nav-item-collapsed': collapsed 
              }"
              @click="navigateTo(item.to)"
            >
              <div class="nav-item-icon">
                <v-icon :icon="item.icon" size="20"></v-icon>
              </div>
              <div v-show="!collapsed" class="nav-item-text">
                {{ item.title }}
              </div>
              <div v-show="!collapsed && $route.path === item.to" class="nav-item-indicator"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="sidebar-footer">
        <div v-show="!collapsed" class="footer-info">
          <div class="version-text">v1.0.0</div>
          <!-- <div class="status-indicator">
            <div class="status-dot"></div>
            <span class="status-text">Online</span>
          </div> -->
        </div>
        <div class="collapse-control">
          <v-btn
            :icon="collapsed ? 'mdi-chevron-right' : 'mdi-chevron-left'" 
            variant="text"
            size="small"
            @click="toggleCollapse"
            class="collapse-btn"
            :class="{ 'rotated': !collapsed }"
          ></v-btn>
        </div>
      </div>
    </v-navigation-drawer>
    </client-only>

    <!-- Main Content -->
    <v-main>
      <!-- Modern Top App Bar with Header -->
      <v-app-bar 
        app 
        elevation="0" 
        color="white" 
        class="modern-top-app-bar"
        :class="{ 'app-bar-collapsed': collapsed }"
      >
        <!-- Header Content -->
        <div class="modern-dashboard-header">
          <div class="header-content">
            <div class="header-left">
              <div class="brand-section">
                <!-- <div class="brand-icon-small">
                  <img 
                    src="/WS yellow logo-16.png" 
                    alt="WebSprix Logo" 
                    class="brand-logo-small"
                    width="32" 
                    height="32"
                  />
                </div> -->
                <div class="title-section">
                  <h1 class="dashboard-title">WS Fleet Management</h1>
                  <p class="dashboard-subtitle">Real-time fleet insights & analytics</p>
                </div>
              </div>
            </div>
            
            <div class="header-center">
              <!-- Search Bar -->
          
            </div>

            <div class="header-right">
              <!-- Notifications -->
              <div class="notification-container">
                <v-btn
                  icon
                  variant="text"
                  class="notification-btn"
                  @click="showNotifications = !showNotifications"
                  :class="{ 'active': showNotifications }"
                >
                  <v-badge
                    :content="unreadNotifications"
                    :model-value="unreadNotifications > 0"
                    color="error"
                    dot
                  >
                    <v-icon>mdi-bell-outline</v-icon>
                  </v-badge>
                </v-btn>
                
                <!-- Notifications Dropdown -->
                <v-menu
                  v-model="showNotifications"
                  :close-on-content-click="false"
                  offset-y
                  location="top center" 

                  class="notification-menu"
                  :max-width="400"
                  :min-width="350"
                >
                  <v-card class="notification-card rounded ">
                    <!-- Pointer/Caret -->
                    <div class="notification-pointer"></div>
                    
                    <!-- Header -->
                    <!-- <div class="notification-header">
                      <div class="header-content">
                        <v-icon color="primary" class="header-icon">mdi-bell</v-icon>
                        <span class="header-title">Notifications</span>
                        <v-icon color="grey" class="header-icon-right">mdi-chat</v-icon>
                      </div>
                    </div> -->
                    <div class="notification-header">
      <div class="header-content">
        <v-icon color="primary" class="header-icon">mdi-bell</v-icon>
        <span class="header-title">Notifications</span>
        <v-icon color="grey" class="header-icon-right">mdi-chat</v-icon>
      </div>
    </div>
                    
                    <!-- Notifications List -->
                    <!-- <div class="notifications-list">
                      <div
                        v-for="notification in displayNotifications"
                        :key="notification.id"
                        :class="{ 'notification-item': true, 'notification-item-selected': notification.selected }"
                        @click="handleNotificationClick(notification)"
                      >
                        <div class="notification-avatar">
                          <img 
                            :src="notification.avatar || '/default-avatar.png'" 
                            :alt="notification.name"
                            class="avatar-image"
                          />
                        </div>
                        <div class="notification-content">
                          <div class="notification-name">{{ notification.name }}</div>
                          <div class="notification-message">{{ notification.message }}</div>
                        </div>
                        <div class="notification-time">{{ notification.time }}</div>
                      </div>
                       -->
                      <div class="notifications-list">
      <div
        v-for="notification in latestNotificationList"
        :key="notification.id"
        :class="{ 'notification-item': true, 'notification-item-selected': notification.selected }"
        @click="handleNotificationClick(notification)"
      >
        <div class="notification-avatar">
          <img 
            :src="notification.avatar || '/default-avatar.png'" 
            alt="notification"
            class="avatar-image"
          />
        </div>
        <div class="notification-content">
          <!-- Title in bold -->
          <div class="notification-name font-weight-bold">{{ notification.title }}</div>
          <!-- Description below -->
          <!-- <div class="notification-message">{{ notification.description }}</div> -->
        </div>
        <!-- Formatted time -->
        <div class="notification-time">{{ formatTime(notification.createdAt) }}</div>
      </div>
                      <!-- Empty State -->
                      <!-- <div v-if="displayNotifications.length === 0" class="empty-notifications">
                        <v-icon size="48" color="grey-lighten-1">mdi-bell-off</v-icon>
                        <div class="empty-text">No notifications</div>
                      </div>
                    </div> -->
                    <div v-if="latestNotificationList.length === 0" class="empty-notifications">
                   <v-icon size="48" color="grey-lighten-1">mdi-bell-off</v-icon>
                   <div class="empty-text">No notifications</div>
                   </div>
                   </div>
                    
                    <!-- Footer -->
                    <div class="notification-footer">
                      <a href="/alerts" class="footer-link">See all incoming activity</a>
                    </div>
                  </v-card>
                </v-menu>
              </div>

              <v-divider vertical class="mx-3 notification-divider"></v-divider>

              <!-- User Menu -->
              <v-menu offset-y location="bottom end">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    class="modern-user-btn"
                    variant="text"
                  >
                    <v-avatar size="36" color="primary" class="me-2 user-avatar">
                      <span class="white--text text-h6" style="text-transform: uppercase;">
                        {{ (currentUser?.first_name?.[0] || 'U').toUpperCase() }}
                      </span>
                    </v-avatar>
                    <div class="d-none d-sm-flex flex-column align-start me-2 user-info">
                      <span class="font-weight-medium user-name">
                        {{ currentUser?.first_name + ' ' + currentUser?.last_name|| 'User' }}
                      </span>
                      <span class="text-caption text-medium-emphasis user-role">
                        <!-- {{ currentUser?.role || 'Fleet Manager' }} -->
                      </span>
                    </div>
                    <v-icon size="20" class="text-medium-emphasis">mdi-chevron-down</v-icon>
                  </v-btn>
                </template>
                <v-card class="modern-user-menu" min-width="280">
                  <v-card-text class="pb-2 pt-4 d-flex flex-column align-center">
                    <v-avatar size="64" color="primary" class="mb-3 user-menu-avatar">
                      <span class="white--text text-h4" style="text-transform: uppercase;">
                        {{ (currentUser?.first_name?.[0] || 'U').toUpperCase() }}
                      </span>
                    </v-avatar>
                    <div class="font-weight-bold text-h6 mb-1 user-menu-name">
                      {{ currentUser?.first_name }} {{ currentUser?.last_name }}
                    </div>
                    <div class="text-caption text-medium-emphasis mb-3 user-menu-role">
                      {{ currentUser?.role || 'Staff' }}
                    </div>
                    <v-chip
                      color="success"
                      size="small"
                      variant="tonal"
                      prepend-icon="mdi-check-circle"
                    >
                      Online
                    </v-chip>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-list density="compact" class="py-0">
                    <!-- <v-list-item
                      @click="handleProfileClick"
                      prepend-icon="mdi-account"
                      title="Profile Settings"
                      subtitle="Manage your account"
                      class="modern-menu-item"
                    />
                    <v-list-item
                      @click="handlePreferences"
                      prepend-icon="mdi-cog"
                      title="Preferences"
                      subtitle="Customize your experience"
                      class="modern-menu-item"
                    />
                    <v-list-item
                      @click="handleHelp"
                      prepend-icon="mdi-help-circle"
                      title="Help & Support"
                      subtitle="Get assistance"
                      class="modern-menu-item"
                    /> -->
                    <v-divider class="my-2"></v-divider>
                    <v-list-item
                      @click="showLogoutPage = true"
                      prepend-icon="mdi-logout"
                      title="Sign Out"
                      subtitle="Logout from your account"
                      class="modern-menu-item logout-item"
                    />
                  </v-list>
                </v-card>
              </v-menu>
            </div>
          </div>
        </div>

        <!-- Logout Confirmation Dialog -->
        <v-dialog v-model="showLogoutPage" max-width="400" persistent>
          <v-card class="dialog-card">
            <v-card-title class="dialog-title">
              <span class="title-icon-badge"><v-icon size="20" color="warning">mdi-logout</v-icon></span>
              Confirm Logout
            </v-card-title>
            <v-card-text>
              Are you sure you want to log out?
            </v-card-text>
            <v-card-actions class="dialog-actions">
              <v-spacer></v-spacer>
              <v-btn variant="outlined" @click="showLogoutPage = false">Cancel</v-btn>
              <v-btn color="warning" @click="logout">Logout</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-app-bar>
      
      <v-container fluid class="main-bg pa-6">
        <NuxtPage />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
const {   latestNotificationList,getLatestNotification } = useNotification();


// Auth composables
const { logout } = useAuth()
const { currentUser } = useAuthState()

// Reactive drawer state
const drawer = ref(true)
const collapsed = ref(false)

// Logout dialog state
const showLogoutPage = ref(false)
const logoutLoading = ref(false)

// Search functionality
const { 
  searchQuery, 
  searchResults, 
  isSearching, 
  performSearch, 
  clearSearch, 
  getSearchSuggestions 
} = useSearch()

const showSearchResults = ref(false)

// Notifications
const { 
  notifications, 
  showNotifications, 
  unreadNotifications, 
  markAsRead, 
  markAllAsRead, 
  clearAllNotifications 
} = useNotifications()

// Debug notifications
console.log('Notifications loaded:', notifications.value)
console.log('Unread notifications:', unreadNotifications.value)

// Fallback notifications if composable fails
const fallbackNotifications = ref([
  {
    id: 1,
    name: 'Kate Youn',
    message: 'Lorem Ipsum / Contrary to popular belief, Lorem Ipsum is not simply random text.',
    avatar: '/default-avatar.png',
    time: '5 mins ago',
    selected: false
  },
  {
    id: 2,
    name: 'Brandon Newman',
    message: 'Lorem Ipsum',
    avatar: '/default-avatar.png',
    time: '12 mins ago',
    selected: false
  },
  {
    id: 3,
    name: 'Dave Wood',
    message: 'Lorem Ipsum',
    avatar: '/default-avatar.png',
    time: '1 hr ago',
    selected: true
  },
  {
    id: 4,
    name: 'Anne Lao',
    message: 'Lorem Ipsum / Contrary to popular belief, Lorem Ipsum is not simply random text.',
    avatar: '/default-avatar.png',
    time: '2 hr ago',
    selected: false
  },
  {
    id: 5,
    name: 'John Smith',
    message: 'Lorem Ipsum',
    avatar: '/default-avatar.png',
    time: '1 day ago',
    selected: false
  }
])

// Use fallback if notifications are empty
const displayNotifications = computed(() => {
  return notifications.value.length > 0 ? notifications.value : fallbackNotifications.value
})

// Computed drawer width
const drawerWidth = computed(() => {
  return collapsed.value ? 64 : 260
})

// Navigation items
const mainNav = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard-outline', to: '/' },
  { title: 'Fleet Overview', icon: 'mdi-car-multiple', to: '/vehicles' },
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
  logoutLoading.value = true
  try {
    await logout()
    showLogoutPage.value = false
  } catch (error) {
    console.error('Logout failed:', error)
  } finally {
    logoutLoading.value = false
  }
}

const handleProfileClick = () => {
  // Navigate to profile page or show profile dialog
  console.log('Profile clicked')
}

const handlePreferences = () => {
  console.log('Preferences clicked')
}

const handleHelp = () => {
  console.log('Help clicked')
}

// Search functionality
const handleSearch = async () => {
  if (searchQuery.value.trim()) {
    await performSearch(searchQuery.value)
    showSearchResults.value = true
  }
}

const handleSearchInput = async () => {
  if (searchQuery.value.length > 2) {
    await performSearch(searchQuery.value)
    showSearchResults.value = true
  } else {
    searchResults.value = []
    showSearchResults.value = false
  }
}

const handleSearchBlur = () => {
  setTimeout(() => {
    if (!searchQuery.value) {
      showSearchResults.value = false
    }
  }, 100)
}

const selectSuggestion = async (text: string) => {
  searchQuery.value = text
  await performSearch(text)
  showSearchResults.value = true
}

const handleSearchResultClick = (result: any) => {
  console.log('Clicked search result:', result)
  showSearchResults.value = false
  // Navigate to the specific item page based on result type
  switch (result.type) {
    case 'vehicle':
      // Navigate to vehicle details
      console.log('Navigate to vehicle:', result.vin)
      break
    case 'fuel-card':
      // Navigate to fuel card details
      console.log('Navigate to fuel card:', result.number)
      break
    case 'report':
      // Navigate to report details
      console.log('Navigate to report:', result.name)
      break
    case 'vendor':
      // Navigate to vendor details
      console.log('Navigate to vendor:', result.name)
      break
  }
}

const clearSearchResults = () => {
  clearSearch()
  showSearchResults.value = false
}
const handleNotificationClick = (notification: any) => {
  markAsRead(notification.id)

  if (notification.actionUrl) {
    navigateTo(notification.actionUrl)
  } else {
    navigateTo('/alerts')
  }

    showNotifications.value = false

}

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  return date.toLocaleString()
}

const handleNotificationClickk = (notification: any) => {
  // Mark as read first
  markAsRead(notification.id)
  
  // Navigate to the appropriate page based on notification actionUrl
  if (notification.actionUrl) {
    navigateTo(notification.actionUrl)
  } else {
    // Fallback navigation based on notification content
    if (notification.title.includes('Vehicle Maintenance')) {
      navigateTo('/maintenance')
    } else if (notification.title.includes('Fuel Card') || notification.title.includes('Low Fuel')) {
      navigateTo('/fuel')
    } else if (notification.title.includes('Report')) {
      navigateTo('/analytics-reports')
    } else {
      navigateTo('/alerts')
    }
  }
  
  // Close the notification dropdown
  showNotifications.value = false
}


// Initialize notifications on mount
onMounted(() => {
  // You can fetch notifications from API here
  console.log('Notifications initialized', currentUser)
    getLatestNotification()

})
</script>

<style scoped>
/* Modern Sidebar Styles */
.modern-sidebar {
  background: linear-gradient(180deg, #ffffff 0%, #fafbfc 100%);
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  min-height: 100vh;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.modern-sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(243, 215, 14, 0.3) 50%, transparent 100%);
}

/* Header Styles */
.sidebar-header {
  padding: 32px 24px 24px;
  background: linear-gradient(135deg, rgba(243, 215, 14, 0.05) 0%, rgba(251, 179, 57, 0.02) 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  position: relative;
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand-section-collapsed {
  justify-content: center;
  gap: 0;
}

.brand-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  /* box-shadow: 0 4px 16px rgba(255, 255, 255, 0.1); */
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.brand-icon-wrapper:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(243, 215, 14, 0.4);
}

.brand-logo {
  border-radius: 8px;
  object-fit: contain;
  transition: transform 0.3s ease;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
}

.brand-text-section {
  flex: 1;
}

.brand-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.2;
  margin-bottom: 2px;
}

.brand-subtitle {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* Navigation Menu Styles */
.nav-menu {
  padding: 24px 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-section-title {
  padding: 0 8px;
  margin-bottom: 8px;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
}

.section-label::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 50%;
  width: 3px;
  height: 3px;
  background: #f3d70e;
  border-radius: 50%;
  transform: translateY(-50%);
}

.nav-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  gap: 12px;
  color: #6b7280;
  font-weight: 500;
  font-size: 0.875rem;
}

.nav-item:hover {
  background: rgba(243, 215, 14, 0.08);
  color: #1a1a1a;
  transform: translateX(4px);
}

.nav-item-active {
  background: linear-gradient(135deg, #f3d70e 0%, #fbb339 100%);
  color: #1a1a1a !important;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(243, 215, 14, 0.25);
  transform: translateX(4px);
}

.nav-item-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 4px;
  height: 24px;
  background: #1a1a1a;
  border-radius: 0 2px 2px 0;
  transform: translateY(-50%);
}

.nav-item-collapsed {
  justify-content: center;
  padding: 12px;
  min-width: 48px;
}

.nav-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.nav-item-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-item-indicator {
  position: absolute;
  right: 8px;
  top: 50%;
  width: 6px;
  height: 6px;
  background: #1a1a1a;
  border-radius: 50%;
  transform: translateY(-50%);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Footer Styles */
.sidebar-footer {
  padding: 20px 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  background: rgba(248, 250, 252, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.footer-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.version-text {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 500;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-text {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.collapse-control {
  display: flex;
  align-items: center;
}

.collapse-btn {
  color: #6b7280;
  transition: all 0.3s ease;
  border-radius: 8px;
  padding: 8px;
}

.collapse-btn:hover {
  color: #f3d70e;
  background: rgba(243, 215, 14, 0.1);
  transform: scale(1.1);
}

.rotated {
  transform: rotate(180deg);
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .modern-sidebar {
    position: fixed;
    z-index: 1000;
  }
}

@media (max-width: 768px) {
  .sidebar-header {
    padding: 24px 16px 20px;
  }
  
  .nav-menu {
    padding: 20px 12px;
  }
  
  .nav-item {
    padding: 10px 12px;
  }
  
  .sidebar-footer {
    padding: 16px 12px;
  }
}

.main-bg {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
  border-radius: 18px;
  box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.08);
  transition: margin-left 0.3s ease;
  position: relative;
}

.main-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 80%, rgba(243, 215, 14, 0.03) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(251, 179, 57, 0.03) 0%, transparent 50%);
  pointer-events: none;
}

/* Modern Top App Bar Styles */
.modern-top-app-bar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px);
  transition: margin-left 0.3s ease;
  height: auto !important;
  min-height: 80px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  position: relative;
}

.modern-top-app-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(243, 215, 14, 0.2) 50%, transparent 100%);
}

.app-bar-collapsed {
  margin-left: 64px;
}

/* Modern Dashboard Header Styles */
.modern-dashboard-header {
  width: 100%;
  padding: 16px 24px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 24px;
}

.header-left {
  flex-shrink: 0;
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon-small {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f3d70e 0%, #fbb339 100%);
  box-shadow: 0 2px 8px rgba(243, 215, 14, 0.3);
}

.brand-logo-small {
  border-radius: 4px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.brand-logo-small:hover {
  transform: scale(1.1);
}

.title-section {
  display: flex;
  flex-direction: column;
}

.dashboard-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.2;
}

.dashboard-subtitle {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 2px 0 0 0;
  font-weight: 400;
}

.header-center {
  flex: 1;
  max-width: 500px;
}

.search-container {
  width: 100%;
}

/* Search Results Dropdown Styles */
.search-results-menu {
  margin-top: 8px;
}

.search-results-card {
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  max-height: 500px;
}

.suggestions-list {
  max-height: 200px;
  overflow-y: auto;
}

.suggestion-item {
  padding: 12px 16px;
  transition: all 0.2s ease;
  border-radius: 8px;
  margin: 4px 8px;
  cursor: pointer;
}

.suggestion-item:hover {
  background: rgba(243, 215, 14, 0.08);
  transform: translateX(4px);
}

.suggestion-text {
  font-weight: 500;
  color: #1a1a1a;
}

.search-results-list {
  max-height: 400px;
  overflow-y: auto;
}

.search-result-item {
  padding: 12px 16px;
  transition: all 0.2s ease;
  border-radius: 8px;
  margin: 4px 8px;
  cursor: pointer;
}

.search-result-item:hover {
  background: rgba(243, 215, 14, 0.08);
  transform: translateX(4px);
}

.result-avatar {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.result-title {
  font-weight: 600;
  font-size: 0.875rem;
  color: #1a1a1a;
  margin-bottom: 2px;
}

.result-subtitle {
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.3;
}

.result-type {
  font-weight: 500;
  color: #1976d2;
  text-transform: capitalize;
}

.result-category {
  font-weight: 500;
  color: #4b5563;
}

.result-vin {
  font-weight: 500;
  color: #007bff;
}

.result-number {
  font-weight: 500;
  color: #28a745;
}

.result-status {
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
}

/* Enhanced Search Field Styles */
.modern-search-field {
  border-radius: 12px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.modern-search-field:hover {
  background: #f1f3f4;
}

.modern-search-field:focus-within {
  background: white;
  box-shadow: 0 0 0 2px rgba(243, 215, 14, 0.3);
}

.search-clear-btn {
  color: #6b7280;
  transition: color 0.2s ease;
}

.search-clear-btn:hover {
  color: #dc3545;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.notification-container {
  position: relative;
  display: inline-block;
}

.notification-divider {
  height: 32px;
  opacity: 0.3;
}

/* .notification-menu {
  margin-top: 8px;
  z-index: 1000;
  position: absolute;
  right: 0;
  top: 100%;
} */
 .notification-menu {
  position: fixed !important;       
  top: 30 !important;                
  left: 80% !important;             
  transform: translateX(-50%) !important; 
  max-width: 400px;
  min-width: 350px;
  z-index: 3000;                    
  margin-top: 50 !important;         
}
/* Notification Card Styles */
.notification-card {
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  max-height: 500px;
  position: relative;
  background: white;
  margin-top: 70px;
}

/* Notification Pointer/Caret */
.notification-pointer {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid white;
  z-index: 1;
}

.notification-pointer::before {
  content: '';
  position: absolute;
  top: 1px;
  left: -8px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid rgba(0, 0, 0, 0.1);
  z-index: -1;
}

/* Notification Header */
.notification-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  background: white;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-icon {
  margin-right: 8px;
  font-size: 18px;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  flex: 1;
  text-align: center;
}

.header-icon-right {
  font-size: 16px;
  color: #9ca3af;
}

/* Notifications List */
.notifications-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.notification-item:hover {
  background-color: #f9fafb;
}

.notification-item-selected {
  background-color: #f3f4f6;
}

.notification-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  flex-shrink: 0;
  overflow: hidden;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-name {
  font-size: 14px;
  font-weight: 500;
  color: #3b82f6;
  margin-bottom: 4px;
  line-height: 1.2;
}

.notification-message {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
}

.notification-time {
  font-size: 12px;
  color: #9ca3af;
  white-space: nowrap;
  margin-left: 12px;
  flex-shrink: 0;
}

/* Empty State */
.empty-notifications {
  padding: 32px 20px;
  text-align: center;
  color: #9ca3af;
}

.empty-text {
  margin-top: 8px;
  font-size: 14px;
}

/* Notification Footer */
.notification-footer {
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
  text-align: center;
  background: white;
}

.footer-link {
  color: #3b82f6;
  text-decoration: underline;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.footer-link:hover {
  color: #2563eb;
}

/* Enhanced Notification Styles */
.notification-btn {
  position: relative;
  color: #6b7280;
  transition: all 0.2s ease;
  border-radius: 50%;
}

.notification-btn:hover {
  color: #1976d2;
  background: rgba(25, 118, 210, 0.08);
  transform: scale(1.05);
}

.notification-btn.active {
  color: #1976d2;
  background: rgba(25, 118, 210, 0.12);
}

.notification-menu {
  margin-top: 8px;
  z-index: 1000;
}

/* Ensure the menu appears directly below the bell icon */
.notification-container {
  position: relative;
}



/* Enhanced User Menu Styles */
.modern-user-btn {
  transition: all 0.2s ease;
  border-radius: 12px;
  padding: 8px 12px;
  position: relative;
}

.modern-user-btn:hover {
  background: rgba(243, 215, 14, 0.08);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.modern-user-btn:hover .user-avatar {
  transform: scale(1.05);
}

.user-info {
  text-align: left;
}

.user-name {
  font-size: 0.875rem;
  color: #1a1a1a;
  line-height: 1.2;
  font-weight: bolder;
}

.user-role {
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.2;
}

.modern-user-menu {
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

.user-menu-avatar {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  border: 3px solid white;
}

.user-menu-name {
  color: #1a1a1a;
}

.user-menu-role {
  color: #6b7280;
}

.modern-menu-item {
  padding: 12px 16px;
  transition: all 0.2s ease;
  border-radius: 8px;
  margin: 4px 8px;
  cursor: pointer;
}

.modern-menu-item:hover {
  background: rgba(243, 215, 14, 0.08);
  transform: translateX(4px);
}

.logout-item {
  color: #dc3545;
}

.logout-item:hover {
  background: rgba(220, 53, 69, 0.08) !important;
  color: #dc3545;
}

/* Enhanced Logout Dialog */
.modern-logout-dialog {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
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
  
  .search-results-card {
    min-width: 320px !important;
    max-width: 90vw;
  }
  
  .modern-user-menu {
    min-width: 280px !important;
    max-width: 90vw;
  }
  
  .notification-card {
    min-width: 320px !important;
    max-width: 90vw;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
  }
  
  .header-center {
    order: 3;
    width: 100%;
  }
  
  .header-right {
    order: 2;
    width: 100%;
    justify-content: space-between;
  }
  
  .dashboard-title {
    font-size: 1.125rem;
  }
  
  .dashboard-subtitle {
    font-size: 0.6875rem;
  }
}

@media (max-width: 480px) {
  .modern-dashboard-header {
    padding: 12px 16px;
  }
  
  .brand-section {
    gap: 8px;
  }
  
  .brand-icon-small {
    width: 32px;
    height: 32px;
  }
  
  .dashboard-title {
    font-size: 1rem;
  }
  
  .dashboard-subtitle {
    font-size: 0.625rem;
  }
  
  .search-results-card,
  .modern-user-menu,
  .notification-card {
    min-width: 280px !important;
    max-width: 95vw;
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