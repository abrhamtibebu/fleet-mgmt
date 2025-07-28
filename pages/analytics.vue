<template>
  <div class="analytics-root">
    <div class="analytics-header">
      <h1 class="analytics-title">Fleet Analytics</h1>
      <p class="analytics-subtitle">Comprehensive performance metrics, trend analysis, and data insights</p>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-row">
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Total Fleet Value"
            :value="`${totalFleetValue.toLocaleString()} ETB`"
            icon="mdi-currency-usd"
            color="primary"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Avg Fuel Efficiency"
            :value="`${averageFuelEfficiency.toFixed(1)} km/l`"
            icon="mdi-gas-station"
            color="success"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Monthly Fuel Cost"
            :value="`${monthlyFuelCost.toLocaleString()} ETB`"
            icon="mdi-chart-line"
            color="warning"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Fleet Utilization"
            :value="`${fleetUtilization.toFixed(1)}%`"
            icon="mdi-speedometer"
            color="info"
          />
        </v-col>
      </v-row>
    </div>

    <!-- Analytics Dashboard -->
    <v-row>
      <!-- Performance Overview -->
      <v-col cols="12" lg="8">
        <v-card class="analytics-section-card">
          <v-card-title class="analytics-section-title">
            <v-icon class="me-2" color="primary">mdi-chart-line</v-icon>
            Performance Overview
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <div class="performance-chart">
                  <h4 class="text-h6 mb-3">Fuel Efficiency Trends</h4>
                  <div class="chart-placeholder">
                    <v-icon size="64" color="grey-lighten-1">mdi-chart-line</v-icon>
                    <p class="text-muted mt-2">Fuel efficiency trend chart will be displayed here</p>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="performance-chart">
                  <h4 class="text-h6 mb-3">Cost Analysis</h4>
                  <div class="chart-placeholder">
                    <v-icon size="64" color="grey-lighten-1">mdi-chart-pie</v-icon>
                    <p class="text-muted mt-2">Cost breakdown chart will be displayed here</p>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Key Metrics -->
      <v-col cols="12" lg="4">
        <v-card class="analytics-section-card">
          <v-card-title class="analytics-section-title">
            <v-icon class="me-2" color="success">mdi-chart-box</v-icon>
            Key Metrics
          </v-card-title>
          <v-card-text>
            <div class="metrics-list">
              <div class="metric-item">
                <div class="metric-label">Total Distance</div>
                <div class="metric-value">{{ totalDistance.toLocaleString() }} km</div>
                <div class="metric-trend positive">+12.5% vs last month</div>
              </div>
              <div class="metric-item">
                <div class="metric-label">Fuel Consumption</div>
                <div class="metric-value">{{ totalFuelConsumption.toLocaleString() }} L</div>
                <div class="metric-trend negative">-5.2% vs last month</div>
              </div>
              <div class="metric-item">
                <div class="metric-label">Maintenance Cost</div>
                <div class="metric-value">{{ totalMaintenanceCost.toLocaleString() }} ETB</div>
                <div class="metric-trend positive">+8.7% vs last month</div>
              </div>
              <div class="metric-item">
                <div class="metric-label">Vehicle Uptime</div>
                <div class="metric-value">{{ vehicleUptime.toFixed(1) }}%</div>
                <div class="metric-trend positive">+2.1% vs last month</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Detailed Analytics -->
    <v-row class="mt-6">
      <!-- Vehicle Performance Ranking -->
      <v-col cols="12" lg="6">
        <v-card class="analytics-section-card">
          <v-card-title class="analytics-section-title">
            <v-icon class="me-2" color="warning">mdi-trophy</v-icon>
            Vehicle Performance Ranking
          </v-card-title>
          <v-card-text>
            <div class="performance-ranking">
              <div
                v-for="(vehicle, index) in topPerformingVehicles"
                :key="vehicle.id"
                class="ranking-item"
              >
                <div class="ranking-position">
                  <v-icon
                    :color="getRankingColor(index)"
                    size="small"
                    class="me-2"
                  >
                    {{ getRankingIcon(index) }}
                  </v-icon>
                  <span class="ranking-number">{{ index + 1 }}</span>
                </div>
                <div class="vehicle-info">
                  <div class="vehicle-license">{{ vehicle.licensePlate }}</div>
                  <div class="vehicle-model">{{ vehicle.brand }} {{ vehicle.model }}</div>
                </div>
                <div class="performance-stats">
                  <div class="stat-item">
                    <span class="stat-label">Efficiency:</span>
                    <span class="stat-value">{{ vehicle.fuelEfficiency.toFixed(1) }} km/l</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Distance:</span>
                    <span class="stat-value">{{ vehicle.currentMileage.toLocaleString() }} km</span>
                  </div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Cost Analysis -->
      <v-col cols="12" lg="6">
        <v-card class="analytics-section-card">
          <v-card-title class="analytics-section-title">
            <v-icon class="me-2" color="error">mdi-currency-usd</v-icon>
            Cost Analysis
          </v-card-title>
          <v-card-text>
            <div class="cost-breakdown">
              <div class="cost-item">
                <div class="cost-label">Fuel Costs</div>
                <div class="cost-value">{{ fuelCosts.toLocaleString() }} ETB</div>
                <div class="cost-percentage">45%</div>
                <v-progress-linear
                  model-value="45"
                  color="error"
                  height="8"
                  rounded
                ></v-progress-linear>
              </div>
              <div class="cost-item">
                <div class="cost-label">Maintenance</div>
                <div class="cost-value">{{ maintenanceCosts.toLocaleString() }} ETB</div>
                <div class="cost-percentage">30%</div>
                <v-progress-linear
                  model-value="30"
                  color="warning"
                  height="8"
                  rounded
                ></v-progress-linear>
              </div>
              <div class="cost-item">
                <div class="cost-label">Insurance</div>
                <div class="cost-value">{{ insuranceCosts.toLocaleString() }} ETB</div>
                <div class="cost-percentage">15%</div>
                <v-progress-linear
                  model-value="15"
                  color="info"
                  height="8"
                  rounded
                ></v-progress-linear>
              </div>
              <div class="cost-item">
                <div class="cost-label">Other</div>
                <div class="cost-value">{{ otherCosts.toLocaleString() }} ETB</div>
                <div class="cost-percentage">10%</div>
                <v-progress-linear
                  model-value="10"
                  color="success"
                  height="8"
                  rounded
                ></v-progress-linear>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Trend Analysis -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card class="analytics-section-card">
          <v-card-title class="analytics-section-title">
            <v-icon class="me-2" color="info">mdi-trending-up</v-icon>
            Trend Analysis
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <div class="trend-card">
                  <h4 class="text-h6 mb-3">Monthly Fuel Consumption</h4>
                  <div class="trend-chart">
                    <v-icon size="48" color="grey-lighten-1">mdi-chart-line</v-icon>
                    <p class="text-muted mt-2">Monthly fuel consumption trend</p>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="trend-card">
                  <h4 class="text-h6 mb-3">Distance Traveled</h4>
                  <div class="trend-chart">
                    <v-icon size="48" color="grey-lighten-1">mdi-map-marker-distance</v-icon>
                    <p class="text-muted mt-2">Monthly distance traveled trend</p>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="trend-card">
                  <h4 class="text-h6 mb-3">Maintenance Costs</h4>
                  <div class="trend-chart">
                    <v-icon size="48" color="grey-lighten-1">mdi-wrench</v-icon>
                    <p class="text-muted mt-2">Monthly maintenance cost trend</p>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Export Options -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card class="analytics-section-card">
          <v-card-title class="analytics-section-title">
            <v-icon class="me-2" color="success">mdi-download</v-icon>
            Export Analytics
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="3">
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
              <v-col cols="12" sm="6" md="3">
                <v-btn
                  block
                  color="error"
                  variant="outlined"
                  prepend-icon="mdi-file-pdf-box"
                  class="export-btn"
                  @click="exportToPDF"
                >
                  Export to PDF
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-btn
                  block
                  color="success"
                  variant="outlined"
                  prepend-icon="mdi-file-csv"
                  class="export-btn"
                  @click="exportToCSV"
                >
                  Export to CSV
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-btn
                  block
                  color="info"
                  variant="outlined"
                  prepend-icon="mdi-chart-box"
                  class="export-btn"
                  @click="generateReport"
                >
                  Generate Report
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Composables
const { vehicles, getVehicles } = useVehicles()
const { fuelRecords, getFuelRecords } = useFuel()

// Reactive data
const totalFleetValue = ref(25000000) // 25M ETB
const monthlyFuelCost = ref(125000) // 125K ETB
const fleetUtilization = ref(78.5) // 78.5%

// Computed properties
const averageFuelEfficiency = computed(() => {
  if (vehicles.value.length === 0) return 0
  const totalEfficiency = vehicles.value.reduce((sum, vehicle) => sum + vehicle.fuelEfficiency, 0)
  return totalEfficiency / vehicles.value.length
})

const totalDistance = computed(() => 
  vehicles.value.reduce((sum, vehicle) => sum + vehicle.currentMileage, 0)
)

const totalFuelConsumption = computed(() => {
  return fuelRecords.value.reduce((sum, record) => sum + record.quantity, 0)
})

const totalMaintenanceCost = ref(85000) // 85K ETB
const vehicleUptime = ref(94.2) // 94.2%

const topPerformingVehicles = computed(() => {
  return [...vehicles.value]
    .sort((a, b) => b.fuelEfficiency - a.fuelEfficiency)
    .slice(0, 5)
})

// Cost breakdown
const fuelCosts = ref(225000) // 225K ETB
const maintenanceCosts = ref(150000) // 150K ETB
const insuranceCosts = ref(75000) // 75K ETB
const otherCosts = ref(50000) // 50K ETB

// Methods
const getRankingColor = (index) => {
  const colors = ['#FFD700', '#C0C0C0', '#CD7F32', '#4CAF50', '#2196F3']
  return colors[index] || '#9E9E9E'
}

const getRankingIcon = (index) => {
  const icons = ['mdi-trophy', 'mdi-medal', 'mdi-medal-outline', 'mdi-star', 'mdi-star-outline']
  return icons[index] || 'mdi-circle'
}

const exportToExcel = () => {
  console.log('Export to Excel')
}

const exportToPDF = () => {
  console.log('Export to PDF')
}

const exportToCSV = () => {
  console.log('Export to CSV')
}

const generateReport = () => {
  console.log('Generate analytics report')
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    getVehicles(),
    getFuelRecords()
  ])
})
</script>

<style scoped>
.analytics-root {
  padding-bottom: 32px;
}

.analytics-header {
  margin-bottom: 32px;
}

.analytics-title {
  letter-spacing: -0.5px;
  margin-top: 8px;
  font-size: 2rem;
  font-weight: 700;
  color: var(--v-theme-text-primary);
}

.analytics-subtitle {
  margin-bottom: 32px;
  color: var(--v-theme-text-secondary);
  font-size: 1.1rem;
}

.kpi-row {
  margin-bottom: 32px;
}

.analytics-section-card {
  border-radius: 18px;
  background: linear-gradient(135deg, #fffde7 0%, #f8fafb 100%);
  box-shadow: 0 2px 12px rgba(16, 30, 54, 0.06);
  margin-bottom: 24px;
  transition: box-shadow 0.2s, transform 0.2s;
}

.analytics-section-card:hover {
  box-shadow: 0 6px 24px rgba(80, 80, 80, 0.10);
  transform: translateY(-1px);
}

.analytics-section-title {
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: #212121;
  padding-top: 18px;
  padding-bottom: 8px;
}

.performance-chart {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
  border-radius: 12px;
  border: 2px dashed #ccc;
}

.metrics-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.metric-item {
  padding: 16px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  border-left: 4px solid var(--v-theme-primary);
}

.metric-label {
  font-size: 0.9rem;
  color: var(--v-theme-text-secondary);
  margin-bottom: 4px;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--v-theme-text-primary);
  margin-bottom: 4px;
}

.metric-trend {
  font-size: 0.8rem;
  font-weight: 500;
}

.metric-trend.positive {
  color: var(--v-theme-success);
}

.metric-trend.negative {
  color: var(--v-theme-error);
}

.performance-ranking {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  transition: transform 0.2s;
}

.ranking-item:hover {
  transform: translateY(-1px);
}

.ranking-position {
  display: flex;
  align-items: center;
  margin-right: 16px;
  min-width: 60px;
}

.ranking-number {
  font-weight: 600;
  color: var(--v-theme-text-primary);
}

.vehicle-info {
  flex-grow: 1;
  margin-right: 16px;
}

.vehicle-license {
  font-weight: 600;
  color: var(--v-theme-text-primary);
}

.vehicle-model {
  font-size: 0.9rem;
  color: var(--v-theme-text-secondary);
}

.performance-stats {
  text-align: right;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 0.9rem;
}

.stat-label {
  color: var(--v-theme-text-secondary);
}

.stat-value {
  font-weight: 500;
  color: var(--v-theme-text-primary);
}

.cost-breakdown {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cost-item {
  padding: 12px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
}

.cost-label {
  font-weight: 500;
  color: var(--v-theme-text-primary);
  margin-bottom: 4px;
}

.cost-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--v-theme-text-primary);
  margin-bottom: 4px;
}

.cost-percentage {
  font-size: 0.9rem;
  color: var(--v-theme-text-secondary);
  margin-bottom: 8px;
}

.trend-card {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.trend-chart {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
  border-radius: 12px;
  border: 2px dashed #ccc;
}

.export-btn {
  font-weight: 600;
  border-radius: 10px;
  min-width: 160px;
}
</style> 