<template>
  <div class="fuel-management-root">
    <!-- Header Section -->
    <div class="fuel-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="fuel-title">Fuel Management</h1>
          <p class="fuel-subtitle">Track fuel consumption, manage fuel cards, and monitor efficiency</p>
        </div>
        <div class="header-actions">
          <!-- <v-btn
            color="primary"
            prepend-icon="mdi-gas-station"
            class="header-btn"
            @click="showFuelEntryDialog = true"
          >
            Add Fuel Entry
          </v-btn>
          <v-btn
            color="success"
            prepend-icon="mdi-credit-card-plus"
            class="header-btn"
            @click="showCardDialog = true"
          >
            Add Fuel Card
          </v-btn> -->
          <v-btn
            icon="mdi-refresh"
            variant="text"
            size="small"
            @click="refreshFuelData"
            :loading="loading"
            class="refresh-btn"
          ></v-btn>
        </div>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-row">
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Total Fuel Cards"
            :value="loading ? '...' : cardList.length.toString()"
            icon="mdi-credit-card"
            color="primary"
            :loading="loading"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Active Cards"
            :value="loading ? '...' : cardList.filter(x => x.status == 1).length.toString()"
            icon="mdi-check-circle"
            color="success"
            :loading="loading"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Low Balance Cards"
            :value="loading ? '...' : cardList.filter(x => x.balance <= 1000).length.toString()"
            icon="mdi-alert"
            color="warning"
            :loading="loading"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Total Spent"
            :value="loading ? '...' : `${getCardBalance()}`"
            icon="mdi-currency-usd"
            color="error"
            :loading="loading"
          />
        </v-col>
      </v-row>
    </div>

    <!-- Search and Filter Bar -->
    <div class="search-filter-section">
      <v-card class="search-card">
        <v-card-text>
          <v-row align="center">
            <v-col cols="12" md="4">
              <v-text-field
                v-model="searchQuery"
                prepend-inner-icon="mdi-magnify"
                placeholder="Search fuel records by vehicle or station..."
                variant="outlined"
                density="compact"
                hide-details
                class="search-field"
                @input="filterFuelData"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="statusFilter"
                :items="statusOptions"
                label="Status Filter"
                variant="outlined"
                density="compact"
                hide-details
                @update:model-value="filterFuelData"
              ></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="cardFilter"
                :items="cardOptions"
                label="Card Filter"
                variant="outlined"
                density="compact"
                hide-details
                @update:model-value="filterFuelData"
              ></v-select>
            </v-col>
            <v-col cols="12" md="2" class="text-right">
              <v-btn
                color="primary"
                variant="outlined"
                prepend-icon="mdi-filter-variant"
                @click="showAdvancedFilters = !showAdvancedFilters"
                class="filter-btn"
              >
                Filters
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <v-card class="content-card">
        <v-tabs v-model="activeTab" color="primary" class="fuel-tabs">
          <v-tab value="records">Fuel Records</v-tab>
          <!-- <v-tab value="cards">Fuel Cards</v-tab>
          <v-tab value="efficiency">Efficiency Analysis</v-tab> -->
        </v-tabs>

      <v-window v-model="activeTab">
        <!-- Fuel Records Tab -->
        <v-window-item value="records">
          <v-card-text class="pa-6">
            <div v-if="loading" class="text-center py-8">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
            <div v-else>
              <v-data-table
                :headers="fuelRecordHeaders"
                :items="filteredFuelRecords"
                :search="searchQuery"
                class="fuel-table"
                density="comfortable"
              >
                <template v-slot:item.vehicleId="{ item }">
                  <div class="d-flex align-center">
                    <v-icon size="small" class="me-2">mdi-truck</v-icon>
                    <span v-if="vehicleList.length">{{ vehicleList.find(vv => vv.id == item.vehicleId).plateNo }}</span>
                  </div>
                </template>
                <template v-slot:item.quantity="{ item }">
                  <span class="font-weight-medium">{{ item.quantity }} L</span>
                </template>
                <template v-slot:item.amount="{ item }">
                  <span class="font-weight-medium">{{ item.amount.toLocaleString() }} ETB</span>
                </template>
                <template v-slot:item.fuelEfficiency="{ item }">
                  <!-- <v-chip
                    :color="getEfficiencyColor(item.fuelEfficiency)"
                    size="small"
                  >
                    {{ item.fuelEfficiency.toFixed(1) }} km/l
                  </v-chip> -->
                </template>
                <template v-slot:item.createdAt="{ item }">
                  {{ formatDate(item.createdAt) }}
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-btn
                    icon="mdi-eye"
                    size="small"
                    variant="text"
                    color="primary"
                    @click="viewFuelRecord(item)"
                  ></v-btn>
                </template>
              </v-data-table>
            </div>
          </v-card-text>
        </v-window-item>

        <!-- Fuel Cards Tab -->
        <v-window-item value="cards">
          <v-card-text class="pa-6">
            <div v-if="loading" class="text-center py-8">
              <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
              <div class="mt-4 text-muted">Loading fuel cards...</div>
            </div>
            <div v-else-if="fuelCards.length === 0" class="text-center py-8">
              <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-credit-card-off</v-icon>
              <h3 class="text-h6 text-muted mb-2">No fuel cards found</h3>
              <p class="text-muted">Add your first fuel card to get started</p>
            </div>
            <div v-else>
              <v-row>
                <v-col
                  v-for="card in fuelCards"
                  :key="card.id"
                  cols="12"
                  sm="6"
                  lg="4"
                >
                <v-card class="fuel-card">
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
                          <span class="balance-value">{{ (card.totalValueIssued || 0).toLocaleString() }} ETB</span>
                        </div>
                        <div class="balance-item">
                          <span class="balance-label">Amount Spent:</span>
                          <span class="balance-value">{{ (card.amountSpent || 0).toLocaleString() }} ETB</span>
                        </div>
                        <div class="balance-item">
                          <span class="balance-label">Remaining:</span>
                          <span class="balance-value" :class="{ 'text-error': card.isLowBalance }">
                            {{ (card.remainingBalance || 0).toLocaleString() }} ETB
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
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
            </div>
          </v-card-text>
        </v-window-item>

        <!-- Efficiency Analysis Tab -->
        <v-window-item value="efficiency">
          <v-card-text class="pa-6">
            <v-row>
              <v-col cols="12" md="6">
                <v-card class="efficiency-card">
                  <v-card-title>Vehicle Efficiency Ranking</v-card-title>
                  <v-card-text>
                    <div
                      v-for="vehicle in vehiclesByEfficiency"
                      :key="vehicle.id"
                      class="efficiency-item"
                    >
                      <div class="d-flex align-center justify-space-between">
                        <div>
                          <div class="font-weight-medium">{{ vehicle.licensePlate }}</div>
                          <div class="text-caption">{{ vehicle.brand }} {{ vehicle.model }}</div>
                        </div>
                        <v-chip
                          :color="getEfficiencyColor(vehicle.fuelEfficiency)"
                          size="small"
                        >
                          {{ vehicle.fuelEfficiency.toFixed(1) }} km/l
                        </v-chip>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <v-card class="efficiency-card">
                  <v-card-title>Monthly Fuel Consumption</v-card-title>
                  <v-card-text>
                    <div class="text-center py-8">
                      <v-icon size="64" color="grey-lighten-1">mdi-chart-line</v-icon>
                      <p class="text-muted mt-2">Fuel consumption charts will be displayed here</p>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-window-item>
      </v-window>
    </v-card>
    </div>

    <!-- Add Fuel Entry Dialog -->
    <v-dialog v-model="showFuelEntryDialog" max-width="600px">
      <v-card>
        <v-card-title class="text-h6 pa-4">Add Fuel Entry</v-card-title>
        <v-card-text class="pa-4">
          <v-form ref="fuelForm" v-model="fuelFormValid">
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="fuelEntryForm.vehicleId"
                  :items="vehicles"
                  item-title="licensePlate"
                  item-value="id"
                  label="Vehicle"
                  variant="outlined"
                  :rules="[v => !!v || 'Vehicle is required']"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="fuelEntryForm.quantity"
                  label="Quantity (Liters)"
                  type="number"
                  variant="outlined"
                  :rules="[v => !!v || 'Quantity is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="fuelEntryForm.amount"
                  label="Amount (ETB)"
                  type="number"
                  variant="outlined"
                  :rules="[v => !!v || 'Amount is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="fuelEntryForm.odometerReading"
                  label="Odometer Reading (km)"
                  type="number"
                  variant="outlined"
                  :rules="[v => !!v || 'Odometer reading is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="fuelEntryForm.station"
                  label="Fuel Station"
                  variant="outlined"
                  :rules="[v => !!v || 'Station is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="fuelEntryForm.fuelCardId"
                  :items="fuelCards"
                  item-title="cardNumber"
                  item-value="id"
                  label="Fuel Card"
                  variant="outlined"
                  :rules="[v => !!v || 'Fuel card is required']"
                  required
                ></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="outlined" @click="showFuelEntryDialog = false">Cancel</v-btn>
          <v-btn
            color="success"
            :loading="saving"
            :disabled="!fuelFormValid"
            @click="saveFuelEntry"
          >
            Add Entry
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import moment from 'moment'
// Composables
const { vehicleList, getVehicles } = useVehicles()
const { fuelRecords, fuelCards, loading, getFuelRecords, getFuelCards, lowBalanceCards, activeCards } = useFuel()
const {cardList, getCard} = useCard()
// Reactive data
const activeTab = ref('records')
const searchQuery = ref('')
const statusFilter = ref('all')
const cardFilter = ref('all')
const showAdvancedFilters = ref(false)
const showFuelEntryDialog = ref(false)
const showCardDialog = ref(false)
const saving = ref(false)
const fuelFormValid = ref(false)
const fuelEntryForm = ref({
  vehicleId: '',
  quantity: 0,
  amount: 0,
  odometerReading: 0,
  station: '',
  fuelCardId: ''
})

// Filter options
const statusOptions = [
  { title: 'All Records', value: 'all' },
  { title: 'Recent', value: 'recent' },
  { title: 'This Month', value: 'month' },
  { title: 'This Year', value: 'year' }
]

const cardOptions = [
  { title: 'All Cards', value: 'all' },
  { title: 'Active', value: 'active' },
  { title: 'Low Balance', value: 'low_balance' },
  { title: 'Inactive', value: 'inactive' }
]

// Table headers
const fuelRecordHeaders = [
  { title: 'Vehicle', key: 'vehicleId', sortable: true },
  { title: 'Date', key: 'createdAt', sortable: true },
  { title: 'Quantity', key: 'quantity', sortable: true },
  { title: 'Amount', key: 'amount', sortable: true },
  { title: 'Station', key: 'fuelStation', sortable: true },
  // { title: 'Efficiency', key: 'fuelEfficiency', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
]

// Computed properties
const filteredFuelRecords = computed(() => {
  if (!searchQuery.value) return fuelRecords.value
  
  const query = searchQuery.value.toLowerCase()
  return fuelRecords.value.filter(record => 
    (record.licensePlate && record.licensePlate.toLowerCase().includes(query)) ||
    (record.station && record.station.toLowerCase().includes(query))
  )
})

const totalFuelSpent = computed(() => {
  return fuelCards.value.reduce((sum, card) => sum + (card.amountSpent || 0), 0)
})

const totalFuelCards = computed(() => {
  return fuelCards.value.length
})

const totalActiveCards = computed(() => {
  return activeCards.value.length
})

const totalLowBalanceCards = computed(() => {
  return lowBalanceCards.value.length
})

const vehiclesByEfficiency = computed(() => {
  return [...vehicles.value].sort((a, b) => (b.fuelEfficiency || 0) - (a.fuelEfficiency || 0))
})

// Methods
const getEfficiencyColor = (efficiency) => {
  if (efficiency >= 12) return 'success'
  if (efficiency >= 10) return 'warning'
  return 'error'
}

const getBalancePercentage = (card) => {
  const amountSpent = card.amountSpent || 0
  const totalValue = card.totalValueIssued || 1 // Avoid division by zero
  return Math.round((amountSpent / totalValue) * 100)
}

const getBalanceColor = (card) => {
  const percentage = getBalancePercentage(card)
  if (percentage >= 80) return 'error'
  if (percentage >= 60) return 'warning'
  return 'success'
}

const formatDate = (dateString) => {
  return moment(dateString).format('lll')
}

const viewFuelRecord = (record) => {
  console.log('View fuel record:', record)
}

const viewCardDetails = (card) => {
  console.log('View card details:', card)
}

const editCard = (card) => {
  console.log('Edit card:', card)
}

const saveFuelEntry = async () => {
  saving.value = true
  try {
    // TODO: Implement save logic
    console.log('Saving fuel entry:', fuelEntryForm.value)
    showFuelEntryDialog.value = false
    resetFuelForm()
  } catch (error) {
    console.error('Error saving fuel entry:', error)
  } finally {
    saving.value = false
  }
}

const refreshFuelData = async () => {
  try {
    await Promise.all([
      getFuelRecords(),
      getFuelCards()
    ])
  } catch (error) {
    console.error('Error refreshing fuel data:', error)
  }
}

const filterFuelData = () => {
  // This method will be called when filters change
  // The filtering logic is handled in the computed properties
  console.log('Filtering fuel data:', { searchQuery: searchQuery.value, statusFilter: statusFilter.value, cardFilter: cardFilter.value })
}

const resetFuelForm = () => {
  fuelEntryForm.value = {
    vehicleId: '',
    quantity: 0,
    amount: 0,
    odometerReading: 0,
    station: '',
    fuelCardId: ''
  }
}
const getCardBalance = () => {
  console.log('XX.AMOUNT', fuelRecords);
  
  let x = 0
  fuelRecords.value.forEach(xx => {
      x += xx.amount
  });

  return x.toLocaleString()
}
// Lifecycle
onMounted(async () => {
  try {
    await Promise.all([
      getVehicles(),
      getFuelRecords(),
      getCard()
      
    ])
  } catch (error) {
    console.error('Error loading fuel data:', error)
  }
})
</script>

<style scoped>
.fuel-management-root {
  padding: 32px;
  min-height: 100vh;
  background: #fafafa;
}

.fuel-header {
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

.fuel-title {
  font-size: 2.75rem;
  font-weight: 900;
  color: #040707;
  margin-bottom: 12px;
  letter-spacing: -1px;
  line-height: 1.1;
}

.fuel-subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0;
  font-weight: 400;
  line-height: 1.5;
}

.header-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.header-btn {
  font-weight: 600;
  border-radius: 16px;
  text-transform: none;
  padding: 16px 28px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.95rem;
  letter-spacing: 0.025em;
}

.header-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.refresh-btn {
  color: #6b7280;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  color: #1976d2;
  transform: rotate(180deg);
}

.kpi-section {
  margin-bottom: 40px;
}

.search-filter-section {
  margin-bottom: 40px;
}

.search-card {
  border-radius: 20px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.search-field {
  border-radius: 16px;
}

.filter-btn {
  border-radius: 16px;
  font-weight: 500;
}

.main-content {
  margin-bottom: 40px;
}

.content-card {
  border-radius: 24px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.content-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  border-color: rgba(0, 0, 0, 0.1);
}

.fuel-tabs {
  background: transparent;
}

.fuel-table {
  border-radius: 12px;
  overflow: hidden;
}

.fuel-card {
  border-radius: 20px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  margin-bottom: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.fuel-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border-color: rgba(0, 0, 0, 0.1);
}

.fuel-card-header {
  padding: 20px 24px 16px 24px;
  border-bottom: 1px solid #e0e0e0;
  background: #fafafa;
}

.fuel-card-number {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1976d2;
}

.fuel-card-content {
  padding: 20px 24px;
}

.fuel-card-info {
  height: 100%;
}

.fuel-card-holder {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 16px;
  color: #1a1a1a;
}

.fuel-card-icon {
  color: #1976d2;
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
  color: #666;
}

.balance-value {
  font-weight: 500;
  color: #1a1a1a;
}

.balance-progress {
  margin-top: auto;
}

.fuel-card-actions {
  padding: 16px 24px 20px 24px;
  border-top: 1px solid #e0e0e0;
  gap: 8px;
  background: #fafafa;
}

.efficiency-card {
  border-radius: 20px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  margin-bottom: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.efficiency-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border-color: rgba(0, 0, 0, 0.1);
}

.efficiency-item {
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.efficiency-item:last-child {
  border-bottom: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .fuel-management-root {
    padding: 16px;
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
  
  .fuel-title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .fuel-title {
    font-size: 1.75rem;
  }
}
</style> 