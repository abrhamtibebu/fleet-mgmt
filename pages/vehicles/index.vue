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
        {{ vendorList.find(v => v.id === vehicle.vendorId)?.name || 'Unknown' }} {{ modelList.find(m => m.id === vehicle.modelId)?.name || 'Unknown' }} ({{ vehicle.year }})
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

    <v-dialog v-model="showAddDialog" max-width="720px" persistent>
      <v-card class="dialog-card">
        <v-card-title class="dialog-title">
          <span class="title-icon-badge"><v-icon size="20" color="warning">mdi-clipboard-plus-outline</v-icon></span>
          {{ editingVehicle ? `Edit Vehicle - ${editingVehicle.plateNo}` : "Add New Vehicle" }}
        </v-card-title>

        <div class="dialog-subtitle pa-4 pt-2">
          Provide the vehicle details below. Fields marked with an asterisk are required.
        </div>

        <v-card-text class="pa-4 pt-0">
          <v-form ref="vehicleFormRef" v-model="formValid">
            <!-- Basic Information -->
            <div class="form-section-title mb-3">
              <span class="section-icon-badge"><v-icon size="18" color="warning">mdi-folder-outline</v-icon></span>
              Basic Information
            </div>
            <v-row class="grid-gap-sm">
              <v-col cols="12" sm="6">
                <v-text-field
                  density="compact"
                  v-model="vehicleForm.plateNo"
                  label="License Plate*"
                  placeholder="Enter license plate"
                  variant="outlined"
                  :rules="[(v) => !!v || 'License plate is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  density="compact"
                  hide-spin-buttons
                  v-model="vehicleForm.year"
                  label="Year*"
                  placeholder="Enter year"
                  type="number"
                  variant="outlined"
                  :rules="[(v) => !!v || 'Year is required']"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="grid-gap-sm">
              <v-col cols="12" sm="6">
                <v-autocomplete
                  density="compact"
                  class="text--black"
                  v-model="vehicleForm.vendorId"
                  :items="vendorList"
                  label="Vendor*"
                  placeholder="Select vendor"
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
                  label="Model*"
                  placeholder="Select model"
                  variant="outlined"
                  :rules="[(v) => !!v || 'Model is required']"
                  required
                  :disabled="!vehicleForm.vendorId"
                  item-title="name"
                  item-value="id"
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-divider class="my-4"></v-divider>

            <!-- Assignment & Operations -->
            <div class="form-section-title mb-3">
              <span class="section-icon-badge"><v-icon size="18" color="warning">mdi-folder-outline</v-icon></span>
              Assignment & Operations
            </div>
            <v-row class="grid-gap-sm">
              <v-col cols="12" sm="6">
                <v-autocomplete
                  density="compact"
                  v-model="vehicleForm.driver"
                  :items="usersList"
                  item-title="name"
                  item-value="id"
                  label="Assigned Driver*"
                  placeholder="Select driver"
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
                  label="Current Mileage (km)*"
                  placeholder="Enter current mileage"
                  type="number"
                  variant="outlined"
                  :rules="[(v) => !!v || 'Current mileage is required']"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="grid-gap-sm">
              <v-col cols="12" sm="6">
                <v-text-field
                  hide-spin-buttons
                  density="compact"
                  v-model="vehicleForm.serviceInterval"
                  label="Service Interval (km)*"
                  placeholder="Enter service interval"
                  type="number"
                  variant="outlined"
                  :rules="[(v) => !!v || 'Service interval is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-autocomplete
                  density="compact"
                  v-model="vehicleForm.type"
                  :items="vehicleTypes"
                  item-title="name"
                  item-value="id"
                  label="Vehicle Type*"
                  placeholder="Select vehicle type"
                  variant="outlined"
                  :rules="[(v) => !!v || 'Vehicle type is required']"
                  required
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-divider class="my-4"></v-divider>

            <!-- Insurance Details -->
            <div class="form-section-title mb-3">
              <span class="section-icon-badge"><v-icon size="18" color="info">mdi-shield-check</v-icon></span>
              Insurance Details
            </div>
            
            <!-- Insurance Entry Form -->
            <div class="insurance-entry-form mb-4">
              <v-row class="grid-gap-sm">
                <v-col cols="12" sm="6">
                  <v-select
                    density="compact"
                    v-model="currentInsuranceEntry.insuranceType"
                    :items="insuranceTypeOptions"
                    item-title="name"
                    item-value="id"
                    label="Insurance Type"
                    placeholder="Select insurance type to add"
                    variant="outlined"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    density="compact"
                    v-model="currentInsuranceEntry.insuranceProvider"
                    label="Insurance Provider"
                    placeholder="Enter insurance company name"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row class="grid-gap-sm">
                <v-col cols="12" sm="6">
                  <v-text-field
                    density="compact"
                    v-model="currentInsuranceEntry.insurancePolicyNumber"
                    label="Policy Number"
                    placeholder="Enter policy number"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    density="compact"
                    v-model="currentInsuranceEntry.insurancePremium"
                    label="Annual Premium (ETB)"
                    placeholder="Enter annual premium amount"
                    type="number"
                    variant="outlined"
                    hide-spin-buttons
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row class="grid-gap-sm">
                <v-col cols="12" sm="6">
                  <v-text-field
                    density="compact"
                    v-model="currentInsuranceEntry.insuranceCoverage"
                    label="Coverage Amount (ETB)"
                    placeholder="Enter coverage amount"
                    type="number"
                    variant="outlined"
                    hide-spin-buttons
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    density="compact"
                    v-model="currentInsuranceEntry.insuranceStartDate"
                    label="Insurance Start Date"
                    placeholder="Select start date"
                    type="date"
                    variant="outlined"
                    @update:model-value="(value) => autoCalculateExpiry(value, 'insurance')"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row class="grid-gap-sm">
                <v-col cols="12" sm="6">
                  <v-text-field
                    density="compact"
                    v-model="currentInsuranceEntry.insuranceEndDate"
                    label="Insurance End Date (Auto-calculated)"
                    placeholder="Auto-calculated from start date"
                    type="date"
                    variant="outlined"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    density="compact"
                    v-model="currentInsuranceEntry.insuranceAgent"
                    label="Insurance Agent"
                    placeholder="Enter agent name and contact"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row class="grid-gap-sm">
                <v-col cols="12" sm="6">
                  <v-text-field
                    density="compact"
                    v-model="currentInsuranceEntry.insurancePhone"
                    label="Agent Phone"
                    placeholder="Enter agent phone number"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-textarea
                    density="compact"
                    v-model="currentInsuranceEntry.insuranceNotes"
                    label="Insurance Notes"
                    placeholder="Enter any additional insurance notes"
                    variant="outlined"
                    rows="2"
                    auto-grow
                  ></v-textarea>
                </v-col>
              </v-row>

              <v-row class="grid-gap-sm">
                <v-col cols="12" class="text-right">
                  <v-btn
                    color="primary"
                    prepend-icon="mdi-plus"
                    @click="addInsuranceEntry"
                    :disabled="!currentInsuranceEntry.insuranceType"
                    class="add-insurance-btn"
                  >
                    Add Insurance Entry
                  </v-btn>
                </v-col>
              </v-row>
            </div>

            <!-- Insurance Entries List -->
            <div v-if="vehicleForm.insuranceEntries.length > 0" class="insurance-entries-list mb-4">
              <div class="section-subtitle mb-3">
                <v-icon class="me-2" color="info">mdi-format-list-bulleted</v-icon>
                Added Insurance Entries
              </div>
              
              <v-card
                v-for="(entry, index) in vehicleForm.insuranceEntries"
                :key="index"
                class="insurance-entry-card mb-3"
                elevation="1"
              >
                <v-card-text class="pa-3">
                  <div class="d-flex align-center justify-space-between">
                    <div class="insurance-entry-header">
                      <v-chip
                        :color="getInsuranceTypeColor(entry.insuranceType)"
                        size="small"
                        variant="tonal"
                        class="me-2"
                      >
                        {{ insuranceTypeOptions.find(t => t.id === entry.insuranceType)?.name }}
                      </v-chip>
                      <span class="insurance-provider">{{ entry.insuranceProvider }}</span>
                    </div>
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      size="small"
                      color="error"
                      @click="removeInsuranceEntry(index)"
                    ></v-btn>
                  </div>
                  
                  <div class="insurance-entry-details mt-2">
                    <div class="detail-row">
                      <span class="detail-label">Policy:</span>
                      <span class="detail-value">{{ entry.insurancePolicyNumber }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Premium:</span>
                      <span class="detail-value">{{ entry.insurancePremium ? `${entry.insurancePremium.toLocaleString()} ETB` : 'Not specified' }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Coverage:</span>
                      <span class="detail-value">{{ entry.insuranceCoverage ? `${entry.insuranceCoverage.toLocaleString()} ETB` : 'Not specified' }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Period:</span>
                      <span class="detail-value">
                        {{ entry.insuranceStartDate ? formatDate(entry.insuranceStartDate) : 'Not specified' }} - 
                        {{ entry.insuranceEndDate ? formatDate(entry.insuranceEndDate) : 'Not specified' }}
                      </span>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </div>

            <!-- Insurance Requirements Notice -->
            <v-alert
              v-if="!hasRequiredInsurance"
              type="warning"
              variant="tonal"
              class="mb-4"
            >
              <div class="d-flex align-center">
                <v-icon class="me-2">mdi-alert-circle</v-icon>
                <span>Both Comprehensive and Third Party insurance are required to create a vehicle.</span>
              </div>
            </v-alert>

            <!-- Renewal Reminders -->
            <div v-if="hasRenewalReminders" class="renewal-reminders mb-4">
              <div class="section-subtitle mb-3">
                <v-icon class="me-2" color="warning">mdi-calendar-clock</v-icon>
                Renewal Reminders
              </div>
              
              <v-alert
                v-for="reminder in renewalReminders"
                :key="reminder.id"
                :type="reminder.severity"
                variant="tonal"
                class="mb-2"
              >
                <div class="d-flex align-center justify-space-between">
                  <div class="d-flex align-center">
                    <v-icon class="me-2">{{ reminder.icon }}</v-icon>
                    <span>{{ reminder.message }}</span>
                  </div>
                  <v-btn
                    size="small"
                    variant="text"
                    color="primary"
                    @click="reminder.action"
                  >
                    {{ reminder.actionText }}
                  </v-btn>
                </div>
              </v-alert>
            </div>

            <v-divider class="my-4"></v-divider>

            <!-- Safety Inspection -->
            <div class="form-section-title mb-3">
              <span class="section-icon-badge"><v-icon size="18" color="success">mdi-car-wrench</v-icon></span>
              Safety Inspection
            </div>
            <v-row class="grid-gap-sm">
              <v-col cols="12" sm="6">
                <v-select
                  density="compact"
                  v-model="vehicleForm.safetyInspectionStatus"
                  :items="safetyInspectionStatusOptions"
                  item-title="name"
                  item-value="id"
                  label="Safety Inspection Status"
                  placeholder="Select inspection status"
                  variant="outlined"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  density="compact"
                  v-model="vehicleForm.safetyInspectionNumber"
                  label="Inspection Certificate Number"
                  placeholder="Enter certificate number"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>

                          <v-row class="grid-gap-sm">
                <v-col cols="12" sm="6">
                  <v-text-field
                    density="compact"
                    v-model="vehicleForm.safetyInspectionDate"
                    label="Last Inspection Date"
                    placeholder="Select inspection date"
                    type="date"
                    variant="outlined"
                    @update:model-value="(value) => autoCalculateExpiry(value, 'safety')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    density="compact"
                    v-model="vehicleForm.safetyInspectionExpiry"
                    label="Inspection Expiry Date (Auto-calculated)"
                    placeholder="Auto-calculated from inspection date"
                    type="date"
                    variant="outlined"
                    readonly
                  ></v-text-field>
                </v-col>
              </v-row>

            <v-row class="grid-gap-sm">
              <v-col cols="12" sm="6">
                <v-text-field
                  density="compact"
                  v-model="vehicleForm.safetyInspectionCenter"
                  label="Inspection Center"
                  placeholder="Enter inspection center name"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  density="compact"
                  v-model="vehicleForm.safetyInspectionCost"
                  label="Inspection Cost (ETB)"
                  placeholder="Enter inspection cost"
                  type="number"
                  variant="outlined"
                  hide-spin-buttons
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="grid-gap-sm">
              <v-col cols="12">
                <v-textarea
                  density="compact"
                  v-model="vehicleForm.safetyInspectionNotes"
                  label="Inspection Notes"
                  placeholder="Enter any inspection findings or notes"
                  variant="outlined"
                  rows="2"
                  auto-grow
                ></v-textarea>
              </v-col>
            </v-row>

            <v-divider class="my-4"></v-divider>

            <!-- Road Fund -->
            <div class="form-section-title mb-3">
              <span class="section-icon-badge"><v-icon size="18" color="info">mdi-road</v-icon></span>
              Road Fund
            </div>
            <v-row class="grid-gap-sm">
              <v-col cols="12" sm="6">
                <v-select
                  density="compact"
                  v-model="vehicleForm.roadFundStatus"
                  :items="roadFundStatusOptions"
                  item-title="name"
                  item-value="id"
                  label="Road Fund Status"
                  placeholder="Select road fund status"
                  variant="outlined"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  density="compact"
                  v-model="vehicleForm.roadFundNumber"
                  label="Road Fund Number"
                  placeholder="Enter road fund number"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>

                          <v-row class="grid-gap-sm">
                <v-col cols="12" sm="6">
                  <v-text-field
                    density="compact"
                    v-model="vehicleForm.roadFundIssueDate"
                    label="Issue Date"
                    placeholder="Select issue date"
                    type="date"
                    variant="outlined"
                    @update:model-value="(value) => autoCalculateExpiry(value, 'road')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    density="compact"
                    v-model="vehicleForm.roadFundExpiryDate"
                    label="Expiry Date (Auto-calculated)"
                    placeholder="Auto-calculated from issue date"
                    type="date"
                    variant="outlined"
                    readonly
                  ></v-text-field>
                </v-col>
              </v-row>

            <v-row class="grid-gap-sm">
              <v-col cols="12" sm="6">
                <v-text-field
                  density="compact"
                  v-model="vehicleForm.roadFundAmount"
                  label="Road Fund Amount (ETB)"
                  placeholder="Enter road fund amount"
                  type="number"
                  variant="outlined"
                  hide-spin-buttons
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  density="compact"
                  v-model="vehicleForm.roadFundIssuingOffice"
                  label="Issuing Office"
                  placeholder="Enter issuing office"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="grid-gap-sm">
              <v-col cols="12">
                <v-textarea
                  density="compact"
                  v-model="vehicleForm.roadFundNotes"
                  label="Road Fund Notes"
                  placeholder="Enter any additional road fund notes"
                  variant="outlined"
                  rows="2"
                  auto-grow
                ></v-textarea>
              </v-col>
            </v-row>

            <v-divider class="my-4"></v-divider>

            <!-- Fuel Card -->
            <div class="form-section-title mb-3">
              <span class="section-icon-badge"><v-icon size="18" color="warning">mdi-credit-card</v-icon></span>
              Fuel Card
            </div>
            <v-row class="grid-gap-sm">
                  <v-col cols="12" md="6">
                <v-autocomplete
                  density="compact"
                  v-model="vehicleForm.cardId"
                  :items="cardList"
                  item-title="number"
                  item-value="id"
                  label="Fuel Card*"
                  placeholder="Select fuel card"
                  variant="outlined"
                  :rules="[(v) => !!v || 'Fuel card is required']"
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
                  label="Vehicle Status*"
                   variant="outlined"
                   :rules="[(v) => !!v || 'Vehicle status is required']"
                   required
                 ></v-select>
               </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="dialog-actions">
          <v-spacer></v-spacer>
          <v-btn variant="outlined" @click="showAddDialog = false">
            Cancel
          </v-btn>
          <v-btn 
            color="warning" 
            :loading="saving" 
            :disabled="!formValid"
            @click="saveVehicle"
            prepend-icon="mdi-content-save"
          >
            {{ editingVehicle ? "Update Vehicle" : "Add Vehicle" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- </v-form> -->
<!-- detail records dialog  -->
<v-dialog v-model="vehicleDetailDialog" max-width="1200px" persistent>
  <v-card class="dialog-card">
    <v-card-title class="dialog-title">
      <v-icon class="me-2" color="primary">mdi-truck</v-icon>
      Vehicle Details - {{ selectedVehicle?.plateNo }}
    </v-card-title>

    <v-card-text class="pa-0">
      <!-- Tabs -->
      <v-tabs
        v-model="activeTab"
        color="primary"
        grow
        class="vehicle-details-tabs"
      >
        <v-tab value="overview" class="vehicle-tab">
          <v-icon class="me-2">mdi-information</v-icon>
          Overview
        </v-tab>
        <v-tab value="fuel" class="vehicle-tab">
          <v-icon class="me-2">mdi-gas-station</v-icon>
          Fuel Records
        </v-tab>
        <v-tab value="maintenance" class="vehicle-tab">
          <v-icon class="me-2">mdi-wrench</v-icon>
          Maintenance
        </v-tab>
        <v-tab value="analytics" class="vehicle-tab">
          <v-icon class="me-2">mdi-chart-line</v-icon>
          Analytics
        </v-tab>
      </v-tabs>

      <v-window v-model="activeTab" class="vehicle-details-window">
        <!-- Overview Tab -->
        <v-window-item value="overview">
          <div class="overview-content pa-6">
      <v-row>
              <!-- Vehicle Information Card -->
        <v-col cols="12" md="6">
                <v-card class="info-card" elevation="0">
                  <v-card-title class="info-card-title">
                    <v-icon class="me-2" color="primary">mdi-car-info</v-icon>
                    Vehicle Information
                  </v-card-title>
                  <v-card-text>
                    <div class="info-grid">
                      <div class="info-item">
                        <div class="info-label">License Plate</div>
                        <div class="info-value">{{ selectedVehicle?.plateNo }}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Brand & Model</div>
                        <div class="info-value">{{ selectedVehicle?.vendor?.name }} {{ selectedVehicle?.model?.name }}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Year</div>
                        <div class="info-value">{{ selectedVehicle?.year }}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Current Mileage</div>
                        <div class="info-value">{{ selectedVehicle?.currentMileage?.toLocaleString() }} km</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Assigned Driver</div>
                        <div class="info-value">{{ usersList.find(x => x.id == selectedVehicle?.driver)?.name || 'Unassigned' }}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Status</div>
                        <div class="info-value">
                          <StatusBadge :status="getStatusDetails(selectedVehicle?.status)" />
                        </div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Service Status Card -->
              <v-col cols="12" md="6">
                <v-card class="info-card" elevation="0">
                  <v-card-title class="info-card-title">
                    <v-icon class="me-2" color="warning">mdi-wrench-clock</v-icon>
                    Service Status
                  </v-card-title>
                  <v-card-text>
                    <div class="service-status-content">
                      <div class="service-progress-section">
                        <div class="d-flex align-center justify-space-between mb-2">
                          <span class="service-label">Service Progress</span>
                          <span class="service-percentage">{{ getServiceProgress(selectedVehicle) }}%</span>
                        </div>
                        <v-progress-linear
                          :model-value="getServiceProgress(selectedVehicle)"
                          :color="getServiceColor(selectedVehicle)"
                          height="12"
                          rounded
                          class="service-progress"
                        ></v-progress-linear>
                        <div class="service-details mt-4">
                          <div class="service-detail-item">
                            <v-icon size="small" class="me-2">mdi-calendar</v-icon>
                            <span>Last Service: {{ formatDate(selectedVehicle?.lastServiceDate || '2025-01-01') }}</span>
                          </div>
                          <div class="service-detail-item">
                            <v-icon size="small" class="me-2">mdi-speedometer</v-icon>
                            <span>Service Interval: {{ selectedVehicle?.serviceInterval || 0 }} km</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Insurance Information Card -->
              <v-col cols="12" md="6">
                <v-card class="info-card" elevation="0">
                  <v-card-title class="info-card-title">
                    <v-icon class="me-2" color="info">mdi-shield-check</v-icon>
                    Insurance Information
                  </v-card-title>
                  <v-card-text>
                    <div v-if="selectedVehicle?.insuranceEntries && selectedVehicle.insuranceEntries.length > 0">
                      <div
                        v-for="(entry, index) in selectedVehicle.insuranceEntries"
                        :key="index"
                        class="insurance-entry-display mb-3"
                      >
                        <div class="insurance-entry-header-display">
                          <v-chip
                            :color="getInsuranceTypeColor(entry.insuranceType)"
                            size="small"
                            variant="tonal"
                            class="me-2"
                          >
                            {{ insuranceTypeOptions.find(t => t.id === entry.insuranceType)?.name }}
                          </v-chip>
                          <span class="insurance-provider-display">{{ entry.insuranceProvider }}</span>
                        </div>
                        
                        <div class="insurance-entry-details-display mt-2">
                          <div class="detail-row-display">
                            <span class="detail-label-display">Policy:</span>
                            <span class="detail-value-display">{{ entry.insurancePolicyNumber || 'Not specified' }}</span>
                          </div>
                          <div class="detail-row-display">
                            <span class="detail-label-display">Premium:</span>
                            <span class="detail-value-display">{{ entry.insurancePremium ? `${entry.insurancePremium.toLocaleString()} ETB` : 'Not specified' }}</span>
                          </div>
                          <div class="detail-row-display">
                            <span class="detail-label-display">Coverage:</span>
                            <span class="detail-value-display">{{ entry.insuranceCoverage ? `${entry.insuranceCoverage.toLocaleString()} ETB` : 'Not specified' }}</span>
                          </div>
                          <div class="detail-row-display">
                            <span class="detail-label-display">Period:</span>
                            <span class="detail-value-display">
                              {{ entry.insuranceStartDate ? formatDate(entry.insuranceStartDate) : 'Not specified' }} - 
                              {{ entry.insuranceEndDate ? formatDate(entry.insuranceEndDate) : 'Not specified' }}
                            </span>
                          </div>
                          <div v-if="entry.insuranceAgent" class="detail-row-display">
                            <span class="detail-label-display">Agent:</span>
                            <span class="detail-value-display">{{ entry.insuranceAgent }}</span>
                          </div>
                          <div v-if="entry.insurancePhone" class="detail-row-display">
                            <span class="detail-label-display">Phone:</span>
                            <span class="detail-value-display">{{ entry.insurancePhone }}</span>
                          </div>
                          <div v-if="entry.insuranceNotes" class="detail-row-display">
                            <span class="detail-label-display">Notes:</span>
                            <span class="detail-value-display">{{ entry.insuranceNotes }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else class="no-insurance-message">
                      <v-icon size="24" color="grey-lighten-1" class="mb-2">mdi-shield-off</v-icon>
                      <span class="text-muted">No insurance information available</span>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Safety Inspection Card -->
              <v-col cols="12" md="6">
                <v-card class="info-card" elevation="0">
                  <v-card-title class="info-card-title">
                    <v-icon class="me-2" color="success">mdi-car-wrench</v-icon>
                    Safety Inspection
                  </v-card-title>
                  <v-card-text>
                    <div class="info-grid">
                      <div class="info-item">
                        <div class="info-label">Status</div>
                        <div class="info-value">
                          <v-chip
                            :color="getSafetyInspectionStatusColor(selectedVehicle?.safetyInspectionStatus)"
                            size="small"
                            variant="tonal"
                          >
                            {{ safetyInspectionStatusOptions.find(s => s.id === selectedVehicle?.safetyInspectionStatus)?.name || 'Not specified' }}
                          </v-chip>
                        </div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Certificate Number</div>
                        <div class="info-value">{{ selectedVehicle?.safetyInspectionNumber || 'Not specified' }}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Last Inspection</div>
                        <div class="info-value">{{ selectedVehicle?.safetyInspectionDate ? formatDate(selectedVehicle.safetyInspectionDate) : 'Not specified' }}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Expiry Date</div>
                        <div class="info-value">{{ selectedVehicle?.safetyInspectionExpiry ? formatDate(selectedVehicle.safetyInspectionExpiry) : 'Not specified' }}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Inspection Center</div>
                        <div class="info-value">{{ selectedVehicle?.safetyInspectionCenter || 'Not specified' }}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Cost</div>
                        <div class="info-value">{{ selectedVehicle?.safetyInspectionCost ? `${selectedVehicle.safetyInspectionCost.toLocaleString()} ETB` : 'Not specified' }}</div>
                      </div>
                      <div v-if="selectedVehicle?.safetyInspectionNotes" class="info-item">
                        <div class="info-label">Notes</div>
                        <div class="info-value">{{ selectedVehicle.safetyInspectionNotes }}</div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Road Fund Card -->
              <v-col cols="12" md="6">
                <v-card class="info-card" elevation="0">
                  <v-card-title class="info-card-title">
                    <v-icon class="me-2" color="info">mdi-road</v-icon>
                    Road Fund
                  </v-card-title>
                  <v-card-text>
                    <div class="info-grid">
                      <div class="info-item">
                        <div class="info-label">Status</div>
                        <div class="info-value">
                          <v-chip
                            :color="getRoadFundStatusColor(selectedVehicle?.roadFundStatus)"
                            size="small"
                            variant="tonal"
                          >
                            {{ roadFundStatusOptions.find(s => s.id === selectedVehicle?.roadFundStatus)?.name || 'Not specified' }}
                          </v-chip>
                        </div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Road Fund Number</div>
                        <div class="info-value">{{ selectedVehicle?.roadFundNumber || 'Not specified' }}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Issue Date</div>
                        <div class="info-value">{{ selectedVehicle?.roadFundIssueDate ? formatDate(selectedVehicle.roadFundIssueDate) : 'Not specified' }}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Expiry Date</div>
                        <div class="info-value">{{ selectedVehicle?.roadFundExpiryDate ? formatDate(selectedVehicle.roadFundExpiryDate) : 'Not specified' }}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Amount</div>
                        <div class="info-value">{{ selectedVehicle?.roadFundAmount ? `${selectedVehicle.roadFundAmount.toLocaleString()} ETB` : 'Not specified' }}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Issuing Office</div>
                        <div class="info-value">{{ selectedVehicle?.roadFundIssuingOffice || 'Not specified' }}</div>
                      </div>
                      <div v-if="selectedVehicle?.roadFundNotes" class="info-item">
                        <div class="info-label">Notes</div>
                        <div class="info-value">{{ selectedVehicle.roadFundNotes }}</div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-window-item>

        <!-- Fuel Records Tab -->
        <v-window-item value="fuel">
          <div class="fuel-content pa-6">
            <div class="d-flex align-center justify-space-between mb-4">
              <h3 class="section-title">Fuel Records</h3>
              <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                @click="addMileageEntry(selectedVehicle)"
              >
                Add Fuel Record
              </v-btn>
            </div>
            
            <div v-if="selectedVehicle?.fuelRecord?.length" class="fuel-records-grid">
              <v-card
              v-for="(fuel, index) in selectedVehicle.fuelRecord"
              :key="'fuel-' + index"
                class="fuel-record-card"
                elevation="0"
              >
                <v-card-text class="fuel-record-content">
                  <div class="fuel-record-header">
                    <div class="fuel-record-date">
                      <v-icon class="me-2" color="primary">mdi-calendar</v-icon>
                      {{ formatDate(fuel.createdAt) }}
            </div>
                    <v-chip
                      :color="fuel.quantity > 50 ? 'success' : 'warning'"
                      size="small"
                      variant="tonal"
                    >
                      {{ fuel.quantity }}L
                    </v-chip>
          </div>
                  <div class="fuel-record-details">
                    <div class="fuel-detail-item">
                      <v-icon size="small" class="me-2">mdi-currency-usd</v-icon>
                      <span class="fuel-label">Amount:</span>
                      <span class="fuel-value">{{ fuel.amount?.toLocaleString() }} ETB</span>
                    </div>
                    <div class="fuel-detail-item">
                      <v-icon size="small" class="me-2">mdi-speedometer</v-icon>
                      <span class="fuel-label">Odometer:</span>
                      <span class="fuel-value">{{ fuel.odometerReading?.toLocaleString() }} km</span>
                    </div>
                    <div class="fuel-detail-item">
                      <v-icon size="small" class="me-2">mdi-gas-station</v-icon>
                      <span class="fuel-label">Station:</span>
                      <span class="fuel-value">{{ fuel.fuelStation || 'N/A' }}</span>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </div>
            <div v-else class="empty-state">
              <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-gas-station-off</v-icon>
              <h3 class="text-h6 text-muted mb-2">No fuel records</h3>
              <p class="text-muted">Add your first fuel record to get started</p>
            </div>
          </div>
        </v-window-item>

        <!-- Maintenance Records Tab -->
        <v-window-item value="maintenance">
          <div class="maintenance-content pa-6">
            <div class="d-flex align-center justify-space-between mb-4">
              <h3 class="section-title">Maintenance Records</h3>
              <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                @click="addMainEntry(selectedVehicle)"
              >
                Add Maintenance
              </v-btn>
            </div>
            
            <div v-if="selectedVehicle?.maintenanceRecord?.length" class="maintenance-records-grid">
              <v-card
              v-for="(maint, index) in selectedVehicle.maintenanceRecord"
              :key="'maint-' + index"
                class="maintenance-record-card"
                elevation="0"
              >
                <v-card-text class="maintenance-record-content">
                  <div class="maintenance-record-header">
                    <div class="maintenance-record-type">
                      <v-icon class="me-2" color="warning">mdi-wrench</v-icon>
                      {{ maint.serviceType }}
            </div>
                    <v-chip
                      color="primary"
                      size="small"
                      variant="tonal"
                    >
                      {{ maint.totalCost?.toLocaleString() }} ETB
                    </v-chip>
          </div>
                  <div class="maintenance-record-details">
                    <div class="maintenance-detail-item">
                      <v-icon size="small" class="me-2">mdi-calendar</v-icon>
                      <span class="maintenance-label">Serviced On:</span>
                      <span class="maintenance-value">{{ formatDate(maint.servicedOn) }}</span>
                    </div>
                    <div class="maintenance-detail-item">
                      <v-icon size="small" class="me-2">mdi-account</v-icon>
                      <span class="maintenance-label">Provider:</span>
                      <span class="maintenance-value">{{ maint.serviceProvider || 'N/A' }}</span>
                    </div>
                    <div v-if="maint.remark" class="maintenance-detail-item">
                      <v-icon size="small" class="me-2">mdi-note-text</v-icon>
                      <span class="maintenance-label">Remark:</span>
                      <span class="maintenance-value">{{ maint.remark }}</span>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </div>
            <div v-else class="empty-state">
              <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-wrench-off</v-icon>
              <h3 class="text-h6 text-muted mb-2">No maintenance records</h3>
              <p class="text-muted">Add your first maintenance record to get started</p>
            </div>
          </div>
        </v-window-item>

        <!-- Analytics Tab -->
        <v-window-item value="analytics">
          <div class="analytics-content pa-6">
            <h3 class="section-title mb-4">Vehicle Analytics</h3>
            <v-row>
              <v-col cols="12" md="4">
                <v-card class="analytics-card" elevation="0">
                  <v-card-text class="text-center">
                    <v-icon size="48" color="primary" class="mb-2">mdi-speedometer</v-icon>
                    <div class="analytics-value">{{ selectedVehicle?.currentMileage?.toLocaleString() || 0 }}</div>
                    <div class="analytics-label">Total Kilometers</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="4">
                <v-card class="analytics-card" elevation="0">
                  <v-card-text class="text-center">
                    <v-icon size="48" color="success" class="mb-2">mdi-gas-station</v-icon>
                    <div class="analytics-value">
                      {{ selectedVehicle?.fuelRecord?.reduce((sum, record) => sum + (record.quantity || 0), 0) || 0 }}L
                    </div>
                    <div class="analytics-label">Total Fuel Used</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="4">
                <v-card class="analytics-card" elevation="0">
                  <v-card-text class="text-center">
                    <v-icon size="48" color="warning" class="mb-2">mdi-wrench</v-icon>
                    <div class="analytics-value">{{ selectedVehicle?.maintenanceRecord?.length || 0 }}</div>
                    <div class="analytics-label">Maintenance Records</div>
                  </v-card-text>
                </v-card>
        </v-col>
      </v-row>
          </div>
        </v-window-item>
      </v-window>
    </v-card-text>

    <v-card-actions class="dialog-actions">
      <v-spacer></v-spacer>
      <v-btn
        variant="outlined"
        @click="vehicleDetailDialog = false"
      >
        Close
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

    <LazyAddFuel v-if="addFuelModal" :vehicle="currItem" @close="addFuelModal = false" @showSuccess="showSuccess"/>
    <LazyAddMaintenance v-if="addMainModal" :vehicle="currItem" @close="addMainModal = false" @showSuccess="showSuccess"/>

    <!-- Manual Renewal Dialog -->
    <v-dialog v-model="renewalDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="me-2" color="primary">mdi-calendar-clock</v-icon>
          {{ getRenewalDialogTitle() }}
        </v-card-title>
        
        <v-card-text>
          <div class="renewal-form">
            <v-row class="grid-gap-sm">
              <v-col cols="12" sm="6">
                <v-text-field
                  density="compact"
                  v-model="manualRenewalForm.startDate"
                  label="Renewal Start Date"
                  placeholder="Select start date"
                  type="date"
                  variant="outlined"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  density="compact"
                  v-model="manualRenewalForm.endDate"
                  label="Renewal End Date"
                  placeholder="Select end date (optional - auto-calculated)"
                  type="date"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
            
            <v-row class="grid-gap-sm">
              <v-col cols="12">
                <v-textarea
                  density="compact"
                  v-model="manualRenewalForm.notes"
                  label="Renewal Notes"
                  placeholder="Enter any additional notes about this renewal"
                  variant="outlined"
                  rows="3"
                  auto-grow
                ></v-textarea>
              </v-col>
            </v-row>
            
            <v-alert
              type="info"
              variant="tonal"
              class="mt-4"
            >
              <div class="d-flex align-center">
                <v-icon class="me-2">mdi-information</v-icon>
                <span>If no end date is provided, it will be automatically calculated as 12 months from the start date.</span>
              </div>
            </v-alert>
          </div>
        </v-card-text>
        
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="renewalDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="applyManualRenewal"
            :disabled="!manualRenewalForm.startDate"
            prepend-icon="mdi-check"
          >
            Apply Renewal
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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

// Insurance type options
const insuranceTypeOptions = [
  { id: 1, name: 'Comprehensive Insurance' },
  { id: 2, name: 'Third Party Liability' },
  { id: 3, name: 'Third Party Fire & Theft' },
  { id: 4, name: 'Commercial Vehicle Insurance' },
  { id: 5, name: 'Fleet Insurance' },
  { id: 6, name: 'Self Insurance' },
  { id: 7, name: 'Other' }
]

// Safety inspection status options
const safetyInspectionStatusOptions = [
  { id: 1, name: 'Valid' },
  { id: 2, name: 'Expired' },
  { id: 3, name: 'Pending' },
  { id: 4, name: 'Failed' },
  { id: 5, name: 'Under Review' }
]

// Road fund status options
const roadFundStatusOptions = [
  { id: 1, name: 'Valid' },
  { id: 2, name: 'Expired' },
  { id: 3, name: 'Pending' },
  { id: 4, name: 'Not Required' },
  { id: 5, name: 'Under Review' }
]
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
const selectedVehicle = ref<any>(null);
const editingVehicle = ref(null);
const addFuelModal = ref(false)
const addMainModal = ref(false)
const saving = ref(false);
const formValid = ref(false);
const activeTab = ref('overview'); // Add this for the new tabbed interface
// const vehicles = ref([]);
const vehicleForm = ref({
  plateNo: "",
  vendorId: null as any,
  modelId: null as any,
  cardId: null as any,
  year: "",
  driver: "",
  currentMileage: 0,
  serviceInterval: 0,
  type: 1,
  status: 1,
  // Insurance entries array
  insuranceEntries: [] as any[],
  // Safety inspection fields
  safetyInspectionStatus: null as any,
  safetyInspectionNumber: "",
  safetyInspectionDate: "",
  safetyInspectionExpiry: "",
  safetyInspectionCenter: "",
  safetyInspectionCost: "",
  safetyInspectionNotes: "",
  // Road fund fields
  roadFundStatus: null as any,
  roadFundNumber: "",
  roadFundIssueDate: "",
  roadFundExpiryDate: "",
  roadFundAmount: "",
  roadFundIssuingOffice: "",
  roadFundNotes: ""
});

// Current insurance entry for the form
const currentInsuranceEntry = ref({
  insuranceType: null as any,
  insuranceProvider: "",
  insurancePolicyNumber: "",
  insurancePremium: "",
  insuranceCoverage: "",
  insuranceStartDate: "",
  insuranceEndDate: "",
  insuranceAgent: "",
  insurancePhone: "",
  insuranceNotes: ""
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
const getServiceProgress = (vehicle: any) => {
  const progress =
    ((vehicle.currentMileage - vehicle.lastServiceMileage) /
      vehicle.serviceInterval) *
    100;
  return Math.min(progress, 100);
};

const getServiceColor = (vehicle: any) => {
  const progress = getServiceProgress(vehicle);
  if (progress >= 100) return "error";
  if (progress >= 80) return "warning";
  return "success";
};

const formatDate = (dateString: string | Date) => {
  return new Date(dateString).toLocaleDateString();
};

const addMainEntry = (vehicle: any) => {
  // Navigate to vehicle details page
  currItem.value = vehicle 
  addMainModal.value = true 
  console.log("View vehicle details:", vehicle);
};

const editVehicle = (vehicle: any) => {
  editingVehicle.value = vehicle;
  vehicleForm.value = { ...vehicle };
  showAddDialog.value = true;
  console.log("Editing vehicle:", vehicle);
};

const addMileageEntry = (vehicle: any) => {
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

const onBrandChange = async (item: any) => {
  await getByVendor(item)
};

const getStatusDetails = (status: Number) => {
  return statusMap.find(v => v.id == status)
}

const getSafetyInspectionStatusColor = (status: number) => {
  const colors: { [key: number]: string } = {
    1: 'success', // Valid
    2: 'error',   // Expired
    3: 'warning', // Pending
    4: 'error',   // Failed
    5: 'info'     // Under Review
  }
  return colors[status] || 'default'
}

const getRoadFundStatusColor = (status: number) => {
  const colors: { [key: number]: string } = {
    1: 'success', // Valid
    2: 'error',   // Expired
    3: 'warning', // Pending
    4: 'info',    // Not Required
    5: 'info'     // Under Review
  }
  return colors[status] || 'default'
}

// Insurance workflow functions
const addInsuranceEntry = () => {
  if (!currentInsuranceEntry.value.insuranceType) return
  
  // Check if this insurance type is already added
  const existingEntry = vehicleForm.value.insuranceEntries.find(
    entry => entry.insuranceType === currentInsuranceEntry.value.insuranceType
  )
  
  if (existingEntry) {
    showErrorMessage('This insurance type has already been added. Please select a different type.')
    return
  }
  
  // Add the entry to the list
  vehicleForm.value.insuranceEntries.push({
    ...currentInsuranceEntry.value,
    id: Date.now() // Temporary ID for tracking
  })
  
  // Clear the form
  clearInsuranceEntry()
}

const removeInsuranceEntry = (index: number) => {
  vehicleForm.value.insuranceEntries.splice(index, 1)
}

const clearInsuranceEntry = () => {
  currentInsuranceEntry.value = {
    insuranceType: null as any,
    insuranceProvider: "",
    insurancePolicyNumber: "",
    insurancePremium: "",
    insuranceCoverage: "",
    insuranceStartDate: "",
    insuranceEndDate: "",
    insuranceAgent: "",
    insurancePhone: "",
    insuranceNotes: ""
  }
}

const getInsuranceTypeColor = (type: number) => {
  const colors: { [key: number]: string } = {
    1: 'primary',   // Comprehensive Insurance
    2: 'secondary', // Third Party Liability
    3: 'warning',   // Third Party Fire & Theft
    4: 'info',      // Commercial Vehicle Insurance
    5: 'success',   // Fleet Insurance
    6: 'error',     // Self Insurance
    7: 'default'    // Other
  }
  return colors[type] || 'default'
}

// Manual renewal dialog variables
const renewalDialog = ref(false)
const selectedRenewalType = ref<'insurance' | 'safety' | 'road' | null>(null)
const selectedRenewalIndex = ref<number | null>(null)
const manualRenewalForm = ref({
  startDate: '',
  endDate: '',
  notes: ''
})

// Reset manual renewal form
const resetManualRenewalForm = () => {
  manualRenewalForm.value = {
    startDate: '',
    endDate: '',
    notes: ''
  }
}

// Apply manual renewal
const applyManualRenewal = () => {
  if (!selectedRenewalType.value || !manualRenewalForm.value.startDate) {
    return
  }

  const startDate = manualRenewalForm.value.startDate
  const endDate = manualRenewalForm.value.endDate || calculateExpiryDate(startDate, 12)

  switch (selectedRenewalType.value) {
    case 'insurance':
      if (selectedRenewalIndex.value !== null) {
        const entry = vehicleForm.value.insuranceEntries[selectedRenewalIndex.value]
        vehicleForm.value.insuranceEntries[selectedRenewalIndex.value] = {
          ...entry,
          insuranceStartDate: startDate,
          insuranceEndDate: endDate,
          insuranceNotes: manualRenewalForm.value.notes || entry.insuranceNotes
        }
        showSuccessMessage('Insurance renewed successfully')
      }
      break
    case 'safety':
      vehicleForm.value.safetyInspectionDate = startDate
      vehicleForm.value.safetyInspectionExpiry = endDate
      vehicleForm.value.safetyInspectionStatus = 1 // Valid
      vehicleForm.value.safetyInspectionNotes = manualRenewalForm.value.notes || vehicleForm.value.safetyInspectionNotes
      showSuccessMessage('Safety inspection renewed successfully')
      break
    case 'road':
      vehicleForm.value.roadFundIssueDate = startDate
      vehicleForm.value.roadFundExpiryDate = endDate
      vehicleForm.value.roadFundStatus = 1 // Valid
      vehicleForm.value.roadFundNotes = manualRenewalForm.value.notes || vehicleForm.value.roadFundNotes
      showSuccessMessage('Road fund renewed successfully')
      break
  }

  // Close dialog and reset form
  renewalDialog.value = false
  resetManualRenewalForm()
  selectedRenewalType.value = null
  selectedRenewalIndex.value = null
}

// Get renewal dialog title
const getRenewalDialogTitle = () => {
  switch (selectedRenewalType.value) {
    case 'insurance':
      if (selectedRenewalIndex.value !== null) {
        const entry = vehicleForm.value.insuranceEntries[selectedRenewalIndex.value]
        const insuranceType = insuranceTypeOptions.find(t => t.id === entry.insuranceType)?.name
        return `Renew ${insuranceType}`
      }
      return 'Renew Insurance'
    case 'safety':
      return 'Renew Safety Inspection'
    case 'road':
      return 'Renew Road Fund'
    default:
      return 'Renew Document'
  }
}

// Computed property to check if required insurance types are present
const hasRequiredInsurance = computed(() => {
  const hasComprehensive = vehicleForm.value.insuranceEntries.some(
    entry => entry.insuranceType === 1 // Comprehensive Insurance
  )
  const hasThirdParty = vehicleForm.value.insuranceEntries.some(
    entry => entry.insuranceType === 2 // Third Party Liability
  )
  return hasComprehensive && hasThirdParty
})

// Renewal logic functions
const calculateExpiryDate = (startDate: string, durationMonths: number = 12) => {
  if (!startDate) return null
  const start = new Date(startDate)
  const expiry = new Date(start)
  expiry.setMonth(expiry.getMonth() + durationMonths)
  return expiry.toISOString().split('T')[0]
}

const getDaysUntilExpiry = (expiryDate: string) => {
  if (!expiryDate) return null
  const expiry = new Date(expiryDate)
  const today = new Date()
  const diffTime = expiry.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const getExpiryStatus = (expiryDate: string) => {
  const daysUntilExpiry = getDaysUntilExpiry(expiryDate)
  if (daysUntilExpiry === null) return 'unknown'
  if (daysUntilExpiry < 0) return 'expired'
  if (daysUntilExpiry <= 30) return 'critical'
  if (daysUntilExpiry <= 90) return 'warning'
  return 'valid'
}

const getExpirySeverity = (status: string) => {
  const severityMap: { [key: string]: string } = {
    'expired': 'error',
    'critical': 'error',
    'warning': 'warning',
    'valid': 'success',
    'unknown': 'info'
  }
  return severityMap[status] || 'info'
}

// Auto-calculate expiry dates when start dates are entered
const autoCalculateExpiry = (startDate: string, type: 'insurance' | 'safety' | 'road') => {
  if (!startDate) return
  
  const expiryDate = calculateExpiryDate(startDate, 12) // 12 months for annual renewal
  
  switch (type) {
    case 'insurance':
      currentInsuranceEntry.value.insuranceEndDate = expiryDate
      break
    case 'safety':
      vehicleForm.value.safetyInspectionExpiry = expiryDate
      break
    case 'road':
      vehicleForm.value.roadFundExpiryDate = expiryDate
      break
  }
}

// Renewal reminders
const renewalReminders = computed(() => {
  const reminders: any[] = []
  
  // Check insurance entries
  vehicleForm.value.insuranceEntries.forEach((entry, index) => {
    if (entry.insuranceEndDate) {
      const status = getExpiryStatus(entry.insuranceEndDate)
      const daysUntilExpiry = getDaysUntilExpiry(entry.insuranceEndDate)
      
      if (status === 'expired') {
        reminders.push({
          id: `insurance-expired-${index}`,
          severity: 'error',
          icon: 'mdi-shield-alert',
          message: `${insuranceTypeOptions.find(t => t.id === entry.insuranceType)?.name} expired ${Math.abs(daysUntilExpiry)} days ago`,
          actionText: 'Update Renewal',
          action: () => renewInsuranceEntry(index)
        })
      } else if (status === 'critical') {
        reminders.push({
          id: `insurance-critical-${index}`,
          severity: 'error',
          icon: 'mdi-shield-alert',
          message: `${insuranceTypeOptions.find(t => t.id === entry.insuranceType)?.name} expires in ${daysUntilExpiry} days`,
          actionText: 'Update Renewal',
          action: () => renewInsuranceEntry(index)
        })
      } else if (status === 'warning') {
        reminders.push({
          id: `insurance-warning-${index}`,
          severity: 'warning',
          icon: 'mdi-shield-clock',
          message: `${insuranceTypeOptions.find(t => t.id === entry.insuranceType)?.name} expires in ${daysUntilExpiry} days`,
          actionText: 'Plan Renewal',
          action: () => planRenewal('insurance', index)
        })
      }
    }
  })
  
  // Check safety inspection
  if (vehicleForm.value.safetyInspectionExpiry) {
    const status = getExpiryStatus(vehicleForm.value.safetyInspectionExpiry)
    const daysUntilExpiry = getDaysUntilExpiry(vehicleForm.value.safetyInspectionExpiry)
    
          if (status === 'expired') {
        reminders.push({
          id: 'safety-expired',
          severity: 'error',
          icon: 'mdi-car-wrench-alert',
          message: `Safety inspection expired ${Math.abs(daysUntilExpiry)} days ago`,
          actionText: 'Update Renewal',
          action: () => renewSafetyInspection()
        })
      } else if (status === 'critical') {
        reminders.push({
          id: 'safety-critical',
          severity: 'error',
          icon: 'mdi-car-wrench-alert',
          message: `Safety inspection expires in ${daysUntilExpiry} days`,
          actionText: 'Update Renewal',
          action: () => renewSafetyInspection()
        })
    } else if (status === 'warning') {
      reminders.push({
        id: 'safety-warning',
        severity: 'warning',
        icon: 'mdi-car-wrench-clock',
        message: `Safety inspection expires in ${daysUntilExpiry} days`,
        actionText: 'Plan Inspection',
        action: () => planRenewal('safety')
      })
    }
  }
  
  // Check road fund
  if (vehicleForm.value.roadFundExpiryDate) {
    const status = getExpiryStatus(vehicleForm.value.roadFundExpiryDate)
    const daysUntilExpiry = getDaysUntilExpiry(vehicleForm.value.roadFundExpiryDate)
    
          if (status === 'expired') {
        reminders.push({
          id: 'road-expired',
          severity: 'error',
          icon: 'mdi-road-alert',
          message: `Road fund expired ${Math.abs(daysUntilExpiry)} days ago`,
          actionText: 'Update Renewal',
          action: () => renewRoadFund()
        })
      } else if (status === 'critical') {
        reminders.push({
          id: 'road-critical',
          severity: 'error',
          icon: 'mdi-road-alert',
          message: `Road fund expires in ${daysUntilExpiry} days`,
          actionText: 'Update Renewal',
          action: () => renewRoadFund()
        })
    } else if (status === 'warning') {
      reminders.push({
        id: 'road-warning',
        severity: 'warning',
        icon: 'mdi-road-clock',
        message: `Road fund expires in ${daysUntilExpiry} days`,
        actionText: 'Plan Renewal',
        action: () => planRenewal('road')
      })
    }
  }
  
  return reminders
})

const hasRenewalReminders = computed(() => renewalReminders.value.length > 0)

// Renewal action functions
// Renewal action functions - Manual update mode
const renewInsuranceEntry = (index: number) => {
  // Open manual update dialog for insurance
  selectedRenewalType.value = 'insurance'
  selectedRenewalIndex.value = index
  renewalDialog.value = true
}

const renewSafetyInspection = () => {
  // Open manual update dialog for safety inspection
  selectedRenewalType.value = 'safety'
  selectedRenewalIndex.value = null
  renewalDialog.value = true
}

const renewRoadFund = () => {
  // Open manual update dialog for road fund
  selectedRenewalType.value = 'road'
  selectedRenewalIndex.value = null
  renewalDialog.value = true
}

const planRenewal = (type: string, index?: number) => {
  let message = ''
  switch (type) {
    case 'insurance':
      message = `Planning renewal for ${insuranceTypeOptions.find(t => t.id === vehicleForm.value.insuranceEntries[index!].insuranceType)?.name}`
      break
    case 'safety':
      message = 'Planning safety inspection renewal'
      break
    case 'road':
      message = 'Planning road fund renewal'
      break
  }
  showSuccessMessage(message)
}
const resetVehicleForm = () => {
  vehicleForm.value = {
    plateNo: "",
    vendorId: null as any,
    modelId: null as any,
    cardId: null as any,
    year: "",
    driver: "",
    currentMileage: 0,
    serviceInterval: 0,
    type: 1,
    status: 1,
    // Insurance entries array
    insuranceEntries: [] as any[],
    // Safety inspection fields
    safetyInspectionStatus: null as any,
    safetyInspectionNumber: "",
    safetyInspectionDate: "",
    safetyInspectionExpiry: "",
    safetyInspectionCenter: "",
    safetyInspectionCost: "",
    safetyInspectionNotes: "",
    // Road fund fields
    roadFundStatus: null as any,
    roadFundNumber: "",
    roadFundIssueDate: "",
    roadFundExpiryDate: "",
    roadFundAmount: "",
    roadFundIssuingOffice: "",
    roadFundNotes: ""
  };
  clearInsuranceEntry();
  editingVehicle.value = null;
};
// async function loadVehicles() {
//   vehicles.value = await getVehicles()
// }

// When clicking Detail
async function vehicleDetail(vehicle: any) {
  try {
    const detail = getVehicleById(vehicle.id)
    selectedVehicle.value = detail || null
    activeTab.value = 'overview' // Reset to overview tab
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
  padding: 16px 24px;
  border-top: 1px solid #f0f1f3;
  background: linear-gradient(135deg, #f8fafb 0%, #f1f3f4 100%);
}

.vehicle-btn {
  font-weight: 500;
  border-radius: 8px;
  text-transform: none;
  min-width: 100px;
}

/* Vehicle Details Dialog Styles - Simple and Modern */
.vehicle-details-tabs {
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.vehicle-tab {
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
}

.vehicle-details-window {
  min-height: 500px;
}

.overview-content,
.fuel-content,
.maintenance-content,
.analytics-content {
  background: white;
  min-height: 500px;
}

.info-card {
  border-radius: 12px;
  background: white;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.info-card-title {
  font-weight: 600;
  color: #1a1a1a;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 12px;
}

.info-grid {
  display: grid;
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 500;
  color: #666;
  font-size: 0.9rem;
}

.info-value {
  font-weight: 600;
  color: #1a1a1a;
  text-align: right;
}

.service-status-content {
  padding: 8px 0;
}

.service-progress-section {
  margin-bottom: 16px;
}

.service-label {
  font-weight: 600;
  color: #1a1a1a;
}

.service-percentage {
  font-weight: 700;
  color: #1976d2;
  font-size: 1.1rem;
}

.service-progress {
  border-radius: 8px;
}

.service-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.service-detail-item {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 0.9rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.fuel-records-grid,
.maintenance-records-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.fuel-record-card,
.maintenance-record-card {
  border-radius: 12px;
  background: white;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.fuel-record-card:hover,
.maintenance-record-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.fuel-record-content,
.maintenance-record-content {
  padding: 16px;
}

.fuel-record-header,
.maintenance-record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.fuel-record-date,
.maintenance-record-type {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #1a1a1a;
}

.fuel-record-details,
.maintenance-record-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.fuel-detail-item,
.maintenance-detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.fuel-label,
.maintenance-label {
  font-weight: 500;
  color: #666;
  min-width: 80px;
}

.fuel-value,
.maintenance-value {
  font-weight: 600;
  color: #1a1a1a;
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: #666;
}

.analytics-card {
  border-radius: 12px;
  background: white;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  text-align: center;
}

.analytics-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.analytics-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 8px 0;
}

.analytics-label {
  font-weight: 500;
  color: #666;
  font-size: 0.9rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .fuel-records-grid,
  .maintenance-records-grid {
    grid-template-columns: 1fr;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .info-value {
    text-align: left;
  }
}

/* Dialog styles to match other dialogs */
.dialog-card {
  border-radius: 24px;
  overflow: hidden;
}

.dialog-title {
  background: white;
  color: #040707;
  font-size: 1.375rem;
  font-weight: 700;
  padding: 28px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.dialog-subtitle {
  color: #6b7280;
  font-size: 0.95rem;
  margin-top: -8px;
}

.form-section-title {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #1a1a1a;
}

.section-icon {
  background: rgba(25, 118, 210, 0.08);
  border-radius: 8px;
  padding: 4px;
}

.grid-gap-sm > .v-col {
  padding-top: 8px !important;
  padding-bottom: 8px !important;
}

.dialog-actions {
  padding: 28px;
  background: white;
}

.title-icon-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 193, 7, 0.15);
  border-radius: 10px;
  padding: 6px;
  margin-right: 8px;
}

.section-icon-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 193, 7, 0.12);
  border-radius: 8px;
  padding: 4px;
  margin-right: 8px;
}

/* Insurance workflow styles */
.insurance-entry-form {
  background: rgba(248, 250, 252, 0.5);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(226, 232, 240, 0.5);
}

.section-subtitle {
  font-weight: 600;
  color: #475569;
  font-size: 0.95rem;
}

.insurance-entry-card {
  border-radius: 8px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.2s ease;
}

.insurance-entry-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.insurance-entry-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.insurance-provider {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.9rem;
}

.insurance-entry-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}

.detail-label {
  font-weight: 500;
  color: #64748b;
  min-width: 80px;
}

.detail-value {
  font-weight: 600;
  color: #1e293b;
  text-align: right;
}

.add-insurance-btn {
  font-weight: 600;
  border-radius: 8px;
}

/* Insurance display styles for vehicle details */
.insurance-entry-display {
  padding: 12px;
  border: 1px solid rgba(226, 232, 240, 0.6);
  border-radius: 8px;
  background: rgba(248, 250, 252, 0.3);
}

.insurance-entry-header-display {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.insurance-provider-display {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.9rem;
}

.insurance-entry-details-display {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-row-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}

.detail-label-display {
  font-weight: 500;
  color: #64748b;
  min-width: 80px;
}

.detail-value-display {
  font-weight: 600;
  color: #1e293b;
  text-align: right;
}

.no-insurance-message {
  text-align: center;
  padding: 24px;
  color: #64748b;
}

/* Renewal reminder styles */
.renewal-reminders {
  background: rgba(255, 248, 220, 0.3);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(251, 191, 36, 0.2);
}

.renewal-reminders .v-alert {
  margin-bottom: 8px;
  border-radius: 8px;
}

.renewal-reminders .v-alert:last-child {
  margin-bottom: 0;
}

/* Auto-calculated field styles */
.v-text-field[readonly] {
  background: rgba(248, 250, 252, 0.8);
}

.v-text-field[readonly] .v-field__input {
  color: #64748b;
  font-style: italic;
}

/* Expiry status indicators */
.expiry-status-expired {
  color: #ef4444;
  font-weight: 600;
}

.expiry-status-critical {
  color: #f59e0b;
  font-weight: 600;
}

.expiry-status-warning {
  color: #f59e0b;
  font-weight: 500;
}

.expiry-status-valid {
  color: #10b981;
  font-weight: 500;
}

/* Manual renewal dialog styles */
.renewal-form {
  padding: 8px 0;
}

.renewal-form .v-text-field {
  margin-bottom: 8px;
}

.renewal-form .v-textarea {
  margin-bottom: 8px;
}
</style>
