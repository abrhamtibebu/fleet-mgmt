<template>
  <v-dialog v-model="showDialog" max-width="800px" persistent>
    <v-card class="renewal-dialog-card">
      <v-card-title class="renewal-dialog-title">
        <v-icon class="me-2" color="primary">mdi-calendar-clock</v-icon>
        {{ isEdit ? 'Edit Renewal' : 'New Renewal' }}
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form ref="renewalFormRef" v-model="formValid">
          <!-- Renewal Type Selection -->
          <div class="form-section-title mb-4">
            <v-icon class="me-2" color="primary">mdi-shield-check</v-icon>
            Renewal Type
          </div>
          
          <v-row class="grid-gap-sm">
            <v-col cols="12" md="6">
              <v-select
                v-model="renewalForm.renewalType"
                :items="renewalTypeOptions"
                item-title="name"
                item-value="value"
                label="Renewal Type*"
                placeholder="Select renewal type"
                variant="outlined"
                density="compact"
                :rules="[(v) => !!v || 'Renewal type is required']"
                required
                @update:model-value="onRenewalTypeChange"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="renewalForm.vehicleId"
                :items="vehicleList"
                item-title="plateNo"
                item-value="id"
                label="Select Vehicle*"
                placeholder="Choose vehicle for renewal"
                variant="outlined"
                density="compact"
                :rules="[(v) => !!v || 'Vehicle is required']"
                required
                :disabled="!renewalForm.renewalType"
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <v-icon>mdi-truck</v-icon>
                    </template>
                    <v-list-item-title>{{ item.raw.plateNo }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ getVehicleModel(item.raw) }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>

          <!-- Insurance Renewal Form -->
          <div v-if="renewalForm.renewalType === 'insurance'" class="renewal-section mt-6">
            <div class="form-section-title mb-4">
              <v-icon class="me-2" color="info">mdi-shield-check</v-icon>
              Insurance Renewal Details
            </div>
            
            <v-row class="grid-gap-sm">
              <v-col cols="12" md="6">
                <v-select
                  v-model="renewalForm.insuranceType"
                  :items="insuranceTypeOptions"
                  item-title="name"
                  item-value="id"
                  label="Insurance Type*"
                  placeholder="Select insurance type"
                  variant="outlined"
                  density="compact"
                  :rules="[(v) => !!v || 'Insurance type is required']"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="renewalForm.insuranceProvider"
                  label="Insurance Provider*"
                  placeholder="Enter insurance company name"
                  variant="outlined"
                  density="compact"
                  :rules="[(v) => !!v || 'Insurance provider is required']"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="grid-gap-sm">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="renewalForm.insurancePolicyNumber"
                  label="Policy Number*"
                  placeholder="Enter policy number"
                  variant="outlined"
                  density="compact"
                  :rules="[(v) => !!v || 'Policy number is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="renewalForm.insurancePremium"
                  label="Annual Premium (ETB)*"
                  placeholder="Enter annual premium amount"
                  type="number"
                  variant="outlined"
                  density="compact"
                  hide-spin-buttons
                  :rules="[(v) => !!v || 'Premium amount is required']"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="grid-gap-sm">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="renewalForm.insuranceCoverage"
                  label="Coverage Amount (ETB)*"
                  placeholder="Enter coverage amount"
                  type="number"
                  variant="outlined"
                  density="compact"
                  hide-spin-buttons
                  :rules="[(v) => !!v || 'Coverage amount is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="renewalForm.insuranceStartDate"
                  label="Start Date*"
                  placeholder="Select start date"
                  type="date"
                  variant="outlined"
                  density="compact"
                  :rules="[(v) => !!v || 'Start date is required']"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="grid-gap-sm">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="renewalForm.insuranceEndDate"
                  label="End Date*"
                  placeholder="Select end date"
                  type="date"
                  variant="outlined"
                  density="compact"
                  :rules="[(v) => !!v || 'End date is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="renewalForm.insuranceAgent"
                  label="Insurance Agent"
                  placeholder="Enter agent name and contact"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="grid-gap-sm">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="renewalForm.insurancePhone"
                  label="Agent Phone"
                  placeholder="Enter agent phone number"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="renewalForm.insuranceNotes"
                  label="Notes"
                  placeholder="Enter any additional notes"
                  variant="outlined"
                  density="compact"
                  rows="2"
                  auto-grow
                ></v-textarea>
              </v-col>
            </v-row>
          </div>

          <!-- Safety Inspection Renewal Form -->
          <div v-if="renewalForm.renewalType === 'safety'" class="renewal-section mt-6">
            <div class="form-section-title mb-4">
              <v-icon class="me-2" color="success">mdi-car-wrench</v-icon>
              Safety Inspection Renewal Details
            </div>
            
            <v-row class="grid-gap-sm">
              <v-col cols="12" md="6">
                <v-select
                  v-model="renewalForm.safetyInspectionStatus"
                  :items="safetyInspectionStatusOptions"
                  item-title="name"
                  item-value="id"
                  label="Inspection Status*"
                  placeholder="Select inspection status"
                  variant="outlined"
                  density="compact"
                  :rules="[(v) => !!v || 'Inspection status is required']"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="renewalForm.safetyInspectionNumber"
                  label="Certificate Number*"
                  placeholder="Enter certificate number"
                  variant="outlined"
                  density="compact"
                  :rules="[(v) => !!v || 'Certificate number is required']"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="grid-gap-sm">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="renewalForm.safetyInspectionDate"
                  label="Inspection Date*"
                  placeholder="Select inspection date"
                  type="date"
                  variant="outlined"
                  density="compact"
                  :rules="[(v) => !!v || 'Inspection date is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="renewalForm.safetyInspectionExpiry"
                  label="Expiry Date*"
                  placeholder="Select expiry date"
                  type="date"
                  variant="outlined"
                  density="compact"
                  :rules="[(v) => !!v || 'Expiry date is required']"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="grid-gap-sm">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="renewalForm.safetyInspectionCenter"
                  label="Inspection Center*"
                  placeholder="Enter inspection center name"
                  variant="outlined"
                  density="compact"
                  :rules="[(v) => !!v || 'Inspection center is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="renewalForm.safetyInspectionCost"
                  label="Inspection Cost (ETB)*"
                  placeholder="Enter inspection cost"
                  type="number"
                  variant="outlined"
                  density="compact"
                  hide-spin-buttons
                  :rules="[(v) => !!v || 'Inspection cost is required']"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="grid-gap-sm">
              <v-col cols="12">
                <v-textarea
                  v-model="renewalForm.safetyInspectionNotes"
                  label="Inspection Notes"
                  placeholder="Enter any inspection findings or notes"
                  variant="outlined"
                  density="compact"
                  rows="2"
                  auto-grow
                ></v-textarea>
              </v-col>
            </v-row>
          </div>

          <!-- Road Fund Renewal Form -->
          <div v-if="renewalForm.renewalType === 'road'" class="renewal-section mt-6">
            <div class="form-section-title mb-4">
              <v-icon class="me-2" color="warning">mdi-road</v-icon>
              Road Fund Renewal Details
            </div>
            
            <v-row class="grid-gap-sm">
              <v-col cols="12" md="6">
                <v-select
                  v-model="renewalForm.roadFundStatus"
                  :items="roadFundStatusOptions"
                  item-title="name"
                  item-value="id"
                  label="Road Fund Status*"
                  placeholder="Select road fund status"
                  variant="outlined"
                  density="compact"
                  :rules="[(v) => !!v || 'Road fund status is required']"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="renewalForm.roadFundNumber"
                  label="Road Fund Number*"
                  placeholder="Enter road fund number"
                  variant="outlined"
                  density="compact"
                  :rules="[(v) => !!v || 'Road fund number is required']"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="grid-gap-sm">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="renewalForm.roadFundIssueDate"
                  label="Issue Date*"
                  placeholder="Select issue date"
                  type="date"
                  variant="outlined"
                  density="compact"
                  :rules="[(v) => !!v || 'Issue date is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="renewalForm.roadFundExpiryDate"
                  label="Expiry Date*"
                  placeholder="Select expiry date"
                  type="date"
                  variant="outlined"
                  density="compact"
                  :rules="[(v) => !!v || 'Expiry date is required']"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="grid-gap-sm">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="renewalForm.roadFundAmount"
                  label="Road Fund Amount (ETB)*"
                  placeholder="Enter road fund amount"
                  type="number"
                  variant="outlined"
                  density="compact"
                  hide-spin-buttons
                  :rules="[(v) => !!v || 'Road fund amount is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="renewalForm.roadFundIssuingOffice"
                  label="Issuing Office*"
                  placeholder="Enter issuing office"
                  variant="outlined"
                  density="compact"
                  :rules="[(v) => !!v || 'Issuing office is required']"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="grid-gap-sm">
              <v-col cols="12">
                <v-textarea
                  v-model="renewalForm.roadFundNotes"
                  label="Road Fund Notes"
                  placeholder="Enter any additional road fund notes"
                  variant="outlined"
                  density="compact"
                  rows="2"
                  auto-grow
                ></v-textarea>
              </v-col>
            </v-row>
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions class="renewal-dialog-actions">
        <v-spacer></v-spacer>
        <v-btn variant="outlined" @click="closeDialog">
          Cancel
        </v-btn>
        <v-btn 
          color="primary" 
          :loading="saving" 
          :disabled="!formValid"
          @click="saveRenewal"
          prepend-icon="mdi-content-save"
        >
          {{ isEdit ? 'Update Renewal' : 'Create Renewal' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// Props
const props = defineProps<{
  modelValue: boolean
  renewalItem?: any
  isEdit?: boolean
}>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'saved': [renewal: any]
}>()

// Composables
const { vehicleList, updateVehicle } = useVehicles()
const { vendorList } = useVendor()
const { modelList } = useModel()

// Reactive data
const renewalFormRef = ref()
const formValid = ref(false)
const saving = ref(false)

// Form data
const renewalForm = ref({
  renewalType: '',
  vehicleId: '',
  // Insurance fields
  insuranceType: null as any,
  insuranceProvider: '',
  insurancePolicyNumber: '',
  insurancePremium: '',
  insuranceCoverage: '',
  insuranceStartDate: '',
  insuranceEndDate: '',
  insuranceAgent: '',
  insurancePhone: '',
  insuranceNotes: '',
  // Safety inspection fields
  safetyInspectionStatus: null as any,
  safetyInspectionNumber: '',
  safetyInspectionDate: '',
  safetyInspectionExpiry: '',
  safetyInspectionCenter: '',
  safetyInspectionCost: '',
  safetyInspectionNotes: '',
  // Road fund fields
  roadFundStatus: null as any,
  roadFundNumber: '',
  roadFundIssueDate: '',
  roadFundExpiryDate: '',
  roadFundAmount: '',
  roadFundIssuingOffice: '',
  roadFundNotes: ''
})

// Options
const renewalTypeOptions = [
  { name: 'Insurance Renewal', value: 'insurance' },
  { name: 'Safety Inspection Renewal', value: 'safety' },
  { name: 'Road Fund Renewal', value: 'road' }
]

const insuranceTypeOptions = [
  { id: 1, name: 'Comprehensive Insurance' },
  { id: 2, name: 'Third Party Liability' },
  { id: 3, name: 'Third Party Fire & Theft' },
  { id: 4, name: 'Commercial Vehicle Insurance' },
  { id: 5, name: 'Fleet Insurance' },
  { id: 6, name: 'Self Insurance' },
  { id: 7, name: 'Other' }
]

const safetyInspectionStatusOptions = [
  { id: 1, name: 'Valid' },
  { id: 2, name: 'Expired' },
  { id: 3, name: 'Pending' },
  { id: 4, name: 'Failed' },
  { id: 5, name: 'Under Review' }
]

const roadFundStatusOptions = [
  { id: 1, name: 'Valid' },
  { id: 2, name: 'Expired' },
  { id: 3, name: 'Pending' },
  { id: 4, name: 'Not Required' },
  { id: 5, name: 'Under Review' }
]

// Computed
const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Methods
const getVehicleModel = (vehicle: any) => {
  if (!vehicle) return ''
  const vendor = vendorList.value.find(v => v.id === vehicle.vendorId)
  const model = modelList.value.find(m => m.id === vehicle.modelId)
  return `${vendor?.name || ''} ${model?.name || ''}`.trim()
}

const onRenewalTypeChange = () => {
  // Reset form when renewal type changes
  resetForm()
}

const resetForm = () => {
  renewalForm.value = {
    renewalType: renewalForm.value.renewalType,
    vehicleId: renewalForm.value.vehicleId,
    // Insurance fields
    insuranceType: null,
    insuranceProvider: '',
    insurancePolicyNumber: '',
    insurancePremium: '',
    insuranceCoverage: '',
    insuranceStartDate: '',
    insuranceEndDate: '',
    insuranceAgent: '',
    insurancePhone: '',
    insuranceNotes: '',
    // Safety inspection fields
    safetyInspectionStatus: null,
    safetyInspectionNumber: '',
    safetyInspectionDate: '',
    safetyInspectionExpiry: '',
    safetyInspectionCenter: '',
    safetyInspectionCost: '',
    safetyInspectionNotes: '',
    // Road fund fields
    roadFundStatus: null,
    roadFundNumber: '',
    roadFundIssueDate: '',
    roadFundExpiryDate: '',
    roadFundAmount: '',
    roadFundIssuingOffice: '',
    roadFundNotes: ''
  }
}

const closeDialog = () => {
  showDialog.value = false
  resetForm()
}

const saveRenewal = async () => {
  try {
    saving.value = true
    
    const selectedVehicle = vehicleList.value.find(v => v.id === renewalForm.value.vehicleId)
    if (!selectedVehicle) {
      throw new Error('Selected vehicle not found')
    }

    // Prepare update data based on renewal type
    const updateData: any = {}
    
    if (renewalForm.value.renewalType === 'insurance') {
      // Create new insurance entry
      const newInsuranceEntry = {
        insuranceType: renewalForm.value.insuranceType,
        insuranceProvider: renewalForm.value.insuranceProvider,
        insurancePolicyNumber: renewalForm.value.insurancePolicyNumber,
        insurancePremium: parseFloat(renewalForm.value.insurancePremium),
        insuranceCoverage: parseFloat(renewalForm.value.insuranceCoverage),
        insuranceStartDate: renewalForm.value.insuranceStartDate,
        insuranceEndDate: renewalForm.value.insuranceEndDate,
        insuranceAgent: renewalForm.value.insuranceAgent,
        insurancePhone: renewalForm.value.insurancePhone,
        insuranceNotes: renewalForm.value.insuranceNotes
      }

      // Add to existing insurance entries or create new array
      const existingEntries = selectedVehicle.insuranceEntries || []
      updateData.insuranceEntries = [...existingEntries, newInsuranceEntry]
    }
    
    else if (renewalForm.value.renewalType === 'safety') {
      updateData.safetyInspectionStatus = renewalForm.value.safetyInspectionStatus
      updateData.safetyInspectionNumber = renewalForm.value.safetyInspectionNumber
      updateData.safetyInspectionDate = renewalForm.value.safetyInspectionDate
      updateData.safetyInspectionExpiry = renewalForm.value.safetyInspectionExpiry
      updateData.safetyInspectionCenter = renewalForm.value.safetyInspectionCenter
      updateData.safetyInspectionCost = parseFloat(renewalForm.value.safetyInspectionCost)
      updateData.safetyInspectionNotes = renewalForm.value.safetyInspectionNotes
    }
    
    else if (renewalForm.value.renewalType === 'road') {
      updateData.roadFundStatus = renewalForm.value.roadFundStatus
      updateData.roadFundNumber = renewalForm.value.roadFundNumber
      updateData.roadFundIssueDate = renewalForm.value.roadFundIssueDate
      updateData.roadFundExpiryDate = renewalForm.value.roadFundExpiryDate
      updateData.roadFundAmount = parseFloat(renewalForm.value.roadFundAmount)
      updateData.roadFundIssuingOffice = renewalForm.value.roadFundIssuingOffice
      updateData.roadFundNotes = renewalForm.value.roadFundNotes
    }

    // Update the vehicle
    await updateVehicle(selectedVehicle.id, updateData)
    
    emit('saved', {
      vehicleId: selectedVehicle.id,
      renewalType: renewalForm.value.renewalType,
      data: updateData
    })
    
    closeDialog()
  } catch (error) {
    console.error('Failed to save renewal:', error)
    // You might want to show an error message here
  } finally {
    saving.value = false
  }
}

// Watch for props changes to populate form for editing
watch(() => props.renewalItem, (newItem) => {
  if (newItem) {
    // Pre-populate form with the selected renewal item
    renewalForm.value.renewalType = newItem.type
    renewalForm.value.vehicleId = newItem.vehicle.id
    
    if (newItem.type === 'insurance' && newItem.insuranceType) {
      renewalForm.value.insuranceType = newItem.insuranceType
      renewalForm.value.insuranceProvider = newItem.provider || ''
      // Add other insurance fields as needed
    }
    
    // Handle quick renewal
    if (newItem.quickRenew && newItem.suggestedEndDate) {
      if (newItem.type === 'insurance') {
        renewalForm.value.insuranceEndDate = newItem.suggestedEndDate
      } else if (newItem.type === 'safety') {
        renewalForm.value.safetyInspectionExpiry = newItem.suggestedEndDate
      } else if (newItem.type === 'road') {
        renewalForm.value.roadFundExpiryDate = newItem.suggestedEndDate
      }
    }
  }
}, { immediate: true })
</script>

<style scoped>
.renewal-dialog-card {
  border-radius: 24px;
  overflow: hidden;
}

.renewal-dialog-title {
  background: white;
  color: #040707;
  font-size: 1.375rem;
  font-weight: 700;
  padding: 28px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.form-section-title {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #1a1a1a;
  font-size: 1.1rem;
}

.renewal-section {
  background: rgba(248, 250, 252, 0.5);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(226, 232, 240, 0.5);
}

.grid-gap-sm > .v-col {
  padding-top: 8px !important;
  padding-bottom: 8px !important;
}

.renewal-dialog-actions {
  padding: 28px;
  background: white;
}
</style>
