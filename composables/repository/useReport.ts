// composables/useReport.ts
import { ref } from 'vue'

interface DashboardReport {
  serviceDue: number
  openNotifications: number
  fuelTrends: Array<{ ym: string; total: number }>
  vehicleStatus: Array<{ status: number; total: number }>
  costBreakdown: { fuel: number; maintenance: number; other: number }
  vehiclePerformance: Array<{
    vehicleId: number
    avg_km_per_l: number
    vehicleData: {
      plateNo: string
      fuelEfficiency: number
    }
  }>
}

export const useReport = () => {
  const { $apiFetch } = useNuxtApp();
  const dashboardReport = ref<DashboardReport | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getAllReport = async (from: string, to: string) => {
    loading.value = true
    try {
      const data = await $apiFetch(`/report/dashboard/${from}/${to}`, {
        method: "GET"
      });
      dashboardReport.value = data.result
    } catch (e) {
      dashboardReport.value = null
      error.value = 'Failed to fetch dashboard report'
      console.error(e)
    } finally {
      loading.value = false
    }
  }
  const getAnalyticsReportt= async (from: string, to: string) => {
    loading.value = true
    try {
      const data = await $apiFetch(`/report/analytics/${from}/${to}`, {
        method: "GET"
      });
      dashboardReport.value = data.result
    } catch (e) {
      dashboardReport.value = null
      error.value = 'Failed to fetch dashboard report'
      console.error(e)
    } finally {
      loading.value = false
    }
  }
  // In your useReport composable
const getAnalyticsReport = async (from: string, to: string) => {
  loading.value = true
  try {
    console.log('Making API call to:', `/report/analytics/${from}/${to}`)
    const data = await $apiFetch(`/report/analytics/${from}/${to}`, {
      method: "GET"
    });
    
    console.log('API Response:', data)
    dashboardReport.value = data
    
    // If the API returns {status: "OK", result: {...}}, we need to access data.result
    if (data.status === "OK" && data.result) {
      dashboardReport.value = data.result
      console.log('Set dashboardReport to result:', dashboardReport.value)
    }
  } catch (e) {
    console.error('API Error:', e)
    dashboardReport.value = null
    error.value = 'Failed to fetch dashboard report'
  } finally {
    loading.value = false
  }
}

  return {
    dashboardReport,
    loading,
    error,
    getAllReport,
    getAnalyticsReport,
  }
}