<template>
  <div class="modern-dashboard">
    <!-- Loading State -->
    <div v-if="status === AuthState.loading" class="text-center py-8">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
      <div class="mt-4 text-muted">Loading dashboard...</div>
    </div>

    <!-- Unauthenticated State -->
    <div v-else-if="status === AuthState.unauthenticated" class="text-center py-8">
      <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-lock</v-icon>
      <h3 class="text-h6 text-muted mb-2">Authentication Required</h3>
      <p class="text-muted">Please log in to access the dashboard</p>
      <v-btn color="primary" @click="$router.push('/login')" class="mt-4">
        Go to Login
      </v-btn>
    </div>

    <!-- KPI Cards Row -->
    <div v-else class="kpi-section">
      <v-row justify="end"> 
        <v-col md="2" cols="auto">
          <v-menu
            v-model="fromMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                v-bind="props"
                label="From"
                :model-value="formatDate(fromRaw, 'from')"
                readonly
                variant="outlined"
                density="compact"
                hide-details
              ></v-text-field>
            </template>
            <v-date-picker v-model="fromRaw">
              <template v-slot:actions>
                <v-btn variant="text" @click="fromMenu = false">Cancel</v-btn>
                <v-btn variant="text" color="primary" @click="applyFromDate">OK</v-btn>
              </template>
            </v-date-picker>
          </v-menu>
        </v-col>
        
        <v-col md="2" cols="auto">
          <v-menu
            v-model="toMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                v-bind="props"
                label="To"
                :model-value="formatDate(toRaw, 'to')"
                readonly
                variant="outlined"
                density="compact"
                hide-details
              ></v-text-field>
            </template>
            <v-date-picker v-model="toRaw">
              <template v-slot:actions>
                <v-btn variant="text" @click="toMenu = false">Cancel</v-btn>
                <v-btn variant="text" color="primary" @click="applyToDate">OK</v-btn>
              </template>
            </v-date-picker>
          </v-menu>
        </v-col>
        
        <v-col cols="auto">
          <v-btn color="primary" @click="reloadReports">Apply</v-btn>
        </v-col>
      </v-row>
      
      <v-row justify="end"> 
        <v-col cols="auto">
          <v-select
            v-model="selectedPeriod"
            :items="['6 months', '1 year', '2 years']"
            variant="outlined"
            density="compact"
            hide-details
            class="period-select"
            @update:modelValue="handlePeriodChange"
          ></v-select>
        </v-col>
      </v-row>
      
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <div class="kpi-card">
            <div class="kpi-icon kpi-primary">
              <v-icon>mdi-truck</v-icon>
            </div>
            <div class="kpi-content">
              <h3 class="kpi-value">{{ loading ? '...' : totalVehicles }}</h3>
              <p class="kpi-label">Total Vehicles</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <div class="kpi-card">
            <div class="kpi-icon kpi-success">
              <v-icon>mdi-check-circle</v-icon>
            </div>
            <div class="kpi-content">
              <h3 class="kpi-value">{{ loading ? '...' : activeVehicles }}</h3>
              <p class="kpi-label">Active Vehicles</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <div class="kpi-card">
            <div class="kpi-icon kpi-warning">
              <v-icon>mdi-wrench</v-icon>
            </div>
            <div class="kpi-content">
              <h3 class="kpi-value">{{ loading ? '...' : serviceDueVehicles }}</h3>
              <p class="kpi-label">Service Due</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <div class="kpi-card">
            <div class="kpi-icon kpi-error">
              <v-icon>mdi-alert</v-icon>
            </div>
            <div class="kpi-content">
              <h3 class="kpi-value">{{ loading ? '...' : openAnomalies }}</h3>
              <p class="kpi-label">Open Alerts</p>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- Main Content Grid -->
    <div v-if="status === AuthState.authenticated" class="dashboard-content">
      <v-row>
        <!-- Fleet Utilization Chart -->
        <v-col cols="12" lg="8">
          <div class="chart-card">
            <div class="chart-header">
              <div class="chart-title">
                <h3>Fuel Consumption Trend</h3>
                <p>Monthly fuel consumption in liters across the fleet</p>
              </div>
              <div class="chart-controls">
                <v-select
                  v-model="selectedPeriod"
                  :items="['6 months', '1 year', '2 years']"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="period-select"
                  @update:modelValue="handlePeriodChange"
                ></v-select>
              </div>
            </div>
            <div class="chart-content">
              <div ref="fleetUtilizationChart" class="chart-container"></div>
            </div>
          </div>
        </v-col>

        <!-- Vehicle Status Overview -->
        <v-col cols="12" lg="4">
          <div class="chart-card">
            <div class="chart-header">
              <h3>Vehicle Status</h3>
              <p>Current fleet status distribution</p>
            </div>
            <div class="chart-content">
              <div ref="statusDonutChart" class="chart-container"></div>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <!-- Cost Breakdown -->
        <v-col cols="12" md="6">
          <div class="chart-card">
            <div class="chart-header">
              <h3>Cost Breakdown</h3>
              <p>Monthly operational cost analysis</p>
            </div>
            <div class="chart-content">
              <div ref="costPieChart" class="chart-container"></div>
            </div>
          </div>
        </v-col>

        <!-- Top Vehicles by Efficiency -->
        <v-col cols="12" md="6">
          <div class="chart-card">
            <div class="chart-header">
              <h3>Top Vehicles by Efficiency</h3>
              <p>Best performing vehicles in the fleet</p>
            </div>
            <div class="chart-content">
              <div ref="topVehiclesBarChart" class="chart-container"></div>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Success Snackbar -->
      <v-snackbar v-model="showSuccessSnackbar" color="success" timeout="3000">
        {{ successMessage }}
        <template v-slot:actions>
          <v-btn color="white" variant="text" @click="showSuccessSnackbar = false">Close</v-btn>
        </template>
      </v-snackbar>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref, watch } from 'vue'
import * as echarts from 'echarts'
import moment from 'moment'

// Auth composables
const { logout } = useAuth()
const { currentUser, status } = useAuthState()
const { AuthState } = await import('~/types/auth')
const { dashboardReport, loading, getAllReport } = useReport()

// Chart refs
const fleetUtilizationChart = ref(null)
const costPieChart = ref(null)
const statusDonutChart = ref(null)
const topVehiclesBarChart = ref(null)

// Period selector
const selectedPeriod = ref('6 months')
const fromMenu = ref(false)
const toMenu = ref(false)

// Initialize dates to current month range
const today = new Date()
const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

// Initialize date refs
const fromRaw = ref(new Date(startOfMonth))
const toRaw = ref(new Date(endOfMonth))

// Date formatting function
const formatDate = (dateInput, type) => {
  if (!dateInput) return ''
  return moment(dateInput).format('YYYY-MM-DD')
}

// Apply date selections
const applyFromDate = () => {
  fromMenu.value = false
}

const applyToDate = () => {
  toMenu.value = false
}

// Handle period selection
const handlePeriodChange = () => {
  const today = new Date()
  
  switch(selectedPeriod.value) {
    case '6 months':
      fromRaw.value = new Date(today.getFullYear(), today.getMonth() - 6, 1)
      toRaw.value = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      break
    case '1 year':
      fromRaw.value = new Date(today.getFullYear() - 1, today.getMonth(), 1)
      toRaw.value = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      break
    case '2 years':
      fromRaw.value = new Date(today.getFullYear() - 2, today.getMonth(), 1)
      toRaw.value = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      break
  }
  
  reloadReports()
}

// Reload reports with current dates
const reloadReports = async () => {
  const formattedFrom = formatDate(fromRaw.value)
  const formattedTo = formatDate(toRaw.value)

  try {
    loading.value = true
    await getAllReport(formattedFrom, formattedTo)
    initializeCharts()
  } catch (error) {
    console.error('Error loading reports:', error)
  } finally {
    loading.value = false
  }
}

// Computed properties from report data
const totalVehicles = computed(() => {
  if (!dashboardReport.value?.vehicleStatus) return 0
  return dashboardReport.value.vehicleStatus.reduce((sum, status) => sum + status.total, 0)
})

const activeVehicles = computed(() => {
  if (!dashboardReport.value?.vehicleStatus) return 0
  const activeStatus = dashboardReport.value.vehicleStatus.find(s => s.status === 1)
  return activeStatus ? activeStatus.total : 0
})

const serviceDueVehicles = computed(() => {
  return dashboardReport.value?.serviceDue || 0
})

const openAnomalies = computed(() => {
  return dashboardReport.value?.openNotifications || 0
})

// Initialize charts
const initializeCharts = () => {
  // Fleet Utilization Chart
  if (fleetUtilizationChart.value && dashboardReport.value?.fuelTrends) {
    const chart = echarts.init(fleetUtilizationChart.value)
    
    chart.setOption({
      tooltip: { 
        trigger: 'axis',
        formatter: (params) => {
          return `${params[0].name}<br/>Fuel Consumption: ${params[0].value} liters`
        }
      },
      xAxis: { 
        type: 'category', 
        data: dashboardReport.value.fuelTrends.map(t => t.ym) 
      },
      yAxis: { 
        type: 'value', 
        name: 'Liters',
        axisLabel: { formatter: '{value} L' }
      },
      series: [{
        name: 'Fuel Consumption',
        data: dashboardReport.value.fuelTrends.map(t => t.total),
        type: 'line',
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(243, 215, 14, 0.3)' },
              { offset: 1, color: 'rgba(243, 215, 14, 0.1)' }
            ]
          }
        },
        color: '#f3d70e',
        symbol: 'circle',
        symbolSize: 10,
        lineStyle: { width: 3 }
      }]
    })
  }

  // Cost Pie Chart
  if (costPieChart.value && dashboardReport.value?.costBreakdown) {
    const chart = echarts.init(costPieChart.value)
    const { fuel, maintenance, other } = dashboardReport.value.costBreakdown
    
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
          { value: fuel, name: 'Fuel', itemStyle: { color: '#f3d70e' } },
          { value: maintenance, name: 'Maintenance', itemStyle: { color: '#fbb339' } },
          { value: other, name: 'Other', itemStyle: { color: '#f5e35e' } }
        ]
      }]
    })
  }

  // Status Donut Chart
  if (statusDonutChart.value && dashboardReport.value?.vehicleStatus) {
    const chart = echarts.init(statusDonutChart.value)
    
    chart.setOption({
      tooltip: { trigger: 'item' },
      legend: { top: 'bottom' },
      series: [{
        name: 'Status',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#ffffff', borderWidth: 2 },
        label: { show: true, formatter: '{b}: {d}%' },
        data: dashboardReport.value.vehicleStatus.map(status => ({
          value: status.total,
          name: getStatusName(status.status),
          itemStyle: { color: getStatusColor(status.status) }
        }))
      }]
    })
  }

  // Top Vehicles Bar Chart
  if (topVehiclesBarChart.value && dashboardReport.value?.vehiclePerformance) {
    const chart = echarts.init(topVehiclesBarChart.value)
    const top = [...dashboardReport.value.vehiclePerformance]
      .sort((a, b) => b.avg_km_per_l - a.avg_km_per_l)
      .slice(0, 5)
    
    chart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { 
        type: 'category', 
        data: top.map(v => v.vehicleData.plateNo) 
      },
      yAxis: { 
        type: 'value', 
        name: 'km/l' 
      },
      series: [{
        data: top.map(v => v.avg_km_per_l),
        type: 'bar',
        itemStyle: { color: '#f3d70e', borderRadius: [8, 8, 0, 0] },
        barWidth: 32
      }]
    })
  }
}

// Helper functions for status
const getStatusName = (statusCode) => {
  const statusMap = {
    1: 'Active',
    2: 'Maintenance',
    3: 'Inactive'
  }
  return statusMap[statusCode] || 'Unknown'
}

const getStatusColor = (statusCode) => {
  const colorMap = {
    1: '#f3d70e',    // Active
    2: '#fbb339',    // Maintenance
    3: '#f5e35e'     // Inactive
  }
  return colorMap[statusCode] || '#cccccc'
}

// Watch for authentication state changes
watch(() => status.value, async (newStatus) => {
  if (newStatus === AuthState.authenticated) {
    await reloadReports()
  }
})

onMounted(async () => {
  await nextTick()
  if (status.value === AuthState.authenticated) {
    await reloadReports()
  }
})
</script>

<style scoped>
/* ... existing styles ... */

.modern-dashboard {
  padding: 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
}

.dashboard-title {
  color: #2c3e50;
  margin: 0 0 8px 0;
}



.kpi-section {
  margin-bottom: 32px;
}

.kpi-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.kpi-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.kpi-primary {
  background: linear-gradient(135deg, #f3d70e 0%, #fbb339 100%);
}

.kpi-success {
  background: linear-gradient(135deg, #f5e35e 0%, #f3d70e 100%);
}

.kpi-warning {
  background: linear-gradient(135deg, #fbb339 0%, #f5e35e 100%);
}

.kpi-error {
  background: linear-gradient(135deg, #ff5252 0%, #fbb339 100%);
}

.kpi-value {
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 4px 0;
}

.kpi-label {
  font-size: 14px;
  color: #6c757d;
  margin: 0;
  font-weight: 500;
}

.dashboard-content {
  margin-bottom: 32px;
}

.chart-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  height: 100%;
  transition: all 0.3s ease;
}

.chart-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.chart-title h3 {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.chart-title p {
  font-size: 14px;
  color: #6c757d;
  margin: 0;
}

.period-select {
  max-width: 150px;
}
.date-select {
  position: absolute;
  right: 1;
}

.chart-container {
  height: 300px;
  width: 100%;
}

.fuel-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.fuel-card-item {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.fuel-card-item:hover {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.fuel-card-item.low-balance {
  border-color: #ff6b6b;
  background: #fff5f5;
}

.fuel-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.vehicle-info {
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #2c3e50;
}

.fuel-card-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-number {
  font-size: 12px;
  color: #6c757d;
  font-weight: 500;
}

.balance-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.balance-amount {
  font-weight: 600;
  color: #2c3e50;
}

.balance-amount.low-balance-text {
  color: #ff6b6b;
}

.balance-percentage {
  font-size: 12px;
  color: #6c757d;
}

.balance-progress {
  margin: 8px 0;
}

.last-refill {
  font-size: 12px;
  color: #6c757d;
}

.service-schedule-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.service-item {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.service-item:hover {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.service-item.overdue {
  border-color: #ff6b6b;
  background: #fff5f5;
}

.service-item.urgent {
  border-color: #ffa726;
  background: #fff8e1;
}

.service-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.service-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.vehicle-id {
  font-size: 12px;
  color: #6c757d;
  font-weight: 500;
}

.mileage-info, .next-service {
  font-size: 12px;
  color: #6c757d;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.action-btn {
  height: 48px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dialog-card {
  border-radius: 16px;
  overflow: hidden;
}

.dialog-title {
  background: linear-gradient(135deg, #f3d70e 0%, #fbb339 100%);
  color: #040707;
  font-size: 20px;
  font-weight: 700;
  padding: 24px;
}

.dialog-actions {
  padding: 24px;
  background: #f8f9fa;
}

@media (max-width: 768px) {
  .modern-dashboard {
    padding: 16px;
  }
  

  
  .chart-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .fuel-cards-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-actions-grid {
    grid-template-columns: 1fr;
  }
}
</style> 