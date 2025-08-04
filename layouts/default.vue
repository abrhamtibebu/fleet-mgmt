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
              <div class="search-container">
                <v-text-field
                  v-model="searchQuery"
                  placeholder="Search vehicles, fuel cards, reports..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="modern-search-field"
                  @keyup.enter="handleSearch"
                  @click:prepend-inner="handleSearch"
                  @input="handleSearchInput"
                  @focus="showSearchResults = true"
                  @blur="handleSearchBlur"
                >
                  <template #append-inner>
                    <v-btn
                      v-if="searchQuery"
                      icon="mdi-close"
                      variant="text"
                      size="small"
                      @click="clearSearch"
                      class="search-clear-btn"
                    ></v-btn>
                  </template>
                </v-text-field>
                
                <!-- Search Results Dropdown -->
                <v-menu
                  v-model="showSearchResults"
                  :close-on-content-click="false"
                  offset-y
                  location="bottom start"
                  class="search-results-menu"
                  :max-width="500"
                >
                  <v-card class="search-results-card">
                    <!-- Search Suggestions -->
                    <div v-if="searchQuery && !isSearching && searchResults.length === 0" class="pa-4">
                      <div class="text-subtitle-2 font-weight-bold mb-3">Suggestions</div>
                      <v-list density="compact" class="suggestions-list">
                        <v-list-item
                          v-for="suggestion in getSearchSuggestions"
                          :key="suggestion.text"
                          @click="selectSuggestion(suggestion.text)"
                          class="suggestion-item"
                        >
                          <template #prepend>
                            <v-icon :icon="suggestion.icon" size="16" color="grey"></v-icon>
                          </template>
                          <v-list-item-title class="suggestion-text">
                            {{ suggestion.text }}
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </div>
                    
                    <!-- Search Results -->
                    <div v-if="searchResults.length > 0" class="pa-4">
                      <div class="d-flex align-center justify-space-between mb-3">
                        <div class="text-subtitle-2 font-weight-bold">
                          Search Results ({{ searchResults.length }})
                        </div>
                        <v-btn
                          variant="text"
                          size="small"
                          @click="clearSearchResults"
                          class="text-caption"
                        >
                          Clear
                        </v-btn>
                      </div>
                      <v-list density="compact" class="search-results-list">
                        <v-list-item
                          v-for="result in searchResults"
                          :key="`${result.type}-${result.id}`"
                          @click="handleSearchResultClick(result)"
                          class="search-result-item"
                        >
                          <template #prepend>
                            <v-avatar
                              :color="result.color"
                              size="32"
                              class="result-avatar"
                            >
                              <v-icon size="16" color="white">
                                {{ result.icon }}
                              </v-icon>
                            </v-avatar>
                          </template>
                          <v-list-item-title class="result-title">
                            {{ result.name }}
                          </v-list-item-title>
                          <v-list-item-subtitle class="result-subtitle">
                            <span class="result-type">{{ result.type }}</span>
                            <span v-if="result.category" class="result-category"> • {{ result.category }}</span>
                            <span v-if="result.vin" class="result-vin"> • {{ result.vin }}</span>
                            <span v-if="result.number" class="result-number"> • {{ result.number }}</span>
                          </v-list-item-subtitle>
                          <template #append>
                            <v-chip
                              :color="result.color"
                              size="small"
                              variant="tonal"
                              class="result-status"
                            >
                              {{ result.status }}
                            </v-chip>
                          </template>
                        </v-list-item>
                      </v-list>
                    </div>
                    
                    <!-- Loading State -->
                    <div v-if="isSearching" class="pa-8 text-center">
                      <v-progress-circular
                        indeterminate
                        color="primary"
                        size="32"
                      ></v-progress-circular>
                      <div class="mt-3 text-caption text-medium-emphasis">Searching...</div>
                    </div>
                    
                    <!-- No Results -->
                    <div v-if="searchQuery && !isSearching && searchResults.length === 0 && getSearchSuggestions.length === 0" class="pa-8 text-center">
                      <v-icon size="48" color="grey-lighten-1">mdi-magnify</v-icon>
                      <div class="mt-3 text-grey">No results found for "{{ searchQuery }}"</div>
                      <div class="text-caption text-medium-emphasis">Try different keywords</div>
                    </div>
                  </v-card>
                </v-menu>
              </div>
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
                  location="bottom end"
                  class="notification-menu"
                  :max-width="450"
                  :min-width="400"
                >
                  <v-card class="notification-card">
                    <v-card-title class="d-flex align-center justify-space-between pa-4">
                      <div class="d-flex align-center">
                        <v-icon color="primary" class="me-2">mdi-bell</v-icon>
                        <span class="text-h6 font-weight-bold">Notifications</span>
                        <v-chip
                          v-if="unreadNotifications > 0"
                          color="error"
                          size="small"
                          class="ml-2"
                        >
                          {{ unreadNotifications }}
                        </v-chip>
                      </div>
                      <v-btn
                        v-if="unreadNotifications > 0"
                        variant="text"
                        size="small"
                        @click="markAllAsRead"
                        class="text-caption"
                        prepend-icon="mdi-check-all"
                      >
                        Mark all as read
                      </v-btn>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-list class="notification-list">
                      <v-list-item
                        v-for="notification in displayNotifications"
                        :key="notification.id"
                        :class="{ 'unread': !notification.read }"
                        @click="handleNotificationClick(notification)"
                        class="notification-item"
                      >
                        <template #prepend>
                          <v-avatar
                            :color="notification.type === 'alert' ? 'error' : notification.type === 'info' ? 'info' : notification.type === 'success' ? 'success' : 'warning'"
                            size="40"
                            class="notification-avatar"
                          >
                            <v-icon size="18" color="white">
                              {{ notification.icon }}
                            </v-icon>
                          </v-avatar>
                        </template>
                        <v-list-item-title class="notification-title">
                          {{ notification.title }}
                        </v-list-item-title>
                        <v-list-item-subtitle class="notification-subtitle">
                          {{ notification.message }}
                        </v-list-item-subtitle>
                        <template #append>
                          <div class="d-flex flex-column align-end">
                            <span class="notification-time">{{ notification.time }}</span>
                            <v-chip
                              v-if="!notification.read"
                              color="primary"
                              size="x-small"
                              variant="tonal"
                              class="mt-1"
                            >
                              New
                            </v-chip>
                          </div>
                        </template>
                      </v-list-item>
                      <v-list-item v-if="displayNotifications.length === 0" class="text-center py-8">
                        <v-icon size="48" color="grey-lighten-1">mdi-bell-off</v-icon>
                        <div class="text-grey mt-2">No notifications</div>
                        <div class="text-caption text-medium-emphasis">You're all caught up!</div>
                      </v-list-item>
                    </v-list>
                    <v-divider v-if="displayNotifications.length > 0"></v-divider>
                    <v-card-actions v-if="displayNotifications.length > 0" class="pa-3">
                      <v-btn
                        variant="text"
                        size="small"
                        @click="showNotifications = false"
                        class="text-caption"
                      >
                        Close
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn
                        variant="text"
                        size="small"
                        @click="clearAllNotifications"
                        class="text-caption text-error"
                        prepend-icon="mdi-delete"
                      >
                        Clear all
                      </v-btn>
                    </v-card-actions>
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
          <v-card class="modern-logout-dialog">
            <v-card-title class="d-flex align-center justify-center mb-4">
              <v-avatar color="error" size="48" class="me-3">
                <v-icon size="24" color="white">mdi-logout</v-icon>
              </v-avatar>
              <span class="text-h5 font-weight-bold">Sign Out</span>
            </v-card-title>
            <v-card-text class="text-center mb-6">
              <p class="text-body-1 mb-2">Are you sure you want to log out of your account?</p>
              <p class="text-caption text-medium-emphasis">You'll need to sign in again to access the dashboard.</p>
            </v-card-text>
            <v-card-actions class="justify-center pb-6">
              <v-btn
                variant="outlined"
                color="primary"
                @click="showLogoutPage = false"
                class="px-6"
              >
                Cancel
              </v-btn>
              <v-btn
                color="error"
                variant="elevated"
                prepend-icon="mdi-logout"
                @click="handleLogout"
                class="px-6"
                :loading="logoutLoading"
              >
                Sign Out
              </v-btn>
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
    title: 'Test Notification',
    message: 'This is a test notification to ensure the dropdown works',
    type: 'info',
    icon: 'mdi-bell',
    time: 'Just now',
    read: false,
    actionUrl: '/alerts',
    actionType: 'alerts'
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
})
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

/* Modern Top App Bar Styles */
.modern-top-app-bar {
  border-bottom: 1px solid #e9ecef;
  background: white !important;
  transition: margin-left 0.3s ease;
  height: auto !important;
  min-height: 80px;
  backdrop-filter: blur(10px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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

.notification-menu {
  margin-top: 8px;
  z-index: 1000;
  position: absolute;
  right: 0;
  top: 100%;
}

.notification-card {
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  max-height: 500px;
  position: relative;
}

.notification-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  padding: 16px;
  transition: all 0.2s ease;
  border-radius: 8px;
  margin: 4px 8px;
  cursor: pointer;
  position: relative;
}

.notification-item:hover {
  background: rgba(243, 215, 14, 0.08);
  transform: translateX(4px);
}

.notification-item.unread {
  background: rgba(25, 118, 210, 0.05);
  border-left: 3px solid #1976d2;
  position: relative;
}

.notification-item.unread::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -2px;
  width: 6px;
  height: 6px;
  background: #1976d2;
  border-radius: 50%;
  transform: translateY(-50%);
}

.notification-avatar {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.notification-title {
  font-weight: 600;
  font-size: 0.875rem;
  color: #1a1a1a;
  margin-bottom: 4px;
  line-height: 1.3;
}

.notification-subtitle {
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.4;
  margin-bottom: 4px;
}

.notification-time {
  font-size: 0.75rem;
  color: #9ca3af;
  white-space: nowrap;
  font-weight: 500;
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

.notification-card {
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  max-height: 500px;
}

.notification-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  padding: 16px;
  transition: all 0.2s ease;
  border-radius: 8px;
  margin: 4px 8px;
  cursor: pointer;
  position: relative;
}

.notification-item:hover {
  background: rgba(243, 215, 14, 0.08);
  transform: translateX(4px);
}

.notification-item.unread {
  background: rgba(25, 118, 210, 0.05);
  border-left: 3px solid #1976d2;
  position: relative;
}

.notification-item.unread::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -2px;
  width: 6px;
  height: 6px;
  background: #1976d2;
  border-radius: 50%;
  transform: translateY(-50%);
}

.notification-avatar {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.notification-title {
  font-weight: 600;
  font-size: 0.875rem;
  color: #1a1a1a;
  margin-bottom: 4px;
  line-height: 1.3;
}

.notification-subtitle {
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.4;
  margin-bottom: 4px;
}

.notification-time {
  font-size: 0.75rem;
  color: #9ca3af;
  white-space: nowrap;
  font-weight: 500;
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