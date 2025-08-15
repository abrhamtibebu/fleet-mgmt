import { ref, computed } from 'vue'

interface Vehicle {
  id: string
  plateNo: string,
  vendorId: number,
  modelId: number,
  cardId: number,
  year: number,
  driver: string,
  status: number,
  currentMileage: number,
  serviceInterval: number,
  type: number,
  // Insurance entries array
  insuranceEntries?: any[],
  // Safety inspection fields
  safetyInspectionStatus?: number,
  safetyInspectionNumber?: string,
  safetyInspectionDate?: string,
  safetyInspectionExpiry?: string,
  safetyInspectionCenter?: string,
  safetyInspectionCost?: number,
  safetyInspectionNotes?: string,
  // Road fund fields
  roadFundStatus?: number,
  roadFundNumber?: string,
  roadFundIssueDate?: string,
  roadFundExpiryDate?: string,
  roadFundAmount?: number,
  roadFundIssuingOffice?: string,
  roadFundNotes?: string
}

export const useVehicles = () => {
  const { $apiFetch } = useNuxtApp();
  const vehicleList = ref<Vehicle[]>([])
  const insuranceRepList = ref<{}>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getVehicles = async () => {
    loading.value = true
    try {

      const data = await $apiFetch<Vehicle>("/vehicle/all", {
        method: "GET"
      });
      vehicleList.value = Array.isArray(data.result) ? data.result : []
    
    } catch (e) {
      vehicleList.value = []
      error.value = 'Failed to fetch vehicles'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const getInsuranceReport = async () => {
    loading.value = true
    try {

      const data = await $apiFetch<Vehicle>("/vehicle/insurancerep", {
        method: "GET"
      });
      insuranceRepList.value = data.result
    
    } catch (e) {
      insuranceRepList.value = []
      error.value = 'Failed to fetch vehicle insurance'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

    const createVehicle = async (body: any) => {
    loading.value = true
    error.value = null
    try {
      const data = await $apiFetch<{ result: Vehicle[] }>('/vehicle/add', {
        method: 'POST',
        body
      })

      vehicleList.value.push(data.result)

    } catch (e) {
      error.value = 'Failed to create vendors'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const updateVehicle = async (id: string, body: any) => {
    loading.value = true
    error.value = null
    try {
      const data = await $apiFetch<{ result: Vehicle }>('/vehicle/update', {
        method: 'PUT',
        body: { id, ...body }
      })

      // Update the vehicle in the list
      const index = vehicleList.value.findIndex(v => v.id === id)
      if (index !== -1) {
        vehicleList.value[index] = data.result
      }

    } catch (e) {
      error.value = 'Failed to update vehicle'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const activeVehicles = computed(() => 
    vehicleList.value.filter(v => v.status === 1)
  )

  const maintenanceVehicles = computed(() => 
    vehicleList.value.filter(v => v.status === 2)
  )

  const serviceDueVehicles = computed(() => 
    vehicleList.value.filter(v => v.currentMileage >= v.nextServiceMileage)
  )

  const getVehicleById = (id: string) => 
    vehicleList.value.find(v => v.id === id)

  const getVehicleByLicensePlate = (licensePlate: string) => 
    vehicleList.value.find(v => v.licensePlate === licensePlate)

  const getVehiclesByFuelCard = (fuelCardId: string) => 
    vehicleList.value.filter(v => v.fuelCardId === fuelCardId)

  const calculateServiceDue = (vehicle: Vehicle) => {
    const distanceToService = vehicle.nextServiceMileage - vehicle.currentMileage
    return {
      distanceToService,
      isOverdue: distanceToService < 0,
      overdueBy: distanceToService < 0 ? Math.abs(distanceToService) : 0,
      percentageUsed: ((vehicle.currentMileage - vehicle.lastServiceMileage) / vehicle.serviceInterval) * 100
    }
  }

  const vehicleTypes = [
      {
        id: 1,
        name : "Fuel-powered Car"
      },
      {
        id: 2,
        name: "Electric-powered Car"
      }
  ]

  const statusMap = [
    {
      id: 1,
      label: 'Active',
      color: 'green'
      
    },
    {
      id: 2,
      label: 'Maintenance',
      color: 'orange'
    },
    {
      id: 3,
      label: 'Inactive',
      color: 'red'
    }
  ]

  const insuranceTypes = [
    {
      id: 1,
      name: 'Comprehensive Insurance'
    },
    {
      id: 2,
      name: 'Third Party Liability'
    },
    {
      id: 3,
      name: 'Safty Inspection'
    },
    {
      id: 4,
      name: 'Road Fund'
    }
  ]

  return {
    insuranceTypes,
    statusMap,
    vehicleList,
    insuranceRepList,
    loading,
    error,
    vehicleTypes,
    getInsuranceReport,
    getVehicles,
    createVehicle,
    updateVehicle,
    activeVehicles,
    maintenanceVehicles,
    serviceDueVehicles,
    getVehicleById,
    getVehicleByLicensePlate,
    getVehiclesByFuelCard,
    calculateServiceDue
  }
} 