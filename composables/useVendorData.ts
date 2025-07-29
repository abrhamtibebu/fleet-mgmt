import { ref, computed } from 'vue'

interface Brand {
  id: string
  name: string
  description: string
  icon: string
  models: Model[]
}

interface Model {
  id: string
  brandId: string
  brandName: string
  name: string
  year: string
  engineSize: string
  description: string
}

interface VendorCard {
  id: string
  cardNumber: string
  cardHolder: string
  balance: number
  status: string
  notes: string
}

export const useVendorData = () => {
  // Reactive data
  const brands = ref<Brand[]>([
    {
      id: 'BR-001',
      name: 'Toyota',
      description: 'Japanese automotive manufacturer',
      icon: 'mdi-car',
      models: []
    },
    {
      id: 'BR-002',
      name: 'Ford',
      description: 'American multinational automaker',
      icon: 'mdi-car',
      models: []
    },
    {
      id: 'BR-003',
      name: 'Honda',
      description: 'Japanese multinational corporation',
      icon: 'mdi-car',
      models: []
    }
  ])

  const models = ref<Model[]>([
    {
      id: 'MD-001',
      brandId: 'BR-001',
      brandName: 'Toyota',
      name: 'Hilux',
      year: '2023',
      engineSize: '2.8',
      description: 'Pickup truck with excellent reliability'
    },
    {
      id: 'MD-002',
      brandId: 'BR-001',
      brandName: 'Toyota',
      name: 'Land Cruiser',
      year: '2023',
      engineSize: '4.5',
      description: 'Luxury SUV with off-road capabilities'
    },
    {
      id: 'MD-003',
      brandId: 'BR-001',
      brandName: 'Toyota',
      name: 'Corolla',
      year: '2023',
      engineSize: '1.8',
      description: 'Compact sedan with excellent fuel efficiency'
    },
    {
      id: 'MD-004',
      brandId: 'BR-001',
      brandName: 'Toyota',
      name: 'Camry',
      year: '2023',
      engineSize: '2.5',
      description: 'Mid-size sedan with premium features'
    },
    {
      id: 'MD-005',
      brandId: 'BR-002',
      brandName: 'Ford',
      name: 'Ranger',
      year: '2023',
      engineSize: '2.0',
      description: 'Compact pickup truck'
    },
    {
      id: 'MD-006',
      brandId: 'BR-002',
      brandName: 'Ford',
      name: 'F-150',
      year: '2023',
      engineSize: '3.5',
      description: 'Full-size pickup truck with towing capacity'
    },
    {
      id: 'MD-007',
      brandId: 'BR-002',
      brandName: 'Ford',
      name: 'Explorer',
      year: '2023',
      engineSize: '2.3',
      description: 'Mid-size SUV with three-row seating'
    },
    {
      id: 'MD-008',
      brandId: 'BR-003',
      brandName: 'Honda',
      name: 'CR-V',
      year: '2023',
      engineSize: '1.5',
      description: 'Compact SUV with excellent safety ratings'
    },
    {
      id: 'MD-009',
      brandId: 'BR-003',
      brandName: 'Honda',
      name: 'Civic',
      year: '2023',
      engineSize: '1.5',
      description: 'Compact car with sporty design'
    },
    {
      id: 'MD-010',
      brandId: 'BR-003',
      brandName: 'Honda',
      name: 'Accord',
      year: '2023',
      engineSize: '1.5',
      description: 'Mid-size sedan with advanced technology'
    }
  ])

  const cards = ref<VendorCard[]>([
    {
      id: 'CR-001',
      cardNumber: '1234567890123456',
      cardHolder: 'Fleet Manager',
      balance: 50000,
      status: 'active',
      notes: 'Primary fleet card'
    },
    {
      id: 'CR-002',
      cardNumber: '9876543210987654',
      cardHolder: 'Operations Team',
      balance: 25000,
      status: 'active',
      notes: 'Secondary operations card'
    },
    {
      id: 'CR-003',
      cardNumber: '4567891234567890',
      cardHolder: 'Emergency Response',
      balance: 10000,
      status: 'inactive',
      notes: 'Emergency backup card'
    }
  ])

  // Computed properties
  const activeCards = computed(() => {
    return cards.value.filter(card => card.status === 'active')
  })

  const totalCardValue = computed(() => {
    return cards.value.reduce((sum, card) => sum + card.balance, 0)
  })

  // Methods
  const addBrand = (brand: Omit<Brand, 'id' | 'models'>) => {
    const newBrand: Brand = {
      ...brand,
      id: `BR-${Date.now()}`,
      models: []
    }
    brands.value.push(newBrand)
  }

  const updateBrand = (id: string, updates: Partial<Brand>) => {
    const index = brands.value.findIndex(b => b.id === id)
    if (index > -1) {
      brands.value[index] = { ...brands.value[index], ...updates }
    }
  }

  const deleteBrand = (id: string) => {
    const index = brands.value.findIndex(b => b.id === id)
    if (index > -1) {
      brands.value.splice(index, 1)
      // Also delete associated models
      models.value = models.value.filter(m => m.brandId !== id)
    }
  }

  const addModel = (model: Omit<Model, 'id' | 'brandName'>) => {
    const brand = brands.value.find(b => b.id === model.brandId)
    const newModel: Model = {
      ...model,
      id: `MD-${Date.now()}`,
      brandName: brand?.name || ''
    }
    models.value.push(newModel)
  }

  const updateModel = (id: string, updates: Partial<Model>) => {
    const index = models.value.findIndex(m => m.id === id)
    if (index > -1) {
      const brand = brands.value.find(b => b.id === updates.brandId || models.value[index].brandId)
      models.value[index] = { 
        ...models.value[index], 
        ...updates,
        brandName: brand?.name || models.value[index].brandName
      }
    }
  }

  const deleteModel = (id: string) => {
    const index = models.value.findIndex(m => m.id === id)
    if (index > -1) {
      models.value.splice(index, 1)
    }
  }

  const addCard = (card: Omit<VendorCard, 'id'>) => {
    const newCard: VendorCard = {
      ...card,
      id: `CR-${Date.now()}`
    }
    cards.value.push(newCard)
  }

  const updateCard = (id: string, updates: Partial<VendorCard>) => {
    const index = cards.value.findIndex(c => c.id === id)
    if (index > -1) {
      cards.value[index] = { ...cards.value[index], ...updates }
    }
  }

  const deleteCard = (id: string) => {
    const index = cards.value.findIndex(c => c.id === id)
    if (index > -1) {
      cards.value.splice(index, 1)
    }
  }

  const getBrandById = (id: string) => {
    return brands.value.find(b => b.id === id)
  }

  const getModelsByBrand = (brandId: string) => {
    return models.value.filter(m => m.brandId === brandId)
  }

  const getCardById = (id: string) => {
    return cards.value.find(c => c.id === id)
  }

  const maskCardNumber = (cardNumber: string) => {
    return `****-****-****-${cardNumber.slice(-4)}`
  }

  const initializeData = () => {
    // Initialize vendor data - this ensures the data is loaded
  }

  return {
    // Data
    brands,
    models,
    cards,
    
    // Computed
    activeCards,
    totalCardValue,
    
    // Methods
    addBrand,
    updateBrand,
    deleteBrand,
    addModel,
    updateModel,
    deleteModel,
    addCard,
    updateCard,
    deleteCard,
    getBrandById,
    getModelsByBrand,
    getCardById,
    maskCardNumber,
    initializeData
  }
} 