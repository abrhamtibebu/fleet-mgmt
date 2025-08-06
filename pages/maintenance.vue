<template>
  <div class="maintenance-root">
    <!-- Header Section -->
    <div class="maintenance-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="maintenance-title">Maintenance Management</h1>
          <p class="maintenance-subtitle">Comprehensive service scheduling, maintenance tracking, and vehicle upkeep management</p>
        </div>
        <!-- <div class="header-actions">
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            class="header-btn primary-btn"
            @click="showServiceDialog = true"
          >
            Schedule Service
          </v-btn>
          <v-btn
            color="success"
            prepend-icon="mdi-wrench"
            class="header-btn success-btn"
            @click="showMaintenanceDialog = true"
          >
            Add Record
          </v-btn>
        </div> -->
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-section">
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Service Due"
            :value="serviceDueVehicles.length.toString()"
            icon="mdi-wrench"
            color="warning"
            @click="filterByServiceDue"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="In Maintenance"
            :value="maintenanceVehicles.length.toString()"
            icon="mdi-tools"
            color="info"
            @click="filterByMaintenance"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Completed This Month"
            :value="completedServicesThisMonth.toString()"
            icon="mdi-check-circle"
            color="success"
            @click="filterByCompleted"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Total Cost"
            :value="`${totalMaintenanceCost.toLocaleString()}`"
            icon="mdi-currency-usd"
            color="error"
            @click="showCostBreakdown"
          />
        </v-col>
      </v-row>
    </div>

    <!-- Search and Filter Bar -->
    <div class="search-filter-section">
      <v-card class="search-card" elevation="0">
        <v-card-text class="pa-6">
          <v-row align="center" class="g-4">
            <v-col cols="12" md="4">
              <v-text-field
                v-model="searchQuery"
                prepend-inner-icon="mdi-magnify"
                placeholder="Search vehicles, service types..."
                variant="outlined"
                density="comfortable"
                hide-details
                class="search-field"
                @input="filterMaintenanceData"
                bg-color="surface"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="statusFilter"
                :items="statusOptions"
                label="Status Filter"
                variant="outlined"
                density="comfortable"
                hide-details
                @update:model-value="filterMaintenanceData"
                bg-color="surface"
              ></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="serviceTypeFilter"
                :items="serviceTypeOptions"
                label="Service Type"
                variant="outlined"
                density="comfortable"
                hide-details
                @update:model-value="filterMaintenanceData"
                bg-color="surface"
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

    <!-- Main Content Grid -->
    <div class="main-content">
      <v-row>
        <!-- Service Due Vehicles -->
        <v-col cols="12" lg="8">
          <v-card class="content-card" elevation="0">
            <v-card-title class="card-title">
              <div class="title-content">
                <v-icon class="title-icon" color="warning">mdi-alert</v-icon>
                <span class="title-text">Service Due Vehicles</span>
                <v-chip color="warning" size="small" class="ms-2" variant="flat">{{ serviceDueVehicles.length }}</v-chip>
              </div>
              <v-btn
                icon="mdi-refresh"
                variant="text"
                size="small"
                @click="refreshServiceDue"
                class="refresh-btn"
              ></v-btn>
            </v-card-title>
            <v-card-text>
              <div v-if="serviceDueVehicles.length === 0" class="empty-state">
                <v-icon size="64" color="success" class="mb-4">mdi-check-circle</v-icon>
                <h3 class="text-h6 text-muted mb-2">All vehicles are up to date</h3>
                <p class="text-muted">No vehicles require immediate service</p>
              </div>
              <div v-else>
                <v-data-table
                  :headers="serviceDueHeaders"
                  :items="serviceDueVehicles"
                  :loading="loading"
                  class="modern-table"
                  density="comfortable"
                >
                  <template v-slot:item.licensePlate="{ item }">
                    <div class="vehicle-info">
                      <v-icon size="small" class="me-2">mdi-truck</v-icon>
                                          
                        <span v-if="vehicleList.length">{{ vehicleList.find(vv => vv.id == item.vehicleId).plateNo }}</span>

                    </div>
                  </template>
                  <!-- <template v-slot:item.serviceStatus="{ item }">
                    <v-chip
                      :color="getServiceStatusColor(item)"
                      size="small"
                      variant="flat"
                    >
                      {{ getServiceStatusText(item) }}
                    </v-chip>
                  </template> -->
                  <template v-slot:item.distanceToService="{ item }">
                    <span :class="getDistanceToServiceClass(item)">
                      {{ getDistanceToServiceText(item) }}
                    </span>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <div class="action-buttons">
                      <v-btn
                        icon="mdi-wrench"
                        size="small"
                        variant="text"
                        color="warning"
                        @click="scheduleService(item)"
                        :title="'Schedule service for ' + item.licensePlate"
                      ></v-btn>
                      <v-btn
                        icon="mdi-eye"
                        size="small"
                        variant="text"
                        color="primary"
                        @click="viewVehicleDetails(item)"
                        :title="'View details for ' + item.licensePlate"
                      ></v-btn>
                      <v-btn
                        icon="mdi-history"
                        size="small"
                        variant="text"
                        color="info"
                        @click="viewMaintenanceHistory(item)"
                        :title="'View maintenance history for ' + item.licensePlate"
                      ></v-btn>
                    </div>
                  </template>
                </v-data-table>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Quick Actions & Stats -->
        <v-col cols="12" lg="12" md="12">
          <!-- Maintenance Statistics -->
          <v-card class="content-card" elevation="0">
            <v-card-title class="card-title">
              <v-icon class="title-icon" color="info">mdi-chart-pie</v-icon>
              <span class="title-text">Maintenance Statistics</span>
            </v-card-title>
            <v-card-text>
              <div class="stats-grid">
                <div class="stat-item" @click="filterByServiceDue">
                  <div class="stat-icon warning">
                    <v-icon color="warning">mdi-wrench</v-icon>
                  </div>
                  <div class="stat-content">
                    <div class="stat-value">{{ serviceDueVehicles.length }}</div>
                    <div class="stat-label">Service Due</div>
                  </div>
                </div>
                <div class="stat-item" @click="filterByMaintenance">
                  <div class="stat-icon info">
                    <v-icon color="info">mdi-tools</v-icon>
                  </div>
                  <div class="stat-content">
                    <div class="stat-value">{{ maintenanceVehicles.length }}</div>
                    <div class="stat-label">In Maintenance</div>
                  </div>
                </div>
                <div class="stat-item" @click="filterByCompleted">
                  <div class="stat-icon success">
                    <v-icon color="success">mdi-check-circle</v-icon>
                  </div>
                  <div class="stat-content">
                    <div class="stat-value">{{ completedServicesThisMonth }}</div>
                    <div class="stat-label">Completed This Month</div>
                  </div>
                </div>
                <div class="stat-item" @click="showCostBreakdown">
                  <div class="stat-icon error">
                    <v-icon color="error">mdi-currency-usd</v-icon>
                  </div>
                  <div class="stat-content">
                    <div class="stat-value">{{ totalMaintenanceCost.toLocaleString() }}</div>
                    <div class="stat-label">Total Cost (ETB)</div>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Quick Actions -->
  
        </v-col>
      </v-row>
    </div>

    <!-- Maintenance History -->
    <div class="history-section">
      <v-card class="content-card" elevation="0">
        <v-card-title class="card-title">
          <div class="title-content">
            <v-icon class="title-icon" color="primary">mdi-history</v-icon>
            <span class="title-text">Recent Maintenance History</span>
          </div>
          <div class="title-actions">
            <v-btn
              icon="mdi-refresh"
              variant="text"
              size="small"
              @click="refreshMaintenanceHistory"
            ></v-btn>
            <v-btn
              icon="mdi-filter"
              variant="text"
              size="small"
              @click="showHistoryFilters = !showHistoryFilters"
            ></v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="maintenanceHistoryHeaders"
            :items="filteredMaintenanceHistory"
            :loading="historyLoading"
            class="modern-table"
            density="comfortable"
          >
            <template v-slot:item.vehicleId="{ item }">
              <div class="vehicle-info">
                <v-icon size="small" class="me-2">mdi-truck</v-icon>
                <span v-if="vehicleList.length" class="font-weight-medium">{{ vehicleList.find(vv => vv.id == item.vehicleId).plateNo }}</span>
              </div>
            </template>
            <template v-slot:item.createdAt="{ item }">
              {{ moment(item.createdAt).format('lll')}}
            </template>

            <template v-slot:item.createdBy="{ item }">
              <span v-if="usersList.length">
              {{ usersList.find(uu => uu.id == item.createdBy)?.name || 'Unknown'}}
              </span>
            </template>
            
            <template v-slot:item.serviceType="{ item }">
              <v-chip
                :color="getServiceTypeColor(item.serviceType)"
                size="small"
                variant="flat"
              >
                {{ serviceTypes.find(xx => xx.id == item.serviceType)?.name || 'Unknown' }}
              </v-chip>
            </template>
            <template v-slot:item.cost="{ item }">
              <span class="font-weight-medium">{{ item.totalCost.toLocaleString() }} ETB</span>
            </template>
            <template v-slot:item.status="{ item }">
              <!-- <StatusBadge :status="item.status" /> -->
            </template>
            <template v-slot:item.actions="{ item }">
              <div class="action-buttons">
                <v-btn
                  icon="mdi-eye"
                  size="small"
                  variant="text"
                  color="primary"
                  @click="viewMaintenanceDetails(item)"
                  :title="'View details for ' + item.serviceType"
                ></v-btn>
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  color="warning"
                  @click="editMaintenanceRecord(item)"
                  :title="'Edit ' + item.serviceType"
                ></v-btn>
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="error"
                  @click="deleteMaintenanceRecord(item)"
                  :title="'Delete ' + item.serviceType"
                ></v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </div>

    <!-- Service Scheduling Dialog -->
    <v-dialog v-model="showServiceDialog" max-width="600px" persistent>
      <v-card class="dialog-card" elevation="0">
        <v-card-title class="dialog-title">
          <v-icon class="me-2" color="primary">mdi-wrench</v-icon>
          Schedule Service
        </v-card-title>
        <v-card-text>
          <v-form ref="serviceFormRef" v-model="serviceFormValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="serviceForm.vehicleId"
                  :items="vehicles"
                  item-title="licensePlate"
                  item-value="id"
                  label="Select Vehicle"
                  variant="outlined"
                  :rules="[v => !!v || 'Vehicle is required']"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="serviceForm.serviceType"
                  :items="serviceTypes"
                  label="Service Type"
                  variant="outlined"
                  :rules="[v => !!v || 'Service type is required']"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="serviceForm.scheduledDate"
                  label="Scheduled Date"
                  type="date"
                  variant="outlined"
                  :rules="[v => !!v || 'Date is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="serviceForm.estimatedCost"
                  label="Estimated Cost (ETB)"
                  type="number"
                  variant="outlined"
                  :rules="[v => !!v || 'Cost is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="serviceForm.notes"
                  label="Service Notes"
                  variant="outlined"
                  rows="3"
                  placeholder="Describe the service requirements..."
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="dialog-actions">
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            @click="showServiceDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            :loading="savingService"
            :disabled="!serviceFormValid"
            @click="saveServiceSchedule"
          >
            Schedule Service
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Maintenance Record Dialog -->
    <v-dialog v-model="showMaintenanceDialog" max-width="700px" persistent>
      <v-card class="dialog-card">
        <v-card-title class="dialog-title">
          <v-icon class="me-2" color="success">mdi-wrench</v-icon>
          Add Maintenance Record
        </v-card-title>
        <v-card-text>
          <v-form ref="maintenanceFormRef" v-model="maintenanceFormValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="maintenanceForm.vehicleId"
                  :items="vehicles"
                  item-title="licensePlate"
                  item-value="id"
                  label="Vehicle"
                  variant="outlined"
                  :rules="[v => !!v || 'Vehicle is required']"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="maintenanceForm.serviceType"
                  :items="serviceTypes"
                  label="Service Type"
                  variant="outlined"
                  :rules="[v => !!v || 'Service type is required']"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="maintenanceForm.date"
                  label="Service Date"
                  type="date"
                  variant="outlined"
                  :rules="[v => !!v || 'Date is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="maintenanceForm.cost"
                  label="Actual Cost (ETB)"
                  type="number"
                  variant="outlined"
                  :rules="[v => !!v || 'Cost is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="maintenanceForm.status"
                  :items="statusOptions"
                  label="Status"
                  variant="outlined"
                  :rules="[v => !!v || 'Status is required']"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="maintenanceForm.mechanic"
                  label="Mechanic/Service Provider"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="maintenanceForm.notes"
                  label="Service Details & Notes"
                  variant="outlined"
                  rows="4"
                  placeholder="Describe the work performed, parts replaced, and any recommendations..."
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="dialog-actions">
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            @click="showMaintenanceDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="success"
            :loading="savingMaintenance"
            :disabled="!maintenanceFormValid"
            @click="saveMaintenanceRecord"
          >
            Save Record
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import moment from 'moment'
// Composables
const { vehicleList, getVehicles, serviceDueVehicles, maintenanceVehicles, calculateServiceDue } = useVehicles()
const {getMaintenanceList, maintenanceList} = useMaintenance()
const {getUsers, usersList} = useCard()

// Reactive data
const searchQuery = ref('')
const statusFilter = ref('all')
const serviceTypeFilter = ref('all')
const showAdvancedFilters = ref(false)
const showHistoryFilters = ref(false)
const loading = ref(false)
const historyLoading = ref(false)
const savingService = ref(false)
const savingMaintenance = ref(false)

// Dialog states
const showServiceDialog = ref(false)
const showMaintenanceDialog = ref(false)
const showSuccessSnackbar = ref(false)
const showErrorSnackbar = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Form refs and validation
const serviceFormRef = ref(null)
const maintenanceFormRef = ref(null)
const serviceFormValid = ref(false)
const maintenanceFormValid = ref(false)

// Form data
const serviceForm = ref({
  vehicleId: '',
  serviceType: '',
  scheduledDate: '',
  estimatedCost: '',
  notes: ''
})

const maintenanceForm = ref({
  vehicleId: '',
  serviceType: '',
  date: '',
  cost: '',
  status: 'completed',
  mechanic: '',
  notes: ''
})

// Options
const statusOptions = [
  { title: 'All Status', value: 'all' },
  { title: 'Scheduled', value: 'scheduled' },
  { title: 'In Progress', value: 'in_progress' },
  { title: 'Completed', value: 'completed' },
  { title: 'Cancelled', value: 'cancelled' }
]

const serviceTypeOptions = [
  { title: 'All Types', value: 'all' },
  { title: 'Regular Service', value: 'Regular Service' },
  { title: 'Brake Service', value: 'Brake Service' },
  { title: 'Tire Rotation', value: 'Tire Rotation' },
  { title: 'Engine Repair', value: 'Engine Repair' },
  { title: 'Electrical', value: 'Electrical' },
  { title: 'Oil Change', value: 'Oil Change' }
]

const serviceTypes = [
  { id: 1, name: "Regular Service" },
  { id: 2, name: "Brake Service" },
  { id: 3, name: "Tire Rotation" },
  { id: 4, name: "Engine Repair" },
  { id: 5, name: "Electrical" },
  { id: 6, name: "Oil Change" },
  { id: 7, name: "Transmission Service" },
  { id: 8, name: "Suspension Service" },
  { id: 9, name: "Air Conditioning" },
  { id: 10, name: "Battery Replacement" }
]

// Table headers
const serviceDueHeaders = [
  { title: 'Vehicle', key: 'licensePlate', sortable: true },
  { title: 'Model', key: 'model', sortable: true },
  { title: 'Last Service', key: 'lastServiceDate', sortable: true },
  { title: 'Service Status', key: 'serviceStatus', sortable: true },
  { title: 'Distance to Service', key: 'distanceToService', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
]

const maintenanceHistoryHeaders = [
  { title: 'Vehicle', key: 'vehicleId', sortable: true },
  { title: 'Service Type', key: 'serviceType', sortable: true },
  { title: 'Date', key: 'createdAt', sortable: true },
  { title: 'Cost', key: 'cost', sortable: true },
  { title: 'Recorded By', key: 'createdBy', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
]

// Mock maintenance history data
const maintenanceHistory = ref([
  {
    id: 'MH-001',
    vehicleId: 'FL-001-ABC',
    licensePlate: 'ABC-123-ET',
    serviceType: 'Regular Service',
    date: '2024-06-01',
    cost: 15000,
    status: 'completed',
    notes: 'Oil change, filter replacement',
    mechanic: 'AutoCare Center'
  },
  {
    id: 'MH-002',
    vehicleId: 'FL-002-DEF',
    licensePlate: 'DEF-456-ET',
    serviceType: 'Brake Service',
    date: '2024-05-28',
    cost: 25000,
    status: 'completed',
    notes: 'Brake pad replacement',
    mechanic: 'QuickFix Garage'
  },
  {
    id: 'MH-003',
    vehicleId: 'FL-003-GHI',
    licensePlate: 'GHI-789-ET',
    serviceType: 'Tire Rotation',
    date: '2024-05-25',
    cost: 8000,
    status: 'completed',
    notes: 'Tire rotation and alignment',
    mechanic: 'TirePro Services'
  }
])

// Computed properties
const filteredMaintenanceHistory = computed(() => {
  let filtered = maintenanceList.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(record => 
      record.licensePlate.toLowerCase().includes(query) ||
      record.serviceType.toLowerCase().includes(query) ||
      record.notes.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(record => record.status === statusFilter.value)
  }

  if (serviceTypeFilter.value !== 'all') {
    filtered = filtered.filter(record => record.serviceType === serviceTypeFilter.value)
  }

  return filtered
})

const completedServicesThisMonth = computed(() => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  return maintenanceHistory.value.filter(record => {
    const recordDate = new Date(record.date)
    return recordDate.getMonth() === currentMonth && 
           recordDate.getFullYear() === currentYear &&
           record.status === 'completed'
  }).length
})

const totalMaintenanceCost = computed(() => {
  return maintenanceList.value.reduce((sum, record) => sum + record.totalCost, 0)
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

const getServiceTypeColor = (serviceType) => {
  const colors = {
    1: 'primary',
    2: 'error',
    3: 'warning',
    4: 'error',
    5: 'info',
    6: 'success'
  }
  return colors[serviceType] || 'grey'
}

// Action methods
const scheduleService = (vehicle) => {
  serviceForm.value.vehicleId = vehicle.id
  showServiceDialog.value = true
}

const viewVehicleDetails = (vehicle) => {
  // Navigate to vehicle details page
  navigateTo(`/vehicles/${vehicle.id}`)
}

const viewMaintenanceHistory = (vehicle) => {
  // Filter history for this vehicle
  const vehicleHistory = maintenanceHistory.value.filter(record => record.vehicleId === vehicle.id)
  console.log('Maintenance history for', vehicle.licensePlate, vehicleHistory)
  // Could open a dialog or navigate to a dedicated history page
}

const viewMaintenanceDetails = (record) => {
  console.log('View maintenance details:', record)
  // Open details dialog
}

const editMaintenanceRecord = (record) => {
  maintenanceForm.value = { ...record }
  showMaintenanceDialog.value = true
}

const deleteMaintenanceRecord = async (record) => {
  if (confirm(`Are you sure you want to delete this ${record.serviceType} record?`)) {
    try {
      const index = maintenanceHistory.value.findIndex(r => r.id === record.id)
      if (index > -1) {
        maintenanceHistory.value.splice(index, 1)
        showSuccessMessage('Maintenance record deleted successfully')
      }
    } catch (error) {
      showErrorMessage('Failed to delete maintenance record')
    }
  }
}

const saveServiceSchedule = async () => {
  savingService.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newService = {
      id: `SERVICE-${Date.now()}`,
      vehicleId: serviceForm.value.vehicleId,
      serviceType: serviceForm.value.serviceType,
      scheduledDate: serviceForm.value.scheduledDate,
      estimatedCost: parseFloat(serviceForm.value.estimatedCost),
      notes: serviceForm.value.notes,
      status: 'scheduled'
    }
    
    // Add to maintenance history
    maintenanceHistory.value.unshift(newService)
    
    showServiceDialog.value = false
    resetServiceForm()
    showSuccessMessage('Service scheduled successfully')
  } catch (error) {
    showErrorMessage('Failed to schedule service')
  } finally {
    savingService.value = false
  }
}

const saveMaintenanceRecord = async () => {
  savingMaintenance.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newRecord = {
      id: `MH-${Date.now()}`,
      vehicleId: maintenanceForm.value.vehicleId,
      licensePlate: vehicles.value.find(v => v.id === maintenanceForm.value.vehicleId)?.licensePlate || '',
      serviceType: maintenanceForm.value.serviceType,
      date: maintenanceForm.value.date,
      cost: parseFloat(maintenanceForm.value.cost),
      status: maintenanceForm.value.status,
      notes: maintenanceForm.value.notes,
      mechanic: maintenanceForm.value.mechanic
    }
    
    // Add to maintenance history
    maintenanceHistory.value.unshift(newRecord)
    
    showMaintenanceDialog.value = false
    resetMaintenanceForm()
    showSuccessMessage('Maintenance record saved successfully')
  } catch (error) {
    showErrorMessage('Failed to save maintenance record')
  } finally {
    savingMaintenance.value = false
  }
}

const resetServiceForm = () => {
  serviceForm.value = {
    vehicleId: '',
    serviceType: '',
    scheduledDate: '',
    estimatedCost: '',
    notes: ''
  }
}

const resetMaintenanceForm = () => {
  maintenanceForm.value = {
    vehicleId: '',
    serviceType: '',
    date: '',
    cost: '',
    status: 'completed',
    mechanic: '',
    notes: ''
  }
}

const filterMaintenanceData = () => {
  // Filter logic is handled by computed properties
  console.log('Filtering maintenance data...')
}

const refreshServiceDue = async () => {
  loading.value = true
  try {
    await getVehicles()
    showSuccessMessage('Service due data refreshed')
  } catch (error) {
    showErrorMessage('Failed to refresh service due data')
  } finally {
    loading.value = false
  }
}

const refreshMaintenanceHistory = async () => {
  historyLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    showSuccessMessage('Maintenance history refreshed')
  } catch (error) {
    showErrorMessage('Failed to refresh maintenance history')
  } finally {
    historyLoading.value = false
  }
}

const generateMaintenanceReport = () => {
  console.log('Generating maintenance report...')
  showSuccessMessage('Maintenance report generated successfully')
}

const exportMaintenanceData = () => {
  console.log('Exporting maintenance data...')
  showSuccessMessage('Maintenance data exported successfully')
}

const showCostBreakdown = () => {
  console.log('Showing cost breakdown...')
  // Could open a dialog with detailed cost analysis
}

const showUrgentAlerts = () => {
  console.log('Showing urgent alerts...')
  // Could open a dialog with urgent maintenance alerts
}

const showMaintenanceSettings = () => {
  console.log('Showing maintenance settings...')
  // Could open a settings dialog
}

const filterByServiceDue = () => {
  statusFilter.value = 'scheduled'
  showSuccessMessage('Filtered by service due vehicles')
}

const filterByMaintenance = () => {
  statusFilter.value = 'in_progress'
  showSuccessMessage('Filtered by vehicles in maintenance')
}

const filterByCompleted = () => {
  statusFilter.value = 'completed'
  showSuccessMessage('Filtered by completed services')
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
  await getMaintenanceList()
  await getVehicles()
  await getUsers()


})
</script>

<style scoped>
.maintenance-root {
  padding: 32px;
  min-height: 100vh;
  background: #fafafa;
}

.maintenance-header {
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

.maintenance-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.maintenance-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.header-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.header-btn {
  font-weight: 600;
  border-radius: 12px;
  text-transform: none;
  padding: 12px 24px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.header-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.primary-btn {
  background: #1976d2;
  color: white;
}

.success-btn {
  background: #2e7d32;
  color: white;
}

.kpi-section {
  margin-bottom: 32px;
}

.search-filter-section {
  margin-bottom: 32px;
}

.search-card {
  border-radius: 16px;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e0e0e0;
}

.search-field {
  border-radius: 8px;
}

.filter-btn {
  border-radius: 8px;
  font-weight: 500;
}

.main-content {
  margin-bottom: 32px;
}

.content-card {
  border-radius: 16px;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  overflow: hidden;
}

.content-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  border-color: #d0d0d0;
}

.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid #e0e0e0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  background: #fafafa;
}

.title-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-text {
  font-weight: 600;
  color: #1a1a1a;
}

.title-icon {
  font-size: 1.5rem;
}

.refresh-btn {
  color: #666;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  color: #1976d2;
  transform: rotate(180deg);
}

.title-actions {
  display: flex;
  gap: 8px;
}

.modern-table {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.vehicle-info {
  display: flex;
  align-items: center;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: #040707;
  opacity: 0.7;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  background: white;
  border-color: #d0d0d0;
}

.stat-icon {
  margin-right: 12px;
  padding: 8px;
  border-radius: 8px;
}

.stat-icon.warning {
  background: rgba(243, 215, 14, 0.2);
}

.stat-icon.info {
  background: rgba(245, 227, 94, 0.2);
}

.stat-icon.success {
  background: rgba(251, 179, 57, 0.2);
}

.stat-icon.error {
  background: rgba(4, 7, 7, 0.1);
}

.stat-content {
  flex-grow: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #666;
  margin-top: 4px;
  font-weight: 500;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.action-btn {
  font-weight: 600;
  border-radius: 12px;
  text-transform: none;
  padding: 12px 16px;
  transition: all 0.3s ease;
  border-width: 2px;
  border-color: #e0e0e0;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #d0d0d0;
}

.dialog-card {
  border-radius: 16px;
  overflow: hidden;
}

.dialog-title {
  background: #1976d2;
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  padding: 24px;
}

.dialog-actions {
  padding: 24px;
  background: #fafafa;
}

/* Responsive Design */
@media (max-width: 768px) {
  .maintenance-root {
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
  
  .maintenance-title {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .card-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style> 