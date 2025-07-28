<template>
  <div>
    <h1 class="text-h4 mb-2 text-text-primary">Fuel Transaction History</h1>
    <p class="text-subtitle-1 text-text-secondary mb-6">
      View and audit all fuel refueling records
    </p>

    <v-card class="bg-surface">
      <v-card-text>
        <v-row class="mb-4">
          <v-col cols="12" md="4">
            <v-select
              label="Filter by Vehicle"
              :items="vehicles"
              item-title="licensePlate"
              item-value="id"
              clearable
              v-model="selectedVehicleId"
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              label="Filter by Fuel Card"
              :items="fuelCards"
              item-title="cardNumber"
              item-value="id"
              clearable
              v-model="selectedFuelCardId"
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              label="Search by Date"
              type="date"
              clearable
              v-model="searchDate"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-table class="text-text-primary">
          <thead>
            <tr>
              <th class="text-left text-overline">Date</th>
              <th class="text-left text-overline">Vehicle</th>
              <th class="text-left text-overline">Fuel Card</th>
              <th class="text-left text-overline">Fuel Type</th>
              <th class="text-left text-overline">Quantity (Liters)</th>
              <th class="text-left text-overline">Total Cost (ETB)</th>
              <th class="text-left text-overline">Location</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in filteredFuelRecords" :key="record.id">
              <td>{{ new Date(record.date).toLocaleDateString() }}</td>
              <td>{{ getVehiclePlate(record.vehicleId) }}</td>
              <td>{{ getFuelCardNumber(record.fuelCardId) }}</td>
              <td>{{ record.fuelType }}</td>
              <td>{{ record.quantity.toLocaleString() }}</td>
              <td>ETB {{ record.totalCost.toLocaleString() }}</td>
              <td>{{ record.location }}</td>
            </tr>
            <tr v-if="filteredFuelRecords.length === 0">
              <td colspan="7" class="text-center text-text-secondary">No fuel records found.</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useFuel } from '~/composables/useFuel'
import { useVehicles } from '~/composables/useVehicles'
import type { FuelRecord } from '~/types/fleet'

const { fuelRecords, getFuelRecords, fuelCards, getFuelCards } = useFuel()
const { vehicles, getVehicles } = useVehicles()

const selectedVehicleId = ref<string | null>(null)
const selectedFuelCardId = ref<string | null>(null)
const searchDate = ref<string | null>(null)

const filteredFuelRecords = computed(() => {
  return fuelRecords.value.filter(record => {
    const matchesVehicle = selectedVehicleId.value ? record.vehicleId === selectedVehicleId.value : true
    const matchesFuelCard = selectedFuelCardId.value ? record.fuelCardId === selectedFuelCardId.value : true
    const matchesDate = searchDate.value ? record.date === searchDate.value : true
    return matchesVehicle && matchesFuelCard && matchesDate
  })
})

const getVehiclePlate = (vehicleId: string) => {
  const vehicle = vehicles.value.find((v) => v.id === vehicleId)
  return vehicle?.licensePlate || 'N/A'
}

const getFuelCardNumber = (fuelCardId: string) => {
  const card = fuelCards.value.find((fc) => fc.id === fuelCardId)
  return card?.cardNumber || 'N/A'
}

onMounted(async () => {
  await Promise.all([getFuelRecords(), getVehicles(), getFuelCards()])
})
</script> 