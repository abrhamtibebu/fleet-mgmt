<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <h1 class="text-h4">Monthly Vehicle Reports</h1>
      <v-btn color="primary" prepend-icon="mdi-download">
        Export Report
      </v-btn>
    </div>

    <v-row>
      <v-col cols="12" md="3">
        <v-card>
          <v-card-text>
            <div class="text-subtitle-1 mb-2">Total Vehicles</div>
            <div class="text-h4">0</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card>
          <v-card-text>
            <div class="text-subtitle-1 mb-2">Total Mileage</div>
            <div class="text-h4">0 mi</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card>
          <v-card-text>
            <div class="text-subtitle-1 mb-2">Fuel Cost</div>
            <div class="text-h4">$0.00</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card>
          <v-card-text>
            <div class="text-subtitle-1 mb-2">Avg. MPG</div>
            <div class="text-h4">0.0</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="mt-6">
      <v-card-title class="d-flex align-center">
        <span>Vehicle Performance</span>
        <v-spacer></v-spacer>
        <v-select
          v-model="selectedMonth"
          :items="months"
          label="Select Month"
          density="compact"
          class="max-width-200"
        ></v-select>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="[]"
          :loading="false"
          class="elevation-1"
        >
          <template v-slot:item.fuelEfficiency="{ item }">
            {{ item.fuelEfficiency }} MPG
          </template>

          <template v-slot:item.status="{ item }">
            <v-chip
              :color="getStatusColor(item.status)"
              size="small"
            >
              {{ item.status }}
            </v-chip>
          </template>

          <template v-slot:no-data>
            <v-alert type="info" class="ma-4">
              No vehicle data available for the selected month
            </v-alert>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-row class="mt-6">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Mileage Distribution</v-card-title>
          <v-card-text>
            <div class="text-center pa-4">
              <v-icon size="64" color="primary">mdi-chart-bar</v-icon>
              <div class="text-subtitle-1 mt-2">Chart will be displayed here</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Fuel Efficiency Trends</v-card-title>
          <v-card-text>
            <div class="text-center pa-4">
              <v-icon size="64" color="primary">mdi-chart-line</v-icon>
              <div class="text-subtitle-1 mt-2">Chart will be displayed here</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedMonth = ref('')
const months = [
  'January 2024',
  'February 2024',
  'March 2024',
  'April 2024',
  'May 2024',
  'June 2024',
]

const headers = [
  { title: 'Vehicle ID', key: 'vehicleId', sortable: true },
  { title: 'Make & Model', key: 'makeModel', sortable: true },
  { title: 'Total Mileage', key: 'mileage', sortable: true },
  { title: 'Fuel Cost', key: 'fuelCost', sortable: true },
  { title: 'Fuel Efficiency', key: 'fuelEfficiency', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
]

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'success'
    case 'maintenance':
      return 'warning'
    case 'inactive':
      return 'error'
    default:
      return 'grey'
  }
}
</script> 