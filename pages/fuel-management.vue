<template>
  <div class="fuel-management-root">
    <div class="fuel-management-header">
      <h1 class="fuel-management-title">Fuel Management</h1>
      <p class="fuel-management-subtitle">Comprehensive fuel tracking, card management, and consumption analysis</p>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-row">
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Total Fuel Cards"
            :value="fuelCards.length.toString()"
            icon="mdi-credit-card"
            color="primary"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Active Cards"
            :value="activeCards.length.toString()"
            icon="mdi-check-circle"
            color="success"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Low Balance Cards"
            :value="lowBalanceCards.length.toString()"
            icon="mdi-alert"
            color="warning"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Total Spent"
            :value="`${totalFuelSpent.toLocaleString()} ETB`"
            icon="mdi-currency-usd"
            color="error"
          />
        </v-col>
      </v-row>
    </div>

    <!-- Main Content Tabs -->
    <v-card class="fuel-management-section-card">
      <v-tabs v-model="activeTab" color="primary" class="fuel-management-tabs">
        <v-tab value="overview">Overview</v-tab>
        <v-tab value="cards">Fuel Cards</v-tab>
        <v-tab value="consumption">Consumption Analysis</v-tab>
        <v-tab value="efficiency">Efficiency Reports</v-tab>
      </v-tabs>

      <v-window v-model="activeTab">
        <!-- Overview Tab -->
        <v-window-item value="overview">
          <v-card-text class="pa-6">
            <v-row>
              <v-col cols="12" lg="8">
                <v-card class="overview-card">
                  <v-card-title>Recent Fuel Transactions</v-card-title>
                  <v-card-text>
                    <v-data-table
                      :headers="fuelTransactionHeaders"
                      :items="recentFuelTransactions"
                      class="fuel-table"
                      density="comfortable"
                    >
                      <!-- <template v-slot:item.vehicleId="{ item }"> -->
                        <template v-slot:item_vehicleId="{ item }">

                        <div class="d-flex align-center">
                          <v-icon size="small" class="me-2">mdi-truck</v-icon>
                          <span>{{ item.licensePlate }}</span>
                        </div>
                      </template>
                      <!-- <template v-slot:item.quantity="{ item }"> -->
                        <template v-slot:item_quantity="{ item }">

                        <span class="font-weight-medium">{{ item.quantity }} L</span>
                      </template>
                      <!-- <template v-slot:item.amount="{ item }"> -->
                        <template v-slot:item_amount="{ item }">

                        <span class="font-weight-medium">{{ item.amount.toLocaleString() }} ETB</span>
                      </template>
                      <!-- <template v-slot:item.fuelEfficiency="{ item }"> -->
                        <template v-slot:item_fuelEfficiency="{ item }">

                        <v-chip
                          :color="getEfficiencyColor(item.fuelEfficiency)"
                          size="small"
                        >
                          {{ item.fuelEfficiency.toFixed(1) }} km/l
                        </v-chip>
                      </template>
                    </v-data-table>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col cols="12" lg="4">
                <v-card class="overview-card">
                  <v-card-title>Fuel Card Status</v-card-title>
                  <v-card-text>
                    <div
                      v-for="card in fuelCards.slice(0, 5)"
                      :key="card.id"
                      class="card-status-item"
                    >
                      <div class="d-flex align-center justify-space-between">
                        <div>
                          <div class="font-weight-medium">{{ card.cardNumber }}</div>
                          <div class="text-caption">{{ card.cardHolder }}</div>
                        </div>
                        <v-chip
                          :color="card.isLowBalance ? 'error' : 'success'"
                          size="small"
                        >
                          {{ card.remainingBalance.toLocaleString() }} ETB
                        </v-chip>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-window-item>

        <!-- Fuel Cards Tab -->
        <v-window-item value="cards">
          <v-card-text class="pa-6">
            <div class="d-flex justify-space-between align-center mb-4">
              <h3 class="text-h6">Fuel Card Management</h3>
              <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                @click="showAddCardDialog = true"
              >
                Add New Card
              </v-btn>
            </div>
            
            <v-row>
              <v-col
                v-for="card in fuelCards"
                :key="card.id"
                cols="12"
                sm="6"
                lg="4"
              >
                <v-card class="fuel-card-detailed">
                  <v-card-title class="fuel-card-header">
                    <div class="d-flex align-center justify-space-between w-100">
                      <div class="fuel-card-number">{{ card.cardNumber }}</div>
                      <StatusBadge :status="card.status" />
                    </div>
                  </v-card-title>

                  <v-card-text class="fuel-card-content">
                    <div class="fuel-card-info">
                      <div class="fuel-card-holder">
                        <v-icon class="fuel-card-icon me-2">mdi-account</v-icon>
                        {{ card.cardHolder }}
                      </div>
                      
                      <div class="fuel-card-balance">
                        <div class="balance-item">
                          <span class="balance-label">Total Issued:</span>
                          <span class="balance-value">{{ card.totalValueIssued.toLocaleString() }} ETB</span>
                        </div>
                        <div class="balance-item">
                          <span class="balance-label">Amount Spent:</span>
                          <span class="balance-value">{{ card.amountSpent.toLocaleString() }} ETB</span>
                        </div>
                        <div class="balance-item">
                          <span class="balance-label">Remaining:</span>
                          <span class="balance-value" :class="{ 'text-error': card.isLowBalance }">
                            {{ card.remainingBalance.toLocaleString() }} ETB
                          </span>
                        </div>
                      </div>

                      <!-- Balance Progress -->
                      <div class="balance-progress mt-3">
                        <div class="d-flex align-center justify-space-between mb-1">
                          <span class="text-caption">Balance Usage</span>
                          <span class="text-caption">{{ getBalancePercentage(card) }}%</span>
                        </div>
                        <v-progress-linear
                          :model-value="getBalancePercentage(card)"
                          :color="getBalanceColor(card)"
                          height="8"
                          rounded
                        ></v-progress-linear>
                      </div>
                    </div>
                  </v-card-text>

                  <v-card-actions class="fuel-card-actions">
                    <v-btn
                      variant="outlined"
                      size="small"
                      class="fuel-btn"
                      @click="viewCardDetails(card)"
                    >
                      View Details
                    </v-btn>
                    <v-btn
                      variant="outlined"
                      size="small"
                      class="fuel-btn"
                      @click="editCard(card)"
                    >
                      Edit
                    </v-btn>
                    <v-btn
                      variant="outlined"
                      size="small"
                      class="fuel-btn"
                      @click="rechargeCard(card)"
                    >
                      Recharge
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-window-item>

        <!-- Consumption Analysis Tab -->
        <v-window-item value="consumption">
          <v-card-text class="pa-6">
            <v-row>
              <v-col cols="12" md="6">
                <v-card class="consumption-card">
                  <v-card-title>Monthly Fuel Consumption</v-card-title>
                  <v-card-text>
                    <div class="text-center py-8">
                      <v-icon size="64" color="grey-lighten-1">mdi-chart-line</v-icon>
                      <p class="text-muted mt-2">Fuel consumption charts will be displayed here</p>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-card class="consumption-card">
                  <v-card-title>Top Fuel Consumers</v-card-title>
                  <v-card-text>
                    <div
                      v-for="vehicle in topFuelConsumers"
                      :key="vehicle.id"
                      class="consumer-item"
                    >
                      <div class="d-flex align-center justify-space-between">
                        <div>
                          <div class="font-weight-medium">{{ vehicle.licensePlate }}</div>
                          <div class="text-caption">{{ vehicle.brand }} {{ vehicle.model }}</div>
                        </div>
                        <div class="text-right">
                          <div class="font-weight-medium">{{ vehicle.fuelEfficiency.toFixed(1) }} km/l</div>
                          <div class="text-caption">Efficiency</div>
                        </div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-window-item>

        <!-- Efficiency Reports Tab -->
        <v-window-item value="efficiency">
          <v-card-text class="pa-6">
            <v-row>
              <v-col cols="12">
                <v-card class="efficiency-card">
                  <v-card-title>Vehicle Efficiency Ranking</v-card-title>
                  <v-card-text>
                    <v-data-table
                      :headers="efficiencyHeaders"
                      :items="vehiclesByEfficiency"
                      class="efficiency-table"
                      density="comfortable"
                    >
                      <!-- <template v-slot:item.fuelEfficiency="{ item }"> -->
                        <template v-slot:item_fuelEfficiency="{ item }">

                        <v-chip
                          :color="getEfficiencyColor(item.fuelEfficiency)"
                          size="small"
                        >
                          {{ item.fuelEfficiency.toFixed(1) }} km/l
                        </v-chip>
                      </template>
                      <!-- <template v-slot:item.status="{ item }"> -->
                        <template v-slot:item_status="{ item }">

                        <StatusBadge :status="item.status" />
                      </template>
                    </v-data-table>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-window-item>
      </v-window>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Composables
const { vehicles, getVehicles } = useVehicles()
const { fuelRecords, fuelCards, getFuelRecords, getFuelCards, lowBalanceCards, activeCards } = useFuel()

// Reactive data
const activeTab = ref('overview')
const showAddCardDialog = ref(false)

// Table headers
const fuelTransactionHeaders = [
  { title: 'Vehicle', key: 'vehicleId', sortable: true },
  { title: 'Date', key: 'date', sortable: true },
  { title: 'Quantity', key: 'quantity', sortable: true },
  { title: 'Amount', key: 'amount', sortable: true },
  { title: 'Station', key: 'station', sortable: true },
  { title: 'Efficiency', key: 'fuelEfficiency', sortable: true }
]

const efficiencyHeaders = [
  { title: 'Vehicle', key: 'licensePlate', sortable: true },
  { title: 'Model', key: 'model', sortable: true },
  { title: 'Driver', key: 'assignedDriver', sortable: true },
  { title: 'Efficiency', key: 'fuelEfficiency', sortable: true },
  { title: 'Status', key: 'status', sortable: true }
]

// Computed properties
const recentFuelTransactions = computed(() => 
  fuelRecords.value.slice(0, 10)
)

const totalFuelSpent = computed(() => {
  return fuelCards.value.reduce((sum, card) => sum + card.amountSpent, 0)
})

const vehiclesByEfficiency = computed(() => {
  return [...vehicles.value].sort((a, b) => b.fuelEfficiency - a.fuelEfficiency)
})

const topFuelConsumers = computed(() => {
  return vehiclesByEfficiency.value.slice(0, 5)
})

// Methods
const getEfficiencyColor = (efficiency) => {
  if (efficiency >= 12) return 'success'
  if (efficiency >= 10) return 'warning'
  return 'error'
}

const getBalancePercentage = (card) => {
  return ((card.amountSpent / card.totalValueIssued) * 100)
}

const getBalanceColor = (card) => {
  const percentage = getBalancePercentage(card)
  if (percentage >= 80) return 'error'
  if (percentage >= 60) return 'warning'
  return 'success'
}

const viewCardDetails = (card) => {
  console.log('View card details:', card)
}

const editCard = (card) => {
  console.log('Edit card:', card)
}

const rechargeCard = (card) => {
  console.log('Recharge card:', card)
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    getVehicles(),
    getFuelRecords(),
    getFuelCards()
  ])
})
</script>

<style scoped>
.fuel-management-root {
  padding-bottom: 32px;
}

.fuel-management-header {
  margin-bottom: 32px;
}

.fuel-management-title {
  letter-spacing: -0.5px;
  margin-top: 8px;
  font-size: 2rem;
  font-weight: 700;
  color: var(--v-theme-text-primary);
}

.fuel-management-subtitle {
  margin-bottom: 32px;
  color: var(--v-theme-text-secondary);
  font-size: 1.1rem;
}

.kpi-row {
  margin-bottom: 32px;
}

.fuel-management-section-card {
  border-radius: 18px;
  background: linear-gradient(135deg, #fffde7 0%, #f8fafb 100%);
  box-shadow: 0 2px 12px rgba(16, 30, 54, 0.06);
  overflow: hidden;
}

.fuel-management-tabs {
  background: transparent;
}

.fuel-table {
  border-radius: 12px;
  overflow: hidden;
}

.overview-card {
  border-radius: 16px;
  background: linear-gradient(135deg, #e3f2fd 0%, #f8fafb 100%);
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.08);
  margin-bottom: 16px;
}

.card-status-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f1f3;
}

.card-status-item:last-child {
  border-bottom: none;
}

.fuel-card-detailed {
  border-radius: 16px;
  background: linear-gradient(135deg, #e3f2fd 0%, #f8fafb 100%);
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.08);
  margin-bottom: 16px;
  transition: box-shadow 0.2s, transform 0.2s;
}

.fuel-card-detailed:hover {
  box-shadow: 0 4px 16px rgba(33, 150, 243, 0.12);
  transform: translateY(-1px);
}

.fuel-card-header {
  padding: 16px 20px 12px 20px;
  border-bottom: 1px solid #f0f1f3;
}

.fuel-card-number {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--v-theme-primary);
}

.fuel-card-content {
  padding: 16px 20px;
}

.fuel-card-info {
  height: 100%;
}

.fuel-card-holder {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 16px;
  color: var(--v-theme-text-primary);
}

.fuel-card-icon {
  color: var(--v-theme-primary);
}

.fuel-card-balance {
  margin-bottom: 16px;
}

.balance-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.balance-label {
  color: var(--v-theme-text-secondary);
}

.balance-value {
  font-weight: 500;
  color: var(--v-theme-text-primary);
}

.balance-progress {
  margin-top: auto;
}

.fuel-card-actions {
  padding: 12px 20px 16px 20px;
  border-top: 1px solid #f0f1f3;
  gap: 8px;
}

.fuel-btn {
  font-weight: 600;
  border-radius: 10px;
  min-width: 100px;
}

.consumption-card {
  border-radius: 16px;
  background: linear-gradient(135deg, #f3e5f5 0%, #f8fafb 100%);
  box-shadow: 0 2px 8px rgba(156, 39, 176, 0.08);
  margin-bottom: 16px;
}

.consumer-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f1f3;
}

.consumer-item:last-child {
  border-bottom: none;
}

.efficiency-card {
  border-radius: 16px;
  background: linear-gradient(135deg, #e8f5e8 0%, #f8fafb 100%);
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.08);
  margin-bottom: 16px;
}

.efficiency-table {
  border-radius: 12px;
  overflow: hidden;
}
</style> 