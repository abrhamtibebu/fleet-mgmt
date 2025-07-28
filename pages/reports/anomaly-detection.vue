<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4 mb-2 text-text-primary">Anomaly Detection</h1>
        <p class="text-subtitle-1 text-text-secondary">
          Monitor and analyze unusual patterns in vehicle performance
        </p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-bell-alert">
        Configure Alerts
      </v-btn>
    </div>

    <v-row>
      <v-col cols="12" md="3">
        <v-card>
          <v-card-text>
            <div class="text-subtitle-1 mb-2">Active Alerts</div>
            <div class="text-h4">0</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card>
          <v-card-text>
            <div class="text-subtitle-1 mb-2">Vehicles Monitored</div>
            <div class="text-h4">0</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card>
          <v-card-text>
            <div class="text-subtitle-1 mb-2">Anomalies Detected</div>
            <div class="text-h4">0</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card>
          <v-card-text>
            <div class="text-subtitle-1 mb-2">Resolved Issues</div>
            <div class="text-h4">0</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="mt-6">
      <v-card-title class="d-flex align-center">
        <span>Recent Anomalies</span>
        <v-spacer></v-spacer>
        <v-select
          v-model="selectedSeverity"
          :items="severityLevels"
          label="Severity"
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
          <template v-slot:item.severity="{ item }">
            <v-chip
              :color="getSeverityColor(item.severity)"
              size="small"
            >
              {{ item.severity }}
            </v-chip>
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
              No anomalies detected
            </v-alert>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-row class="mt-6">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Anomaly Distribution</v-card-title>
          <v-card-text>
            <div class="chart-container" style="height: 300px;">
              <canvas ref="anomalyChart"></canvas>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Common Anomaly Types</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="(type, index) in anomalyTypes"
                :key="index"
                :prepend-icon="type.icon"
                :title="type.title"
                :subtitle="type.description"
              >
                <template v-slot:append>
                  <v-chip
                    :color="type.severity === 'High' ? 'error' : 'warning'"
                    size="small"
                  >
                    {{ type.severity }}
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

const selectedSeverity = ref('all')
const severityLevels = [
  { title: 'All Severities', value: 'all' },
  { title: 'High', value: 'high' },
  { title: 'Medium', value: 'medium' },
  { title: 'Low', value: 'low' },
]

const headers = [
  { title: 'Vehicle', key: 'vehicle', sortable: true },
  { title: 'Type', key: 'type', sortable: true },
  { title: 'Severity', key: 'severity', sortable: true },
  { title: 'Detected', key: 'detected', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false },
]

const anomalyTypes = [
  {
    icon: 'mdi-gas-station',
    title: 'Unusual Fuel Consumption',
    description: 'Sudden increase in fuel usage',
    severity: 'High',
  },
  {
    icon: 'mdi-speedometer',
    title: 'Speed Anomalies',
    description: 'Unusual speed patterns',
    severity: 'Medium',
  },
  {
    icon: 'mdi-engine',
    title: 'Engine Performance',
    description: 'Irregular engine behavior',
    severity: 'High',
  },
]

const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'high':
      return 'error'
    case 'medium':
      return 'warning'
    case 'low':
      return 'info'
    default:
      return 'grey'
  }
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'resolved':
      return 'success'
    case 'investigating':
      return 'warning'
    case 'new':
      return 'error'
    default:
      return 'grey'
  }
}

let anomalyChart: Chart | null = null

onMounted(() => {
  const ctx = document.querySelector('canvas')?.getContext('2d')
  if (ctx) {
    anomalyChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Fuel', 'Speed', 'Engine', 'Other'],
        datasets: [
          {
            label: 'Anomalies by Type',
            data: [0, 0, 0, 0],
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(75, 192, 192, 0.5)',
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 206, 86)',
              'rgb(75, 192, 192)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    })
  }
})
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
}
</style> 