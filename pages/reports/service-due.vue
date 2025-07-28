<template>
  <div>
    <h1 class="text-h4 mb-2 font-weight-bold">Maintenance Management</h1>
    <p class="text-subtitle-1 text-medium-emphasis mb-6">
      Track service schedules, maintenance history, and costs
    </p>

    <!-- KPI Cards -->
    <v-row class="mb-4">
      <v-col cols="12" md="3">
        <KpiCard title="Total Cost (YTD)" value="14,000 ETB" icon="mdi-currency-usd" trend="Jan 2024" trendClass="text-caption" />
      </v-col>
      <v-col cols="12" md="3">
        <KpiCard title="Services Due" value="3" icon="mdi-alert-outline" trend="Within 30 days" trendClass="text-error" />
      </v-col>
      <v-col cols="12" md="3">
        <KpiCard title="Completed" value="2" icon="mdi-check-circle-outline" trend="This month" trendClass="text-success" />
      </v-col>
      <v-col cols="12" md="3">
        <KpiCard title="Pending" value="1" icon="mdi-timer-sand" trend="Requires action" trendClass="text-warning" />
      </v-col>
    </v-row>

    <div class="d-flex justify-space-between align-center mb-4 flex-wrap">
      <v-tabs v-model="tab" color="primary" class="mb-2">
        <v-tab value="upcoming">Upcoming Services</v-tab>
        <v-tab value="history">Maintenance History</v-tab>
        <v-tab value="schedule">Service Schedule</v-tab>
      </v-tabs>
      <div>
        <v-btn color="primary" variant="outlined" class="mr-2">Schedule Service</v-btn>
        <v-btn color="primary" prepend-icon="mdi-plus">Add Record</v-btn>
      </div>
    </div>

    <v-window v-model="tab">
      <v-window-item value="upcoming">
        <v-card class="pa-0">
          <v-card-title>Upcoming Maintenance</v-card-title>
          <v-card-text class="pa-0">
            <v-list density="compact" class="bg-transparent">
              <v-list-item v-for="item in upcomingMaintenance" :key="item.id" class="mb-2 pa-2 rounded-lg">
                <div class="d-flex align-center justify-space-between w-100">
                  <div class="d-flex align-center">
                    <v-icon color="primary" class="mr-2">mdi-wrench-outline</v-icon>
                    <div>
                      <div class="font-weight-medium">{{ item.vehicleId }}</div>
                      <div class="text-caption text-medium-emphasis">{{ item.type }}</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-weight-bold">Due Date: {{ item.date }}</div>
                    <div class="text-caption">Mileage: {{ item.mileage }} km</div>
                  </div>
                  <v-chip :color="item.urgencyColor" size="small" class="ml-4">{{ item.urgency }}</v-chip>
                  <v-btn color="primary" class="ml-4">Schedule</v-btn>
                </div>
              </v-list-item>
              <v-list-item v-if="upcomingMaintenance.length === 0" class="bg-transparent">
                <v-list-item-title class="text-center text-text-medium-emphasis">No upcoming maintenance.</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item value="history">
        <v-card class="pa-0">
          <v-card-title>Maintenance History</v-card-title>
          <v-card-text>
            <div class="text-center pa-4">
              <v-icon size="64" color="primary">mdi-history</v-icon>
              <div class="text-subtitle-1 mt-2">Maintenance history will be displayed here</div>
            </div>
          </v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item value="schedule">
        <v-card class="pa-0">
          <v-card-title>Service Schedule</v-card-title>
          <v-card-text>
            <div class="text-center pa-4">
              <v-icon size="64" color="primary">mdi-calendar-clock</v-icon>
              <div class="text-subtitle-1 mt-2">Service schedule will be displayed here</div>
            </div>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KpiCard from '~/components/KpiCard.vue'

const tab = ref('upcoming')

const upcomingMaintenance = ref([
  { id: 1, vehicleId: 'FL-001-ABC', type: 'Regular Service', date: '2024-01-25', mileage: '45,000', urgency: 'High', urgencyColor: 'error' },
  { id: 2, vehicleId: 'FL-004-JKL', type: 'Oil Change', date: '2024-01-28', mileage: '32,500', urgency: 'Medium', urgencyColor: 'warning' },
  { id: 3, vehicleId: 'FL-007-MNO', type: 'Tire Rotation', date: '2024-02-02', mileage: '28,000', urgency: 'Low', urgencyColor: 'info' },
])
</script> 