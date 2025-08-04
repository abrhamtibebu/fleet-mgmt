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

export const useNotifications = () => {
  const notifications = ref<Notification[]>([
    {
      id: 1,
      title: 'Vehicle Maintenance Due',
      message: 'Vehicle VIN-1234 requires scheduled maintenance',
      type: 'alert',
      icon: 'mdi-wrench',
      time: '2 min ago',
      read: false,
      actionUrl: '/maintenance',
      actionType: 'maintenance'
    },
    {
      id: 2,
      title: 'Fuel Card Expiring',
      message: 'Fuel card FC-5678 expires in 7 days',
      type: 'warning',
      icon: 'mdi-fuel',
      time: '1 hour ago',
      read: false,
      actionUrl: '/fuel',
      actionType: 'fuel'
    },
    {
      id: 3,
      title: 'New Report Available',
      message: 'Monthly fleet efficiency report is ready',
      type: 'info',
      icon: 'mdi-chart-box',
      time: '3 hours ago',
      read: true,
      actionUrl: '/analytics-reports',
      actionType: 'reports'
    },
    {
      id: 4,
      title: 'System Update',
      message: 'Fleet management system updated to v2.1',
      type: 'info',
      icon: 'mdi-update',
      time: '1 day ago',
      read: true,
      actionUrl: '/alerts',
      actionType: 'alerts'
    },
    {
      id: 5,
      title: 'Low Fuel Alert',
      message: 'Vehicle VIN-9012 fuel level below 20%',
      type: 'warning',
      icon: 'mdi-gas-station',
      time: '4 hours ago',
      read: false,
      actionUrl: '/fuel',
      actionType: 'fuel'
    }
  ])

  const showNotifications = ref(false)

  const unreadNotifications = computed(() => {
    return notifications.value.filter(n => !n.read).length
  })

  const markAsRead = (notificationId: number) => {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
    }
  }

  const markAllAsRead = () => {
    notifications.value.forEach(notification => {
      notification.read = true
    })
  }

  const addNotification = (notification: Omit<Notification, 'id' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      read: false
    }
    notifications.value.unshift(newNotification)
  }

  const removeNotification = (notificationId: number) => {
    const index = notifications.value.findIndex(n => n.id === notificationId)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearAllNotifications = () => {
    notifications.value = []
  }

  return {
    notifications,
    showNotifications,
    unreadNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    clearAllNotifications
  }
} 