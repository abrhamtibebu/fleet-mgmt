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
  const { $apiFetch } = useNuxtApp();
  const anomalies = ref<Anomaly[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getAnomalies = async () => {
    loading.value = true
    try {
      const data = await $apiFetch<Anomaly[]>('/anomalies', {
        method: "GET"
      });
      anomalies.value = Array.isArray(data) ? data : []
    } catch (e) {
      console.error('Failed to fetch anomalies:', e)
      // Provide fallback data when API is not available
      anomalies.value = [
        {
          id: 'AN-001',
          vehicleId: 'FL-001-ABC',
          licensePlate: 'ABC-123-ET',
          type: 'fuel_consumption_spike',
          severity: 'medium',
          description: 'Fuel consumption increased by 25% compared to average',
          details: {
            averageEfficiency: 12.5,
            currentEfficiency: 9.8,
            changePercentage: 25.2
          },
          detectedAt: '2024-06-05T14:30:00Z',
          status: 'open',
          resolvedAt: null
        },
        {
          id: 'AN-002',
          vehicleId: 'FL-002-DEF',
          licensePlate: 'DEF-456-ET',
          type: 'service_overdue',
          severity: 'high',
          description: 'Vehicle has exceeded service interval by 2,500 km',
          details: {
            currentMileage: 32500,
            lastServiceMileage: 25000,
            serviceInterval: 10000,
            overdueBy: 2500
          },
          detectedAt: '2024-06-01T09:00:00Z',
          status: 'open',
          resolvedAt: null
        }
      ]
      error.value = 'Using fallback data - API endpoint not available'
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