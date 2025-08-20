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

    } catch (e: any) {
      error.value = 'Failed to create vendors'
      console.error(e)
      throw e; // Rethrow the original error

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
      throw e; // Rethrow the original error
    } finally {
      loading.value = false
    }
  }
  const deleteVendor = async (id: number) => {
  loading.value = true
  error.value = null
  try {
    await $apiFetch(`/vendor/${id}`, {
      method: 'DELETE'
    })
    // Remove the deleted vendor from the list
    vendorList.value = vendorList.value.filter(vendor => vendor.id !== id)
  } catch (e) {
    error.value = 'Failed to delete vendor'
    console.error(e)
    throw e // Re-throw the error so the calling component can handle it
  } finally {
    loading.value = false
  }
}
const changeVendorStatus = async (id: number, status: string) => {
  loading.value = true
  try {
    const response = await $apiFetch(`/vendor/status/${id}/${status}`, {
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

  const deleteBrand = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await $apiFetch(`/vendor/${id}`, {
        method: 'DELETE'
      })

      // Remove the brand from the list
      const index = vendorList.value.findIndex(v => v.id === id)
      if (index !== -1) {
        vendorList.value.splice(index, 1)
      }

    } catch (e) {
      error.value = 'Failed to delete brand'
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
    deleteVendor,
    changeVendorStatus,
    deleteBrand,
    loading,
    error
  }
}
