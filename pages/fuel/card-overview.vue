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
          <v-card-actions class="mt-auto d-flex justify-end">
            <v-btn variant="text" size="small" color="primary">View Details</v-btn>
            <v-btn variant="text" size="small" color="secondary">Manage</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useFuel } from '~/composables/repository/useFuel'
import { useVehicles } from '~/composables/repository/useVehicles'
import type { FuelCard } from '~/types/fleet'

const { fuelCards, lowBalanceCards, getFuelCards } = useFuel()
const { vehicles, getVehicles } = useVehicles() // To get vehicle plate for display

const totalCardValue = computed(() => {
  return fuelCards.value.reduce((sum, card) => sum + card.totalValue, 0)
})

const totalRemainingBalance = computed(() => {
  return fuelCards.value.reduce((sum, card) => sum + card.remainingBalance, 0)
})

const getVehiclePlate = (fuelCardId: string) => {
  // This is a placeholder, as the current FuelCard interface doesn't directly link to VehicleId
  // In a real scenario, you'd link the fuel card to a vehicle or vice-versa.
  // For now, let's mock a vehicle based on the fuelCardId for demonstration
  const mockVehicles = [
    { id: 'FC-001', licensePlate: 'AA-1234' },
    { id: 'FC-002', licensePlate: 'BB-5678' },
    { id: 'FC-003', licensePlate: 'CC-9012' },
    { id: 'FC-004', licensePlate: 'DD-3456' },
    { id: 'FC-005', licensePlate: 'EE-7890' },
  ]
  const vehicle = mockVehicles.find(v => v.id === fuelCardId)
  return vehicle?.licensePlate || 'N/A'
}

const getCardProgressColor = (card: FuelCard) => {
  const percentage = (card.amountSpent / card.totalValue) * 100
  if (percentage >= 80) return 'error'
  if (percentage >= 50) return 'warning'
  return 'primary'
}

onMounted(async () => {
  await Promise.all([getFuelCards(), getVehicles()])
})
</script> 