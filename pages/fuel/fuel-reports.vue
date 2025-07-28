<template>
  <div>
    <h1 class="text-h4 mb-6">Fuel Reports</h1>
    
    <v-card class="mb-6">
      <v-card-title>Fuel Consumption Overview</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-card variant="outlined">
              <v-card-text>
                <div class="text-h6">Total Fuel Cost</div>
                <div class="text-h4">$0.00</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card variant="outlined">
              <v-card-text>
                <div class="text-h6">Average MPG</div>
                <div class="text-h4">0.0</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card variant="outlined">
              <v-card-text>
                <div class="text-h6">Total Gallons</div>
                <div class="text-h4">0.0</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title class="d-flex align-center">
        <span>Recent Fuel Transactions</span>
        <v-spacer></v-spacer>
        <v-btn color="primary" prepend-icon="mdi-filter">
          Filter
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="[]"
          :loading="false"
          class="elevation-1"
        >
          <template v-slot:no-data>
            <v-alert type="info" class="ma-4">
              No fuel transactions found
            </v-alert>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const headers = [
  { title: 'Date', key: 'date' },
  { title: 'Vehicle', key: 'vehicle' },
  { title: 'Card Number', key: 'cardNumber' },
  { title: 'Station', key: 'station' },
  { title: 'Gallons', key: 'gallons' },
  { title: 'Cost', key: 'cost' },
  { title: 'MPG', key: 'mpg' },
]
</script> 