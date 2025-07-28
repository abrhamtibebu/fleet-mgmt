<template>
  <div class="tracking-root">
    <div class="tracking-header">
      <h1 class="tracking-title">Fleet Tracking</h1>
      <p class="tracking-subtitle">Real-time vehicle tracking, location monitoring, and route optimization</p>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-row">
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Active Vehicles"
            :value="activeVehicles.length.toString()"
            icon="mdi-map-marker"
            color="success"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="In Transit"
            :value="inTransitVehicles.length.toString()"
            icon="mdi-truck-delivery"
            color="primary"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Total Distance"
            :value="`${totalDistance.toLocaleString()} km`"
            icon="mdi-map-marker-distance"
            color="info"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Avg Speed"
            :value="`${averageSpeed.toFixed(0)} km/h`"
            icon="mdi-speedometer"
            color="warning"
          />
        </v-col>
      </v-row>
    </div>

    <!-- Main Tracking Interface -->
    <v-row>
      <!-- Map/Vehicle List -->
      <v-col cols="12" lg="8">
        <v-card class="tracking-section-card">
          <v-card-title class="tracking-section-title">
            <v-icon class="me-2" color="primary">mdi-map</v-icon>
            Fleet Map View
          </v-card-title>
          <v-card-text>
            <div class="map-container">
              <div class="map-placeholder">
                <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-map</v-icon>
                <h3 class="text-h6 text-muted mb-2">Interactive Fleet Map</h3>
                <p class="text-muted">Real-time vehicle locations and routes will be displayed here</p>
                <v-btn
                  color="primary"
                  variant="outlined"
                  class="mt-4"
                  @click="initializeMap"
                >
                  Initialize Map
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Vehicle Status Panel -->
      <v-col cols="12" lg="4">
        <v-card class="tracking-section-card">
          <v-card-title class="tracking-section-title">
            <v-icon class="me-2" color="success">mdi-truck</v-icon>
            Vehicle Status
          </v-card-title>
          <v-card-text>
            <div class="vehicle-status-list">
              <div
                v-for="vehicle in vehicles"
                :key="vehicle.id"
                class="vehicle-status-item"
                :class="{ 'active': vehicle.status === 'active' }"
              >
                <div class="vehicle-status-header">
                  <div class="d-flex align-center">
                    <v-icon
                      :color="getStatusColor(vehicle.status)"
                      size="small"
                      class="me-2"
                    >
                      {{ getStatusIcon(vehicle.status) }}
                    </v-icon>
                    <div class="vehicle-info">
                      <div class="vehicle-license">{{ vehicle.licensePlate }}</div>
                      <div class="vehicle-model">{{ vehicle.brand }} {{ vehicle.model }}</div>
                    </div>
                  </div>
                  <v-chip
                    :color="getStatusColor(vehicle.status)"
                    size="small"
                  >
                    {{ vehicle.status }}
                  </v-chip>
                </div>
                
                <div class="vehicle-status-details">
                  <div class="status-detail">
                    <v-icon size="small" class="me-1">mdi-map-marker</v-icon>
                    <span>{{ vehicle.location }}</span>
                  </div>
                  <div class="status-detail">
                    <v-icon size="small" class="me-1">mdi-account</v-icon>
                    <span>{{ vehicle.assignedDriver }}</span>
                  </div>
                  <div class="status-detail">
                    <v-icon size="small" class="me-1">mdi-speedometer</v-icon>
                    <span>{{ vehicle.currentMileage.toLocaleString() }} km</span>
                  </div>
                </div>

                <div class="vehicle-status-actions">
                  <v-btn
                    icon="mdi-eye"
                    size="small"
                    variant="text"
                    color="primary"
                    @click="trackVehicle(vehicle)"
                  ></v-btn>
                  <v-btn
                    icon="mdi-phone"
                    size="small"
                    variant="text"
                    color="success"
                    @click="contactDriver(vehicle)"
                  ></v-btn>
                  <v-btn
                    icon="mdi-message"
                    size="small"
                    variant="text"
                    color="info"
                    @click="sendMessage(vehicle)"
                  ></v-btn>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Route Optimization -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card class="tracking-section-card">
          <v-card-title class="tracking-section-title">
            <v-icon class="me-2" color="warning">mdi-route</v-icon>
            Route Optimization
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <div class="route-optimization">
                  <h4 class="text-h6 mb-3">Optimize Routes</h4>
                  <v-select
                    v-model="selectedVehicles"
                    :items="vehicles"
                    item-title="licensePlate"
                    item-value="id"
                    label="Select Vehicles"
                    multiple
                    variant="outlined"
                    class="mb-3"
                  ></v-select>
                  <v-text-field
                    v-model="destination"
                    label="Destination"
                    variant="outlined"
                    class="mb-3"
                  ></v-text-field>
                  <v-btn
                    color="primary"
                    block
                    @click="optimizeRoutes"
                  >
                    Optimize Routes
                  </v-btn>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="route-stats">
                  <h4 class="text-h6 mb-3">Route Statistics</h4>
                  <div class="stat-item">
                    <span class="stat-label">Total Distance:</span>
                    <span class="stat-value">{{ optimizedDistance }} km</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Estimated Time:</span>
                    <span class="stat-value">{{ estimatedTime }} hours</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Fuel Cost:</span>
                    <span class="stat-value">{{ fuelCost.toLocaleString() }} ETB</span>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Composables
const { vehicles, getVehicles, activeVehicles } = useVehicles()

// Reactive data
const selectedVehicles = ref([])
const destination = ref('')
const optimizedDistance = ref(1250)
const estimatedTime = ref(8.5)
const fuelCost = ref(12500)

// Computed properties
const inTransitVehicles = computed(() => 
  vehicles.value.filter(v => v.status === 'active' && v.location !== 'Addis Ababa')
)

const totalDistance = computed(() => 
  vehicles.value.reduce((sum, v) => sum + v.currentMileage, 0)
)

const averageSpeed = computed(() => {
  // Placeholder calculation
  return 45
})

// Methods
const getStatusColor = (status) => {
  const colors = {
    active: 'success',
    maintenance: 'warning',
    inactive: 'error'
  }
  return colors[status] || 'grey'
}

const getStatusIcon = (status) => {
  const icons = {
    active: 'mdi-check-circle',
    maintenance: 'mdi-wrench',
    inactive: 'mdi-close-circle'
  }
  return icons[status] || 'mdi-help-circle'
}

const initializeMap = () => {
  console.log('Initializing map')
}

const trackVehicle = (vehicle) => {
  console.log('Track vehicle:', vehicle)
}

const contactDriver = (vehicle) => {
  console.log('Contact driver:', vehicle)
}

const sendMessage = (vehicle) => {
  console.log('Send message to:', vehicle)
}

const optimizeRoutes = () => {
  console.log('Optimizing routes for:', selectedVehicles.value)
}

// Lifecycle
onMounted(async () => {
  await getVehicles()
})
</script>

<style scoped>
.tracking-root {
  padding-bottom: 32px;
}

.tracking-header {
  margin-bottom: 32px;
}

.tracking-title {
  letter-spacing: -0.5px;
  margin-top: 8px;
  font-size: 2rem;
  font-weight: 700;
  color: var(--v-theme-text-primary);
}

.tracking-subtitle {
  margin-bottom: 32px;
  color: var(--v-theme-text-secondary);
  font-size: 1.1rem;
}

.kpi-row {
  margin-bottom: 32px;
}

.tracking-section-card {
  border-radius: 18px;
  background: linear-gradient(135deg, #fffde7 0%, #f8fafb 100%);
  box-shadow: 0 2px 12px rgba(16, 30, 54, 0.06);
  margin-bottom: 24px;
  transition: box-shadow 0.2s, transform 0.2s;
}

.tracking-section-card:hover {
  box-shadow: 0 6px 24px rgba(80, 80, 80, 0.10);
  transform: translateY(-1px);
}

.tracking-section-title {
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: #212121;
  padding-top: 18px;
  padding-bottom: 8px;
}

.map-container {
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
}

.map-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
  border: 2px dashed #ccc;
}

.vehicle-status-list {
  max-height: 500px;
  overflow-y: auto;
}

.vehicle-status-item {
  background: linear-gradient(90deg, #e3f2fd 0%, #f8fafb 100%);
  border-radius: 12px;
  margin-bottom: 12px;
  padding: 16px;
  transition: all 0.2s;
  border-left: 4px solid transparent;
}

.vehicle-status-item.active {
  border-left-color: var(--v-theme-success);
  background: linear-gradient(90deg, #e8f5e8 0%, #f8fafb 100%);
}

.vehicle-status-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.vehicle-status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.vehicle-info {
  flex-grow: 1;
}

.vehicle-license {
  font-weight: 600;
  color: var(--v-theme-text-primary);
}

.vehicle-model {
  font-size: 0.9rem;
  color: var(--v-theme-text-secondary);
}

.vehicle-status-details {
  margin-bottom: 12px;
}

.status-detail {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  font-size: 0.9rem;
  color: var(--v-theme-text-secondary);
}

.vehicle-status-actions {
  display: flex;
  gap: 4px;
}

.route-optimization,
.route-stats {
  padding: 16px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 8px 0;
}

.stat-label {
  color: var(--v-theme-text-secondary);
  font-weight: 500;
}

.stat-value {
  font-weight: 600;
  color: var(--v-theme-text-primary);
}
</style> 