<template>
  <div class="fuel-root">
    <div class="fuel-header">
      <h1 class="fuel-title">Fuel Management</h1>
      <p class="fuel-subtitle">Track fuel consumption, manage fuel cards, and monitor efficiency</p>
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

    <!-- Action Bar -->
    <div class="fuel-actions mb-6">
      <v-row align="center">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            placeholder="Search fuel records by vehicle or station..."
            variant="outlined"
            density="compact"
            hide-details
            class="fuel-search"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6" class="text-md-right">
          <v-btn
            color="success"
            prepend-icon="mdi-gas-station"
            class="fuel-btn me-2"
            @click="showFuelEntryDialog = true"
          >
            Add Fuel Entry
          </v-btn>
          <v-btn
            color="primary"
            prepend-icon="mdi-credit-card-plus"
            class="fuel-btn"
            @click="showCardDialog = true"
          >
            Add Fuel Card
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <!-- Main Content Tabs -->
    <v-card class="fuel-section-card">
      <v-tabs v-model="activeTab" color="primary" class="fuel-tabs">
        <v-tab value="records">Fuel Records</v-tab>
        <v-tab value="cards">Fuel Cards</v-tab>
        <v-tab value="efficiency">Efficiency Analysis</v-tab>
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
                    <span>{{ item.licensePlate }}</span>
                  </div>
                </template>
                <template v-slot:item.quantity="{ item }">
                  <span class="font-weight-medium">{{ item.quantity }} L</span>
                </template>
                <template v-slot:item.amount="{ item }">
                  <span class="font-weight-medium">{{ item.amount.toLocaleString() }} ETB</span>
                </template>
                <template v-slot:item.fuelEfficiency="{ item }">
                  <v-chip
                    :color="getEfficiencyColor(item.fuelEfficiency)"
                    size="small"
                  >
                    {{ item.fuelEfficiency.toFixed(1) }} km/l
                  </v-chip>
                </template>
                <template v-slot:item.date="{ item }">
                  {{ formatDate(item.date) }}
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
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
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

// Composables
const { vehicles, getVehicles } = useVehicles()
const { fuelRecords, fuelCards, loading, getFuelRecords, getFuelCards, lowBalanceCards, activeCards } = useFuel()

// Reactive data
const activeTab = ref('records')
const searchQuery = ref('')
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

// Table headers
const fuelRecordHeaders = [
  { title: 'Vehicle', key: 'vehicleId', sortable: true },
  { title: 'Date', key: 'date', sortable: true },
  { title: 'Quantity', key: 'quantity', sortable: true },
  { title: 'Amount', key: 'amount', sortable: true },
  { title: 'Station', key: 'station', sortable: true },
  { title: 'Efficiency', key: 'fuelEfficiency', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
]

// Computed properties
const filteredFuelRecords = computed(() => {
  if (!searchQuery.value) return fuelRecords.value
  
  const query = searchQuery.value.toLowerCase()
  return fuelRecords.value.filter(record => 
    record.licensePlate.toLowerCase().includes(query) ||
    record.station.toLowerCase().includes(query)
  )
})

const totalFuelSpent = computed(() => {
  return fuelCards.value.reduce((sum, card) => sum + card.amountSpent, 0)
})

const vehiclesByEfficiency = computed(() => {
  return [...vehicles.value].sort((a, b) => b.fuelEfficiency - a.fuelEfficiency)
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

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
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
.fuel-root {
  padding-bottom: 32px;
}

.fuel-header {
  margin-bottom: 32px;
}

.fuel-title {
  letter-spacing: -0.5px;
  margin-top: 8px;
  font-size: 2rem;
  font-weight: 700;
  color: var(--v-theme-text-primary);
}

.fuel-subtitle {
  margin-bottom: 32px;
  color: var(--v-theme-text-secondary);
  font-size: 1.1rem;
}

.kpi-row {
  margin-bottom: 32px;
}

.fuel-actions {
  background: linear-gradient(135deg, #fffde7 0%, #f8fafb 100%);
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(16, 30, 54, 0.06);
}

.fuel-search {
  max-width: 400px;
}

.fuel-btn {
  font-weight: 600;
  border-radius: 10px;
  min-width: 140px;
}

.fuel-section-card {
  border-radius: 18px;
  background: linear-gradient(135deg, #fffde7 0%, #f8fafb 100%);
  box-shadow: 0 2px 12px rgba(16, 30, 54, 0.06);
  overflow: hidden;
}

.fuel-tabs {
  background: transparent;
}

.fuel-table {
  border-radius: 12px;
  overflow: hidden;
}

.fuel-card {
  border-radius: 16px;
  background: linear-gradient(135deg, #e3f2fd 0%, #f8fafb 100%);
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.08);
  margin-bottom: 16px;
  transition: box-shadow 0.2s, transform 0.2s;
}

.fuel-card:hover {
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

.efficiency-card {
  border-radius: 16px;
  background: linear-gradient(135deg, #f3e5f5 0%, #f8fafb 100%);
  box-shadow: 0 2px 8px rgba(156, 39, 176, 0.08);
  margin-bottom: 16px;
}

.efficiency-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f1f3;
}

.efficiency-item:last-child {
  border-bottom: none;
}
</style> 