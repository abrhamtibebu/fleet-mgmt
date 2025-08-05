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

interface User{
  name: string,
  id: string
}

export function useCard() {
  const { $apiFetch } = useNuxtApp();
  const cardList = ref<Card[]>([])
  const usersList = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getCard = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await $apiFetch<{ result: Card[] }>('/card/all', {
        method: 'GET'
      })
      
      cardList.value = Array.isArray(data.result) ? data.result : []

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
   
      cardList.value.push(data.result)

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
      usersList.value = Array.isArray(data.result) ? data.result : []
      
      return data.result;
    } catch (e) {
      console.error(e)
    } finally {
    }
  }
  const deleteCard = async (id: number) => {
  loading.value = true
  try {
    const response = await $apiFetch(`/card/${id}`, {
      method: 'DELETE'
    })
    return response
  } catch (e) {
    console.error('Delete card error:', e)
    throw e
  } finally {
    loading.value = false
  }
}
const changeCardStatus = async (id: number, status: string) => {
  loading.value = true
  try {
    const response = await $apiFetch(`/card/status/${id}/${status}`, {
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
    cardList,
    usersList,
    getCard,
    createCard,
    getUsers,
    deleteCard,
    changeCardStatus,
    loading,
    error
  }
}
