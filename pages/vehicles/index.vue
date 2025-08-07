<template>
  <div class="vehicles-root">
    <div class="vehicles-header">
      <h1 class="vehicles-title">Vehicle Management</h1>
      <p class="vehicles-subtitle">
        Manage your fleet vehicles, track maintenance, and monitor performance
      </p>
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
            @click=" resetVehicleForm(), showAddDialog = true, editingVehicle = false" 
          >
            Add New Vehicle
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <!-- Vehicle Cards Grid -->
    <div v-if="loading" class="text-center py-8">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
      <div class="mt-4 text-muted">Loading vehicles...</div>
    </div>

    <div v-else-if="filteredVehicles.length === 0" class="text-center py-8">
      <v-icon size="64" color="grey-lighten-1" class="mb-4"
        >mdi-truck-off</v-icon
      >
      <h3 class="text-h6 text-muted mb-2">No vehicles found</h3>
      <p class="text-muted">Add your first vehicle to get started</p>
    </div>

    <div v-else class="vehicles-grid">
      <v-row>
        <v-col
          v-for="vehicle in filteredVehicles"
          :key="vehicle.id"
          cols="12"
          md="12"
          sm="6"
          lg="4"
          xl="3"
        >
        <v-card class="vehicle-card">
  <v-card-title class="vehicle-card-header">
    <div class="d-flex align-center justify-space-between w-100">
      <div class="vehicle-license">{{ vehicle.plateNo }}</div>
      <StatusBadge :status="getStatusDetails(vehicle.status)" />
    </div>
  </v-card-title>

  <v-card-text class="vehicle-card-content">
    <div class="vehicle-info">
      <div class="vehicle-model">
        <v-icon class="vehicle-main-icon me-2">mdi-truck</v-icon>
        {{ vehicle.vendor.name }} {{ vehicle.model.name }} ({{ vehicle.year }})
      </div>

      <div class="vehicle-details">
        <div class="vehicle-detail-item">
          <v-icon size="small" class="me-1">mdi-account</v-icon>
          <span>{{ usersList.find(x => x.id == vehicle.driver)?.name || 'Unassigned' }}</span>
        </div>
        <div class="vehicle-detail-item">
          <v-icon size="small" class="me-1">mdi-speedometer</v-icon>
          <span>{{ vehicle.currentMileage.toLocaleString() }} km</span>
        </div>
      </div>

      <div class="service-status mt-3">
        <div class="d-flex align-center justify-space-between mb-1">
          <span class="text-caption font-weight-medium">Service Status</span>
          <span class="text-caption">
            {{ formatDate('2025-09-01') }}
            <!-- {{ formatDate(vehicle.lastServiceDate) }} -->
          </span>
        </div>
        <v-progress-linear
          :model-value="getServiceProgress(vehicle)"
          :color="getServiceColor(vehicle)"
          height="8"
          rounded
        ></v-progress-linear>
        <div class="text-caption text-muted mt-1">
          Next service at 1000 KM
        </div>
      </div>
    </div>
  </v-card-text>

  <v-card-actions class="vehicle-card-actions d-flex flex-wrap gap-2">
    <v-btn
      variant="outlined"
      size="small"
      class="vehicle-btn"
      @click="addMainEntry(vehicle)"
    >
      Mentainance
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
      Fuel
    </v-btn>
     <v-btn
      variant="outlined"
      size="small"
      class="vehicle-btn"
      @click="vehicleDetail(vehicle)"
    >
      Detail
    </v-btn>
  </v-card-actions>
</v-card>

        </v-col>
      </v-row>
    </div>

    <!-- Add/Edit Vehicle Dialog -->
    <!-- <v-form ref="vehicleFormRef" v-model="formValid"> -->

    <v-dialog v-model="showAddDialog" max-width="600px">
      <v-card>
        <v-card-title class="text-h6 pa-4">
          <v-icon class="me-2" color="primary">mdi-truck</v-icon>
          {{ editingVehicle ? `Edit Vehicle - ${editingVehicle.plateNo}` : "Add New Vehicle" }}
        </v-card-title>
        <v-card-text class="pa-4">
          <v-form ref="vehicleFormRef" v-model="formValid">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  density="compact"
                  v-model="vehicleForm.plateNo"
                  label="License Plate"
                  variant="outlined"
                  :rules="[(v) => !!v || 'License plate is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-autocomplete
                  density="compact"
                  class="text--black"
                  v-model="vehicleForm.vendorId"
                  :items="vendorList"
                  label="Vendor"
                  variant="outlined"
                  :rules="[(v) => !!v || 'Vendor is required']"
                  required
                  @update:model-value="onBrandChange"
                  item-title="name"
                  item-value="id"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6">
                <v-autocomplete
                  density="compact"
                  v-model="vehicleForm.modelId"
                  :items="modelList"
                  label="Model"
                  variant="outlined"
                  :rules="[(v) => !!v || 'Model is required']"
                  required
                  :disabled="!vehicleForm.vendorId"
                  item-title="name"
                  item-value="id"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  density="compact"
                  hide-spin-buttons
                  v-model="vehicleForm.year"
                  label="Year"
                  type="number"
                  variant="outlined"
                  :rules="[(v) => !!v || 'Year is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-autocomplete
                  density="compact"
                  v-model="vehicleForm.driver"
                  :items="usersList"
                  item-title="name"
                  item-value="id"
                  label="Assigned Driver"
                  variant="outlined"
                  :rules="[(v) => !!v || 'Driver is required']"
                  required
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  hide-spin-buttons
                  density="compact"
                  v-model="vehicleForm.currentMileage"
                  label="Current Mileage (km)"
                  type="number"
                  variant="outlined"
                  :rules="[(v) => !!v || 'Current mileage is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  hide-spin-buttons
                  density="compact"
                  v-model="vehicleForm.serviceInterval"
                  label="Service Interval (km)"
                  type="number"
                  variant="outlined"
                  :rules="[(v) => !!v || 'Service interval is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  density="compact"
                  v-model="vehicleForm.cardId"
                  :items="cardList"
                  item-title="number"
                  item-value="id"
                  label="Fuel Card"
                  variant="outlined"
                  :rules="[(v) => !!v || 'Fuel card is required']"
                  required
                ></v-autocomplete>
              </v-col>
                  <v-col cols="12" md="6">
                <v-autocomplete
                  density="compact"
                  v-model="vehicleForm.type"
                  :items="vehicleTypes"
                  item-title="name"
                  item-value="id"
                  label="Vehicle Type"
                  variant="outlined"
                  :rules="[(v) => !!v || 'Vehicle type is required']"
                  required
                ></v-autocomplete>
              </v-col>
                             <v-col cols="12" md="6" v-if="editingVehicle">
                 <v-select
                   density="compact"
                   v-model="vehicleForm.status"
                   :items="vehicleStatusOptions"
                   item-title="name"
                   item-value="id"
                   label="Vehicle Status"
                   variant="outlined"
                   :rules="[(v) => !!v || 'Vehicle status is required']"
                   required
                 ></v-select>
               </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4 justify-center">
          <v-btn variant="outlined" @click="showAddDialog = false">
            Cancel
          </v-btn>
          <v-btn 
            color="primary" 
            :loading="saving" 
            :disabled="!formValid"
            @click="saveVehicle"
          >
            {{ editingVehicle ? "Update" : "Add" }} Vehicle
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- </v-form> -->
<!-- detail records dialog  -->
 <v-dialog v-model="vehicleDetailDialog" max-width="700px">
  <v-card>
    <v-card-title>
      <v-icon class="me-2" color="primary">mdi-details</v-icon>
      Vehicle Details - {{ selectedVehicle?.plateNo }}
    </v-card-title>

    <v-card-text>
      <!-- Fuel Records -->
      <v-row>
        <v-col cols="12" md="6">
          <h1 class="text-subtitle-1 mb-2" style="font-weight: bold; font-size: 30px;">Fuel Records</h1>
          <div v-if="selectedVehicle?.fuelRecord?.length">
            <div
              v-for="(fuel, index) in selectedVehicle.fuelRecord"
              :key="'fuel-' + index"
              class="mb-3 pa-3 border rounded"
            >
              <div><strong>Quantity:</strong> {{ fuel.quantity }}</div>
              <div><strong>Amount:</strong> {{ fuel.amount }}</div>
              <div><strong>Odometer:</strong> {{ fuel.odometerReading }}</div>
              <div><strong>Fuel Station:</strong> {{ fuel.fuelStation }}</div>
              <div><strong>Date:</strong> {{ formatDate(fuel.createdAt) }}</div>
            </div>
          </div>
          <div v-else>No fuel records available.</div>
        </v-col>

      <!-- Maintenance Records -->
        <v-col cols="12" md="6">
          <h1 class="text-subtitle-1 mb-2" style="font-weight: bold;">Maintenance Records</h1>
          <div v-if="selectedVehicle?.maintenanceRecord?.length">
            <div
              v-for="(maint, index) in selectedVehicle.maintenanceRecord"
              :key="'maint-' + index"
              class="mb-3 pa-3 border rounded"
            >
              <div><strong>Service Type:</strong> {{ maint.serviceType }}</div>
              <div><strong>Total Cost:</strong> {{ maint.totalCost }}</div>
              <div><strong>Serviced On:</strong> {{ maint.servicedOn }}</div>
              <div><strong>Service Provider:</strong> {{ maint.serviceProvider }}</div>
              <div><strong>Remark:</strong> {{ maint.remark }}</div>
            </div>
          </div>
          <div v-else>No maintenance records available.</div>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="vehicleDetailDialog = false">Close</v-btn>
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

    <LazyAddFuel v-if="addFuelModal" :vehicle="currItem" @close="addFuelModal = false" @showSuccess="showSuccess"/>
    <LazyAddMaintenance v-if="addMainModal" :vehicle="currItem" @close="addMainModal = false" @showSuccess="showSuccess"/>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
// import vehicles from "~/server/api/vehicles";
const { $apiFetch } = useNuxtApp();
const vehicleFormRef = ref();

// Composables
const { vehicleList, loading, getVehicles, createVehicle, updateVehicle, vehicleTypes, statusMap,getVehicleById } = useVehicles();

// Vehicle status options for the form
const vehicleStatusOptions = computed(() => {
  return statusMap.map(status => ({
    id: status.id,
    name: status.label
  }));
});
const { getCard, getUsers, cardList, usersList } = useCard();
const { getByVendor, modelList } = useModel();
const {
  vendorList,
  getVendor,
} = useVendor();

// Reactive data
const currItem = ref(null)
const searchQuery = ref("");
const showAddDialog = ref(false);
const vehicleDetailDialog = ref(false);
const selectedVehicle = ref(null);
const editingVehicle = ref(null);
const addFuelModal = ref(false)
const addMainModal = ref(false)
const saving = ref(false);
const formValid = ref(false);
// const vehicles = ref([]);
const vehicleForm = ref({
  plateNo: "",
  vendorId: "",
  modelId: "",
  cardId: "",
  year: "",
  driver: "",
  currentMileage: 0,
  serviceInterval: 0,
  type: 1
});
const showSuccessSnackbar = ref(false)
const showErrorSnackbar = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Computed properties
const filteredVehicles = computed(() => {
  if (!searchQuery.value) return vehicleList.value;

  const query = searchQuery.value.toLowerCase();
  return vehicleList.value.filter(
    (vehicle) =>
      vehicle.plateNo.toLowerCase().includes(query) ||
      (usersList.value.find(x => x.id == vehicle.driver)?.name || '').toLowerCase().includes(query)
  );
});

// const vendorCardOptions = computed(() => {

//   return vendorCards.value.map(card => ({
//     title: `${card.cardHolder} - ${maskCardNumber(card.cardNumber)}`,
//     value: card.id
//   }))
// })

// Methods
const getServiceProgress = (vehicle) => {
  const progress =
    ((vehicle.currentMileage - vehicle.lastServiceMileage) /
      vehicle.serviceInterval) *
    100;
  return Math.min(progress, 100);
};

const getServiceColor = (vehicle) => {
  const progress = getServiceProgress(vehicle);
  if (progress >= 100) return "error";
  if (progress >= 80) return "warning";
  return "success";
};

const formatDate = (dateString: Date) => {
  return new Date(dateString).toLocaleDateString();
};

const addMainEntry = (vehicle) => {
  // Navigate to vehicle details page
  currItem.value = vehicle 
  addMainModal.value = true 
  console.log("View vehicle details:", vehicle);
};

const editVehicle = (vehicle) => {
  editingVehicle.value = vehicle;
  vehicleForm.value = { ...vehicle };
  showAddDialog.value = true;
  console.log("Editing vehicle:", vehicle);
};

const addMileageEntry = (vehicle) => {
  // Navigate to mileage entry page
  currItem.value = vehicle
  addFuelModal.value = true
  console.log("Add mileage entry for:", vehicle);
};

const showSuccess = async (message: string) => {
  try {  
    showSuccessMessage(message)
  } catch (error) {
    showErrorMessage(message)
  }
}
const saveVehicle = async () => {
  try {  
    if (editingVehicle.value) {
      // Update existing vehicle
      await updateVehicle(editingVehicle.value.id, vehicleForm.value)
      showSuccessMessage('Vehicle updated successfully')
    } else {
      // Create new vehicle with default status (Active = 1)
      const newVehicleData = {
        ...vehicleForm.value,
        status: 1 // Default to Active status for new vehicles
      }
      await createVehicle(newVehicleData)
      showSuccessMessage('Vehicle created successfully')
    }
    showAddDialog.value = false;
    resetVehicleForm();
  } catch (error) {
    showErrorMessage(editingVehicle.value ? 'Failed to update vehicle' : 'Failed to create vehicle')
  } finally {
    saving.value = false;
  }
};

const showSuccessMessage = (message: string) => {
  successMessage.value = message
  showSuccessSnackbar.value = true
}

const showErrorMessage = (message: string) => {
  errorMessage.value = message
  showErrorSnackbar.value = true
}

const onBrandChange = async (item: Number) => {
  await getByVendor(item)
};

const getStatusDetails = (status: Number) => {
  return statusMap.find(v => v.id == status)
}
const resetVehicleForm = () => {
  vehicleForm.value = {
    plateNo: "",
    vendorId: null,
    modelId: null,
    cardId: null,
    year: "",
    driver: "",
    currentMileage: 0,
    serviceInterval: 0,
    type: 1
  };
  editingVehicle.value = null;
};
// async function loadVehicles() {
//   vehicles.value = await getVehicles()
// }

// When clicking Detail
async function vehicleDetail(vehicle) {
  try {
    const detail = await getVehicleById(vehicle.id)
    selectedVehicle.value = detail
    vehicleDetailDialog.value = true
  } catch (error) {
    console.error('Failed to load vehicle detail', error)
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    getVehicles(),
    getCard(),
    getUsers(),
    getVendor(),
    // initializeData()
  ]);
});
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
