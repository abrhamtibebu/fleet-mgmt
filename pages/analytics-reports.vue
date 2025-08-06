<template>
  <div class="analytics-reports-root glass-bg">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Analytics & Reports</h1>
          <p class="page-subtitle">Comprehensive fleet analytics, performance metrics, and report generation</p>
        </div>
        <div class="header-actions">
          <v-btn
            color="primary"
            prepend-icon="mdi-download"
            class="header-btn"
            @click="exportAllData"
          >
            Export All
          </v-btn>
          <v-btn
            color="success"
            prepend-icon="mdi-chart-box"
            class="header-btn"
            @click="generateComprehensiveReport"
          >
            Generate Report
          </v-btn>
        </div>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-section">
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <KpiCard
            title="Total Fleet Value"
            :value="`${totalFleetValue.toLocaleString()} ETB`"
            icon="mdi-currency-usd"
            color="primary"
            @click="showFleetValueBreakdown"
          />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <KpiCard
            title="Avg Fuel Efficiency"
            :value="`${averageFuelEfficiency.toFixed(1)} km/l`"
            icon="mdi-gas-station"
            color="success"
            @click="showEfficiencyAnalysis"
          />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <KpiCard
            title="Monthly Fuel Cost"
            :value="`${monthlyFuelCost.toLocaleString()} ETB`"
            icon="mdi-chart-line"
            color="warning"
            @click="showFuelCostAnalysis"
          />
        </v-col>
        <!-- <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Fleet Utilization"
            :value="`${fleetUtilization.toFixed(1)}%`"
            icon="mdi-speedometer"
            color="info"
            @click="showUtilizationAnalysis"
          />
        </v-col> -->
      </v-row>
    </div>

    <!-- Modern Analytics Grid -->
    <v-row class="analytics-main-grid" dense>
      <!-- Fuel Efficiency Trends -->
      <v-col cols="12" md="6" xl="4">
        <v-card class="section-card glass-card">
          <v-card-title class="section-title">
            <v-icon class="me-2" color="success">mdi-gas-station</v-icon>
            Fuel Efficiency Trends
          </v-card-title>
          <v-card-text>
            <div ref="fuelEfficiencyChart" style="height: 260px;"></div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <!-- Cost Breakdown -->
      <v-col cols="12" md="6" xl="4">
        <v-card class="section-card glass-card">
          <v-card-title class="section-title">
            <v-icon class="me-2" color="warning">mdi-currency-usd</v-icon>
            Cost Breakdown
          </v-card-title>
          <v-card-text>
            <div ref="costBreakdownChart" style="height: 260px;"></div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <!-- Fleet Performance -->
      <v-col cols="12" md="6" xl="4">
        <v-card class="section-card glass-card">
          <v-card-title class="section-title">
            <v-icon class="me-2" color="primary">mdi-speedometer</v-icon>
            Fleet Performance
          </v-card-title>
          <v-card-text>
            <div ref="fleetPerformanceChart" style="height: 260px;"></div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <!-- Monthly Trends -->
      <v-col cols="12" md="6" xl="6">
        <v-card class="section-card glass-card">
          <v-card-title class="section-title">
            <v-icon class="me-2" color="info">mdi-trending-up</v-icon>
            Monthly Trends
          </v-card-title>
          <v-card-text>
            <div ref="monthlyTrendsChart" style="height: 260px;"></div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <!-- Vehicle Rankings -->
      <v-col cols="12" md="6" xl="6">
        <v-card class="section-card glass-card">
          <v-card-title class="section-title">
            <v-icon class="me-2" color="success">mdi-trophy</v-icon>
            Top Performing Vehicles
          </v-card-title>
          <v-card-text>
            <div ref="vehicleRankingsChart" style="height: 260px;"></div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Report Types Grid -->
  
    <!-- Key Metrics -->


    <!-- Export Options -->
 

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="showSuccessSnackbar"
      color="success"
      timeout="3000"
    >
      {{ successMessage }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="showSuccessSnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Error Snackbar -->
    <v-snackbar
      v-model="showErrorSnackbar"
      color="error"
      timeout="5000"
    >
      {{ errorMessage }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="showErrorSnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import * as echarts from 'echarts'

// Composables
const { vehicleList, getVehicles, serviceDueVehicles, calculateServiceDue } = useVehicles()
const { fuelRecords, fuelCards, getFuelRecords, getFuelCards } = useFuel()
const { anomalies, getAnomalies } = useAnomalies()

// Chart refs
const fuelEfficiencyChart = ref(null)
const costBreakdownChart = ref(null)
const fleetPerformanceChart = ref(null)
const monthlyTrendsChart = ref(null)
const vehicleRankingsChart = ref(null)

// Reactive data
const loading = ref(false)
const showSuccessSnackbar = ref(false)
const showErrorSnackbar = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Analytics data
const totalFleetValue = ref(25000000) // 25M ETB
const monthlyFuelCost = ref(125000) // 125K ETB
const fleetUtilization = ref(78.5) // 78.5%
const totalMaintenanceCost = ref(85000) // 85K ETB
const vehicleUptime = ref(94.2) // 94.2%

// Cost breakdown
const fuelCosts = ref(225000) // 225K ETB
const maintenanceCosts = ref(150000) // 150K ETB
const insuranceCosts = ref(75000) // 75K ETB
const otherCosts = ref(50000) // 50K ETB

// Computed properties
const averageFuelEfficiency = computed(() => {
  if (vehicleList.value.length === 0) return 0
  const totalEfficiency = vehicleList.value.reduce((sum, vehicle) => sum + vehicle.fuelEfficiency, 0)
  return totalEfficiency / vehicleList.value.length
})

const totalDistance = computed(() => 
  vehicleList.value.reduce((sum, vehicle) => sum + vehicle.currentMileage, 0)
)

const totalFuelConsumption = computed(() => {
  return fuelRecords.value.reduce((sum, record) => sum + record.quantity, 0)
})

const topPerformingVehicles = computed(() => {
  return [...vehicleList.value]
    .sort((a, b) => b.fuelEfficiency - a.fuelEfficiency)
    .slice(0, 5)
})

const totalFuelSpent = computed(() => {
  return fuelCards.value.reduce((sum, card) => sum + card.amountSpent, 0)
})

const averageFuelCost = computed(() => {
  if (vehicleList.value.length === 0) return 0
  return totalFuelSpent.value / vehicleList.value.length
})

const activeAlerts = computed(() => {
  return anomalies.value.filter(alert => alert.status === 'open')
})

// Chart initialization
const initializeCharts = () => {
  // Fuel Efficiency Trends Chart
  if (fuelEfficiencyChart.value) {
    const chart = echarts.init(fuelEfficiencyChart.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
      yAxis: { type: 'value', name: 'km/l' },
      series: [{
        data: [12.5, 13.2, 12.8, 13.5, 14.1, 13.9, 14.3],
        type: 'line',
        smooth: true,
        areaStyle: {},
        color: '#f3d70e',
        symbol: 'circle',
        symbolSize: 8
      }]
    })
  }

  // Cost Breakdown Chart
  if (costBreakdownChart.value) {
    const chart = echarts.init(costBreakdownChart.value)
    chart.setOption({
      tooltip: { trigger: 'item' },
      legend: { top: 'bottom' },
      series: [{
        name: 'Cost',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#ffffff', borderWidth: 2 },
        label: { show: true, formatter: '{b}: {d}%' },
        data: [
          { value: fuelCosts.value, name: 'Fuel', itemStyle: { color: '#f3d70e' } },
          { value: maintenanceCosts.value, name: 'Maintenance', itemStyle: { color: '#fbb339' } },
          { value: insuranceCosts.value, name: 'Insurance', itemStyle: { color: '#f5e35e' } },
          { value: otherCosts.value, name: 'Other', itemStyle: { color: '#040707' } }
        ]
      }]
    })
  }

  // Fleet Performance Chart
  if (fleetPerformanceChart.value) {
    const chart = echarts.init(fleetPerformanceChart.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['Utilization', 'Efficiency', 'Uptime', 'Cost/km'] },
      yAxis: { type: 'value', name: 'Percentage' },
      series: [{
        data: [fleetUtilization.value, averageFuelEfficiency.value * 10, vehicleUptime.value, 85],
        type: 'bar',
        itemStyle: { color: '#f3d70e', borderRadius: [8, 8, 0, 0] },
        barWidth: 40
      }]
    })
  }

  // Monthly Trends Chart
  if (monthlyTrendsChart.value) {
    const chart = echarts.init(monthlyTrendsChart.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['Fuel Cost', 'Distance', 'Efficiency'] },
      xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
      yAxis: { type: 'value' },
      series: [
        {
          name: 'Fuel Cost',
          type: 'line',
          data: [120000, 125000, 118000, 132000, 128000, 135000, 125000],
          color: '#f3d70e'
        },
        {
          name: 'Distance',
          type: 'line',
          data: [45000, 48000, 52000, 49000, 55000, 58000, 54000],
          color: '#fbb339'
        },
        {
          name: 'Efficiency',
          type: 'line',
          data: [12.5, 13.2, 12.8, 13.5, 14.1, 13.9, 14.3],
          color: '#f5e35e'
        }
      ]
    })
  }

  // Vehicle Rankings Chart
  if (vehicleRankingsChart.value) {
    const chart = echarts.init(vehicleRankingsChart.value)
    const top = topPerformingVehicles.value
    chart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: top.map(v => v.licensePlate) },
      yAxis: { type: 'value', name: 'km/l' },
      series: [{
        data: top.map(v => v.fuelEfficiency),
        type: 'bar',
        itemStyle: { color: '#f3d70e', borderRadius: [8, 8, 0, 0] },
        barWidth: 32
      }]
    })
  }
}

// Methods
const getRankingColor = (index) => {
  const colors = ['#FFD700', '#C0C0C0', '#CD7F32', '#4CAF50', '#2196F3']
  return colors[index] || '#9E9E9E'
}

const getRankingIcon = (index) => {
  const icons = ['mdi-trophy', 'mdi-medal', 'mdi-medal-outline', 'mdi-star', 'mdi-star-outline']
  return icons[index] || 'mdi-circle'
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

const generateReport = (reportType) => {
  console.log('Generating report:', reportType)
  showSuccessMessage(`Report "${reportType}" generated successfully`)
}

const generateComprehensiveReport = () => {
  console.log('Generating comprehensive report')
  showSuccessMessage('Comprehensive report generated successfully')
}

const exportAllData = () => {
  console.log('Exporting all data')
  showSuccessMessage('All data exported successfully')
}

const exportToExcel = () => {
  console.log('Export to Excel')
  showSuccessMessage('Data exported to Excel successfully')
}

const exportToPDF = () => {
  console.log('Export to PDF')
  showSuccessMessage('Report exported to PDF successfully')
}

const exportToCSV = () => {
  console.log('Export to CSV')
  showSuccessMessage('Data exported to CSV successfully')
}

const showFleetValueBreakdown = () => {
  console.log('Showing fleet value breakdown')
}

const showEfficiencyAnalysis = () => {
  console.log('Showing efficiency analysis')
}

const showFuelCostAnalysis = () => {
  console.log('Showing fuel cost analysis')
}

const showUtilizationAnalysis = () => {
  console.log('Showing utilization analysis')
}

const showSuccessMessage = (message) => {
  successMessage.value = message
  showSuccessSnackbar.value = true
}

const showErrorMessage = (message) => {
  errorMessage.value = message
  showErrorSnackbar.value = true
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
    
    // Initialize charts after data is loaded
    setTimeout(() => {
      initializeCharts()
    }, 100)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.analytics-reports-root {
  padding: 32px 0 64px 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #ffffff 0%, #f5e35e 20%, #fbb339 100%);
}

.glass-bg {
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(12px);
  border-radius: 32px;
  box-shadow: 0 8px 40px 0 rgba(243, 215, 14, 0.15);
}

.header-section {
  margin-bottom: 40px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
}

.header-text {
  flex: 1;
}

.page-title {
  font-size: 2.8rem;
  font-weight: 900;
  letter-spacing: -1px;
  color: #040707;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 1.25rem;
  color: #040707;
  opacity: 0.8;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.header-btn {
  font-weight: 600;
  border-radius: 12px;
  text-transform: none;
  padding: 12px 24px;
  box-shadow: 0 4px 12px rgba(243, 215, 14, 0.2);
  transition: all 0.3s ease;
}

.header-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(243, 215, 14, 0.3);
}

.kpi-section {
  margin-bottom: 40px;
}

.analytics-main-grid {
  margin-bottom: 40px;
}

.reports-section,
.export-section {
  margin-bottom: 40px;
}

.section-card {
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(15px);
  box-shadow: 0 8px 32px rgba(243, 215, 14, 0.12);
  border: 1px solid rgba(243, 215, 14, 0.15);
  transition: all 0.3s ease;
  overflow: hidden;
}

.glass-card {
  background: rgba(255,255,255,0.9);
  border-radius: 24px;
  box-shadow: 0 4px 32px 0 rgba(243, 215, 14, 0.12);
  border: 1px solid rgba(243, 215, 14, 0.15);
  transition: box-shadow 0.2s, transform 0.2s;
  overflow: hidden;
}

.glass-card:hover {
  box-shadow: 0 8px 48px 0 rgba(243, 215, 14, 0.25);
  transform: translateY(-2px) scale(1.01);
}

.section-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(243, 215, 14, 0.2);
  border-color: rgba(243, 215, 14, 0.3);
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 16px 24px;
  border-bottom: 2px solid rgba(243, 215, 14, 0.3);
  font-size: 1.25rem;
  font-weight: 700;
  color: #040707;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(245, 227, 94, 0.1) 100%);
}

.report-card {
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 227, 94, 0.1) 100%);
  box-shadow: 0 2px 12px rgba(243, 215, 14, 0.1);
  transition: box-shadow 0.2s, transform 0.2s;
  cursor: pointer;
  border: 1px solid rgba(243, 215, 14, 0.1);
}

.report-card:hover {
  box-shadow: 0 8px 32px rgba(243, 215, 14, 0.2);
  transform: translateY(-2px) scale(1.02);
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
  border-left: 4px solid #f3d70e;
  transition: all 0.3s ease;
}

.metric-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(243, 215, 14, 0.15);
}

.metric-label {
  font-size: 0.9rem;
  color: #040707;
  opacity: 0.7;
  margin-bottom: 4px;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #040707;
  margin-bottom: 4px;
}

.metric-trend {
  font-size: 0.8rem;
  font-weight: 500;
}

.metric-trend.positive {
  color: #f3d70e;
}

.metric-trend.negative {
  color: #fbb339;
}

.alerts-list {
  padding: 0 8px 8px 8px;
}

.alert-item {
  padding: 12px;
  margin-bottom: 8px;
  background: linear-gradient(90deg, rgba(245, 227, 94, 0.1) 0%, rgba(255, 255, 255, 0.5) 100%);
  border-radius: 8px;
  border-left: 4px solid #f3d70e;
  transition: all 0.3s ease;
}

.alert-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(243, 215, 14, 0.15);
}

.export-btn {
  font-weight: 600;
  border-radius: 10px;
  min-width: 160px;
  transition: all 0.3s ease;
}

.export-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(243, 215, 14, 0.2);
}

/* Responsive Design */
@media (max-width: 768px) {
  .analytics-reports-root {
    padding: 16px 0 32px 0;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-actions {
    width: 100%;
    justify-content: stretch;
  }
  
  .header-btn {
    flex: 1;
  }
  
  .page-title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .section-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style> 