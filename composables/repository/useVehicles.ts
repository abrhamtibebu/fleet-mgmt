import { ref, computed } from 'vue'

interface Vehicle {
  id: string
  licensePlate: string
  brand: string
  model: string
  year: number
  status: 'active' | 'maintenance' | 'inactive'
  currentMileage: number
  lastServiceMileage: number
  lastServiceDate: string
  nextServiceMileage: number
  serviceInterval: number
  fuelCardId: string
  assignedDriver: string
  location: string
  fuelEfficiency: number
  createdAt: string
  updatedAt: string
}

export const useVehicles = () => {
  const { $apiFetch } = useNuxtApp();
  const vehicles = ref<Vehicle[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getVehicles = async () => {
    loading.value = true
    try {

      const data = await $apiFetch<Vehicle>("/vehicles", {
        method: "GET"
      });
      vehicles.value = Array.isArray(data) ? data : []
    } catch (e) {
      vehicles.value = []
      error.value = 'Failed to fetch vehicles'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const activeVehicles = computed(() => 
    vehicles.value.filter(v => v.status === 'active')
  )

  const maintenanceVehicles = computed(() => 
    vehicles.value.filter(v => v.status === 'maintenance')
  )

  const serviceDueVehicles = computed(() => 
    vehicles.value.filter(v => v.currentMileage >= v.nextServiceMileage)
  )

  const getVehicleById = (id: string) => 
    vehicles.value.find(v => v.id === id)

  const getVehicleByLicensePlate = (licensePlate: string) => 
    vehicles.value.find(v => v.licensePlate === licensePlate)

  const getVehiclesByFuelCard = (fuelCardId: string) => 
    vehicles.value.filter(v => v.fuelCardId === fuelCardId)

  const calculateServiceDue = (vehicle: Vehicle) => {
    const distanceToService = vehicle.nextServiceMileage - vehicle.currentMileage
    return {
      distanceToService,
      isOverdue: distanceToService < 0,
      overdueBy: distanceToService < 0 ? Math.abs(distanceToService) : 0,
      percentageUsed: ((vehicle.currentMileage - vehicle.lastServiceMileage) / vehicle.serviceInterval) * 100
    }
  }

  return {
    vehicles,
    loading,
    error,
    getVehicles,
    activeVehicles,
    maintenanceVehicles,
    serviceDueVehicles,
    getVehicleById,
    getVehicleByLicensePlate,
    getVehiclesByFuelCard,
    calculateServiceDue
  }
} 