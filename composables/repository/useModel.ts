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
      
      modelList.value = Array.isArray(data.result) ? data.result : []

      return data.result;
    } catch (e) {
      error.value = 'Failed to fetch models'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const getByVendor = async (id:Number) =>{
        loading.value = true
    error.value = null
    try {
      const data = await $apiFetch<{ result: Model[] }>(`/model/vendor/${id}`, {
        method: 'GET'
      })
      
      modelList.value = Array.isArray(data.result) ? data.result : []

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

      modelList.value.push(data.result)

    } catch (e) {
      error.value = 'Failed to create model'
      console.error(e)
    } finally {
      loading.value = false
    }
  }
const deleteModel = async (id: number) => {
  loading.value = true
  try {
    const response = await $apiFetch(`/model/${id}`, {
      method: 'DELETE'
    })
    return response
  } catch (e) {
    console.error('Delete model error:', e)
    throw e
  } finally {
    loading.value = false
  }
}
const changeModelStatus = async (id: number, status: string) => {
  loading.value = true
  try {
    const response = await $apiFetch(`/model/status/${id}/${status}`, {
      method: 'PATCH'
    })
    return response
  } catch (e) {
    console.error('Status change error:', e)
    throw e
  } finally {
    loading.value = false
  }
}
  return {
    modelList,
    getModel,
    getByVendor,
    createModel,
    deleteModel,
    changeModelStatus,
    loading,
    error
  }
}
