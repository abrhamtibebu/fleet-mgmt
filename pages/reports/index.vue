<template>
  <div class="reports-root">
    <div class="reports-header">
      <h1 class="reports-title">Reports & Analytics</h1>
      <p class="reports-subtitle">Generate comprehensive fleet reports and export data</p>
    </div>

    <!-- Report Types Grid -->
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card class="report-card" @click="generateReport('monthly-vehicle')">
          <v-card-text class="text-center pa-6">
            <v-icon size="48" color="primary" class="mb-3">mdi-file-chart</v-icon>
            <h3 class="text-h6 mb-2">Monthly Vehicle Report</h3>
            <p class="text-muted">Total km, fuel consumption, and efficiency per vehicle</p>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card class="report-card" @click="generateReport('fuel-card-balance')">
          <v-card-text class="text-center pa-6">
            <v-icon size="48" color="success" class="mb-3">mdi-credit-card</v-icon>
            <h3 class="text-h6 mb-2">Fuel Card Balance</h3>
            <p class="text-muted">Current balances, spending patterns, and low balance alerts</p>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card class="report-card" @click="generateReport('refill-history')">
          <v-card-text class="text-center pa-6">
            <v-icon size="48" color="warning" class="mb-3">mdi-gas-station</v-icon>
            <h3 class="text-h6 mb-2">Refill History</h3>
            <p class="text-muted">Detailed fuel refill records with station and cost analysis</p>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card class="report-card" @click="generateReport('service-due')">
          <v-card-text class="text-center pa-6">
            <v-icon size="48" color="error" class="mb-3">mdi-wrench</v-icon>
            <h3 class="text-h6 mb-2">Service Due Report</h3>
            <p class="text-muted">Vehicles due for service and maintenance scheduling</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Analytics -->
    <v-row class="mt-6">
      <v-col cols="12" lg="8">
        <v-card class="reports-section-card">
          <v-card-title class="reports-section-title">
            <v-icon class="me-2" color="primary">mdi-chart-line</v-icon>
            Fleet Performance Overview
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <div class="analytics-item">
                  <h4 class="text-h6 mb-3">Top Performing Vehicles</h4>
                  <div
                    v-for="vehicle in topPerformingVehicles"
                    :key="vehicle.id"
                    class="performance-item"
                  >
                    <div class="d-flex align-center justify-space-between">
                      <div>
                        <div class="font-weight-medium">{{ vehicle.licensePlate }}</div>
                        <div class="text-caption">{{ vehicle.brand }} {{ vehicle.model }}</div>
                      </div>
                      <v-chip color="success" size="small">
                        {{ vehicle.fuelEfficiency.toFixed(1) }} km/l
                      </v-chip>
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="analytics-item">
                  <h4 class="text-h6 mb-3">Fuel Cost Analysis</h4>
                  <div class="cost-breakdown">
                    <div class="cost-item">
                      <span class="cost-label">Total Spent:</span>
                      <span class="cost-value">{{ totalFuelSpent.toLocaleString() }} ETB</span>
                    </div>
                    <div class="cost-item">
                      <span class="cost-label">Average per Vehicle:</span>
                      <span class="cost-value">{{ averageFuelCost.toFixed(0) }} ETB</span>
                    </div>
                    <div class="cost-item">
                      <span class="cost-label">This Month:</span>
                      <span class="cost-value">{{ monthlyFuelCost.toLocaleString() }} ETB</span>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" lg="4">
        <v-card class="reports-section-card">
          <v-card-title class="reports-section-title">
            <v-icon class="me-2" color="warning">mdi-alert</v-icon>
            Active Alerts
          </v-card-title>
          <v-card-text>
            <div v-if="activeAlerts.length === 0" class="text-center py-4 text-muted">
              No active alerts
            </div>
            <div v-else class="alerts-list">
              <div
                v-for="alert in activeAlerts.slice(0, 5)"
                :key="alert.id"
                class="alert-item"
              >
                <div class="d-flex align-center">
                  <v-icon
                    :color="getAlertColor(alert.severity)"
                    size="small"
                    class="me-2"
                  >
                    mdi-alert-circle
                  </v-icon>
                  <div class="flex-grow-1">
                    <div class="font-weight-medium">{{ alert.description }}</div>
                    <div class="text-caption text-muted">
                      {{ alert.licensePlate || alert.cardNumber }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Export Options -->
    <v-card class="reports-section-card mt-6">
      <v-card-title class="reports-section-title">
        <v-icon class="me-2" color="info">mdi-download</v-icon>
        Export Data
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-btn
              block
              color="primary"
              variant="outlined"
              prepend-icon="mdi-file-excel"
              class="export-btn"
              @click="exportToExcel"
            >
              Export to Excel
            </v-btn>
          </v-col>
          <v-col cols="12" md="4">
            <v-btn
              block
              color="success"
              variant="outlined"
              prepend-icon="mdi-file-pdf"
              class="export-btn"
              @click="exportToPDF"
            >
              Export to PDF
            </v-btn>
          </v-col>
          <v-col cols="12" md="4">
            <v-btn
              block
              color="info"
              variant="outlined"
              prepend-icon="mdi-file-csv"
              class="export-btn"
              @click="exportToCSV"
            >
              Export to CSV
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Composables
const { vehicles, getVehicles, serviceDueVehicles } = useVehicles()
const { fuelRecords, fuelCards, getFuelRecords, getFuelCards } = useFuel()
const { anomalies, getAnomalies } = useAnomalies()

// Reactive data
const loading = ref(false)

// Computed properties
const topPerformingVehicles = computed(() => {
  return [...vehicles.value]
    .sort((a, b) => b.fuelEfficiency - a.fuelEfficiency)
    .slice(0, 5)
})

const totalFuelSpent = computed(() => {
  return fuelCards.value.reduce((sum, card) => sum + card.amountSpent, 0)
})

const averageFuelCost = computed(() => {
  if (vehicles.value.length === 0) return 0
  return totalFuelSpent.value / vehicles.value.length
})

const monthlyFuelCost = computed(() => {
  // This would be calculated from actual monthly data
  return totalFuelSpent.value * 0.1 // Placeholder: 10% of total
})

const activeAlerts = computed(() => {
  return anomalies.value.filter(alert => alert.status === 'open')
})

// Methods
const generateReport = (reportType) => {
  console.log('Generating report:', reportType)
  // TODO: Implement report generation logic
}

const getAlertColor = (severity) => {
  const colors = {
    low: 'success',
    medium: 'warning',
    high: 'error',
    critical: 'error'
  }
  return colors[severity] || 'info'
}

const exportToExcel = () => {
  console.log('Exporting to Excel')
}

const exportToPDF = () => {
  console.log('Exporting to PDF')
}

const exportToCSV = () => {
  console.log('Exporting to CSV')
}

// Lifecycle
onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      getVehicles(),
      getFuelRecords(),
      getFuelCards(),
      getAnomalies()
    ])
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.reports-root {
  padding-bottom: 32px;
}

.reports-header {
  margin-bottom: 32px;
}

.reports-title {
  letter-spacing: -0.5px;
  margin-top: 8px;
  font-size: 2rem;
  font-weight: 700;
  color: var(--v-theme-text-primary);
}

.reports-subtitle {
  margin-bottom: 32px;
  color: var(--v-theme-text-secondary);
  font-size: 1.1rem;
}

.report-card {
  border-radius: 18px;
  background: linear-gradient(135deg, #fffde7 0%, #f8fafb 100%);
  box-shadow: 0 2px 12px rgba(16, 30, 54, 0.06);
  transition: box-shadow 0.2s, transform 0.2s;
  cursor: pointer;
}

.report-card:hover {
  box-shadow: 0 8px 32px rgba(80, 80, 80, 0.12);
  transform: translateY(-2px) scale(1.02);
}

.reports-section-card {
  border-radius: 18px;
  background: linear-gradient(135deg, #fffde7 0%, #f8fafb 100%);
  box-shadow: 0 2px 12px rgba(16, 30, 54, 0.06);
  margin-bottom: 24px;
  transition: box-shadow 0.2s, transform 0.2s;
}

.reports-section-card:hover {
  box-shadow: 0 6px 24px rgba(80, 80, 80, 0.10);
  transform: translateY(-1px);
}

.reports-section-title {
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: #212121;
  padding-top: 18px;
  padding-bottom: 8px;
}

.analytics-item {
  padding: 16px;
}

.performance-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f1f3;
}

.performance-item:last-child {
  border-bottom: none;
}

.cost-breakdown {
  padding: 16px;
}

.cost-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 8px 0;
}

.cost-label {
  color: var(--v-theme-text-secondary);
  font-weight: 500;
}

.cost-value {
  font-weight: 600;
  color: var(--v-theme-text-primary);
}

.alerts-list {
  padding: 0 8px 8px 8px;
}

.alert-item {
  padding: 12px;
  margin-bottom: 8px;
  background: linear-gradient(90deg, #e3f2fd 0%, #f8fafb 100%);
  border-radius: 8px;
  border-left: 4px solid var(--v-theme-primary);
}

.export-btn {
  font-weight: 600;
  border-radius: 10px;
  min-width: 160px;
  margin-bottom: 8px;
}
</style> 