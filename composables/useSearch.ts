import { ref, computed } from 'vue'

export const useSearch = () => {
  const searchQuery = ref('')
  const searchResults = ref([])
  const isSearching = ref(false)
  const searchHistory = ref([])

  // Mock data for search - replace with actual API calls
  const searchableData = ref({
    vehicles: [
      { id: 1, name: 'Ford Transit', type: 'vehicle', category: 'Van', vin: 'VIN-1234', status: 'Active' },
      { id: 2, name: 'Toyota Camry', type: 'vehicle', category: 'Sedan', vin: 'VIN-5678', status: 'Maintenance' },
      { id: 3, name: 'Chevrolet Silverado', type: 'vehicle', category: 'Truck', vin: 'VIN-9012', status: 'Active' },
    ],
    fuelCards: [
      { id: 1, name: 'Fuel Card FC-001', type: 'fuel-card', number: 'FC-001', status: 'Active', balance: '$500' },
      { id: 2, name: 'Fuel Card FC-002', type: 'fuel-card', number: 'FC-002', status: 'Active', balance: '$750' },
      { id: 3, name: 'Fuel Card FC-003', type: 'fuel-card', number: 'FC-003', status: 'Expired', balance: '$0' },
    ],
    reports: [
      { id: 1, name: 'Monthly Fleet Report', type: 'report', category: 'Analytics', date: '2024-01-15' },
      { id: 2, name: 'Fuel Consumption Report', type: 'report', category: 'Fuel', date: '2024-01-10' },
      { id: 3, name: 'Maintenance Schedule', type: 'report', category: 'Maintenance', date: '2024-01-05' },
    ],
    vendors: [
      { id: 1, name: 'ABC Auto Service', type: 'vendor', category: 'Maintenance', status: 'Active' },
      { id: 2, name: 'XYZ Fuel Station', type: 'vendor', category: 'Fuel', status: 'Active' },
      { id: 3, name: 'DEF Parts Supply', type: 'vendor', category: 'Parts', status: 'Inactive' },
    ]
  })

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      searchResults.value = []
      return
    }

    isSearching.value = true
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const results = []
      const searchTerm = query.toLowerCase()
      
      // Search through vehicles
      searchableData.value.vehicles.forEach(vehicle => {
        if (
          vehicle.name.toLowerCase().includes(searchTerm) ||
          vehicle.vin.toLowerCase().includes(searchTerm) ||
          vehicle.category.toLowerCase().includes(searchTerm)
        ) {
          results.push({
            ...vehicle,
            icon: 'mdi-car',
            color: vehicle.status === 'Active' ? 'success' : 'warning'
          })
        }
      })
      
      // Search through fuel cards
      searchableData.value.fuelCards.forEach(card => {
        if (
          card.name.toLowerCase().includes(searchTerm) ||
          card.number.toLowerCase().includes(searchTerm)
        ) {
          results.push({
            ...card,
            icon: 'mdi-credit-card',
            color: card.status === 'Active' ? 'success' : 'error'
          })
        }
      })
      
      // Search through reports
      searchableData.value.reports.forEach(report => {
        if (
          report.name.toLowerCase().includes(searchTerm) ||
          report.category.toLowerCase().includes(searchTerm)
        ) {
          results.push({
            ...report,
            icon: 'mdi-file-chart',
            color: 'info'
          })
        }
      })
      
      // Search through vendors
      searchableData.value.vendors.forEach(vendor => {
        if (
          vendor.name.toLowerCase().includes(searchTerm) ||
          vendor.category.toLowerCase().includes(searchTerm)
        ) {
          results.push({
            ...vendor,
            icon: 'mdi-store',
            color: vendor.status === 'Active' ? 'success' : 'grey'
          })
        }
      })
      
      searchResults.value = results
      
      // Add to search history
      if (!searchHistory.value.includes(query)) {
        searchHistory.value.unshift(query)
        if (searchHistory.value.length > 10) {
          searchHistory.value.pop()
        }
      }
      
    } catch (error) {
      console.error('Search failed:', error)
      searchResults.value = []
    } finally {
      isSearching.value = false
    }
  }

  const clearSearch = () => {
    searchQuery.value = ''
    searchResults.value = []
  }

  const getSearchSuggestions = computed(() => {
    if (!searchQuery.value.trim()) return []
    
    const suggestions = []
    const query = searchQuery.value.toLowerCase()
    
    // Add history suggestions
    searchHistory.value.forEach(term => {
      if (term.toLowerCase().includes(query)) {
        suggestions.push({
          text: term,
          type: 'history',
          icon: 'mdi-history'
        })
      }
    })
    
    // Add quick suggestions
    const quickSuggestions = [
      'vehicles', 'fuel cards', 'reports', 'maintenance', 'vendors',
      'Ford Transit', 'Toyota Camry', 'FC-001', 'Monthly Report'
    ]
    
    quickSuggestions.forEach(suggestion => {
      if (suggestion.toLowerCase().includes(query) && !suggestions.find(s => s.text === suggestion)) {
        suggestions.push({
          text: suggestion,
          type: 'suggestion',
          icon: 'mdi-lightbulb'
        })
      }
    })
    
    return suggestions.slice(0, 5)
  })

  return {
    searchQuery,
    searchResults,
    isSearching,
    searchHistory,
    performSearch,
    clearSearch,
    getSearchSuggestions
  }
} 