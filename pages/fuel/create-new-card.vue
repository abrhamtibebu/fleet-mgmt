<template>
  <div>
    <h1 class="text-h4 mb-2 text-text-primary">Create New Fuel Card</h1>
    <p class="text-subtitle-1 text-text-secondary mb-6">
      Register a new National Oil Company fuel card
    </p>

    <v-card class="bg-surface pa-6">
      <v-card-text>
        <v-form ref="fuelCardForm" v-model="isFormValid">
          <v-text-field
            v-model="formData.cardNumber"
            label="Card Number"
            :rules="[v => !!v || 'Card number is required', v => (v && v.length === 16) || 'Card number must be 16 digits']"
            maxlength="16"
            counter
            required
            class="mb-4"
          ></v-text-field>

          <v-text-field
            v-model.number="formData.totalValue"
            label="Total Value (ETB)"
            type="number"
            :rules="[v => !!v || 'Total value is required', v => v > 0 || 'Value must be positive']"
            required
            class="mb-4"
          ></v-text-field>

          <v-text-field
            v-model="formData.assignedToVehicleId"
            label="Assign to Vehicle (License Plate)"
            hint="Optional: Assign to a specific vehicle now or later"
            persistent-hint
            class="mb-4"
          ></v-text-field>

          <v-text-field
            v-model="formData.expiryDate"
            label="Expiry Date"
            type="date"
            :rules="[v => !!v || 'Expiry date is required']"
            required
            class="mb-4"
          ></v-text-field>

          <v-text-field
            v-model="formData.issuedBy"
            label="Issued By"
            :rules="[v => !!v || 'Issuer is required']"
            required
            class="mb-4"
          ></v-text-field>

          <v-textarea
            v-model="formData.notes"
            label="Notes"
            rows="3"
            class="mb-4"
          ></v-textarea>

          <v-btn
            color="primary"
            block
            :disabled="!isFormValid"
            @click="createFuelCard"
          >
            Create Fuel Card
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFuel } from '~/composables/useFuel'
import type { FuelCard } from '~/types/fleet'

const { addFuelCard } = useFuel()

const isFormValid = ref(false)
const formData = ref<Omit<FuelCard, 'id' | 'amountSpent' | 'remainingBalance' | 'lastUpdated' | 'createdAt'>>({
  cardNumber: '',
  totalValue: 0,
  assignedToVehicleId: '',
  expiryDate: '',
  issuedBy: '',
  notes: '',
})

const createFuelCard = async () => {
  if (isFormValid.value) {
    const newCard: FuelCard = {
      id: `fc-${Date.now()}`,
      cardNumber: formData.value.cardNumber,
      totalValue: formData.value.totalValue,
      amountSpent: 0, // Newly created card has 0 spent
      remainingBalance: formData.value.totalValue, // Remaining balance equals total value initially
      assignedToVehicleId: formData.value.assignedToVehicleId,
      expiryDate: formData.value.expiryDate,
      issuedBy: formData.value.issuedBy,
      notes: formData.value.notes,
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }
    await addFuelCard(newCard)
    console.log('New Fuel Card:', newCard)
    // Reset form
    resetForm()
  }
}

const resetForm = () => {
  formData.value = {
    cardNumber: '',
    totalValue: 0,
    assignedToVehicleId: '',
    expiryDate: '',
    issuedBy: '',
    notes: '',
  }
  isFormValid.value = false
}
</script>