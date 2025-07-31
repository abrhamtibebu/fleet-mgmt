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
      // vendorList.value = Array.isArray(data.result) ? data.result : []
      vendorList.value = Array.isArray(data) ? data : []

    } catch (e) {
      error.value = 'Failed to fetch vendors'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  return {
    vendorList,
    getVendor,
    loading,
    error
  }
}
