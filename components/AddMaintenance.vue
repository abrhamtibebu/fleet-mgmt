<template>
    <div>
            <v-dialog @click:outside="emit('close')" v-model="showMaintenanceDialog" max-width="700px" persistent>
      <v-card class="dialog-card">
        <v-card-title class="dialog-title d-flex align-center">
          <v-icon class="me-2" color="success">mdi-wrench</v-icon>
          Add Maintenance Record  
           <span class="ml-auto">
    <v-icon   @click="showMaintenanceDialog = false" color="red">mdi-window-close</v-icon>
  </span>
        </v-card-title>
        <v-card-text>
          <v-form ref="maintenanceFormRef" v-model="maintenanceFormValid">
            <v-row>
              <!-- <v-col cols="12" md="6">
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
              </v-col> -->
              <v-col cols="12" md="6">
                <v-autocomplete
                  item-title="name"
                  item-value="id"
                  v-model="maintenanceForm.serviceType"
                  :items="serviceTypes"
                  label="Service Type"
                  variant="outlined"
                  :rules="[v => !!v || 'Service type is required']"
                  required
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="maintenanceForm.servicedOn"
                  label="Service Date"
                  type="date"
                  variant="outlined"
                  :rules="[v => !!v || 'Date is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  hide-spin-buttons
                  v-model="maintenanceForm.totalCost"
                  label="Total Cost (ETB)"
                  type="number"
                  variant="outlined"
                  :rules="[v => !!v || 'Cost is required']"
                  required
                ></v-text-field>
              </v-col>
              <!-- <v-col cols="12" md="6">
                <v-select
                  v-model="maintenanceForm.status"
                  :items="statusOptions"
                  label="Status"
                  variant="outlined"
                  :rules="[v => !!v || 'Status is required']"
                  required
                ></v-select>
              </v-col> -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="maintenanceForm.serviceProvider"
                  label="Mechanic/Service Provider"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="maintenanceForm.odometerReading"
                  label="Odometer Reading (km)"
                  type="number"
                  variant="outlined"
                  :rules="[v => !!v || 'Odometer reading is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="maintenanceForm.remark"
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
    </div>
</template>

<script lang="ts" setup>
const showMaintenanceDialog = ref(true)
const savingMaintenance = ref(false)
const maintenanceFormValid = ref(false)

const {createMaintenance} = useMaintenance()

const emit = defineEmits<{
  close: []
}>()

const props = defineProps({
    vehicle: {
        type: Object,
        default: {}
    }
})

const maintenanceForm = ref({
  vehicleId: props.vehicle.id,
  serviceType: '',
  servicedOn: '',
  totalCost: '',
  serviceProvider: '',
  odometerReading: 0,
  remark: ''
})

const saveMaintenanceRecord = async () => {
  savingMaintenance.value = true
  try {
    await createMaintenance(maintenanceForm.value)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    emit('showSuccess','Fuel Record Added Successfully')
    emit('close')
    
    
    resetMaintenanceForm()
  } catch (error) {
  } finally {
    savingMaintenance.value = false
  }
}


const resetMaintenanceForm = () => {
  maintenanceForm.value = {
    vehicleId: props.maintenance.id,
    serviceType: '',
    date: '',
    cost: '',
    status: 'completed',
    mechanic: '',
    odometerReading: 0,   
    notes: ''
  }
}

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


</script>
