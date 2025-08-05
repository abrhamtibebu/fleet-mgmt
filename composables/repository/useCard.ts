import { ref } from 'vue'

interface Card {
  id: number
  number: string,
  vendorId: number,
  holder: string,
  balance: string,
  expiryDate: string,
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

  const updateCard = async (id: string, body: any) => {
    loading.value = true
    error.value = null
    try {
      const data = await $apiFetch<{ result: Card }>('/card/update', {
        method: 'PUT',
        body: { id, ...body }
      })

      // Update the card in the list
      const index = cardList.value.findIndex(c => c.id === id)
      if (index !== -1) {
        cardList.value[index] = data.result
      }

    } catch (e) {
      error.value = 'Failed to update card'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const deleteCard = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await $apiFetch(`/card/delete`, {
        method: 'DELETE',
        body: { id }
      })

      // Remove the card from the list
      const index = cardList.value.findIndex(c => c.id === id)
      if (index !== -1) {
        cardList.value.splice(index, 1)
      }

    } catch (e) {
      error.value = 'Failed to delete card'
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
    updateCard,
    deleteCard,
    getUsers,
    loading,
    error
  }
}
