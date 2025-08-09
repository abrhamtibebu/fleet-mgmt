<template>
  <div class="mileage-root">
    <div class="mileage-header">
      <h1 class="mileage-title">Mileage Tracking</h1>
      <p class="mileage-subtitle">Track vehicle mileage, monitor service intervals, and analyze usage patterns</p>
    </div>

    <!-- KPI Cards -->
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
            title="Service Due"
            :value="serviceDueVehicles.length.toString()"
            icon="mdi-wrench"
            color="warning"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Avg Monthly Distance"
            :value="`${averageMonthlyDistance.toFixed(0)} km`"
            icon="mdi-speedometer"
            color="info"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Total Distance"
            :value="`${totalDistance.toLocaleString()} km`"
            icon="mdi-map-marker-distance"
            color="success"
          />
        </v-col>
      </v-row>
    </div>

    <!-- Action Bar -->
    <div class="mileage-actions mb-6">
      <v-row align="center">
      <v-col cols="12" md="6">
              <v-text-field
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            placeholder="Search vehicles by license plate or driver..."
            variant="outlined"
            density="compact"
            hide-details
            class="mileage-search"
              ></v-text-field>
        </v-col>
        <v-col cols="12" md="6" class="text-md-right">
              <v-btn
                color="primary"
            prepend-icon="mdi-speedometer"
            class="mileage-btn"
            @click="showMileageEntryDialog = true"
          >
            Add Mileage Entry
              </v-btn>
        </v-col>
      </v-row>
    </div>

    <!-- Main Content -->
    <v-row>
      <!-- Vehicle Mileage Overview -->
      <v-col cols="12" lg="8">
        <v-card class="mileage-section-card">
          <v-card-title class="mileage-section-title">
            <v-icon class="me-2" color="primary">mdi-truck</v-icon>
            Vehicle Mileage Overview
          </v-card-title>
          <v-card-text>
            <div v-if="loading" class="text-center py-8">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
            <div v-else>
              <v-data-table
                :headers="mileageHeaders"
                :items="filteredVehicles"
                :search="searchQuery"
                class="mileage-table"
                density="comfortable"
              >
                <template v-slot:item.licensePlate="{ item }">
                  <div class="d-flex align-center">
                    <v-icon size="small" class="me-2">mdi-truck</v-icon>
                    <span class="font-weight-medium">{{ item.licensePlate }}</span>
                  </div>
                </template>
                <template v-slot:item.currentMileage="{ item }">
                  <span class="font-weight-medium">{{ item.currentMileage.toLocaleString() }} km</span>
                </template>
                <template v-slot:item.serviceStatus="{ item }">
                    <v-chip
                    :color="getServiceStatusColor(item)"
                      size="small"
                    >
                    {{ getServiceStatusText(item) }}
                    </v-chip>
                </template>
                <template v-slot:item.distanceToService="{ item }">
                  <span :class="getDistanceToServiceClass(item)">
                    {{ getDistanceToServiceText(item) }}
                  </span>
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-btn
                    icon="mdi-plus"
                    size="small"
                    variant="text"
                    color="primary"
                    @click="addMileageForVehicle(item)"
                  ></v-btn>
                  <v-btn
                    icon="mdi-eye"
                    size="small"
                    variant="text"
                    color="info"
                    @click="viewMileageHistory(item)"
                  ></v-btn>
                </template>
              </v-data-table>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Service Alerts & Quick Actions -->
      <v-col cols="12" lg="4">
        <!-- Service Due Alerts -->
        <v-card class="mileage-section-card mb-4">
          <v-card-title class="mileage-section-title">
            <v-icon class="me-2" color="warning">mdi-alert</v-icon>
            Service Due Alerts
          </v-card-title>
          <v-card-text>
            <div v-if="serviceDueVehicles.length === 0" class="text-center py-4 text-muted">
              All vehicles are up to date with service
            </div>
            <div v-else class="mileage-list">
              <div
                v-for="vehicle in serviceDueVehicles.slice(0, 5)"
                :key="vehicle.id"
                class="mileage-list-item pa-3 mb-2 rounded-lg"
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

        <!-- Quick Actions -->
        <v-card class="mileage-section-card">
          <v-card-title class="mileage-section-title">
            <v-icon class="me-2" color="success">mdi-lightning-bolt</v-icon>
            Quick Actions
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <v-btn
                  block
                  color="primary"
                  variant="outlined"
                  prepend-icon="mdi-speedometer"
                  class="mileage-btn mb-2"
                  @click="showMileageEntryDialog = true"
                >
                  Add Entry
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  block
                  color="success"
                  variant="outlined"
                  prepend-icon="mdi-file-chart"
                  class="mileage-btn mb-2"
                  @click="$router.push('/reports')"
                >
                  Reports
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  block
                  color="info"
                  variant="outlined"
                  prepend-icon="mdi-wrench"
                  class="mileage-btn mb-2"
                  @click="scheduleService"
                >
                  Schedule Service
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  block
                  color="warning"
                  variant="outlined"
                  prepend-icon="mdi-export"
                  class="mileage-btn mb-2"
                  @click="exportMileageData"
                >
                  Export Data
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add Mileage Entry Dialog -->
    <v-dialog v-model="showMileageEntryDialog" max-width="600px">
      <v-card class="dialog-card">
        <v-card-title class="dialog-title">
          <span class="title-icon-badge"><v-icon size="20" color="warning">mdi-speedometer</v-icon></span>
          Add Mileage Entry
        </v-card-title>
        <v-card-text>
          <v-form ref="mileageForm" v-model="mileageFormValid">
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="mileageEntryForm.vehicleId"
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
                  v-model="mileageEntryForm.odometerReading"
                  label="Odometer Reading (km)"
                  type="number"
                  variant="outlined"
                  :rules="[v => !!v || 'Odometer reading is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="mileageEntryForm.date"
                  label="Date"
                  type="date"
                  variant="outlined"
                  :rules="[v => !!v || 'Date is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="mileageEntryForm.driver"
                  label="Driver"
                  variant="outlined"
                  :rules="[v => !!v || 'Driver is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="mileageEntryForm.notes"
                  label="Notes"
                  variant="outlined"
                  rows="3"
                  placeholder="Optional notes about the trip or route..."
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="dialog-actions">
          <v-spacer></v-spacer>
          <v-btn variant="outlined" @click="showMileageEntryDialog = false">Cancel</v-btn>
          <v-btn color="warning" :loading="saving" :disabled="!mileageFormValid" @click="saveMileageEntry">Add Entry</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Composables
const { vehicles, loading, getVehicles, serviceDueVehicles, calculateServiceDue } = useVehicles()
const { mileageRecords, getMileageRecords } = useMileage()

// Reactive data
const searchQuery = ref('')
const showMileageEntryDialog = ref(false)
const saving = ref(false)
const mileageFormValid = ref(false)
const mileageEntryForm = ref({
  vehicleId: '',
  odometerReading: 0,
  date: new Date().toISOString().split('T')[0],
  driver: '',
  notes: ''
})

// Table headers
const mileageHeaders = [
  { title: 'Vehicle', key: 'licensePlate', sortable: true },
  { title: 'Current Mileage', key: 'currentMileage', sortable: true },
  { title: 'Last Service', key: 'lastServiceDate', sortable: true },
  { title: 'Service Status', key: 'serviceStatus', sortable: true },
  { title: 'Distance to Service', key: 'distanceToService', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
]

// Computed properties
const filteredVehicles = computed(() => {
  if (!searchQuery.value) return vehicles.value
  
  const query = searchQuery.value.toLowerCase()
  return vehicles.value.filter(vehicle => 
    vehicle.licensePlate.toLowerCase().includes(query) ||
    vehicle.assignedDriver.toLowerCase().includes(query) ||
    vehicle.brand.toLowerCase().includes(query) ||
    vehicle.model.toLowerCase().includes(query)
  )
})

const totalDistance = computed(() => {
  return vehicles.value.reduce((sum, vehicle) => sum + vehicle.currentMileage, 0)
})

const averageMonthlyDistance = computed(() => {
  if (vehicles.value.length === 0) return 0
  // This would typically be calculated from actual mileage records
  return totalDistance.value / vehicles.value.length / 12
})

// Methods
const getServiceStatusColor = (vehicle) => {
  const serviceInfo = calculateServiceDue(vehicle)
  if (serviceInfo.isOverdue) return 'error'
  if (serviceInfo.percentageUsed >= 80) return 'warning'
  return 'success'
}

const getServiceStatusText = (vehicle) => {
  const serviceInfo = calculateServiceDue(vehicle)
  if (serviceInfo.isOverdue) return 'Overdue'
  if (serviceInfo.percentageUsed >= 80) return 'Due Soon'
  return 'OK'
}

const getDistanceToServiceText = (vehicle) => {
  const serviceInfo = calculateServiceDue(vehicle)
  if (serviceInfo.isOverdue) {
    return `${serviceInfo.overdueBy.toLocaleString()} km overdue`
  }
  return `${serviceInfo.distanceToService.toLocaleString()} km remaining`
}

const getDistanceToServiceClass = (vehicle) => {
  const serviceInfo = calculateServiceDue(vehicle)
  if (serviceInfo.isOverdue) return 'text-error font-weight-medium'
  if (serviceInfo.percentageUsed >= 80) return 'text-warning font-weight-medium'
  return 'text-success font-weight-medium'
}

const addMileageForVehicle = (vehicle) => {
  mileageEntryForm.value.vehicleId = vehicle.id
  mileageEntryForm.value.driver = vehicle.assignedDriver
  showMileageEntryDialog.value = true
}

const viewMileageHistory = (vehicle) => {
  console.log('View mileage history for:', vehicle)
}

const scheduleService = () => {
  console.log('Schedule service')
}

const exportMileageData = () => {
  console.log('Export mileage data')
}

const saveMileageEntry = async () => {
  saving.value = true
  try {
    // TODO: Implement save logic
    console.log('Saving mileage entry:', mileageEntryForm.value)
    showMileageEntryDialog.value = false
    resetMileageForm()
  } catch (error) {
    console.error('Error saving mileage entry:', error)
  } finally {
    saving.value = false
  }
}

const resetMileageForm = () => {
  mileageEntryForm.value = {
    vehicleId: '',
    odometerReading: 0,
    date: new Date().toISOString().split('T')[0],
    driver: '',
    notes: ''
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    getVehicles(),
    getMileageRecords()
  ])
})
</script> 

<style scoped>
.mileage-root {
  padding-bottom: 32px;
}

.mileage-header {
  margin-bottom: 32px;
}

.mileage-title {
  letter-spacing: -0.5px;
  margin-top: 8px;
  font-size: 2rem;
  font-weight: 700;
  color: var(--v-theme-text-primary);
}

.mileage-subtitle {
  margin-bottom: 32px;
  color: var(--v-theme-text-secondary);
  font-size: 1.1rem;
}

.kpi-row {
  margin-bottom: 32px;
}

.mileage-actions {
  background: linear-gradient(135deg, #fffde7 0%, #f8fafb 100%);
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(16, 30, 54, 0.06);
}

.mileage-search {
  max-width: 400px;
}

.mileage-btn {
  font-weight: 600;
  border-radius: 10px;
  min-width: 140px;
}

.mileage-section-card {
  border-radius: 18px;
  background: linear-gradient(135deg, #fffde7 0%, #f8fafb 100%);
  box-shadow: 0 2px 12px rgba(16, 30, 54, 0.06);
  margin-bottom: 24px;
  transition: box-shadow 0.2s, transform 0.2s;
}

.mileage-section-card:hover {
  box-shadow: 0 6px 24px rgba(80, 80, 80, 0.10);
  transform: translateY(-1px);
}

.mileage-section-title {
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: #212121;
  padding-top: 18px;
  padding-bottom: 8px;
}

.mileage-table {
  border-radius: 12px;
  overflow: hidden;
}

.mileage-list {
  padding: 0 8px 8px 8px;
}

.mileage-list-item {
  background: linear-gradient(90deg, #e3f2fd 0%, #f8fafb 100%);
  box-shadow: 0 1px 4px rgba(33, 150, 243, 0.06);
  transition: box-shadow 0.2s, transform 0.2s, background 0.2s;
}

.mileage-list-item:hover {
  box-shadow: 0 4px 16px rgba(33, 150, 243, 0.10);
  background: linear-gradient(90deg, #bbdefb 0%, #f8fafb 100%);
  transform: translateY(-1px) scale(1.01);
}
</style> 