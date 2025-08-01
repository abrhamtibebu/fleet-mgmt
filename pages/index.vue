<template>
  <div class="dashboard-root glass-bg">
    <div class="dashboard-header">
      <h1 class="dashboard-title">Fleet Management Dashboard</h1>
      <p class="dashboard-subtitle">Comprehensive, real-time fleet insights</p>
    </div>

    <!-- KPI Cards Row -->
    <div class="kpi-row">
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <KpiCard title="Total Vehicles" :value="vehicleList.length.toString()" icon="mdi-truck" color="primary" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard title="Active Vehicles" :value="activeVehicles.length.toString()" icon="mdi-check-circle" color="success" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard title="Service Due" :value="serviceDueVehicles.length.toString()" icon="mdi-wrench" color="warning" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard title="Open Alerts" :value="openAnomalies.length.toString()" icon="mdi-alert" color="error" />
        </v-col>
      </v-row>
    </div>

    <!-- Modern Analytics Grid -->
    <v-row class="dashboard-main-grid" dense>
      <!-- Fleet Utilization Line Chart -->
      <v-col cols="12" md="6" xl="4">
        <v-card class="dashboard-section-card glass-card">
          <v-card-title class="dashboard-section-title">
            <v-icon class="me-2" color="primary">mdi-chart-line</v-icon>
            Fleet Utilization Trend
          </v-card-title>
          <v-card-text>
            <div ref="fleetUtilizationChart" style="height: 260px;"></div>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- Cost Pie Chart -->
      <v-col cols="12" md="6" xl="4">
        <v-card class="dashboard-section-card glass-card">
          <v-card-title class="dashboard-section-title">
            <v-icon class="me-2" color="warning">mdi-currency-usd</v-icon>
            Cost Breakdown
          </v-card-title>
          <v-card-text>
            <div ref="costPieChart" style="height: 260px;"></div>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- Vehicle Status Donut Chart -->
      <v-col cols="12" md="6" xl="4">
        <v-card class="dashboard-section-card glass-card">
          <v-card-title class="dashboard-section-title">
            <v-icon class="me-2" color="info">mdi-car-multiple</v-icon>
            Vehicle Status
          </v-card-title>
          <v-card-text>
            <div ref="statusDonutChart" style="height: 260px;"></div>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- Top Vehicles Bar Chart -->
      <v-col cols="12" md="6" xl="6">
        <v-card class="dashboard-section-card glass-card">
          <v-card-title class="dashboard-section-title">
            <v-icon class="me-2" color="success">mdi-trophy</v-icon>
            Top 5 Vehicles by Efficiency
          </v-card-title>
          <v-card-text>
            <div ref="topVehiclesBarChart" style="height: 260px;"></div>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- Alerts Timeline -->
      <v-col cols="12" md="6" xl="6">
        <v-card class="dashboard-section-card glass-card">
          <v-card-title class="dashboard-section-title">
            <v-icon class="me-2" color="error">mdi-alert</v-icon>
            Alerts Timeline
          </v-card-title>
          <v-card-text>
            <div ref="alertsTimelineChart" style="height: 260px;"></div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Fuel Card Balances & Service Schedule -->
    <v-row class="dashboard-main-grid" dense>
      <!-- Fuel Card Balances -->
      <v-col cols="12" lg="6">
        <v-card class="dashboard-section-card glass-card">
          <v-card-title class="dashboard-section-title">
            <v-icon class="me-2" color="info">mdi-credit-card</v-icon>
            Fuel Card Balances
          </v-card-title>
          <v-card-text>
            <div class="fuel-cards-container">
              <div 
                v-for="card in fuelCardData" 
                :key="card.id"
                class="fuel-card-item"
                :class="{ 'low-balance': card.isLowBalance }"
              >
                <div class="fuel-card-header">
                  <div class="vehicle-info">
                    <v-icon size="small" color="primary" class="me-2">mdi-car</v-icon>
                    <span class="vehicle-name">{{ card.vehicleName }}</span>
                  </div>
                  <v-chip 
                    :color="card.status === 'active' ? 'success' : 'error'"
                    size="small"
                    variant="flat"
                  >
                    {{ card.status }}
                  </v-chip>
                </div>
                
                <div class="fuel-card-details">
                  <div class="card-number">{{ card.cardNumber }}</div>
                  <div class="balance-info">
                    <span class="balance-amount" :class="{ 'low-balance-text': card.isLowBalance }">
                      ${{ card.currentBalance.toLocaleString() }} / ${{ card.totalBalance.toLocaleString() }}
                    </span>
                    <span class="balance-percentage">{{ card.percentage.toFixed(1) }}%</span>
                  </div>
                  
                  <v-progress-linear
                    :model-value="card.percentage"
                    :color="card.isLowBalance ? 'error' : 'primary'"
                    height="8"
                    rounded
                    class="balance-progress"
                  ></v-progress-linear>
                  
                  <div class="last-refill">
                    Last refill: {{ card.lastRefillDate }}
                  </div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Service Schedule -->
      <v-col cols="12" lg="6">
        <v-card class="dashboard-section-card glass-card">
          <v-card-title class="dashboard-section-title">
            <div class="d-flex align-center justify-space-between w-100">
              <div class="d-flex align-center">
                <v-icon class="me-2" color="warning">mdi-wrench</v-icon>
                Service Schedule
              </div>
              <v-btn
                color="primary"
                variant="outlined"
                size="small"
                prepend-icon="mdi-plus"
              >
                Schedule Service
              </v-btn>
            </div>
          </v-card-title>
          <v-card-text>
            <div class="service-schedule-container">
              <div 
                v-for="service in serviceScheduleData" 
                :key="service.id"
                class="service-item"
                :class="{ 'overdue': service.isOverdue, 'urgent': service.isUrgent }"
              >
                <div class="service-header">
                  <div class="vehicle-info">
                    <v-icon 
                      size="small" 
                      :color="getServiceIconColor(service.status)"
                      class="me-2"
                    >
                      {{ getServiceIcon(service.status) }}
                    </v-icon>
                    <span class="vehicle-name">{{ service.vehicleName }}</span>
                  </div>
                  <v-chip 
                    :color="getServiceStatusColor(service.status)"
                    size="small"
                    variant="flat"
                  >
                    {{ service.statusText }}
                  </v-chip>
                </div>
                
                <div class="service-details">
                  <div class="vehicle-id">{{ service.vehicleId }}</div>
                  <div class="mileage-info">
                    Current Mileage: {{ service.currentMileage.toLocaleString() }} km
                  </div>
                  <div class="next-service">
                    Next Service: {{ service.nextServiceDate }}
                  </div>
                  
                  <v-progress-linear
                    :model-value="service.progressPercentage"
                    :color="getServiceProgressColor(service.status)"
                    height="8"
                    rounded
                    class="service-progress"
                  ></v-progress-linear>
                  
                  <div class="service-interval">
                    Service Interval Progress: {{ service.progressPercentage }}%
                  </div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Actions & Add Card Dialog (unchanged) -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="dashboard-section-card glass-card">
          <v-card-title class="dashboard-section-title">
            <v-icon class="me-2" color="primary">mdi-lightning-bolt</v-icon>
            Quick Actions
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <v-btn block color="primary" variant="outlined" prepend-icon="mdi-plus" class="mb-2" @click="$router.push('/vehicles')">Add Vehicle</v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn block color="success" variant="outlined" prepend-icon="mdi-gas-station" class="mb-2" @click="$router.push('/fuel')">Fuel Entry</v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn block color="info" variant="outlined" prepend-icon="mdi-speedometer" class="mb-2" @click="$router.push('/mileage')">Mileage Entry</v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn block color="warning" variant="outlined" prepend-icon="mdi-chart-box" class="mb-2" @click="$router.push('/analytics-reports')">Analytics</v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn block color="secondary" variant="outlined" prepend-icon="mdi-credit-card" class="mb-2" @click="showAddCardDialog = true">Add Card</v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn block color="error" variant="outlined" prepend-icon="mdi-wrench" class="mb-2" @click="$router.push('/maintenance')">Maintenance</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <!-- Add Card Dialog (unchanged) -->
        <v-dialog v-model="showAddCardDialog" max-width="500px" persistent>
          <v-card class="dialog-card">
            <v-card-title class="dialog-title">
              <v-icon class="me-2" color="secondary">mdi-credit-card</v-icon>
              Add New Fuel Card
            </v-card-title>
            <v-card-text>
              <v-form ref="cardFormRef" v-model="cardFormValid">
                <v-row>
                  <v-col cols="12">
                    <v-select v-model="cardForm.vendorCardId" :items="vendorCardOptions" label="Select from Vendor Cards (Optional)" variant="outlined" placeholder="Choose an existing vendor card or leave empty to create new" clearable></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="cardForm.cardNumber" label="Card Number" variant="outlined" :rules="[v => !!v || 'Card number is required']" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="cardForm.cardHolder" label="Card Holder" variant="outlined" :rules="[v => !!v || 'Card holder is required']" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="cardForm.totalValue" label="Total Value (ETB)" type="number" variant="outlined" :rules="[v => !!v || 'Total value is required']" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select v-model="cardForm.status" :items="cardStatusOptions" label="Status" variant="outlined" :rules="[v => !!v || 'Status is required']" required></v-select>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <v-card-actions class="dialog-actions">
              <v-spacer></v-spacer>
              <v-btn variant="outlined" @click="showAddCardDialog = false">Cancel</v-btn>
              <v-btn color="secondary" :loading="savingCard" :disabled="!cardFormValid" @click="saveCard">Add Card</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import * as echarts from 'echarts'



const { vehicleList, loading, getVehicles, activeVehicles, serviceDueVehicles, calculateServiceDue } = useVehicles()
const { fuelCards, getFuelCards, lowBalanceCards } = useFuel()
const { anomalies, getAnomalies, openAnomalies } = useAnomalies()
const { cards, vendorCards, initializeData } = useVendorData()
const { vendorList,getVendor,error } = useVendor()


// Chart refs
const fleetUtilizationChart = ref(null)
const costPieChart = ref(null)
const statusDonutChart = ref(null)
const topVehiclesBarChart = ref(null)
const alertsTimelineChart = ref(null)

// KPI/Stats
const totalFuelSpent = computed(() => fuelCards.value.reduce((sum, card) => sum + card.amountSpent, 0))
const averageEfficiency = computed(() => vehicleList.value.length === 0 ? 0 : vehicleList.value.reduce((sum, v) => sum + v.fuelEfficiency, 0) / vehicleList.value.length)
const maintenanceCost = ref(150000)
const otherCosts = ref(50000)

// Fuel Card Data
const fuelCardData = ref([
  {
    id: 1,
    vehicleName: 'Ford Transit',
    cardNumber: '**** 1234',
    status: 'active',
    currentBalance: 850,
    totalBalance: 1000,
    percentage: 85.0,
    isLowBalance: false,
    lastRefillDate: '2024-01-20'
  },
  {
    id: 2,
    vehicleName: 'Toyota Hilux',
    cardNumber: '**** 5678',
    status: 'active',
    currentBalance: 120,
    totalBalance: 800,
    percentage: 15.0,
    isLowBalance: true,
    lastRefillDate: '2024-01-18'
  },
  {
    id: 3,
    vehicleName: 'Mercedes Sprinter',
    cardNumber: '**** 9012',
    status: 'active',
    currentBalance: 1200,
    totalBalance: 1500,
    percentage: 80.0,
    isLowBalance: false,
    lastRefillDate: '2024-01-22'
  },
  {
    id: 4,
    vehicleName: 'VW Caddy',
    cardNumber: '**** 3456',
    status: 'active',
    currentBalance: 45,
    totalBalance: 600,
    percentage: 7.5,
    isLowBalance: true,
    lastRefillDate: '2024-01-15'
  }
])

// Service Schedule Data
const serviceScheduleData = ref([
  {
    id: 1,
    vehicleName: 'Ford Transit',
    vehicleId: 'ABC-123',
    currentMileage: 87500,
    nextServiceDate: '2024-01-20',
    status: 'overdue',
    statusText: 'overdue (5d overdue)',
    progressPercentage: 55,
    isOverdue: true,
    isUrgent: false
  },
  {
    id: 2,
    vehicleName: 'Mercedes Sprinter',
    vehicleId: 'DEF-456',
    currentMileage: 152000,
    nextServiceDate: '2024-01-10',
    status: 'urgent',
    statusText: 'urgent (12d overdue)',
    progressPercentage: 47,
    isOverdue: true,
    isUrgent: true
  },
  {
    id: 3,
    vehicleName: 'Toyota Hilux',
    vehicleId: 'XYZ-789',
    currentMileage: 45200,
    nextServiceDate: '2024-02-01',
    status: 'routine',
    statusText: 'routine',
    progressPercentage: 52,
    isOverdue: false,
    isUrgent: false
  }
])

// Helper functions for service schedule
const getServiceIcon = (status) => {
  const icons = {
    overdue: 'mdi-alert',
    urgent: 'mdi-clock-alert',
    routine: 'mdi-calendar'
  }
  return icons[status] || 'mdi-calendar'
}

const getServiceIconColor = (status) => {
  const colors = {
    overdue: 'error',
    urgent: 'warning',
    routine: 'info'
  }
  return colors[status] || 'info'
}

const getServiceStatusColor = (status) => {
  const colors = {
    overdue: 'error',
    urgent: 'warning',
    routine: 'primary'
  }
  return colors[status] || 'primary'
}

const getServiceProgressColor = (status) => {
  const colors = {
    overdue: 'error',
    urgent: 'warning',
    routine: 'primary'
  }
  return colors[status] || 'primary'
}


const showAddCardDialog = ref(false)
const savingCard = ref(false)
const showSuccessSnackbar = ref(false)
const successMessage = ref('')
const cardFormRef = ref(null)
const cardFormValid = ref(false)
const cardForm = ref({ cardNumber: '', cardHolder: '', totalValue: '', status: 'Active', vendorCardId: '' })
const cardStatusOptions = [
  { title: 'Active', value: 'Active' },
  { title: 'Inactive', value: 'Inactive' },
  { title: 'Suspended', value: 'Suspended' }
]
const vendorCardOptions = computed(() => vendorCards.value.map(card => ({ title: `${card.cardHolder} - ${maskCardNumber(card.cardNumber)}`, value: card.id })))

const saveCard = async () => {
  savingCard.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    let newCard
    if (cardForm.value.vendorCardId) {
      const vendorCard = vendorCards.value.find(c => c.id === cardForm.value.vendorCardId)
      if (vendorCard) {
        newCard = {
          id: `CARD-${Date.now()}`,
          cardNumber: vendorCard.cardNumber,
          cardHolder: vendorCard.cardHolder,
          totalValueIssued: parseFloat(cardForm.value.totalValue),
          amountSpent: 0,
          remainingBalance: parseFloat(cardForm.value.totalValue),
          status: cardForm.value.status,
          lowBalanceThreshold: parseFloat(cardForm.value.totalValue) * 0.2,
          isLowBalance: false,
          lastTransactionDate: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    } else {
      newCard = {
        id: `CARD-${Date.now()}`,
        cardNumber: cardForm.value.cardNumber,
        cardHolder: cardForm.value.cardHolder,
        totalValueIssued: parseFloat(cardForm.value.totalValue),
        amountSpent: 0,
        remainingBalance: parseFloat(cardForm.value.totalValue),
        status: cardForm.value.status,
        lowBalanceThreshold: parseFloat(cardForm.value.totalValue) * 0.2,
        isLowBalance: false,
        lastTransactionDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
    fuelCards.value.push(newCard)
    showAddCardDialog.value = false
    resetCardForm()
    successMessage.value = 'Fuel card added successfully'
    showSuccessSnackbar.value = true
  } catch (error) {
    console.error('Failed to save card:', error)
  } finally {
    savingCard.value = false
  }
}
const resetCardForm = () => {
  cardForm.value = { cardNumber: '', cardHolder: '', totalValue: '', status: 'Active', vendorCardId: '' }
}
const maskCardNumber = (cardNumber) => `****-****-****-${cardNumber.slice(-4)}`

const initializeCharts = () => {
  // Fleet Utilization Chart
  if (fleetUtilizationChart.value) {
    const chart = echarts.init(fleetUtilizationChart.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
      yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
      series: [{
        data: [72, 75, 78, 80, 82, 85, 88],
        type: 'line',
        smooth: true,
        areaStyle: {},
        color: '#f3d70e',
        symbol: 'circle',
        symbolSize: 10
      }]
    })
  }

  // Cost Pie Chart
  if (costPieChart.value) {
    const chart = echarts.init(costPieChart.value)
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
          { value: totalFuelSpent.value, name: 'Fuel', itemStyle: { color: '#f3d70e' } },
          { value: maintenanceCost.value, name: 'Maintenance', itemStyle: { color: '#fbb339' } },
          { value: otherCosts.value, name: 'Other', itemStyle: { color: '#f5e35e' } }
        ]
      }]
    })
  }

  // Status Donut Chart
  if (statusDonutChart.value) {
    const chart = echarts.init(statusDonutChart.value)
    const statusCounts = { active: 0, maintenance: 0, inactive: 0 }
    vehicleList.value.forEach(v => statusCounts[v.status] = (statusCounts[v.status] || 0) + 1)
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
        data: [
          { value: statusCounts.active, name: 'Active', itemStyle: { color: '#f3d70e' } },
          { value: statusCounts.maintenance, name: 'Maintenance', itemStyle: { color: '#fbb339' } },
          { value: statusCounts.inactive, name: 'Inactive', itemStyle: { color: '#f5e35e' } }
        ]
      }]
    })
  }

  // Top Vehicles Bar Chart
  if (topVehiclesBarChart.value) {
    const chart = echarts.init(topVehiclesBarChart.value)
    const top = [...vehicleList.value].sort((a, b) => b.fuelEfficiency - a.fuelEfficiency).slice(0, 5)
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

  // Alerts Timeline Chart
  if (alertsTimelineChart.value) {
    const chart = echarts.init(alertsTimelineChart.value)
    const alerts = openAnomalies.value.slice(0, 10).map((a, index) => ({
      name: a.description,
      value: index + 1,
      itemStyle: { color: a.severity === 'critical' ? '#fbb339' : a.severity === 'high' ? '#f3d70e' : '#f5e35e' }
    }))
    chart.setOption({
      tooltip: { trigger: 'item', formatter: p => `${p.name}<br>Severity: ${p.data.severity || 'medium'}` },
      xAxis: { type: 'category', data: alerts.map((_, i) => `Alert ${i + 1}`) },
      yAxis: { type: 'value', name: 'Severity Level' },
      series: [{
        type: 'bar',
        data: alerts,
        itemStyle: { borderRadius: [4, 4, 0, 0] },
        barWidth: 20
      }]
    })
  }
}

onMounted(async () => {
  await Promise.all([
    getVehicles(),
    getFuelCards(),
    // getAnomalies(),
    getVendor(),
  ])
  initializeData()
  
  // Initialize charts after data is loaded
  setTimeout(() => {
    initializeCharts()
  }, 100)
})
</script>

<style scoped>
.dashboard-root {
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
.dashboard-header {
  margin-bottom: 40px;
  text-align: center;
}
.dashboard-title {
  font-size: 2.8rem;
  font-weight: 900;
  letter-spacing: -1px;
  color: #040707;
  margin-bottom: 8px;
}
.dashboard-subtitle {
  font-size: 1.25rem;
  color: #040707;
  opacity: 0.8;
  margin-bottom: 0;
}
.kpi-row {
  margin-bottom: 40px;
}
.dashboard-main-grid {
  margin-bottom: 40px;
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
.dashboard-section-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #040707;
  padding-top: 18px;
  padding-bottom: 8px;
  letter-spacing: 0.01em;
  background: none;
}
.dialog-card {
  border-radius: 20px;
  overflow: hidden;
}
.dialog-title {
  background: linear-gradient(135deg, #fbb339 0%, #f3d70e 100%);
  color: #040707;
  font-size: 1.25rem;
  font-weight: 700;
  padding: 24px;
}
.dialog-actions {
  padding: 24px;
  background: linear-gradient(135deg, #ffffff 0%, #f5e35e 20%);
}

/* Fuel Card Balances Styles */
.fuel-cards-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.fuel-card-item {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 227, 94, 0.1) 100%);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(243, 215, 14, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.fuel-card-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #f3d70e, #fbb339);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.fuel-card-item:hover::before {
  opacity: 1;
}

.fuel-card-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(243, 215, 14, 0.2);
}

.fuel-card-item.low-balance {
  border: 2px solid #fbb339;
  background: linear-gradient(135deg, rgba(251, 179, 57, 0.1) 0%, rgba(255, 255, 255, 0.95) 100%);
}

.fuel-card-item.low-balance::before {
  background: linear-gradient(90deg, #fbb339, #f3d70e);
  opacity: 1;
}

.fuel-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.vehicle-info {
  display: flex;
  align-items: center;
}

.vehicle-name {
  font-weight: 600;
  font-size: 1.1rem;
  color: #040707;
}

.fuel-card-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-number {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #040707;
  opacity: 0.7;
  letter-spacing: 1px;
}

.balance-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.balance-amount {
  font-weight: 700;
  font-size: 1.2rem;
  color: #040707;
}

.balance-amount.low-balance-text {
  color: #fbb339;
}

.balance-percentage {
  font-size: 0.9rem;
  color: #040707;
  opacity: 0.7;
  font-weight: 500;
}

.balance-progress {
  margin: 8px 0;
}

.last-refill {
  font-size: 0.85rem;
  color: #040707;
  opacity: 0.6;
  font-style: italic;
}

/* Service Schedule Styles */
.service-schedule-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.service-item {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 227, 94, 0.1) 100%);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(243, 215, 14, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.service-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #f3d70e, #fbb339);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.service-item:hover::before {
  opacity: 1;
}

.service-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(243, 215, 14, 0.2);
}

.service-item.overdue {
  border: 2px solid #fbb339;
  background: linear-gradient(135deg, rgba(251, 179, 57, 0.15) 0%, rgba(255, 255, 255, 0.95) 100%);
}

.service-item.overdue::before {
  background: linear-gradient(90deg, #fbb339, #f3d70e);
  opacity: 1;
}

.service-item.urgent {
  border: 2px solid #f3d70e;
  background: linear-gradient(135deg, rgba(243, 215, 14, 0.15) 0%, rgba(255, 255, 255, 0.95) 100%);
}

.service-item.urgent::before {
  background: linear-gradient(90deg, #f3d70e, #fbb339);
  opacity: 1;
}

.service-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.service-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.vehicle-id {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #040707;
  opacity: 0.7;
  letter-spacing: 1px;
}

.mileage-info {
  font-weight: 600;
  color: #040707;
}

.next-service {
  font-size: 0.9rem;
  color: #040707;
  opacity: 0.7;
}

.service-progress {
  margin: 8px 0;
}

.service-interval {
  font-size: 0.85rem;
  color: #040707;
  opacity: 0.6;
  font-style: italic;
}
</style> 