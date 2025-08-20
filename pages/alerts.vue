<template>
  <div class="alerts-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">
            <v-icon class="title-icon">mdi-bell-ring</v-icon>
            Alerts & Notifications
          </h1>
          <p class="page-subtitle">Manage and monitor all system alerts and notifications</p>
        </div>
      </div>
    </div>

    <!-- Filters and Controls -->
    <div class="filters-section">
      <v-card class="filters-card">
        <div class="filters-content">
          <div class="filters-left">
            <v-select
              v-model="selectedType"
              :items="typeOptions"
              label="Filter by Type"
              variant="outlined"
              density="compact"
              hide-details
              class="filter-select"
              prepend-icon="mdi-filter"
            ></v-select>
            <v-select
              v-model="selectedStatus"
              :items="statusOptions"
              label="Filter by Status"
              variant="outlined"
              density="compact"
              hide-details
              class="filter-select"
              prepend-icon="mdi-eye"
            ></v-select>
          </div>
          <div class="filters-right">
            <v-text-field
              v-model="searchQuery"
              label="Search notifications"
              variant="outlined"
              density="compact"
              hide-details
              prepend-icon="mdi-magnify"
              clearable
              class="search-field"
            ></v-text-field>
            <v-btn
              color="primary"
              variant="outlined"
              @click="refreshNotifications"
              :loading="loading"
              prepend-icon="mdi-refresh"
            >
              Refresh
            </v-btn>
          </div>
        </div>
      </v-card>
    </div>

    <!-- Notifications List -->
    <div class="notifications-section">
      <v-card class="notifications-card">
        <div class="card-header">
          <h3 class="card-title">
            <v-icon class="title-icon">mdi-format-list-bulleted</v-icon>
            All Notifications
          </h3>
          <div class="card-actions">
            <v-chip
              :color="selectedStatus === 'all' ? 'primary' : 'default'"
              variant="outlined"
              @click="selectedStatus = 'all'"
            >
              All ({{ notificationList.length }})
            </v-chip>
            <v-chip
              :color="selectedStatus === 'unread' ? 'primary' : 'default'"
              variant="outlined"
              @click="selectedStatus = 'unread'"
            >
              Unread ({{ unreadNotifications }})
            </v-chip>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <v-progress-circular
            indeterminate
            color="primary"
            size="48"
          ></v-progress-circular>
          <p class="loading-text">Loading notifications...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredNotifications.length === 0" class="empty-state">
          <v-icon size="64" color="grey-lighten-1" class="empty-icon">mdi-bell-off</v-icon>
          <h3 class="empty-title">No notifications found</h3>
          <p class="empty-subtitle">
            {{ searchQuery ? 'Try adjusting your search criteria' : 'You\'re all caught up!' }}
          </p>
        </div>

        <!-- Notifications List -->
        <div v-else class="notifications-list">
          <div
            v-for="notification in filteredNotifications"
            :key="notification.id"
            class="notification-item"
            :class="{
              'notification-unread': !notification.read,
              'notification-read': notification.read
            }"
          >
            <div class="notification-icon">
              <v-icon
                :color="getTypeColor(notification.type)"
                :icon="notification.icon"
                size="24"
              ></v-icon>
            </div>
            
            <div class="notification-content">
              <div class="notification-header">
                <h4 class="notification-title">{{ notification.title }}</h4>
                <div class="notification-meta">
                  <v-chip
                    :color="getTypeColor(notification.type)"
                    size="x-small"
                    variant="outlined"
                    class="type-chip"
                  >
                    {{ notification.type }}
                  </v-chip>
                  <span class="notification-time">{{ notification.time }}</span>
                </div>
              </div>
              
              <p class="notification-message">{{ notification.message }}</p>
              
              <div class="notification-actions">
                <v-btn
                  v-if="!notification.read"
                  size="small"
                  color="primary"
                  variant="outlined"
                  @click="markAsRead(notification.id)"
                  prepend-icon="mdi-check"
                >
                  Mark as Read
                </v-btn>
                
                <v-btn
                  v-if="notification.actionUrl"
                  size="small"
                  color="primary"
                  @click="handleNotificationAction(notification)"
                  prepend-icon="mdi-arrow-right"
                >
                  Take Action
                </v-btn>
                
                <v-btn
                  size="small"
                  color="error"
                  variant="outlined"
                  @click="removeNotification(notification.id)"
                  prepend-icon="mdi-delete"
                >
                  Delete
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </div>



    <!-- Success Snackbar -->
    <v-snackbar v-model="showSuccessSnackbar" color="success" timeout="3000">
      {{ successMessage }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="showSuccessSnackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Notification composable
const {
  getNotification,
  getLatestNotification,
  notificationList,
  latestNotificationList,
  unreadNotifications,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  loading,
  error
} = useNotification()

// Reactive state
const searchQuery = ref('')
const selectedType = ref('all')
const selectedStatus = ref('all')
const showSuccessSnackbar = ref(false)
const successMessage = ref('')

// Filter options
const typeOptions = [
  { title: 'All Types', value: 'all' },
  { title: 'Alerts', value: 'alert' },
  { title: 'Warnings', value: 'warning' },
  { title: 'Info', value: 'info' },
  { title: 'Success', value: 'success' }
]

const statusOptions = [
  { title: 'All Status', value: 'all' },
  { title: 'Unread', value: 'unread' },
  { title: 'Read', value: 'read' }
]

// Computed properties
const filteredNotifications = computed(() => {
  let filtered = notificationList.value

  // Filter by type
  if (selectedType.value !== 'all') {
    filtered = filtered.filter(n => n.type === selectedType.value)
  }

  // Filter by status
  if (selectedStatus.value === 'unread') {
    filtered = filtered.filter(n => !n.read)
  } else if (selectedStatus.value === 'read') {
    filtered = filtered.filter(n => n.read)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(n => 
      n.title.toLowerCase().includes(query) ||
      n.message.toLowerCase().includes(query)
    )
  }

  return filtered
})



// Methods
const getTypeColor = (type: string) => {
  const colorMap = {
    alert: 'error',
    warning: 'warning',
    info: 'info',
    success: 'success'
  }
  return colorMap[type] || 'grey'
}

const handleNotificationAction = (notification: any) => {
  markAsRead(notification.id)
  if (notification.actionUrl) {
    navigateTo(notification.actionUrl)
  }
}

const refreshNotifications = async () => {
  try {
    await getNotification()
    await getLatestNotification()
    showSuccessMessage('Notifications refreshed successfully')
  } catch (error) {
    console.error('Failed to refresh notifications:', error)
  }
}



const showSuccessMessage = (message: string) => {
  successMessage.value = message
  showSuccessSnackbar.value = true
}

const loadNotifications = async () => {
  try {
    await getNotification()
    await getLatestNotification()
  } catch (error) {
    console.error('Failed to load notifications:', error)
  }
}

onMounted(() => {
  loadNotifications()
})
</script>

<style scoped>
.alerts-page {
  padding: 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
}

.page-header {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.header-left {
  flex: 1;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.title-icon {
  color: #f3d70e;
}

.page-subtitle {
  font-size: 16px;
  color: #6c757d;
  margin: 0;
}



.filters-section {
  margin-bottom: 24px;
}

.filters-card {
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.filters-content {
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.filters-left {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.filters-right {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-select {
  min-width: 160px;
}

.search-field {
  min-width: 240px;
}

.notifications-section {
  margin-bottom: 32px;
}

.notifications-card {
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-header {
  padding: 24px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.card-actions {
  display: flex;
  gap: 12px;
}

.loading-state {
  padding: 48px;
  text-align: center;
}

.loading-text {
  margin-top: 16px;
  color: #6c757d;
  font-size: 16px;
}

.empty-state {
  padding: 48px;
  text-align: center;
}

.empty-icon {
  margin-bottom: 16px;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.empty-subtitle {
  color: #6c757d;
  margin: 0;
}

.notifications-list {
  max-height: 600px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.notification-item:hover {
  background: #f8f9fa;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-unread {
  background: rgba(243, 215, 14, 0.05);
  border-left: 4px solid #f3d70e;
}

.notification-read {
  opacity: 0.8;
}

.notification-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(243, 215, 14, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 16px;
}

.notification-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  flex: 1;
}

.notification-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.type-chip {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.notification-time {
  font-size: 12px;
  color: #6c757d;
  white-space: nowrap;
}

.notification-message {
  color: #6c757d;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.notification-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .alerts-page {
    padding: 16px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
  }
  
  .filters-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filters-left,
  .filters-right {
    justify-content: stretch;
  }
  
  .filter-select,
  .search-field {
    min-width: auto;
    flex: 1;
  }
  
  .card-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .card-actions {
    justify-content: center;
  }
  
  .notification-header {
    flex-direction: column;
    gap: 8px;
  }
  
  .notification-meta {
    align-self: flex-start;
  }
  
  .notification-actions {
    justify-content: stretch;
  }
  
  .notification-actions .v-btn {
    flex: 1;
  }
}
</style>
