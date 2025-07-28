<template>
  <div class="dashboard-root">
    <div class="dashboard-header">
      <h1 class="dashboard-title">Fleet Management Dashboard</h1>
      <p class="dashboard-subtitle">Comprehensive fleet monitoring and management system</p>
    </div>

    <!-- KPI Cards Row -->
    <div class="kpi-row">
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Total Vehicles"
            :value="vehicles.length.toString()"
            icon="mdi-truck"
            color="primary"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Active Vehicles"
            :value="activeVehicles.length.toString()"
            icon="mdi-check-circle"
            color="success"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Service Due"
            :value="serviceDueVehicles.length.toString()"
            icon="mdi-wrench"
            color="warning"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Open Alerts"
            :value="openAnomalies.length.toString()"
            icon="mdi-alert"
            color="error"
          />
        </v-col>
      </v-row>
    </div>

    <!-- Fuel Management KPIs -->
    <div class="kpi-row">
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Fuel Cards"
            :value="fuelCards.length.toString()"
            icon="mdi-credit-card"
            color="info"
          />
      </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Low Balance Cards"
            :value="lowBalanceCards.length.toString()"
            icon="mdi-currency-usd-off"
            color="error"
          />
      </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Total Fuel Spent"
            :value="`${totalFuelSpent.toLocaleString()} ETB`"
            icon="mdi-gas-station"
            color="warning"
          />
      </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Avg Efficiency"
            :value="`${averageEfficiency.toFixed(1)} km/l`"
            icon="mdi-speedometer"
            color="success"
          />
      </v-col>
    </v-row>
    </div>

    <!-- Main Content Grid -->
    <v-row>
      <!-- Recent Alerts Section -->
      <v-col cols="12" lg="6">
        <v-card class="dashboard-section-card">
          <v-card-title class="dashboard-section-title">
            <v-icon class="me-2" color="error">mdi-alert</v-icon>
            Recent Alerts & Anomalies
          </v-card-title>
          <v-card-text>
            <div v-if="loading" class="text-center py-4">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
            <div v-else-if="openAnomalies.length === 0" class="text-center py-4 text-muted">
              No active alerts
            </div>
            <div v-else class="dashboard-list">
              <div
                v-for="anomaly in openAnomalies.slice(0, 5)"
                :key="anomaly.id"
                class="dashboard-list-item pa-3 mb-2 rounded-lg"
              >
                <div class="d-flex align-center justify-space-between">
                  <div class="flex-grow-1">
                    <div class="d-flex align-center mb-1">
                      <v-chip
                        :color="getSeverityColor(anomaly.severity)"
                        size="small"
                        class="me-2"
                      >
                        {{ anomaly.severity }}
                      </v-chip>
                      <span class="text-caption text-muted">
                        {{ formatDate(anomaly.detectedAt) }}
                      </span>
                    </div>
                    <div class="font-weight-medium">{{ anomaly.description }}</div>
                    <div class="text-caption text-muted">
                      {{ anomaly.licensePlate || anomaly.cardNumber }}
                    </div>
                  </div>
                  <v-btn
                    icon="mdi-eye"
                    size="small"
                    variant="text"
                    color="primary"
                  ></v-btn>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Service Due Vehicles -->
      <v-col cols="12" lg="6">
        <v-card class="dashboard-section-card">
          <v-card-title class="dashboard-section-title">
            <v-icon class="me-2" color="warning">mdi-wrench</v-icon>
            Service Due Vehicles
          </v-card-title>
          <v-card-text>
            <div v-if="serviceDueVehicles.length === 0" class="text-center py-4 text-muted">
              All vehicles are up to date with service
            </div>
            <div v-else class="dashboard-list">
              <div
                v-for="vehicle in serviceDueVehicles.slice(0, 5)"
                :key="vehicle.id"
                class="dashboard-list-item pa-3 mb-2 rounded-lg"
              >
                <div class="d-flex align-center justify-space-between">
                  <div class="flex-grow-1">
                    <div class="font-weight-medium">{{ vehicle.licensePlate }}</div>
                    <div class="text-caption">{{ vehicle.brand }} {{ vehicle.model }}</div>
                    <div class="text-caption text-muted">
                      Overdue by {{ calculateServiceDue(vehicle).overdueBy.toLocaleString() }} km
                  </div>
                  </div>
                  <v-btn
                    icon="mdi-wrench"
                    size="small"
                    variant="text"
                    color="warning"
                  ></v-btn>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

    <!-- Fleet Status Overview -->
      <v-col cols="12">
        <v-card class="dashboard-section-card">
          <v-card-title class="dashboard-section-title">
            <v-icon class="me-2" color="primary">mdi-truck</v-icon>
            Fleet Status Overview
          </v-card-title>
          <v-card-text>
      <v-row>
              <v-col cols="12" md="6">
                <div class="dashboard-list">
                  <div
                    v-for="vehicle in vehicles.slice(0, 6)"
                    :key="vehicle.id"
                    class="dashboard-list-item pa-3 mb-2 rounded-lg"
                  >
                    <div class="d-flex align-center justify-space-between">
                      <div class="flex-grow-1">
                        <div class="d-flex align-center mb-1">
                          <div class="font-weight-medium me-2">{{ vehicle.licensePlate }}</div>
                          <StatusBadge :status="vehicle.status" />
                        </div>
                        <div class="text-caption">{{ vehicle.brand }} {{ vehicle.model }} ({{ vehicle.year }})</div>
                        <div class="text-caption text-muted">
                          {{ vehicle.currentMileage.toLocaleString() }} km • {{ vehicle.assignedDriver }}
              </div>
            </div>
                      <div class="text-right">
                        <div class="text-caption font-weight-medium">
                          {{ vehicle.fuelEfficiency.toFixed(1) }} km/l
                        </div>
                        <div class="text-caption text-muted">Efficiency</div>
              </div>
            </div>
              </div>
            </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="dashboard-status-card pa-4 rounded-lg">
                  <h4 class="mb-3">Quick Actions</h4>
                  <v-row>
                    <v-col cols="6">
                      <v-btn
                        block
                        color="primary"
                        variant="outlined"
                        prepend-icon="mdi-plus"
                        class="mb-2"
                        @click="$router.push('/vehicles')"
                      >
                        Add Vehicle
                      </v-btn>
                    </v-col>
                    <v-col cols="6">
                      <v-btn
                        block
                        color="success"
                        variant="outlined"
                        prepend-icon="mdi-gas-station"
                        class="mb-2"
                        @click="$router.push('/fuel')"
                      >
                        Fuel Entry
                      </v-btn>
                    </v-col>
                    <v-col cols="6">
                      <v-btn
                        block
                        color="info"
                        variant="outlined"
                        prepend-icon="mdi-speedometer"
                        class="mb-2"
                        @click="$router.push('/mileage')"
                      >
                        Mileage Entry
                      </v-btn>
                    </v-col>
                    <v-col cols="6">
                      <v-btn
                        block
                        color="warning"
                        variant="outlined"
                        prepend-icon="mdi-file-chart"
                        class="mb-2"
                        @click="$router.push('/reports')"
                      >
                        Reports
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'

// Composables
const { vehicles, loading, getVehicles, activeVehicles, serviceDueVehicles, calculateServiceDue } = useVehicles()
const { fuelCards, getFuelCards, lowBalanceCards } = useFuel()
const { anomalies, getAnomalies, openAnomalies } = useAnomalies()

// Computed properties
const totalFuelSpent = computed(() => {
  return fuelCards.value.reduce((sum, card) => sum + card.amountSpent, 0)
})

const averageEfficiency = computed(() => {
  if (vehicles.value.length === 0) return 0
  const totalEfficiency = vehicles.value.reduce((sum, vehicle) => sum + vehicle.fuelEfficiency, 0)
  return totalEfficiency / vehicles.value.length
})

// Methods
const getSeverityColor = (severity) => {
  const colors = {
    low: 'success',
    medium: 'warning',
    high: 'error',
    critical: 'error'
  }
  return colors[severity] || 'info'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    getVehicles(),
    getFuelCards(),
    getAnomalies()
  ])
})
</script> 

<style scoped>
.dashboard-root {
  padding-bottom: 32px;
}

.dashboard-header {
  margin-bottom: 32px;
}

.dashboard-title {
  letter-spacing: -0.5px;
  margin-top: 8px;
  font-size: 2rem;
  font-weight: 700;
  color: var(--v-theme-text-primary);
}

.dashboard-subtitle {
  margin-bottom: 32px;
  color: var(--v-theme-text-secondary);
  font-size: 1.1rem;
}

.kpi-row {
  margin-bottom: 32px;
}

.dashboard-section-card {
  border-radius: 18px;
  background: linear-gradient(135deg, #fffde7 0%, #f8fafb 100%);
  box-shadow: 0 2px 12px rgba(16, 30, 54, 0.06);
  margin-bottom: 32px;
  transition: box-shadow 0.2s, transform 0.2s;
}

.dashboard-section-card:hover {
  box-shadow: 0 6px 24px rgba(80, 80, 80, 0.10);
  transform: translateY(-1px);
}

.dashboard-section-title {
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: #212121;
  padding-top: 18px;
  padding-bottom: 8px;
}

.dashboard-list {
  padding: 0 8px 8px 8px;
}

.dashboard-list-item {
  background: linear-gradient(90deg, #e3f2fd 0%, #f8fafb 100%);
  box-shadow: 0 1px 4px rgba(33, 150, 243, 0.06);
  transition: box-shadow 0.2s, transform 0.2s, background 0.2s;
}

.dashboard-list-item:hover {
  box-shadow: 0 4px 16px rgba(33, 150, 243, 0.10);
  background: linear-gradient(90deg, #bbdefb 0%, #f8fafb 100%);
  transform: translateY(-1px) scale(1.01);
}

.dashboard-status-card {
  border-radius: 14px;
  box-shadow: 0 1px 6px rgba(80, 80, 80, 0.04);
  transition: box-shadow 0.2s, transform 0.2s;
  background: linear-gradient(135deg, #f3e5f5 0%, #f8fafb 100%);
}

.dashboard-status-card:hover {
  box-shadow: 0 6px 24px rgba(80, 80, 80, 0.10);
  transform: translateY(-2px) scale(1.01);
}
</style> 