<template>
  <div>
    <h1 class="text-h4 mb-2 text-text-primary">NOC Fuel Card Overview</h1>
    <p class="text-subtitle-1 text-text-secondary mb-6">
      Monitor and manage National Oil Company fuel cards
    </p>

    <v-row>
      <!-- Key Metrics -->
      <v-col cols="12" md="3">
        <v-card class="d-flex align-center pa-4 bg-surface text-text-primary">
          <v-icon size="48" color="primary" class="mr-4">mdi-credit-card-multiple-outline</v-icon>
          <div>
            <div class="text-subtitle-2 text-text-secondary">Total Cards</div>
            <div class="text-h5">{{ fuelCards.length }}</div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="d-flex align-center pa-4 bg-surface text-text-primary">
          <v-icon size="48" color="warning" class="mr-4">mdi-alert-circle-outline</v-icon>
          <div>
            <div class="text-subtitle-2 text-text-secondary">Low Balance</div>
            <div class="text-h5">{{ lowBalanceCards.length }}</div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="d-flex align-center pa-4 bg-surface text-text-primary">
          <v-icon size="48" color="info" class="mr-4">mdi-cash-multiple</v-icon>
          <div>
            <div class="text-subtitle-2 text-text-secondary">Total Value</div>
            <div class="text-h5">ETB {{ totalCardValue.toLocaleString() }}</div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="d-flex align-center pa-4 bg-surface text-text-primary">
          <v-icon size="48" color="success" class="mr-4">mdi-cash-check</v-icon>
          <div>
            <div class="text-subtitle-2 text-text-secondary">Remaining Balance</div>
            <div class="text-h5">ETB {{ totalRemainingBalance.toLocaleString() }}</div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col
        v-for="card in fuelCards"
        :key="card.id"
        cols="12" sm="6" md="4" lg="3"
      >
        <v-card class="bg-surface d-flex flex-column">
          <v-card-text>
            <div class="d-flex justify-space-between align-center mb-2">
              <div class="text-h6 text-text-primary">{{ card.cardNumber }}</div>
              <v-chip
                :color="card.remainingBalance > 0 ? 'success' : 'error'"
                size="small"
                label
              >
                {{ card.remainingBalance > 0 ? 'Active' : 'Depleted' }}
              </v-chip>
            </div>
            <div class="text-subtitle-2 text-text-secondary mb-3">Vehicle: {{ getVehiclePlate(card.id) }}</div>

            <v-progress-linear
              :model-value="(card.amountSpent / card.totalValue) * 100"
              height="8"
              rounded
              :color="getCardProgressColor(card)"
              class="mb-2"
            ></v-progress-linear>

            <div class="text-caption text-text-secondary mb-2">
              Balance Usage: {{ ((card.amountSpent / card.totalValue) * 100).toFixed(0) }}%
            </div>

            <div class="d-flex justify-space-between text-caption text-text-secondary">
              <span>Total Value: <span class="font-weight-medium">ETB {{ card.totalValue.toLocaleString() }}</span></span>
              <span>Used: <span class="font-weight-medium">ETB {{ card.amountSpent.toLocaleString() }}</span></span>
            </div>
            <div class="d-flex justify-space-between text-caption text-text-secondary">
              <span>Remaining: <span class="font-weight-medium">ETB {{ card.remainingBalance.toLocaleString() }}</span></span>
              <span>Last Transaction: {{ new Date(card.lastUpdated).toLocaleDateString() }}</span>
            </div>
          </v-card-text>
          <v-card-actions class="mt-auto d-flex justify-space-between">
            <div>
              <v-btn variant="text" size="small" color="primary">View Details</v-btn>
              <v-btn variant="text" size="small" color="secondary">Manage</v-btn>
            </div>
            <v-btn
              color="success"
              size="small"
              prepend-icon="mdi-gas-station"
              @click="openRefillDialog(card)"
              :disabled="card.remainingBalance <= 0"
            >
              Refill
            </v-btn>
          </v-card-actions>
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
import { useVehicles } from '~/composables/repository/useVehicles'

const { fuelCards, getFuelCards, lowBalanceCards, refillFuelCard } = useFuel()
const { vehicleList, getVehicles } = useVehicles()

// Refill functionality
const showRefillDialog = ref(false)
const selectedCardForRefill = ref(null)
const showSuccessSnackbar = ref(false)
const showErrorSnackbar = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const totalCardValue = computed(() => {
  return fuelCards.value.reduce((sum, card) => sum + card.totalValue, 0)
})

const totalRemainingBalance = computed(() => {
  return fuelCards.value.reduce((sum, card) => sum + card.remainingBalance, 0)
})

const getVehiclePlate = (cardId: string) => {
  // This would typically come from a relationship between cards and vehicles
  // For now, returning a placeholder
  return 'ABC-123-ET'
}

const getCardProgressColor = (card: any) => {
  const usagePercentage = (card.amountSpent / card.totalValue) * 100
  if (usagePercentage >= 80) return 'error'
  if (usagePercentage >= 60) return 'warning'
  return 'success'
}

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

onMounted(async () => {
  try {
    await Promise.all([
      getFuelCards(),
      getVehicles()
    ])
  } catch (error) {
    console.error('Error loading fuel card data:', error)
  }
})
</script> 