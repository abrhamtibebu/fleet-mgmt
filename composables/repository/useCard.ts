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

  return {
    cardList,
    usersList,
    getCard,
    createCard,
    getUsers,
    loading,
    error
  }
}
