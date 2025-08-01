import { ref } from 'vue'

interface Vendor {
  id: number
  name: string
}

export function useVendor() {
  const { $apiFetch } = useNuxtApp();
  const vendorList = ref<Vendor[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getVendor = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await $apiFetch<{ result: Vendor[] }>('/vendor/all', {
        method: 'GET'
      })
      

      vendorList.value = Array.isArray(data.result) ? data.result : []

      return data.result;
    } catch (e) {
      error.value = 'Failed to fetch vendors'
      console.error(e)
    } finally {
      loading.value = false
    }
  }
  const createVendor = async (body: any) => {
    loading.value = true
    error.value = null
    try {
      const data = await $apiFetch<{ result: Vendor[] }>('/vendor/add', {
        method: 'POST',
        body
      })

      vendorList.value.push(data.result)

    } catch (e) {
      error.value = 'Failed to create vendors'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const editVendor = async (id: number, body: Vendor) => {
      try {
      const data = await $apiFetch<{ result: Vendor[] }>(`/vendor/${id}`, {
        method: 'PUT',
        body
      })

      // vendorList.value.push(data.result)
      let vd = vendorList.value.findIndex((v:Vendor) => v.id == id)
      vendorList.value[vd] = data.result

    } catch (e) {
      error.value = 'Failed to create vendors'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  


  return {
    editVendor,
    vendorList,
    getVendor,
    createVendor,
    loading,
    error
  }
}
