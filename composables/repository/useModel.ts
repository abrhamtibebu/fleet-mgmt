import { ref } from 'vue'

interface Model {
  id: number
  name: string,
  vendorId: number,
  year: number,
  engine: number,
  description: string
}

export function useModel() {
  const { $apiFetch } = useNuxtApp();
  const modelList = ref<Model[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getModel = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await $apiFetch<{ result: Model[] }>('/model/all', {
        method: 'GET'
      })
      
      // vendorList.value = Array.isArray(data.result) ? data.result : []
      modelList.value = Array.isArray(data) ? data : []

      return data.result;
    } catch (e) {
      error.value = 'Failed to fetch models'
      console.error(e)
    } finally {
      loading.value = false
    }
  }
  const createModel = async (body: any) => {
    loading.value = true
    error.value = null
    try {
      const data = await $apiFetch<{ result: Model[] }>('/model/add', {
        method: 'POST',
        body
      })
      // vendorList.value = Array.isArray(data.result) ? data.result : []
      modelList.value = Array.isArray(data) ? data : []

    } catch (e) {
      error.value = 'Failed to create model'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  return {
    modelList,
    getModel,
    createModel,
    loading,
    error
  }
}
