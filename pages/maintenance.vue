<template>
  <div class="maintenance-root">
    <div class="maintenance-header">
      <h1 class="maintenance-title">Maintenance Management</h1>
      <p class="maintenance-subtitle">Service scheduling, maintenance history, and vehicle upkeep tracking</p>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-row">
      <v-row>
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
            title="In Maintenance"
            :value="maintenanceVehicles.length.toString()"
            icon="mdi-tools"
            color="info"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Completed This Month"
            :value="completedServicesThisMonth.toString()"
            icon="mdi-check-circle"
            color="success"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Total Cost"
            :value="`${totalMaintenanceCost.toLocaleString()} ETB`"
            icon="mdi-currency-usd"
            color="error"
          />
        </v-col>
      </v-row>
    </div>

    <!-- Action Bar -->
    <div class="maintenance-actions mb-6">
      <v-row align="center">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            placeholder="Search vehicles by license plate or service type..."
            variant="outlined"
            density="compact"
            hide-details
            class="maintenance-search"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6" class="text-md-right">
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            class="maintenance-btn me-2"
            @click="showServiceDialog = true"
          >
            Schedule Service
          </v-btn>
          <v-btn
            color="success"
            prepend-icon="mdi-wrench"
            class="maintenance-btn"
            @click="showMaintenanceDialog = true"
          >
            Add Maintenance Record
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <!-- Main Content -->
    <v-row>
      <!-- Service Due Vehicles -->
      <v-col cols="12" lg="8">
        <v-card class="maintenance-section-card">
          <v-card-title class="maintenance-section-title">
            <v-icon class="me-2" color="warning">mdi-alert</v-icon>
            Service Due Vehicles
          </v-card-title>
          <v-card-text>
            <div v-if="serviceDueVehicles.length === 0" class="text-center py-8">
              <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-check-circle</v-icon>
              <h3 class="text-h6 text-muted mb-2">All vehicles are up to date</h3>
              <p class="text-muted">No vehicles require immediate service</p>
            </div>
            <div v-else>
              <v-data-table
                :headers="serviceDueHeaders"
                :items="serviceDueVehicles"
                class="maintenance-table"
                density="comfortable"
              >
                <template v-slot:item.licensePlate="{ item }">
                  <div class="d-flex align-center">
                    <v-icon size="small" class="me-2">mdi-truck</v-icon>
                    <span class="font-weight-medium">{{ item.licensePlate }}</span>
                  </div>
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
                    icon="mdi-wrench"
                    size="small"
                    variant="text"
                    color="warning"
                    @click="scheduleService(item)"
                  ></v-btn>
                  <v-btn
                    icon="mdi-eye"
                    size="small"
                    variant="text"
                    color="primary"
                    @click="viewVehicleDetails(item)"
                  ></v-btn>
                </template>
              </v-data-table>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Maintenance Statistics -->
      <v-col cols="12" lg="4">
        <v-card class="maintenance-section-card">
          <v-card-title class="maintenance-section-title">
            <v-icon class="me-2" color="info">mdi-chart-pie</v-icon>
            Maintenance Statistics
          </v-card-title>
          <v-card-text>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-icon">
                  <v-icon color="warning">mdi-wrench</v-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ serviceDueVehicles.length }}</div>
                  <div class="stat-label">Service Due</div>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">
                  <v-icon color="info">mdi-tools</v-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ maintenanceVehicles.length }}</div>
                  <div class="stat-label">In Maintenance</div>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">
                  <v-icon color="success">mdi-check-circle</v-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ completedServicesThisMonth }}</div>
                  <div class="stat-label">Completed This Month</div>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">
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
        <v-card class="maintenance-section-card mt-4">
          <v-card-title class="maintenance-section-title">
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
                  prepend-icon="mdi-plus"
                  class="maintenance-btn mb-2"
                  @click="showServiceDialog = true"
                >
                  Schedule Service
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  block
                  color="success"
                  variant="outlined"
                  prepend-icon="mdi-wrench"
                  class="maintenance-btn mb-2"
                  @click="showMaintenanceDialog = true"
                >
                  Add Record
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  block
                  color="info"
                  variant="outlined"
                  prepend-icon="mdi-file-chart"
                  class="maintenance-btn mb-2"
                  @click="generateMaintenanceReport"
                >
                  Generate Report
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  block
                  color="warning"
                  variant="outlined"
                  prepend-icon="mdi-export"
                  class="maintenance-btn mb-2"
                  @click="exportMaintenanceData"
                >
                  Export Data
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Maintenance History -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card class="maintenance-section-card">
          <v-card-title class="maintenance-section-title">
            <v-icon class="me-2" color="primary">mdi-history</v-icon>
            Recent Maintenance History
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="maintenanceHistoryHeaders"
              :items="maintenanceHistory"
              class="maintenance-table"
              density="comfortable"
            >
              <template v-slot:item.vehicleId="{ item }">
                <div class="d-flex align-center">
                  <v-icon size="small" class="me-2">mdi-truck</v-icon>
                  <span class="font-weight-medium">{{ item.licensePlate }}</span>
                </div>
              </template>
              <template v-slot:item.serviceType="{ item }">
                <v-chip
                  :color="getServiceTypeColor(item.serviceType)"
                  size="small"
                >
                  {{ item.serviceType }}
                </v-chip>
              </template>
              <template v-slot:item.cost="{ item }">
                <span class="font-weight-medium">{{ item.cost.toLocaleString() }} ETB</span>
              </template>
              <template v-slot:item.status="{ item }">
                <StatusBadge :status="item.status" />
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Composables
const { vehicles, getVehicles, serviceDueVehicles, maintenanceVehicles, calculateServiceDue } = useVehicles()

// Reactive data
const searchQuery = ref('')
const showServiceDialog = ref(false)
const showMaintenanceDialog = ref(false)

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
  { title: 'Date', key: 'date', sortable: true },
  { title: 'Cost', key: 'cost', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Notes', key: 'notes', sortable: true }
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
    notes: 'Oil change, filter replacement'
  },
  {
    id: 'MH-002',
    vehicleId: 'FL-002-DEF',
    licensePlate: 'DEF-456-ET',
    serviceType: 'Brake Service',
    date: '2024-05-28',
    cost: 25000,
    status: 'completed',
    notes: 'Brake pad replacement'
  },
  {
    id: 'MH-003',
    vehicleId: 'FL-003-GHI',
    licensePlate: 'GHI-789-ET',
    serviceType: 'Tire Rotation',
    date: '2024-05-25',
    cost: 8000,
    status: 'completed',
    notes: 'Tire rotation and alignment'
  }
])

// Computed properties
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
  return maintenanceHistory.value.reduce((sum, record) => sum + record.cost, 0)
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
    'Regular Service': 'primary',
    'Brake Service': 'error',
    'Tire Rotation': 'warning',
    'Engine Repair': 'error',
    'Electrical': 'info'
  }
  return colors[serviceType] || 'grey'
}

const scheduleService = (vehicle) => {
  console.log('Schedule service for:', vehicle)
}

const viewVehicleDetails = (vehicle) => {
  console.log('View vehicle details:', vehicle)
}

const generateMaintenanceReport = () => {
  console.log('Generate maintenance report')
}

const exportMaintenanceData = () => {
  console.log('Export maintenance data')
}

// Lifecycle
onMounted(async () => {
  await getVehicles()
})
</script>

<style scoped>
.maintenance-root {
  padding-bottom: 32px;
}

.maintenance-header {
  margin-bottom: 32px;
}

.maintenance-title {
  letter-spacing: -0.5px;
  margin-top: 8px;
  font-size: 2rem;
  font-weight: 700;
  color: var(--v-theme-text-primary);
}

.maintenance-subtitle {
  margin-bottom: 32px;
  color: var(--v-theme-text-secondary);
  font-size: 1.1rem;
}

.kpi-row {
  margin-bottom: 32px;
}

.maintenance-actions {
  background: linear-gradient(135deg, #fffde7 0%, #f8fafb 100%);
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(16, 30, 54, 0.06);
}

.maintenance-search {
  max-width: 400px;
}

.maintenance-btn {
  font-weight: 600;
  border-radius: 10px;
  min-width: 140px;
}

.maintenance-section-card {
  border-radius: 18px;
  background: linear-gradient(135deg, #fffde7 0%, #f8fafb 100%);
  box-shadow: 0 2px 12px rgba(16, 30, 54, 0.06);
  margin-bottom: 24px;
  transition: box-shadow 0.2s, transform 0.2s;
}

.maintenance-section-card:hover {
  box-shadow: 0 6px 24px rgba(80, 80, 80, 0.10);
  transform: translateY(-1px);
}

.maintenance-section-title {
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: #212121;
  padding-top: 18px;
  padding-bottom: 8px;
}

.maintenance-table {
  border-radius: 12px;
  overflow: hidden;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
}

.stat-icon {
  margin-right: 12px;
}

.stat-content {
  flex-grow: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--v-theme-text-primary);
}

.stat-label {
  font-size: 0.9rem;
  color: var(--v-theme-text-secondary);
}
</style> 