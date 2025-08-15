import { ref, computed } from 'vue'

export interface Notification {
  id: number
  title: string
  message: string
  type: 'alert' | 'warning' | 'info' | 'success'
  icon: string
  time: string
  read: boolean
  actionUrl?: string
  actionType?: 'maintenance' | 'fuel' | 'reports' | 'alerts' | 'vehicles'
}

export const useNotification = () => {
  const { $apiFetch } = useNuxtApp()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const notificationList = ref<Notification[]>([])
  const latestNotificationList = ref<Notification[]>([])

  const unreadNotifications = computed(() => {
    return notificationList.value.filter(n => !n.read).length
  })

  const showNotifications = ref(false)

  //  Fetch all notifications =====
  const getNotification = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await $apiFetch<{ result: Notification[] }>('/notification/all', {
        method: 'GET'
      })
      notificationList.value = Array.isArray(data.result) ? data.result : []
      return notificationList.value
    } catch (e) {
      error.value = 'Failed to fetch notifications'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  //  Fetch latest notifications =====
  const getLatestNotification = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await $apiFetch<{ result: Notification[] }>('/notification/latest', {
        method: 'GET'
      })
      latestNotificationList.value = Array.isArray(data.result) ? data.result : []
      return latestNotificationList.value
    } catch (e) {
      error.value = 'Failed to fetch latest notifications'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  //  Mark a single notification as read =====
  const markAsRead = async (notificationId: number) => {
    try {
      await $apiFetch(`/notification/${notificationId}/read`, { method: 'POST' })
      await getNotification()
      await getLatestNotification()
    } catch (e) {
      console.error('Failed to mark notification as read', e)
    }
  }

  //  Mark all notifications as read =====
  const markAllAsRead = async () => {
    try {
      await $apiFetch('/notification/mark-all-read', { method: 'POST' })
      await getNotification()
      await getLatestNotification()
    } catch (e) {
      console.error('Failed to mark all notifications as read', e)
    }
  }

  //  Add notification =====
  const addNotification = async (notification: Omit<Notification, 'id' | 'read'>) => {
    try {
      await $apiFetch('/notification', {
        method: 'POST',
        body: notification
      })
      await getNotification()
      await getLatestNotification()
    } catch (e) {
      console.error('Failed to add notification', e)
    }
  }

  //  Remove notification =====
  const removeNotification = async (notificationId: number) => {
    try {
      await $apiFetch(`/notification/${notificationId}`, { method: 'DELETE' })
      await getNotification()
      await getLatestNotification()
    } catch (e) {
      console.error('Failed to remove notification', e)
    }
  }

  // Clear all notifications =====
  const clearAllNotifications = async () => {
    try {
      await $apiFetch('/notification/clear', { method: 'DELETE' })
      await getNotification()
      await getLatestNotification()
    } catch (e) {
      console.error('Failed to clear notifications', e)
    }
  }

  return {
    loading,
    error,
    notificationList,
    latestNotificationList,
    unreadNotifications,
    showNotifications,
    getNotification,
    getLatestNotification,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    clearAllNotifications
  }
}
