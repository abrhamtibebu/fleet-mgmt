<template>
  <div>
    <h1 class="text-h4 mb-2 text-text-primary">All Reports</h1>
    <p class="text-subtitle-1 text-text-secondary mb-6">
      Access a comprehensive overview of all fleet management reports
    </p>

    <v-card class="bg-surface pa-6 mb-6">
      <v-card-title class="text-text-primary">Report Categories</v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            v-for="report in reportCategories"
            :key="report.title"
            cols="12" sm="6" md="4"
          >
            <v-card class="d-flex flex-column bg-background elevation-2" hover :to="report.to">
              <v-card-title class="text-primary font-weight-bold">{{ report.title }}</v-card-title>
              <v-card-text class="text-text-secondary">{{ report.description }}</v-card-text>
              <v-card-actions class="mt-auto">
                <v-btn text color="secondary" :to="report.to">View Report <v-icon right>mdi-arrow-right</v-icon></v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card class="bg-surface pa-6 mt-6">
      <v-card-title class="text-text-primary">Quick Access: Recent Reports</v-card-title>
      <v-card-text>
        <v-list class="bg-transparent">
          <v-list-item
            v-for="recent in recentReports"
            :key="recent.id"
            :to="recent.to"
            link
            class="rounded-lg mb-2 bg-background"
          >
            <v-list-item-title class="text-text-primary">{{ recent.name }}</v-list-item-title>
            <v-list-item-subtitle class="text-text-secondary">Generated: {{ new Date(recent.date).toLocaleDateString() }}</v-list-item-subtitle>
            <template v-slot:append>
              <v-icon color="primary">mdi-open-in-new</v-icon>
            </template>
          </v-list-item>
          <v-list-item v-if="recentReports.length === 0">
            <v-list-item-title class="text-center text-text-secondary">No recent reports.</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const reportCategories = [
  {
    title: 'Monthly Vehicle Report',
    description: 'Detailed monthly overview of vehicle performance and service status.',
    to: '/reports/monthly-vehicle',
  },
  {
    title: 'Fuel Consumption Analysis',
    description: 'Analyze fuel usage, efficiency, and cost over selected periods.',
    to: '/fuel/fuel-reports',
  },
  {
    title: 'Fuel Card Balance & Usage',
    description: 'Track fuel card expenditures and remaining balances.',
    to: '/fuel/card-overview',
  },
  {
    title: 'Service Due & Maintenance',
    description: 'Identify vehicles due for service and overdue maintenance tasks.',
    to: '/reports/service-due',
  },
  {
    title: 'Anomaly Detection',
    description: 'Flag unusual patterns in fuel consumption or mileage.',
    to: '/reports/anomaly-detection',
  },
  {
    title: 'Driver Behavior Report',
    description: 'Evaluate driver efficiency and identify areas for improvement.',
    to: '/reports/driver-behavior',
  },
]

const recentReports = ref([
  { id: 'r1', name: 'June 2024 Fuel Summary', date: '2024-07-01', to: '/fuel/fuel-reports' },
  { id: 'r2', name: 'Vehicle Service Due - Q2 2024', date: '2024-06-25', to: '/reports/service-due' },
  { id: 'r3', name: 'May 2024 Fleet Overview', date: '2024-06-01', to: '/reports/monthly-vehicle' },
])
</script> 