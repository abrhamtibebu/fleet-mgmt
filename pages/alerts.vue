<template>
  <div class="vendor-management-root">
    <!-- All Notifications -->
    <v-card class="pa-4 mt-4">
      <h3>All Notifications ({{ unreadNotifications }} unread)</h3>
      <!-- <v-btn small color="primary" @click="markAllAsRead">Mark All as Read</v-btn> -->
      <!-- <v-btn small color="error" @click="clearAllNotifications">Clear All</v-btn>  -->
      <v-list>
        <v-list-item
          v-for="n in notificationList"
          :key="n.id"
        >
          <v-list-item-title>
            {{ n.title }}
            <!-- <span v-if="!n.read" style="color: red">(unread)</span> -->
          </v-list-item-title>
          <v-list-item-subtitle>{{ n.description }}</v-list-item-subtitle>
          <!-- <v-btn size="x-small" color="success" @click="markAsRead(n.id)">Read</v-btn> -->
          <!-- <v-btn size="x-small" color="error" @click="removeNotification(n.id)">Delete</v-btn> -->
        </v-list-item>
      </v-list>
    </v-card>

    <!-- Latest Notifications -->
    <v-card class="pa-4 mt-4">
      <h3>Latest Notifications</h3>
      <v-list>
        <v-list-item
          v-for="n in latestNotificationList"
          :key="n.id"
        >
          <v-list-item-title>{{ n.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ n.description }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
// import { useNotification } from '~/repositories/useNotification'

const {
  getNotification,
  getLatestNotification,
  notificationList,
  latestNotificationList,
  unreadNotifications,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications
} = useNotification()

const loadNotifications = async () => {
  await getNotification()
  await getLatestNotification()
}

onMounted(() => {
  loadNotifications()
})
</script>
