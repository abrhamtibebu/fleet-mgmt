import { ref } from 'vue'

interface Card {
  id: number
  number: string,
  vendorId: number,
  holder: string,
  balance: string,
  status: number,
  remark: string
}

export function useCard() {
  const { $apiFetch } = useNuxtApp();
  const cardList = ref<Card[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getCard = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await $apiFetch<{ result: Card[] }>('/card/all', {
        method: 'GET'
      })
      
      // vendorList.value = Array.isArray(data.result) ? data.result : []
      cardList.value = Array.isArray(data) ? data : []

      return data.result;
    } catch (e) {
      error.value = 'Failed to fetch cards'
      console.error(e)
    } finally {
      loading.value = false
    }
  }
  const createCard = async (body: any) => {
    loading.value = true
    error.value = null
    try {
      const data = await $apiFetch<{ result: Card[] }>('/card/add', {
        method: 'POST',
        body
      })
      // vendorList.value = Array.isArray(data.result) ? data.result : []
      cardList.value = Array.isArray(data) ? data : []

    } catch (e) {
      error.value = 'Failed to create card'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

   const getUsers = async () => {
    try {
      const data = await $apiFetch<{ result: any[] }>('/user/all', {
        method: 'GET'
      })
      return data.result;
    } catch (e) {
      console.error(e)
    } finally {
    }
  }

  return {
    cardList,
    getCard,
    createCard,
    getUsers,
    loading,
    error
  }
}
