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
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <div class="kpi-card">
            <div class="kpi-icon kpi-primary">
              <v-icon>mdi-truck</v-icon>
            </div>
            <div class="kpi-content">
              <h3 class="kpi-value">{{ loading ? '...' : vehicleList.length }}</h3>
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
              <h3 class="kpi-value">{{ loading ? '...' : activeVehicles.length }}</h3>
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
              <h3 class="kpi-value">{{ loading ? '...' : serviceDueVehicles.length }}</h3>
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
              <h3 class="kpi-value">{{ loading ? '...' : openAnomalies.length }}</h3>
              <p class="kpi-label">Open Alerts</p>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
    <!-- End of conditional content -->

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

      <v-row>
        <!-- Fuel Card Balances -->
        <v-col cols="12" lg="8">
          <div class="chart-card">
            <div class="chart-header">
              <h3>Fuel Card Balances</h3>
              <p>Current fuel card status and balances</p>
            </div>
            <div class="fuel-cards-grid">
              <div 
                v-for="card in fuelCardData" 
                :key="card.id"
                class="fuel-card-item"
                :class="{ 'low-balance': card.isLowBalance }"
              >
                <div class="fuel-card-header">
                  <div class="vehicle-info">
                    <v-icon size="small" class="me-2">mdi-car</v-icon>
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
                      ${{ (card.currentBalance || 0).toLocaleString() }} / ${{ (card.totalBalance || 0).toLocaleString() }}
                    </span>
                    <span class="balance-percentage">{{ (card.percentage || 0).toFixed(1) }}%</span>
                  </div>
                  
                  <v-progress-linear
                    :model-value="card.percentage || 0"
                    :color="card.isLowBalance ? 'error' : 'primary'"
                    height="6"
                    rounded
                    class="balance-progress"
                  ></v-progress-linear>
                  
                  <div class="last-refill">
                    Last refill: {{ card.lastRefillDate }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-col>

        <!-- Service Schedule -->
        <v-col cols="12" lg="4">
          <div class="chart-card">
            <div class="chart-header">
              <div class="d-flex align-center justify-space-between w-100">
                <h3>Service Schedule</h3>
                <v-btn
                  color="primary"
                  variant="outlined"
                  size="small"
                  prepend-icon="mdi-plus"
                >
                  Schedule
                </v-btn>
              </div>
            </div>
            <div class="service-schedule-list">
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
                    Current Mileage: {{ (service.currentMileage || 0).toLocaleString() }} km
                  </div>
                  <div class="next-service">
                    Next Service: {{ (service.nextServiceMileage || 0).toLocaleString() }} km
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-col>
             </v-row>

       <!-- Quick Actions Section -->
       <v-row>
         <v-col cols="12" md="6">
           <div class="chart-card">
             <div class="chart-header">
               <h3>Quick Actions</h3>
               <p>Common tasks and shortcuts</p>
             </div>
             <div class="quick-actions-grid">
               <v-btn 
                 block 
                 color="primary" 
                 variant="outlined" 
                 prepend-icon="mdi-plus" 
                 class="action-btn mb-3" 
                 @click="$router.push('/vehicles')"
               >
                 Add Vehicle
               </v-btn>
               <v-btn 
                 block 
                 color="success" 
                 variant="outlined" 
                 prepend-icon="mdi-gas-station" 
                 class="action-btn mb-3" 
                 @click="$router.push('/fuel')"
               >
                 Fuel Entry
               </v-btn>
               <v-btn 
                 block 
                 color="info" 
                 variant="outlined" 
                 prepend-icon="mdi-speedometer" 
                 class="action-btn mb-3" 
                 @click="$router.push('/mileage')"
               >
                 Mileage Entry
               </v-btn>
               <v-btn 
                 block 
                 color="warning" 
                 variant="outlined" 
                 prepend-icon="mdi-chart-box" 
                 class="action-btn mb-3" 
                 @click="$router.push('/analytics-reports')"
               >
                 Analytics
               </v-btn>
               <v-btn 
                 block 
                 color="secondary" 
                 variant="outlined" 
                 prepend-icon="mdi-credit-card" 
                 class="action-btn mb-3" 
                 @click="showAddCardDialog = true"
               >
                 Add Card
               </v-btn>
               <v-btn 
                 block 
                 color="error" 
                 variant="outlined" 
                 prepend-icon="mdi-wrench" 
                 class="action-btn mb-3" 
                 @click="$router.push('/maintenance')"
               >
                 Maintenance
               </v-btn>
             </div>
           </div>
         </v-col>
         <v-col cols="12" md="6">
           <!-- Add Card Dialog -->
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
                       <v-select 
                         v-model="cardForm.vendorCardId" 
                         :items="vendorCardOptions" 
                         label="Select from Vendor Cards (Optional)" 
                         variant="outlined" 
                         placeholder="Choose an existing vendor card or leave empty to create new" 
                         clearable
                       ></v-select>
                     </v-col>
                     <v-col cols="12">
                       <v-text-field 
                         v-model="cardForm.cardNumber" 
                         label="Card Number" 
                         variant="outlined" 
                         :rules="[v => !!v || 'Card number is required']" 
                         required
                       ></v-text-field>
                     </v-col>
                     <v-col cols="12">
                       <v-text-field 
                         v-model="cardForm.cardHolder" 
                         label="Card Holder" 
                         variant="outlined" 
                         :rules="[v => !!v || 'Card holder is required']" 
                         required
                       ></v-text-field>
                     </v-col>
                     <v-col cols="12">
                       <v-text-field 
                         v-model="cardForm.totalValue" 
                         label="Total Value (ETB)" 
                         type="number" 
                         variant="outlined" 
                         :rules="[v => !!v || 'Total value is required']" 
                         required
                       ></v-text-field>
                     </v-col>
                     <v-col cols="12">
                       <v-text-field 
                         v-model="cardForm.expiryDate" 
                         label="Expiry Date" 
                         type="date" 
                         variant="outlined" 
                         :rules="[v => !!v || 'Expiry date is required']" 
                         required
                       ></v-text-field>
                     </v-col>
                     <v-col cols="12">
                       <v-select 
                         v-model="cardForm.status" 
                         :items="cardStatusOptions" 
                         label="Status" 
                         variant="outlined" 
                         :rules="[v => !!v || 'Status is required']" 
                         required
                       ></v-select>
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
   </div>
 </template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import * as echarts from 'echarts'



const { vehicleList, loading, getVehicles, activeVehicles, serviceDueVehicles, calculateServiceDue } = useVehicles()
const { fuelCards, getFuelCards, lowBalanceCards, fuelRecords, getFuelRecords } = useFuel()
const { anomalies, getAnomalies, openAnomalies } = useAnomalies()
const { cards, vendorCards, initializeData } = useVendorData()
const { vendorList,getVendor,error } = useVendor()


// Chart refs
const fleetUtilizationChart = ref(null)
const costPieChart = ref(null)
const statusDonutChart = ref(null)
const topVehiclesBarChart = ref(null)
const alertsTimelineChart = ref(null)

// Period selector
const selectedPeriod = ref('6 months')

// KPI/Stats
const totalFuelSpent = computed(() => fuelCards.value.reduce((sum, card) => sum + card.amountSpent, 0))
const averageEfficiency = computed(() => vehicleList.value.length === 0 ? 0 : vehicleList.value.reduce((sum, v) => sum + v.fuelEfficiency, 0) / vehicleList.value.length)
const maintenanceCost = ref(150000)
const otherCosts = ref(50000)

// Calculate monthly fuel consumption in liters
const getMonthlyFuelConsumption = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
  const currentYear = new Date().getFullYear()
  
  return months.map((month, index) => {
    const monthRecords = fuelRecords.value.filter(record => {
      const recordDate = new Date(record.date)
      return recordDate.getFullYear() === currentYear && recordDate.getMonth() === index
    })
    
    return monthRecords.reduce((sum, record) => sum + record.quantity, 0)
  })
}

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
    nextServiceMileage: 90000,
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
    nextServiceMileage: 160000,
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
    nextServiceMileage: 50000,
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
const cardForm = ref({ cardNumber: '', cardHolder: '', totalValue: '', expiryDate: '', status: 'Active', vendorCardId: '' })
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
          expiryDate: cardForm.value.expiryDate,
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
        expiryDate: cardForm.value.expiryDate,
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
  cardForm.value = { cardNumber: '', cardHolder: '', totalValue: '', expiryDate: '', status: 'Active', vendorCardId: '' }
}
const maskCardNumber = (cardNumber) => `****-****-****-${cardNumber.slice(-4)}`

const initializeCharts = () => {
  // Fleet Utilization Chart - Now showing Fuel Consumption in Liters
  if (fleetUtilizationChart.value) {
    const chart = echarts.init(fleetUtilizationChart.value)
    const monthlyFuelConsumption = getMonthlyFuelConsumption()
    
    chart.setOption({
      tooltip: { 
        trigger: 'axis',
        formatter: function(params) {
          return `${params[0].name}<br/>${params[0].seriesName}: ${params[0].value} liters`
        }
      },
      xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
      yAxis: { 
        type: 'value', 
        name: 'Liters',
        axisLabel: { formatter: '{value} L' },
        nameLocation: 'middle',
        nameGap: 40
      },
      series: [{
        name: 'Fuel Consumption',
        data: monthlyFuelConsumption,
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
        lineStyle: {
          width: 3
        }
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

// Auth composables
const { logout } = useAuth()
const { currentUser, status } = useAuthState()
const { AuthState } = await import('~/types/auth')



// Watch for authentication state changes
watch(() => status.value, async (newStatus) => {
  if (newStatus === AuthState.authenticated) {
    try {
      await Promise.all([
        getVehicles(),
        getFuelCards(),
        getVendor(),
      ])
      initializeData()
      
      // Initialize charts after data is loaded
      setTimeout(() => {
        initializeCharts()
      }, 100)
    } catch (error) {
      console.error('Error loading dashboard data after auth:', error)
    }
  }
})

onMounted(async () => {
  const { status } = useAuthState()
  
  // Wait for authentication to be ready
  await nextTick()
  
  // Only load data if user is authenticated
  if (status.value === AuthState.authenticated) {
    try {
      await Promise.all([
        getVehicles(),
        getFuelCards(),
        getFuelRecords(),
        // getAnomalies(),
        getVendor(),
      ])
      initializeData()
      
      // Initialize charts after data is loaded
      setTimeout(() => {
        initializeCharts()
      }, 100)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }
})
</script>

<style scoped>
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
  max-width: 120px;
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