<template>
  <div class="renewals-root">
    <div class="renewals-header">
      <h1 class="renewals-title">Vehicle Renewals Management</h1>
      <p class="renewals-subtitle">
        Manage insurance, safety inspection, and road fund renewals for your
        fleet
      </p>
    </div>

    <!-- Action Bar -->
    <div class="renewals-actions mb-6">
      <v-row align="center">
        <v-col cols="12" md="4">
          <v-text-field
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            placeholder="Search vehicles by license plate..."
            variant="outlined"
            density="compact"
            hide-details
            class="renewals-search"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4" class="text-center">
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            class="renewals-btn"
            @click="showRenewalDialog = true"
          >
            New Renewal
          </v-btn>
        </v-col>
        <v-col cols="12" md="4" class="text-md-right">
          <v-btn
            color="success"
            prepend-icon="mdi-refresh"
            class="renewals-btn"
            @click="refreshRenewals"
          >
            Refresh
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <!-- Renewal Overview Cards -->
    <div class="renewal-overview mb-6">
      <v-row>
        <v-col cols="12" md="3">
          <v-card
            class="overview-card insurance-card"
            :class="{ 'selected-filter': selectedRenewalType === 'insurance' }"
            @click="filterByType('insurance')"
          >
            <v-card-text class="text-center">
              <v-icon size="48" color="info" class="mb-3"
                >mdi-shield-check</v-icon
              >
              <h3 class="text-h4 font-weight-bold">
                {{ insuranceRepList.insuranceRenewals }}
              </h3>
              <p class="text-muted">Insurance Renewals</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card
            class="overview-card safety-card"
            :class="{ 'selected-filter': selectedRenewalType === 'safety' }"
            @click="filterByType('safety')"
          >
            <v-card-text class="text-center">
              <v-icon size="48" color="success" class="mb-3"
                >mdi-car-wrench</v-icon
              >
              <h3 class="text-h4 font-weight-bold">
                {{ insuranceRepList.safteyInspections }}
              </h3>
              <p class="text-muted">Safety Inspections</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card
            class="overview-card road-card"
            :class="{ 'selected-filter': selectedRenewalType === 'road' }"
            @click="filterByType('road')"
          >
            <v-card-text class="text-center">
              <v-icon size="48" color="warning" class="mb-3">mdi-road</v-icon>
              <h3 class="text-h4 font-weight-bold">
                {{ insuranceRepList.roadFundRenewals }}
              </h3>
              <p class="text-muted">Road Fund Renewals</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card
            class="overview-card urgent-card"
            :class="{ 'selected-filter': selectedRenewalType === 'urgent' }"
            @click="filterByType('urgent')"
          >
            <v-card-text class="text-center">
              <v-icon size="48" color="error" class="mb-3">mdi-alert</v-icon>
              <h3 class="text-h4 font-weight-bold">
                {{ getUrgentRenewals(insuranceRepList.vehicleInsurances) }}
              </h3>
              <p class="text-muted">Urgent Renewals</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Filter Controls -->
      <v-row class="mt-4">
        <v-col cols="12" class="text-center">
          <v-chip-group v-model="selectedRenewalType" mandatory>
            <v-chip value="0" variant="outlined" @click="clearFilter">
              All Renewals
            </v-chip>
            <v-chip value="1" variant="outlined" color="info">
              Insurance
            </v-chip>
            <v-chip value="2" variant="outlined" color="success">
              Safety
            </v-chip>
            <v-chip value="3" variant="outlined" color="warning">
              Road Fund
            </v-chip>
            <v-chip value="4" variant="outlined" color="error">
              Third Party
            </v-chip>
          </v-chip-group>
        </v-col>
      </v-row>
    </div>

    <!-- Renewal Statistics -->
    <div class="renewal-stats mb-6">
      <v-row>
        <v-col cols="12" md="3">
          <v-card class="stat-card">
            <v-card-text class="text-center">
              <div class="stat-number">{{ renewalRep.totalRenewals }}</div>
              <div class="stat-label">Total Renewals</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card class="stat-card">
            <v-card-text class="text-center">
              <div class="stat-number text-warning">
                {{ renewalRep.expiringThisMonth }}
              </div>
              <div class="stat-label">Expiring This Month</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card class="stat-card">
            <v-card-text class="text-center">
              <div class="stat-number text-error">{{ renewalRep.overdue }}</div>
              <div class="stat-label">Overdue</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card class="stat-card">
            <v-card-text class="text-center">
              <div class="stat-number text-success">
                {{ renewalRep.recentlyRenewed }}
              </div>
              <div class="stat-label">Recently Renewed</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Renewals Table -->
    <v-card class="renewals-table-card">
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-icon class="me-2" color="primary">mdi-calendar-clock</v-icon>
          Renewals Due
        </div>
        <v-chip color="primary" size="small"
          >{{ overDues.length }} items</v-chip
        >
      </v-card-title>

      <v-card-text class="pa-0">
        <v-data-table
          :headers="renewalHeaders"
          :items="overDues"
          :loading="loading"
          class="renewals-table"
          density="comfortable"
        >
          <template v-slot:item.vehicle="{ item }">
            <div class="d-flex align-center">
              <div>
                <div class="font-weight-medium">{{ item.vehicleData.plateNo }}</div>
              </div>
            </div>
          </template>

          <template v-slot:item.type="{ item }">
            <v-chip
              :color="getRenewalTypeColor(item.type)"
              size="small"
              variant="tonal"
            >
              <v-icon size="small" class="me-1">{{
                getRenewalTypeIcon(item.type)
              }}</v-icon>
              {{ getRenewalTypeLabel(item.type) }}
            </v-chip>
          </template>

          <template v-slot:item.expiryDate="{ item }">
            <div class="d-flex align-center">
              {{ moment(item.endDate).format('ll') }}
            </div>
          </template>

          <template v-slot:item.daysUntilExpiry="{ item }">
            <v-chip
              :color="getExpiryStatusColor(item.daysUntilExpiry)"
              size="small"
              variant="flat"
            >
              {{ moment(item.endDate).diff(moment(), 'days') }} Days
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="d-flex gap-2">
              <v-btn
                size="small"
                variant="outlined"
                color="primary"
                @click="renewItem(item)"
              >
                Renew
              </v-btn>
              <v-btn
                size="small"
                variant="text"
                color="info"
                @click="viewDetails(item)"
              >
                Details
              </v-btn>
              <v-btn
                size="small"
                variant="text"
                color="warning"
                @click="editRenewal(item)"
              >
                Edit
              </v-btn>
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn
                    size="small"
                    variant="text"
                    color="secondary"
                    v-bind="props"
                    icon="mdi-dots-vertical"
                  ></v-btn>
                </template>
                <v-list>
                  <v-list-item @click="quickRenew(item)">
                    <v-list-item-title>
                      <v-icon class="me-2" size="small"
                        >mdi-lightning-bolt</v-icon
                      >
                      Quick Renew
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="markAsRenewed(item)">
                    <v-list-item-title>
                      <v-icon class="me-2" size="small">mdi-check</v-icon>
                      Mark as Renewed
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Success/Error Messages -->
    <v-snackbar v-model="showSuccessSnackbar" color="success" timeout="3000">
      {{ successMessage }}
    </v-snackbar>

    <v-snackbar v-model="showErrorSnackbar" color="error" timeout="3000">
      {{ errorMessage }}
    </v-snackbar>

    <!-- Renewal Dialog -->
    <RenewalDialog
      v-model="showRenewalDialog"
      :renewal-item="selectedRenewalItem"
      :is-edit="isEditingRenewal"
      @saved="onRenewalSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import moment from "moment";
// Composables
const {
  vehicleList,
  loading,
  getVehicles,
  getInsuranceReport,
  insuranceRepList,
  insuranceTypes,
} = useVehicles();
const { vendorList, getVendor } = useVendor();
const { modelList, getModel } = useModel();

// Reactive data
const overDues = ref([]);
const searchQuery = ref("");
const successMessage = ref("");
const showSuccessSnackbar = ref(false);
const errorMessage = ref("");
const showErrorSnackbar = ref(false);
const showRenewalDialog = ref(false);
const selectedRenewalItem = ref(null);
const isEditingRenewal = ref(false);
const selectedRenewalType = ref("0");

// Table headers
const renewalHeaders = [
  { title: "Vehicle", key: "vehicle", sortable: false },
  { title: "Type", key: "type", sortable: true },
  { title: "Expiry Date", key: "expiryDate", sortable: true },
  { title: "Days Left", key: "daysUntilExpiry", sortable: true },
  // { title: "Actions", key: "actions", sortable: false },
];

const renewalRep = ref({
  totalRenewals: 0,
  expiringThisMonth: 0,
  overdue: 0,
  recentlyRenewed: 0,
});

// Insurance type options
const insuranceTypeOptions = [
  { id: 1, name: "Comprehensive Insurance" },
  { id: 2, name: "Third Party Liability" },
  { id: 3, name: "Third Party Fire & Theft" },
];

// Computed properties
const allRenewals = computed(() => {
  const renewals = [];

  vehicleList.value.forEach((vehicle) => {
    // Insurance renewals
    if (vehicle.insuranceEntries) {
      vehicle.insuranceEntries.forEach((entry, index) => {
        if (entry.insuranceEndDate) {
          const daysUntilExpiry = getDaysUntilExpiry(entry.insuranceEndDate);
          renewals.push({
            id: `insurance-${vehicle.id}-${index}`,
            vehicle,
            type: "insurance",
            insuranceType: insuranceTypeOptions.find(
              (t) => t.id === entry.insuranceType
            )?.name,
            provider: entry.insuranceProvider,
            expiryDate: entry.insuranceEndDate,
            daysUntilExpiry,
            entryIndex: index,
          });
        }
      });
    }

    // Safety inspection renewal
    if (vehicle.safetyInspectionExpiry) {
      const daysUntilExpiry = getDaysUntilExpiry(
        vehicle.safetyInspectionExpiry
      );
      renewals.push({
        id: `safety-${vehicle.id}`,
        vehicle,
        type: "safety",
        expiryDate: vehicle.safetyInspectionExpiry,
        daysUntilExpiry,
      });
    }

    // Road fund renewal
    if (vehicle.roadFundExpiryDate) {
      const daysUntilExpiry = getDaysUntilExpiry(vehicle.roadFundExpiryDate);
      renewals.push({
        id: `road-${vehicle.id}`,
        vehicle,
        type: "road",
        expiryDate: vehicle.roadFundExpiryDate,
        daysUntilExpiry,
      });
    }
  });

  return renewals.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
});

const filteredRenewals = computed(() => {
  let filtered = allRenewals.value;

  // Search filter
  if (searchQuery.value) {
    filtered = filtered.filter((item) =>
      item.vehicle.plateNo
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase())
    );
  }

  console.log("selectedRenewalType", selectedRenewalType.value);

  setRenewalReps(selectedRenewalType.value);

  // Type filter
  if (selectedRenewalType.value && selectedRenewalType.value !== "all") {
    if (selectedRenewalType.value === "urgent") {
      filtered = filtered.filter((item) => item.daysUntilExpiry <= 30);
    } else {
      filtered = filtered.filter(
        (item) => item.type === selectedRenewalType.value
      );
    }
  }

  return filtered;
});

const setRenewalReps = (type: string) => {
  //   const renewalRep = ref({
  //   totalRenewals: 10,
  //   expiringThisMonth: 10,
  //   overdue: 20,
  //   recentlyRenewed: 30
  // });

  console.log("from the setter", insuranceRepList.value);

  const startDate = moment().startOf('month').format('YYYY-MM-DD')
  const endDate = moment().endOf('month').format('YYYY-MM-DD')

  const startOfWeek = moment().startOf('week').format('YYYY-MM-DD')
  const endOfWeek = moment().startOf('week').format('YYYY-MM-DD')

  const today = moment().format('YYYY-MM-DD')

  
  switch (type) {
    case "0":
      if (insuranceRepList.value.renewalRecords) {
        renewalRep.value.totalRenewals =
          insuranceRepList.value.renewalRecords.length;
      }
      if(insuranceRepList.value.vehicleInsurances){
        renewalRep.value.expiringThisMonth = insuranceRepList.value.vehicleInsurances.filter(x => x.endDate >= startDate && x.endDate <= endDate).length
        renewalRep.value.overdue = insuranceRepList.value.vehicleInsurances.filter(x => x.endDate < today).length
        renewalRep.value.recentlyRenewed = insuranceRepList.value.vehicleInsurances.filter(x => x.startDate >= startOfWeek && x.endDate <= endOfWeek).length
      }
      break;
    case "1":
      if (insuranceRepList.value.renewalRecords) {
        renewalRep.value.totalRenewals =
          insuranceRepList.value.renewalRecords.filter(x => x.type == 1).length;
      }

      if(insuranceRepList.value.vehicleInsurances){
        renewalRep.value.expiringThisMonth = insuranceRepList.value.vehicleInsurances.filter(x => x.endDate >= startDate && x.endDate <= endDate && x.type == 1).length
        renewalRep.value.overdue = insuranceRepList.value.vehicleInsurances.filter(x => x.endDate < today && x.type == 1).length
        renewalRep.value.recentlyRenewed = insuranceRepList.value.vehicleInsurances.filter(x => x.startDate >= startOfWeek && x.endDate <= endOfWeek && x.type == 1).length
      }
      break;

    case "2":
      if (insuranceRepList.value.renewalRecords) {
        renewalRep.value.totalRenewals =
          insuranceRepList.value.renewalRecords.filter(x => x.type == 2).length;
      }

      if(insuranceRepList.value.vehicleInsurances){
        renewalRep.value.expiringThisMonth = insuranceRepList.value.vehicleInsurances.filter(x => x.endDate >= startDate && x.endDate <= endDate && x.type == 2).length
        renewalRep.value.overdue = insuranceRepList.value.vehicleInsurances.filter(x => x.endDate < today && x.type == 2).length
        renewalRep.value.recentlyRenewed = insuranceRepList.value.vehicleInsurances.filter(x => x.startDate >= startOfWeek && x.endDate <= endOfWeek && x.type == 2).length
      }
      break;
    case "3":
      if (insuranceRepList.value.renewalRecords) {
        renewalRep.value.totalRenewals =
          insuranceRepList.value.renewalRecords.filter(x => x.type == 3).length;
      }

      if(insuranceRepList.value.vehicleInsurances){
        renewalRep.value.expiringThisMonth = insuranceRepList.value.vehicleInsurances.filter(x => x.endDate >= startDate && x.endDate <= endDate && x.type == 3).length
        renewalRep.value.overdue = insuranceRepList.value.vehicleInsurances.filter(x => x.endDate < today && x.type == 3).length
        renewalRep.value.recentlyRenewed = insuranceRepList.value.vehicleInsurances.filter(x => x.startDate >= startOfWeek && x.endDate <= endOfWeek && x.type == 3).length
      }
      break;
    case "4":
      if (insuranceRepList.value.renewalRecords) {
        renewalRep.value.totalRenewals =
          insuranceRepList.value.renewalRecords.filter(x => x.type == 3).length;
      }

      if(insuranceRepList.value.vehicleInsurances){
        renewalRep.value.expiringThisMonth = insuranceRepList.value.vehicleInsurances.filter(x => x.endDate >= startDate && x.endDate <= endDate && x.type == 3).length
        renewalRep.value.overdue = insuranceRepList.value.vehicleInsurances.filter(x => x.endDate < today && x.type == 3).length
        renewalRep.value.recentlyRenewed = insuranceRepList.value.vehicleInsurances.filter(x => x.startDate >= startOfWeek && x.endDate <= endOfWeek && x.type == 3).length
      }
      break;

    default:
      break;
  }
};
const insuranceRenewals = computed(() =>
  allRenewals.value.filter((item) => item.type === "insurance")
);

const safetyRenewals = computed(() =>
  allRenewals.value.filter((item) => item.type === "safety")
);

const roadFundRenewals = computed(() =>
  allRenewals.value.filter((item) => item.type === "road")
);

const urgentRenewals = computed(() =>
  allRenewals.value.filter((item) => item.daysUntilExpiry <= 30)
);

const totalRenewals = computed(() => allRenewals.value.length);

const expiringThisMonth = computed(() => {
  const today = new Date();
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return allRenewals.value.filter((item) => {
    const expiryDate = new Date(item.expiryDate);
    return expiryDate <= endOfMonth && item.daysUntilExpiry > 0;
  }).length;
});

const overdueRenewals = computed(
  () => allRenewals.value.filter((item) => item.daysUntilExpiry < 0).length
);

const recentlyRenewed = computed(() => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return allRenewals.value.filter((item) => {
    // This would need to be implemented based on your data structure
    // For now, return 0 as placeholder
    return false;
  }).length;
});

// Methods
const getDaysUntilExpiry = (expiryDate: string) => {
  if (!expiryDate) return null;
  const expiry = new Date(expiryDate);
  const today = new Date();
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const getRenewalTypeColor = (type: string) => {
  const colors = {
    insurance: "info",
    safety: "success",
    road: "warning",
  };
  return colors[type] || "grey";
};

const getRenewalTypeIcon = (type: string) => {
  const icons = {
    1: "mdi-shield-check",
    2: "mdi-shield-check",
    3: "mdi-car-wrench",
    4: "mdi-road",
  };
  return icons[type] || "mdi-help";
};

const getRenewalTypeLabel = (type: string) => {
  const labels = {
    1: "Comprehensive Insurance",
    2: "Third Party Liability",
    3: "Safty Inspection",
    4: "Road Fund"
  };
  return labels[type] || "Unknown";
};

const getUrgentRenewals = (insurances: any) => {
  let urgent = 0;
  let threshold = 10;
  let today = moment();
  if (insurances) {
    insurances.forEach((ins: any) => {
      if (moment(ins.endDate).diff(today, "days") <= threshold) {
        if((moment(ins.endDate).diff(today, "days") >= 0)){
          overDues.value.push(ins);
        }
        urgent++;
      }
    });
  }

  return urgent;
};

const getExpiryStatusColor = (daysUntilExpiry: number) => {
  if (daysUntilExpiry < 0) return "error";
  if (daysUntilExpiry <= 30) return "warning";
  if (daysUntilExpiry <= 90) return "orange";
  return "success";
};

const getExpiryStatusIcon = (daysUntilExpiry: number) => {
  if (daysUntilExpiry < 0) return "mdi-alert-circle";
  if (daysUntilExpiry <= 30) return "mdi-clock-alert";
  if (daysUntilExpiry <= 90) return "mdi-clock";
  return "mdi-check-circle";
};

const getExpiryStatusClass = (daysUntilExpiry: number) => {
  if (daysUntilExpiry < 0) return "text-error font-weight-medium";
  if (daysUntilExpiry <= 30) return "text-warning font-weight-medium";
  if (daysUntilExpiry <= 90) return "text-orange font-weight-medium";
  return "text-success font-weight-medium";
};

const getDaysUntilExpiryText = (daysUntilExpiry: number) => {
  if (daysUntilExpiry < 0) return `${Math.abs(daysUntilExpiry)} days overdue`;
  if (daysUntilExpiry === 0) return "Expires today";
  if (daysUntilExpiry === 1) return "Expires tomorrow";
  return `${daysUntilExpiry} days left`;
};

const getVehicleModel = (vehicle: any) => {
  if (!vehicle) return "";
  const vendor = vendorList.value.find((v) => v.id === vehicle.vendorId);
  const model = modelList.value.find((m) => m.id === vehicle.modelId);
  return `${vendor?.name || ""} ${model?.name || ""}`.trim();
};

const renewItem = (item: any) => {
  // Pre-populate the renewal dialog with the selected item
  selectedRenewalItem.value = item;
  isEditingRenewal.value = false;
  showRenewalDialog.value = true;
};

const viewDetails = (item: any) => {
  // Navigate to vehicle details page
  navigateTo(`/vehicles?id=${item.vehicle.id}`);
};

const editRenewal = (item: any) => {
  // Pre-populate the renewal dialog for editing
  selectedRenewalItem.value = item;
  isEditingRenewal.value = true;
  showRenewalDialog.value = true;
};

const onRenewalSaved = (renewal: any) => {
  showSuccessMessage("renewal saved successfully for vehicle");
  // Refresh the renewals list
  refreshRenewals();
};

const filterByType = (type: string) => {
  selectedRenewalType.value = type;
};

const clearFilter = () => {
  selectedRenewalType.value = 0;
};

const quickRenew = (item: any) => {
  // Pre-populate with current expiry date + 1 year for quick renewal
  const currentDate = new Date();
  const nextYear = new Date(
    currentDate.getFullYear() + 1,
    currentDate.getMonth(),
    currentDate.getDate()
  );

  selectedRenewalItem.value = {
    ...item,
    quickRenew: true,
    suggestedEndDate: nextYear.toISOString().split("T")[0],
  };
  isEditingRenewal.value = false;
  showRenewalDialog.value = true;
};

const markAsRenewed = async (item: any) => {
  try {
    // This would update the vehicle to mark the renewal as completed
    // For now, just show a success message
    showSuccessMessage(
      `${item.type} renewal marked as completed for ${item.vehicle.plateNo}`
    );
  } catch (error) {
    showErrorMessage("Failed to mark renewal as completed");
  }
};

const refreshRenewals = async () => {
  try {
    await Promise.all([getVehicles(), getVendor(), getModel()]);
    showSuccessMessage("Renewals refreshed successfully");
  } catch (error) {
    showErrorMessage("Failed to refresh renewals");
  }
};

const showSuccessMessage = (message: string) => {
  successMessage.value = message;
  showSuccessSnackbar.value = true;
};

const showErrorMessage = (message: string) => {
  errorMessage.value = message;
  showErrorSnackbar.value = true;
};

// Lifecycle
onMounted(async () => {
  await Promise.all([
    getInsuranceReport(),
    getVehicles(),
    getVendor(),
    getModel(),
  ]);

  console.log("RENEWAL DATA", insuranceRepList);
});
</script>

<style scoped>
.renewals-root {
  padding: 32px;
  min-height: 100vh;
  background: #fafafa;
}

.renewals-header {
  margin-bottom: 40px;
}

.renewals-title {
  letter-spacing: -0.5px;
  margin-top: 8px;
  font-size: 2rem;
  font-weight: 700;
  color: var(--v-theme-text-primary);
}

.renewals-subtitle {
  margin-bottom: 32px;
  color: var(--v-theme-text-secondary);
  font-size: 1.1rem;
}

.renewals-actions {
  background: linear-gradient(135deg, #fffde7 0%, #f8fafb 100%);
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(16, 30, 54, 0.06);
}

.renewals-search {
  max-width: 400px;
}

.renewals-btn {
  font-weight: 600;
  border-radius: 10px;
  min-width: 120px;
}

.renewal-overview {
  margin-bottom: 32px;
}

.overview-card {
  border-radius: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.overview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.overview-card.selected-filter {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  border: 2px solid var(--v-theme-primary);
}

.insurance-card {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}

.safety-card {
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
}

.road-card {
  background: linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%);
}

.urgent-card {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
}

.renewals-table-card {
  border-radius: 18px;
  background: linear-gradient(135deg, #fffde7 0%, #f8fafb 100%);
  box-shadow: 0 2px 12px rgba(16, 30, 54, 0.06);
  margin-bottom: 24px;
  transition: box-shadow 0.2s, transform 0.2s;
}

.renewals-table-card:hover {
  box-shadow: 0 6px 24px rgba(80, 80, 80, 0.1);
  transform: translateY(-1px);
}

.renewals-table {
  border-radius: 18px;
}

.renewal-stats {
  margin-bottom: 32px;
}

.stat-card {
  border-radius: 16px;
  background: white;
  box-shadow: 0 2px 12px rgba(16, 30, 54, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--v-theme-text-secondary);
  font-weight: 500;
}
</style>
