<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <h1 class="text-h4">Card Management</h1>
      <v-btn color="primary" prepend-icon="mdi-plus">
        Add New Card
      </v-btn>
    </div>

    <v-card class="mb-6">
      <v-card-title class="d-flex align-center">
        <span>Active Fuel Cards</span>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search cards"
          single-line
          hide-details
          density="compact"
          class="max-width-300"
        ></v-text-field>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="fuelCards"
          :search="search"
          :loading="loading"
          class="elevation-1"
        >
          <template v-slot:item.status="{ item }">
            <v-chip
              :color="item.status === 'Active' ? 'success' : 'error'"
              size="small"
            >
              {{ item.status }}
            </v-chip>
          </template>

          <template v-slot:item.remainingBalance="{ item }">
            <div class="d-flex align-center">
              <span class="font-weight-medium">ETB {{ item.remainingBalance.toLocaleString() }}</span>
              <v-chip
                v-if="item.isLowBalance"
                color="warning"
                size="x-small"
                class="ml-2"
              >
                Low
              </v-chip>
            </div>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              icon="mdi-gas-station"
              variant="text"
              size="small"
              color="success"
              class="mr-2"
              @click="openRefillDialog(item)"
              :disabled="item.remainingBalance <= 0"
              :title="item.remainingBalance <= 0 ? 'Card is depleted' : 'Refill card'"
            ></v-btn>
            <v-btn
              icon="mdi-pencil"
              variant="text"
              size="small"
              color="primary"
              class="mr-2"
              @click="editCard(item)"
            ></v-btn>
            <v-btn
              icon="mdi-delete"
              variant="text"
              size="small"
              color="error"
              @click="deleteCard(item)"
            ></v-btn>
          </template>

          <template v-slot:no-data>
            <v-alert type="info" class="ma-4">
              No fuel cards found
            </v-alert>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Card Usage Statistics</v-card-title>
          <v-card-text>
            <div class="d-flex align-center mb-4">
              <v-icon color="primary" class="mr-2">mdi-chart-pie</v-icon>
              <span class="text-subtitle-1">Monthly Usage</span>
            </div>
            <div class="text-h6 mb-2">ETB {{ monthlyUsage.toLocaleString() }}</div>
            <div class="text-caption text-medium-emphasis">Total spending this month</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Card Status Overview</v-card-title>
          <v-card-text>
            <div class="d-flex align-center mb-4">
              <v-icon color="primary" class="mr-2">mdi-credit-card-check</v-icon>
              <span class="text-subtitle-1">Active Cards</span>
            </div>
            <div class="text-h6 mb-2">{{ activeCardsCount }}</div>
            <div class="text-caption text-medium-emphasis">Total active cards</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Refill Card Dialog -->
    <RefillCard
      v-model="showRefillDialog"
      :card="selectedCardForRefill"
      @refill-processed="handleRefillProcessed"
    />

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="showSuccessSnackbar"
      color="success"
      timeout="3000"
      location="top"
    >
      {{ successMessage }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="showSuccessSnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Error Snackbar -->
    <v-snackbar
      v-model="showErrorSnackbar"
      color="error"
      timeout="5000"
      location="top"
    >
      {{ errorMessage }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="showErrorSnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFuel } from '~/composables/repository/useFuel'

const { fuelCards, loading, getFuelCards, refillFuelCard } = useFuel()

const search = ref('')

// Refill functionality
const showRefillDialog = ref(false)
const selectedCardForRefill = ref(null)
const showSuccessSnackbar = ref(false)
const showErrorSnackbar = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const headers = [
  { title: 'Card Number', key: 'cardNumber', sortable: true },
  { title: 'Cardholder', key: 'cardHolder', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Remaining Balance', key: 'remainingBalance', sortable: true },
  { title: 'Last Transaction', key: 'lastTransactionDate', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false },
]

const monthlyUsage = computed(() => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  return fuelCards.value.reduce((sum, card) => {
    const lastTransactionDate = new Date(card.lastTransactionDate)
    if (lastTransactionDate.getMonth() === currentMonth && lastTransactionDate.getFullYear() === currentYear) {
      return sum + card.amountSpent
    }
    return sum
  }, 0)
})

const activeCardsCount = computed(() => {
  return fuelCards.value.filter(card => card.status === 'Active').length
})

const openRefillDialog = (card: any) => {
  selectedCardForRefill.value = card
  showRefillDialog.value = true
}

const handleRefillProcessed = async (cardId: string, amount: number, notes: string) => {
  try {
    const result = await refillFuelCard(cardId, amount, notes)
    
    successMessage.value = result.message
    showSuccessSnackbar.value = true
    
  } catch (error) {
    errorMessage.value = 'Failed to process refill'
    showErrorSnackbar.value = true
    console.error('Error processing refill:', error)
  }
}

const editCard = (card: any) => {
  console.log('Edit card:', card)
  // Implement edit functionality
}

const deleteCard = (card: any) => {
  console.log('Delete card:', card)
  // Implement delete functionality
}

onMounted(async () => {
  try {
    await getFuelCards()
  } catch (error) {
    console.error('Error loading fuel card data:', error)
  }
})
</script> 