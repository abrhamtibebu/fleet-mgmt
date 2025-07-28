import { ref, computed } from 'vue'

interface Anomaly {
  id: string
  vehicleId?: string
  licensePlate?: string
  cardNumber?: string
  type: 'fuel_consumption_spike' | 'service_overdue' | 'mileage_without_refuel' | 'low_fuel_card_balance' | 'refuel_without_mileage'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  details: Record<string, any>
  detectedAt: string
  status: 'open' | 'resolved' | 'acknowledged'
  resolvedAt: string | null
}

export const useAnomalies = () => {
  const anomalies = ref<Anomaly[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getAnomalies = async () => {
    loading.value = true
    try {
      const response = await fetch('/api/anomalies')
      const data = await response.json()
      anomalies.value = Array.isArray(data) ? data : []
    } catch (e) {
      anomalies.value = []
      error.value = 'Failed to fetch anomalies'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const openAnomalies = computed(() => 
    anomalies.value.filter(anomaly => anomaly.status === 'open')
  )

  const highSeverityAnomalies = computed(() => 
    anomalies.value.filter(anomaly => 
      anomaly.severity === 'high' || anomaly.severity === 'critical'
    )
  )

  const getAnomaliesByVehicle = (vehicleId: string) => 
    anomalies.value.filter(anomaly => anomaly.vehicleId === vehicleId)

  const getAnomaliesByType = (type: Anomaly['type']) => 
    anomalies.value.filter(anomaly => anomaly.type === type)

  const getAnomaliesBySeverity = (severity: Anomaly['severity']) => 
    anomalies.value.filter(anomaly => anomaly.severity === severity)

  const getAnomalyCountByType = computed(() => {
    const counts: Record<string, number> = {}
    anomalies.value.forEach(anomaly => {
      counts[anomaly.type] = (counts[anomaly.type] || 0) + 1
    })
    return counts
  })

  const getAnomalyCountBySeverity = computed(() => {
    const counts: Record<string, number> = {}
    anomalies.value.forEach(anomaly => {
      counts[anomaly.severity] = (counts[anomaly.severity] || 0) + 1
    })
    return counts
  })

  const getRecentAnomalies = (days: number = 7) => {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    return anomalies.value.filter(anomaly => 
      new Date(anomaly.detectedAt) >= cutoffDate
    )
  }

  const getAnomalyTrend = (days: number = 30) => {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    const recentAnomalies = anomalies.value.filter(anomaly => 
      new Date(anomaly.detectedAt) >= cutoffDate
    )

    const dailyCounts: Record<string, number> = {}
    recentAnomalies.forEach(anomaly => {
      const date = anomaly.detectedAt.split('T')[0]
      dailyCounts[date] = (dailyCounts[date] || 0) + 1
    })

    return Object.entries(dailyCounts).map(([date, count]) => ({
      date,
      count
    })).sort((a, b) => a.date.localeCompare(b.date))
  }

  return {
    anomalies,
    loading,
    error,
    getAnomalies,
    openAnomalies,
    highSeverityAnomalies,
    getAnomaliesByVehicle,
    getAnomaliesByType,
    getAnomaliesBySeverity,
    getAnomalyCountByType,
    getAnomalyCountBySeverity,
    getRecentAnomalies,
    getAnomalyTrend
  }
} 