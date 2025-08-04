import { ref, computed } from 'vue'

interface Maintenance {
  id: string
  vehicleId: number,
  serviceType: number,
  totalCost: number,
  servicedOn: Date,
  remark: string,
}

export const useMaintenance = () => {
  const { $apiFetch } = useNuxtApp();
  const maintenanceList = ref<[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getMaintenanceList = async () => {
    loading.value = true
    try {

      const data = await $apiFetch<Maintenance>("/maintenance/all", {
        method: "GET"
      });
      maintenanceList.value = Array.isArray(data.result) ? data.result : []
    
    } catch (e) {
      maintenanceList.value = []
      error.value = 'Failed to fetch maintenance list'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

    const createMaintenance = async (body: any) => {
    loading.value = true
    error.value = null
    try {
      const data = await $apiFetch<{ result: Maintenance[] }>('/maintenance/add', {
        method: 'POST',
        body
      })

      maintenanceList.value.push(data.result)

    } catch (e) {
      error.value = 'Failed to create maintenance record'
      console.error(e)
    } finally {
      loading.value = false
    }
  }


  return {
    maintenanceList,
    loading,
    error,
    getMaintenanceList,
    createMaintenance
  }
} 