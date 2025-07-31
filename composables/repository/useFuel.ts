import { ref, computed } from 'vue'

interface FuelRecord {
  id: string
  vehicleId: string
  licensePlate: string
  date: string
  quantity: number
  amount: number
  odometerReading: number
  fuelCardId: string
  station: string
  fuelEfficiency: number
  createdAt: string
}

interface FuelCard {
  id: string
  cardNumber: string
  cardHolder: string
  totalValueIssued: number
  amountSpent: number
  remainingBalance: number
  status: 'Active' | 'Inactive' | 'Suspended'
  lowBalanceThreshold: number
  isLowBalance: boolean
  lastTransactionDate: string
  createdAt: string
  updatedAt: string
}

export const useFuel = () => {
  const { $apiFetch } = useNuxtApp();
  const fuelRecords = ref<FuelRecord[]>([])
  const fuelCards = ref<FuelCard[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getFuelRecords = async (vehicleId?: string) => {
    loading.value = true
    try {
      const url = vehicleId ? `/fuel-records?vehicleId=${vehicleId}` : '/fuel-records'
      const data = await $apiFetch<FuelRecord[]>(url, {
        method: "GET"
      });
      fuelRecords.value = Array.isArray(data) ? data : []
    } catch (e) {
      fuelRecords.value = []
      error.value = 'Failed to fetch fuel records'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const getFuelCards = async () => {
    loading.value = true
    try {
      const data = await $apiFetch<FuelCard[]>('/card/all', {
        method: "GET"
      });
      fuelCards.value = Array.isArray(data) ? data : []
    } catch (e) {
      fuelCards.value = []
      error.value = 'Failed to fetch fuel cards'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const getFuelRecordsByVehicle = (vehicleId: string) => 
    fuelRecords.value.filter(record => record.vehicleId === vehicleId)

  const getFuelRecordsByCard = (fuelCardId: string) => 
    fuelRecords.value.filter(record => record.fuelCardId === fuelCardId)

  const getFuelCardById = (id: string) => 
    fuelCards.value.find(card => card.id === id)

  const lowBalanceCards = computed(() => 
    fuelCards.value.filter(card => card.isLowBalance)
  )

  const activeCards = computed(() => 
    fuelCards.value.filter(card => card.status === 'Active')
  )

  const calculateFuelEfficiency = (vehicleId: string) => {
    const records = getFuelRecordsByVehicle(vehicleId)
    if (records.length < 2) return 0

    const totalDistance = records[records.length - 1].odometerReading - records[0].odometerReading
    const totalFuel = records.reduce((sum, record) => sum + record.quantity, 0)
    
    return totalDistance / totalFuel
  }

  const getMonthlyFuelConsumption = (vehicleId: string, year: number, month: number) => {
    const records = getFuelRecordsByVehicle(vehicleId)
    const monthlyRecords = records.filter(record => {
      const recordDate = new Date(record.date)
      return recordDate.getFullYear() === year && recordDate.getMonth() === month
    })

    return {
      totalQuantity: monthlyRecords.reduce((sum, record) => sum + record.quantity, 0),
      totalAmount: monthlyRecords.reduce((sum, record) => sum + record.amount, 0),
      averageEfficiency: monthlyRecords.length > 0 
        ? monthlyRecords.reduce((sum, record) => sum + record.fuelEfficiency, 0) / monthlyRecords.length 
        : 0
    }
  }

  return {
    fuelRecords,
    fuelCards,
    loading,
    error,
    getFuelRecords,
    getFuelCards,
    getFuelRecordsByVehicle,
    getFuelRecordsByCard,
    getFuelCardById,
    lowBalanceCards,
    activeCards,
    calculateFuelEfficiency,
    getMonthlyFuelConsumption
  }
} 