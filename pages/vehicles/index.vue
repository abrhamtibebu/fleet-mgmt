<template>
  <div class="vehicles-root">
    <div class="vehicles-header">
      <h1 class="vehicles-title">Vehicle Management</h1>
      <p class="vehicles-subtitle">Manage your fleet vehicles, track maintenance, and monitor performance</p>
      </div>

    <!-- Action Bar -->
    <div class="vehicles-actions mb-6">
      <v-row align="center">
        <v-col cols="12" md="6">
        <v-text-field
            v-model="searchQuery"
          prepend-inner-icon="mdi-magnify"
            placeholder="Search vehicles by license plate, model, or driver..."
            variant="outlined"
            density="compact"
          hide-details
            class="vehicles-search"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6" class="text-md-right">
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            class="vehicles-btn"
            @click="showAddDialog = true"
          >
            Add New Vehicle
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <!-- Vehicle Cards Grid -->
    <div v-if="loading" class="text-center py-8">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <div class="mt-4 text-muted">Loading vehicles...</div>
    </div>

    <div v-else-if="filteredVehicles.length === 0" class="text-center py-8">
      <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-truck-off</v-icon>
      <h3 class="text-h6 text-muted mb-2">No vehicles found</h3>
      <p class="text-muted">Add your first vehicle to get started</p>
    </div>

    <div v-else class="vehicles-grid">
      <v-row>
        <v-col
          v-for="vehicle in filteredVehicles"
          :key="vehicle.id"
          cols="12"
          sm="6"
          lg="4"
          xl="3"
        >
          <v-card class="vehicle-card">
            <v-card-title class="vehicle-card-header">
              <div class="d-flex align-center justify-space-between w-100">
                <div class="vehicle-license">{{ vehicle.licensePlate }}</div>
                <StatusBadge :status="vehicle.status" />
              </div>
            </v-card-title>

            <v-card-text class="vehicle-card-content">
              <div class="vehicle-info">
                <div class="vehicle-model">
                  <v-icon class="vehicle-main-icon me-2">mdi-truck</v-icon>
                  {{ vehicle.brand }} {{ vehicle.model }} ({{ vehicle.year }})
                </div>
                
                <div class="vehicle-details">
                  <div class="vehicle-detail-item">
                    <v-icon size="small" class="me-1">mdi-account</v-icon>
                    <span>{{ vehicle.assignedDriver }}</span>
                  </div>
                  <div class="vehicle-detail-item">
                    <v-icon size="small" class="me-1">mdi-map-marker</v-icon>
                    <span>{{ vehicle.location }}</span>
                  </div>
                  <div class="vehicle-detail-item">
                    <v-icon size="small" class="me-1">mdi-speedometer</v-icon>
                    <span>{{ vehicle.currentMileage.toLocaleString() }} km</span>
                  </div>
                  <div class="vehicle-detail-item">
                    <v-icon size="small" class="me-1">mdi-gas-station</v-icon>
                    <span>{{ vehicle.fuelEfficiency.toFixed(1) }} km/l</span>
                  </div>
                </div>

                <!-- Service Status -->
                <div class="service-status mt-3">
                  <div class="d-flex align-center justify-space-between mb-1">
                    <span class="text-caption font-weight-medium">Service Status</span>
                    <span class="text-caption">{{ formatDate(vehicle.lastServiceDate) }}</span>
                  </div>
                  <v-progress-linear
                    :model-value="getServiceProgress(vehicle)"
                    :color="getServiceColor(vehicle)"
                    height="8"
                    rounded
                  ></v-progress-linear>
                  <div class="text-caption text-muted mt-1">
                    Next service at {{ vehicle.nextServiceMileage.toLocaleString() }} km
                  </div>
                </div>
              </div>
            </v-card-text>

            <v-card-actions class="vehicle-card-actions">
              <v-btn
                variant="outlined"
                size="small"
                class="vehicle-btn"
                @click="viewVehicleDetails(vehicle)"
              >
                View Details
              </v-btn>
              <v-btn
                variant="outlined"
                size="small"
                class="vehicle-btn"
                @click="editVehicle(vehicle)"
              >
                Edit
        </v-btn>
              <v-btn
                variant="outlined"
                size="small"
                class="vehicle-btn"
                @click="addMileageEntry(vehicle)"
              >
                Add Mileage
        </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Add/Edit Vehicle Dialog -->
    <v-dialog v-model="showAddDialog" max-width="600px">
      <v-card>
        <v-card-title class="text-h6 pa-4">
          {{ editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle' }}
        </v-card-title>
        <v-card-text class="pa-4">
          <v-form ref="vehicleForm" v-model="formValid">
    <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="vehicleForm.licensePlate"
                  label="License Plate"
                  variant="outlined"
                  :rules="[v => !!v || 'License plate is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="vehicleForm.brand"
                  label="Brand"
                  variant="outlined"
                  :rules="[v => !!v || 'Brand is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="vehicleForm.model"
                  label="Model"
                  variant="outlined"
                  :rules="[v => !!v || 'Model is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="vehicleForm.year"
                  label="Year"
                  type="number"
                  variant="outlined"
                  :rules="[v => !!v || 'Year is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="vehicleForm.assignedDriver"
                  label="Assigned Driver"
                  variant="outlined"
                  :rules="[v => !!v || 'Driver is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="vehicleForm.location"
                  label="Location"
                  variant="outlined"
                  :rules="[v => !!v || 'Location is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="vehicleForm.currentMileage"
                  label="Current Mileage (km)"
                  type="number"
                  variant="outlined"
                  :rules="[v => !!v || 'Current mileage is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="vehicleForm.serviceInterval"
                  label="Service Interval (km)"
                  type="number"
                  variant="outlined"
                  :rules="[v => !!v || 'Service interval is required']"
                  required
                ></v-text-field>
      </v-col>
              <v-col cols="12">
                <v-select
                  v-model="vehicleForm.fuelCardId"
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
          <v-btn
            variant="outlined"
            @click="showAddDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            :loading="saving"
            :disabled="!formValid"
            @click="saveVehicle"
          >
            {{ editingVehicle ? 'Update' : 'Add' }} Vehicle
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Composables
const { vehicles, loading, getVehicles } = useVehicles()
const { fuelCards, getFuelCards } = useFuel()

// Reactive data
const searchQuery = ref('')
const showAddDialog = ref(false)
const editingVehicle = ref(null)
const saving = ref(false)
const formValid = ref(false)
const vehicleForm = ref({
  licensePlate: '',
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  assignedDriver: '',
  location: '',
  currentMileage: 0,
  serviceInterval: 10000,
  fuelCardId: ''
})

// Computed properties
const filteredVehicles = computed(() => {
  if (!searchQuery.value) return vehicles.value
  
  const query = searchQuery.value.toLowerCase()
  return vehicles.value.filter(vehicle => 
    vehicle.licensePlate.toLowerCase().includes(query) ||
    vehicle.brand.toLowerCase().includes(query) ||
    vehicle.model.toLowerCase().includes(query) ||
    vehicle.assignedDriver.toLowerCase().includes(query)
  )
})

// Methods
const getServiceProgress = (vehicle) => {
  const progress = ((vehicle.currentMileage - vehicle.lastServiceMileage) / vehicle.serviceInterval) * 100
  return Math.min(progress, 100)
}

const getServiceColor = (vehicle) => {
  const progress = getServiceProgress(vehicle)
  if (progress >= 100) return 'error'
  if (progress >= 80) return 'warning'
  return 'success'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const viewVehicleDetails = (vehicle) => {
  // Navigate to vehicle details page
  console.log('View vehicle details:', vehicle)
}

const editVehicle = (vehicle) => {
  editingVehicle.value = vehicle
  vehicleForm.value = { ...vehicle }
  showAddDialog.value = true
}

const addMileageEntry = (vehicle) => {
  // Navigate to mileage entry page
  console.log('Add mileage entry for:', vehicle)
}

const saveVehicle = async () => {
  saving.value = true
  try {
    // TODO: Implement save logic
    console.log('Saving vehicle:', vehicleForm.value)
    showAddDialog.value = false
    resetForm()
  } catch (error) {
    console.error('Error saving vehicle:', error)
  } finally {
    saving.value = false
  }
}

const resetForm = () => {
  vehicleForm.value = {
    licensePlate: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    assignedDriver: '',
    location: '',
    currentMileage: 0,
    serviceInterval: 10000,
    fuelCardId: ''
  }
  editingVehicle.value = null
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    getVehicles(),
    getFuelCards()
  ])
})
</script> 

<style scoped>
.vehicles-root {
  padding-bottom: 32px;
}

.vehicles-header {
  margin-bottom: 32px;
}

.vehicles-title {
  letter-spacing: -0.5px;
  margin-top: 8px;
  font-size: 2rem;
  font-weight: 700;
  color: var(--v-theme-text-primary);
}

.vehicles-subtitle {
  margin-bottom: 32px;
  color: var(--v-theme-text-secondary);
  font-size: 1.1rem;
}

.vehicles-actions {
  background: linear-gradient(135deg, #fffde7 0%, #f8fafb 100%);
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(16, 30, 54, 0.06);
}

.vehicles-search {
  max-width: 400px;
}

.vehicles-btn {
  font-weight: 600;
  border-radius: 10px;
  min-width: 160px;
}

.vehicles-grid {
  margin-top: 24px;
}

.vehicle-card {
  border-radius: 20px;
  background: linear-gradient(135deg, #fffde7 0%, #f8fafb 100%);
  box-shadow: 0 2px 12px rgba(16, 30, 54, 0.06);
  margin-bottom: 24px;
  transition: box-shadow 0.2s, transform 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.vehicle-card:hover {
  box-shadow: 0 8px 32px rgba(80, 80, 80, 0.12);
  transform: translateY(-2px) scale(1.01);
}

.vehicle-card-header {
  padding: 20px 24px 12px 24px;
  border-bottom: 1px solid #f0f1f3;
}

.vehicle-license {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--v-theme-primary);
}

.vehicle-card-content {
  flex-grow: 1;
  padding: 16px 24px;
}

.vehicle-info {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.vehicle-model {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--v-theme-text-primary);
}

.vehicle-main-icon {
  color: var(--v-theme-primary);
}

.vehicle-details {
  margin-bottom: 16px;
}

.vehicle-detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: var(--v-theme-text-secondary);
}

.service-status {
  margin-top: auto;
}

.vehicle-card-actions {
  padding: 16px 24px 20px 24px;
  border-top: 1px solid #f0f1f3;
  gap: 8px;
}

.vehicle-btn {
  font-weight: 600;
  border-radius: 10px;
  min-width: 120px;
  flex: 1;
}
</style> 