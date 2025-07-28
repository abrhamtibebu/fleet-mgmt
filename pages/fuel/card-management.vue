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
          :items="[]"
          :search="search"
          :loading="false"
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

          <template v-slot:item.actions="{ item }">
            <v-btn
              icon="mdi-pencil"
              variant="text"
              size="small"
              color="primary"
              class="mr-2"
            ></v-btn>
            <v-btn
              icon="mdi-delete"
              variant="text"
              size="small"
              color="error"
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
            <div class="text-h6 mb-2">$0.00</div>
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
            <div class="text-h6 mb-2">0</div>
            <div class="text-caption text-medium-emphasis">Total active cards</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const search = ref('')

const headers = [
  { title: 'Card Number', key: 'cardNumber', sortable: true },
  { title: 'Cardholder', key: 'cardholder', sortable: true },
  { title: 'Vehicle', key: 'vehicle', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Last Used', key: 'lastUsed', sortable: true },
  { title: 'Monthly Limit', key: 'monthlyLimit', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false },
]
</script> 