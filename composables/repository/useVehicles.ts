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
  const department = ref<Vehicle[]>([])
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

 // ~/composables/useVehicle.ts
const createVehicle = async (body: any) => {
  loading.value = true;
  error.value = null;
  try {
    const data = await $apiFetch<{ result: Vehicle[] }>('/vehicle/add', {
      method: 'POST',
      body
    });

    vehicleList.value.push(data.result);
    return data; // Return the successful response
  } catch (e: any) {
    // Preserve the original error structure
    error.value = e.data?.error || 'Failed to create vehicle';
    console.error(e);
    throw e; // Rethrow the original error
  } finally {
    loading.value = false;
  }
};

// Add Department 
const addDepartment = async (vehicleId: number, departmentId: number) => {
  loading.value = true;
  try {
    const data = await $apiFetch<Vehicle>(`/vehicle/${vehicleId}/department/${departmentId}`, {
      method: "PUT",
    });
    // Assuming department.value is an array
    department.value.push(data);
    return data; // return for confirmation if needed
  } catch (e: any) {
    error.value = e.data?.error || 'Failed to add department';
    console.error(e);
    throw e;
  } finally {
    loading.value = false;
  }
};


const updateVehicle = async (id: string, body: any) => {
  loading.value = true;
  error.value = null;
  try {
    const data = await $apiFetch<{ result: Vehicle }>('/vehicle/update', {
      method: 'PUT',
      body: { id, ...body }
    });

    // Update the vehicle in the list
    const index = vehicleList.value.findIndex(v => v.id === id);
    if (index !== -1) {
      vehicleList.value[index] = data.result;
    }
    return data; // Return the successful response
  } catch (e: any) {
    error.value = e.data?.error || 'Failed to update vehicle';
    console.error(e);
    throw e; // Rethrow the original error
  } finally {
    loading.value = false;
  }
};
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

  
const updateInsurance = async (vehicleId: Number,
type: Number, body: any) => {

loading.value = true

error.value = null

try {

const data = await $apiFetch<{ result: Vehicle
}>(`/vehicle/${vehicleId}/type/${type}`,
{

method: 'PUT',

body

})




return data

 




} catch (e) {

error.value = 'Failed to update vehicle'

console.error(e)

} finally {

loading.value = false

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
    calculateServiceDue,
    updateInsurance,
    addDepartment
  }
} 