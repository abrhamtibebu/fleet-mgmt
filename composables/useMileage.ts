import { ref, computed } from 'vue'

interface MileageRecord {
  id: string
  vehicleId: string
  licensePlate: string
  date: string
  odometerReading: number
  previousReading: number
  distanceTraveled: number
  driver: string
  notes: string
  createdAt: string
}

export const useMileage = () => {
  const mileageRecords = ref<MileageRecord[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getMileageRecords = async (vehicleId?: string) => {
    loading.value = true
    try {
      const url = vehicleId ? `/api/mileage-records?vehicleId=${vehicleId}` : '/api/mileage-records'
      const response = await fetch(url)
      const data = await response.json()
      mileageRecords.value = Array.isArray(data) ? data : []
    } catch (e) {
      mileageRecords.value = []
      error.value = 'Failed to fetch mileage records'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const getMileageRecordsByVehicle = (vehicleId: string) => 
    mileageRecords.value.filter(record => record.vehicleId === vehicleId)

  const getLatestMileageRecord = (vehicleId: string) => {
    const records = getMileageRecordsByVehicle(vehicleId)
    return records.length > 0 ? records[records.length - 1] : null
  }

  const getMonthlyMileage = (vehicleId: string, year: number, month: number) => {
    const records = getMileageRecordsByVehicle(vehicleId)
    const monthlyRecords = records.filter(record => {
      const recordDate = new Date(record.date)
      return recordDate.getFullYear() === year && recordDate.getMonth() === month
    })

    return {
      totalDistance: monthlyRecords.reduce((sum, record) => sum + record.distanceTraveled, 0),
      averageDailyDistance: monthlyRecords.length > 0 
        ? monthlyRecords.reduce((sum, record) => sum + record.distanceTraveled, 0) / monthlyRecords.length 
        : 0,
      recordCount: monthlyRecords.length
    }
  }

  const calculateTotalMileage = (vehicleId: string) => {
    const records = getMileageRecordsByVehicle(vehicleId)
    return records.reduce((sum, record) => sum + record.distanceTraveled, 0)
  }

  const getMileageTrend = (vehicleId: string, days: number = 30) => {
    const records = getMileageRecordsByVehicle(vehicleId)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const recentRecords = records.filter(record => 
      new Date(record.date) >= cutoffDate
    )

    return recentRecords.map(record => ({
      date: record.date,
      distance: record.distanceTraveled,
      odometer: record.odometerReading
    }))
  }

  return {
    mileageRecords,
    loading,
    error,
    getMileageRecords,
    getMileageRecordsByVehicle,
    getLatestMileageRecord,
    getMonthlyMileage,
    calculateTotalMileage,
    getMileageTrend
  }
} 