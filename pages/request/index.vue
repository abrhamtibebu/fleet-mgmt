<template>
  <div>
    <h1 class="renewals-title">Travel Request Review</h1>
    <p class="text-subtitle-1 text-text-secondary mb-6">
      Approve or reject this travel request after checking all details
    </p>
  </div>
  <v-row>
    <v-col cols="12" md="12" class="d-flex justify-end">
      <v-btn color="primary" @click="openTravelDialog">Request Travel</v-btn>
    </v-col>
  </v-row>
  <v-row>
    <!-- <v-col cols="12" md="4">
      <v-btn color="green" class="mt-8" @click="openTravelDialog"> Approve Request </v-btn>
    </v-col>  -->
    <!-- @click="$router.push('/vehicles')" -->
    <!-- <div v-for="vehicle in vehicleList" :key="vehicle.id">
  <v-btn @click="openApproveTravelDialog(vehicle.id)">Travels</v-btn>
</div>  -->
    <!-- <v-col cols="12" md="4">
      <v-btn color="red" class="mt-8" @click="openApproveTravelDialog(vehicleId)">
        approve assigne Request
      </v-btn>
    </v-col> -->
    <!-- <div v-for="vehicle in vehicleList" :key="vehicle.id">
  <v-btn @click="openApproveTravelDialog(vehicle.id)">Travels</v-btn>
</div> -->
  </v-row>
  <v-row>
    <v-col cols="12">
      <h2>Travel Requests</h2>
</v-col>
   <v-col cols="12" md="2" sm="12" class="ml-4">
        <v-select
          :items="statuses"
          item-title="name"
          item-value="id"
          rounded
          label="status"
          v-model="selectedStatus"
          dense
          color="black"
          hide-details
        ></v-select>
      </v-col>
      <v-col>
        <v-btn @click="filterData()" color="yellow">filter</v-btn>
      </v-col>
     <!-- :items="travelRequests" -->
      <v-data-table
        :headers="headers"
        :items="filteredRequests"
        item-key="id"
        class="elevation-1"
      >
        <!-- Display multiple Route as comma-separated -->
        <!-- Route Display -->
        <template #item.route="{ item }">
          {{ item.route.join(", ") }}
        </template>

        <!-- Travelers Display (names) -->
        <template #item.travelers="{ item }">
          {{ getTravelerNames(item.travelers) }}
        </template>
        <template #item.department="{ item }">
          {{ getDepartmentName(item.department) }}
        </template>

        <!-- Actions column -->
         <!-- @click="openApproveTravelDialog(item.id, 'approve')"  -->
       <template #item.actions="{ item }">
  <!-- APPROVE -->
  <v-tooltip text="Approve Request" location="top" >
    <template #activator="{ props }" v-if="item.status ===1 ">
      <v-btn
        v-bind="props"
        icon
        variant="text"
        size="small"
        color="green"
        @click="openApproveTravelDialog(item)"
      >
        <v-icon size="18">mdi-check</v-icon>
      </v-btn>
      
    </template>
  </v-tooltip>

  <!-- REJECT -->
 <!-- @click="openConfirmDialog(item.vehicleId, 'Reject')" -->

<v-tooltip text="Reject Request" location="top" >
  <template #activator="{ props }" v-if="item.status ===1 ">
    <v-btn
      v-bind="props"
      icon
       variant="text"
      size="small"
      color="brown"
      @click="openConfirmDialog(item.id, 'Reject')"

    >
      <v-icon size="18">mdi-close</v-icon>
    </v-btn>
  </template>
</v-tooltip>

<!-- Cancel -->
   <!-- @click="openConfirmDialog(item.vehicleId, 'Cancel')"  2 appro   3 rejuct 4 cancle-->

<v-tooltip text="Cancel Request" location="top" >
  <template #activator="{ props }" v-if="item.status ===1 || item.status ===2 ">
    <v-btn
      v-bind="props"
      icon
      variant="text"
      size="small"
      color="red"
      @click="openConfirmDialog(item.id, 'Cancel')"

    >
      <v-icon size="18">mdi-cancel</v-icon>
    </v-btn>
  </template>
</v-tooltip>
</template>
      </v-data-table>
      <!-- Confirmation Dialog -->
      <v-dialog v-model="confirmDialog.show" max-width="600px">
        <v-card>
          <v-card-title><h4>Confirm Action</h4></v-card-title>
          <v-card-text>
           <p>Are you Sure you Want to
            <strong>{{
              confirmDialog.action === "Reject" ? "Reject" : "Cancle"
            }}</strong>
            this Travel Request? </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="closeConfirmDialog">Cancel</v-btn>
            <v-btn text color="primary" @click="performAction">Yes</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </v-row>

  <v-dialog v-model="travelDialog" max-width="800px">
    <v-card>
      <v-card-title>Request Travel</v-card-title>

      <v-card-text>
        <v-row>
          <!-- traveler Department  -->

          <!-- <v-col cols="12" md="6">
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template #activator="{ props }">
                    <v-text-field
                      v-model="travelForm.date"
                      label="Request Date"
                      readonly
                      v-bind="props"
                      prepend-inner-icon="mdi-calendar"
                      variant="outlined"
                      hide-details
                    ></v-text-field>
                  </template>

                  <v-date-picker
                    v-model="travelForm.date"
                    @update:model-value="menu = false"
                    show-adjacent-months
                    hide-header
                  ></v-date-picker>
                </v-menu>
              </v-col> -->
          <v-col cols="12" md="6">
            <v-select
              v-model="travelForm.travelers"
              label="Traveler"
              variant="outlined"
              :rules="[(v) => !!v || 'Traveler is required']"
              required
              item-title="name"
              item-value="id"
              :items="usersList"
              style="width: 350px"
              class="mt-3"
              multiple
            ></v-select>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              :rules="[(v) => !!v || 'Department is required']"
              v-model="travelForm.department"
              placeholder="Department"
              :items="groups"
              item-title="name"
              item-value="id"
              label="Select Department"
              class="rounded-lg mt-3"
              style="width: 300px"
              clearable
            ></v-select>
          </v-col>
        </v-row>
        <!-- Dynamic Routes -->
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              class="mt-3"
              v-model="travelForm.travelDate"
              label=" Request Date"
              placeholder="Select  Date"
              type="date"
              style="font-size: 20px"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <div
              v-for="(destination, index) in travelForm.route"
              :key="index"
              class="d-flex align-center mt-3"
              style="width: 350px"
            >
              <v-text-field
                v-model="travelForm.route[index]"
                label="Enter Route"
              />
              <v-btn
                icon
                @click="removeDestination(index)"
                v-if="travelForm.route.length > 1"
              >
                <v-icon color="red">mdi-minus</v-icon>
              </v-btn>
              <v-btn
                icon
                @click="addDestination"
                v-if="index === travelForm.route.length - 1"
              >
                <v-icon color="green">mdi-plus</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="travelDialog = false">Cancel</v-btn>
        <v-btn color="primary" @click="submitTravel">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!--approve dialog-->
  <v-dialog v-model="approveTravelDialog" max-width="600px">
    <v-card>
      <v-card-title> Approve Travel Request </v-card-title>

      <v-card-text>
        <v-row>
          <!-- Vehicle Selection -->
          <v-col cols="12" md="6">
            <v-autocomplete
              v-model="travelApproveForm.vehicleId"
              :items="vehicleList"
              item-title="plateNo"
              item-value="id"
              label="Select Vehicle*"
              placeholder="Choose vehicle"
              variant="outlined"
              density="compact"
              :rules="[(v) => !!v || 'Vehicle is required']"
              required
              @update:model-value="handleVehicleSelect"
            ></v-autocomplete>
            <!-- @change="handleVehicleSelect" -->
          </v-col>
          <!-- Start Kilometer -->
          <v-col cols="12" md="6">
            <v-text-field
              type="number"
              v-model="travelApproveForm.startKm"
              label="Start Kilometer"
              variant="outlined"
              :rules="[(v) => !!v || 'Start kilometer is required']"
              readonly
              required
              density="compact"
            ></v-text-field>
          </v-col>

          <!-- Remarks -->
          <v-col cols="12" md="6">
            <v-textarea
              v-model="travelApproveForm.remarks"
              label="Remarks"
              variant="outlined"
              rows="3"
              auto-grow
            ></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
<p v-if="assignedCountMessage" style="color:#ff9800;font-weight:500;">
  {{ assignedCountMessage }}
</p>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="approveTravelDialog = false">Cancel</v-btn>
        <v-btn color="primary" @click="approveRequest">Approve</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-snackbar
    v-model="showSuccessSnackbar"
    color="success"
    timeout="3000"
    location="top "
  >
    {{ successMessage }}
    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="showSuccessSnackbar = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>

  <v-snackbar
    v-model="showErrorSnackbar"
    color="error"
    timeout="5000"
    location="top "
  >
    {{ errorMessage }}
    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="showErrorSnackbar = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
  <v-snackbar
  v-model="showAssignedSnackbar"
  timeout="4000"
  color="warning"
  location="bottom"
>
  {{ assignedCountMessage }}
</v-snackbar>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, watch } from "vue";
import { nextTick } from "vue";
import * as echarts from "echarts";
import moment from "moment";

const showSuccessSnackbar = ref(false);
const showErrorSnackbar = ref(false);
const successMessage = ref("");
const errorMessage = ref("");
const approveTravelDialog = ref(false);
const selectedVehicleId = ref<number | null>(null);
const travelDialog = ref(false);
const selectedReqId = ref(null);
const VehicleId = ref(null);


const {
  dashboardReport,
  loading,
  getAllReport,
  useRequestTravel,
  requestTravel,
  getTravelRequests,
   approveTravelRequest,
  rejectTravelRequest,
  cancelTravelRequest,
  updateTravelStatus,
  getUsers,
  usersList,
  vehicleList,
  travelList,
  getVehicles,
  vehicleAssignedPerDay,
} = useReport();
const selectedStatus = ref(null);
const filteredRequests = ref([]);

// Travel requests table
// const travelRequests = ref<Array<any>>([])
const travelRequests = ref([]); // must be an empty array initially
const assignedVehiclePerDay = ref<[]>([]);
const assignedCountMessage = ref("");
const  statuses =[
        { id: 1, name: "Pending" },
        { id: 2, name: "Approved" },
        { id: 3, name: "Rejected" },
        { id: 4, name: "Canceled" },
      ];
//approve from
const travelApproveForm = ref({
  startKm: null,
  vehicleId: null,
  remarks: null,
});
const showAssignedSnackbar = ref(false);
const assignedCount = ref(0);
const selectedReqItem = ref(null);
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];  // "yyyy-mm-dd"
};

//open approve dialog
// const openApproveTravelDialog = (vehicleId) => {
//   selectedVehicleId.value = vehicleId;
//   approveTravelDialog.value = true;

//   const selectedVehicle = vehicleList.value.find(v => v.id === vehicleId);

//   travelApproveForm.value = {
//     startKm: selectedVehicle ? selectedVehicle.currentMileage : 0,
//   };
// };
// const openApproveTravelDialog = (item) => {
//   selectedReqId.value = item.id;  // store the request ID
//   approveTravelDialog.value = true;

//   const selectedVehicle = vehicleList.value.find(v => v.id === item.vehicleId);
  
//   travelApproveForm.value = {
//     vehicleId: item.vehicleId ?? null,
//     startKm: selectedVehicle?.currentMileage ?? 0,
//     remarks: "",
//   };
//   // ⬇ CHECK vehicle assignment
//   await getVehicleAssignedPerDay(item.vehicleId, item.travelDate);

//   if (assignedVehiclePerDay.value.length > 0) {
//     assignedCountMessage.value =
//       `This vehicle is already assigned ${assignedVehiclePerDay.value.length} time(s) on this date.`;
//   } else {
//     assignedCountMessage.value = "";
//   }
// };
// const getVehicleAssignedPerDay = async (vehicleId, date) => {
//   assignedVehiclePerDay.value = await vehicleAssignedPerDay(vehicleId, date);
// };
const getVehicleAssignedPerDay = async (vehicleId, date) => {
  try {
    assignedVehiclePerDay.value = await vehicleAssignedPerDay(vehicleId, date);
  } catch (err) {
    console.warn("No assigned history for this vehicle on date:", date);
    assignedVehiclePerDay.value = [];  // fallback instead of error
  }
};

const openApproveTravelDialog = async (item) => {
  selectedReqId.value = item.id;
  selectedReqItem.value = item;    // save the full item (NEEDED!)
  approveTravelDialog.value = true;

  const selectedVehicle = vehicleList.value.find(v => v.id === item.vehicleId);

  travelApproveForm.value = {
    vehicleId: item.vehicleId ?? null,
    startKm: selectedVehicle?.currentMileage ?? 0,
    remarks: "",
  };

  // ⬇ CHECK vehicle assignment
  assignedCountMessage.value = "";

};


// const payload = {
//   vehicleId: Number(travelApproveForm.value.vehicleId), // convert to number
// };
const payload = computed(() => ({
  vehicleId: Number(travelApproveForm.value.vehicleId)
}));

const getTravelerNames = (ids) => {
  return ids
    .map((id) => {
      const user = usersList.value.find((u) => u.id === id);
      return user ? user.name : "Unknown";
    })
    .join(", ");
};

// Table headers
const headers = [
  { title: "Request Date", value: "travelDate" },
  { title: "Traveler", value: "travelers" },
  { title: "Department", value: "department" },
  { title: "Route", value: "route" },
  { title: "Actions", value: "actions", sortable: false },
];
// Confirmation dialog state
const confirmDialog = ref({
  show: false,
  action: "", // 'approve' or 'reject'
  requestId: null as number | null,
});
// Fetch travel requests from backend
const fetchTravelRequests = async () => {
  travelRequests.value = await getTravelRequests();
  filteredRequests.value = travelRequests.value; // default: show all

};
// Feach travel assigned vichle 

//change the status to approved and push to the assigns to another oage
const router = useRouter();
const handleReject = async () => {
  // await changeStatus() // e.g., API call to reject request
  router.push("/vehicles"); // then redirect
};
// Open confirmation dialog
const openConfirmDialog = (id: number, action: string) => {
  confirmDialog.value.requestId = id;
  confirmDialog.value.action = action;
  confirmDialog.value.show = true;
};

// Close confirmation dialog
const closeConfirmDialog = () => {
  confirmDialog.value.show = false;
  confirmDialog.value.requestId = null;
  confirmDialog.value.action = "";
};

// Perform approve/reject action
// const performAction = async () => {
//   const { requestId, action } = confirmDialog.value;

//   if (!requestId) return;

//   try {
//     if (action === "Reject") {
//       await rejectTravelRequest(requestId, "reject");
//     } else if (action === "Cancel") {
//       await cancelTravelRequest(requestId, "cancel");
//     }

//     // Close the dialog
//     closeConfirmDialog();

//     // Refresh the table
//     await fetchTravelRequests();

//     // Show success snackbar
//     showSuccessSnackbar.value = true;
//     successMessage.value = `${action} action completed successfully!`;
//   } catch (error) {
//     console.error(`Failed to ${action} request:`, error);

//     // Show error snackbar
//     showErrorSnackbar.value = true;
//     errorMessage.value = `Failed to ${action} travel request`;
//   }
// };



// const performAction = async () => {
//   const { requestId, action } = confirmDialog.value;
//   if (!requestId) return;

//   let statusNumber = action === "Reject" ? 2 : 3;

//   try {
//     if (action === "Reject") {
//       await rejectTravelRequest(requestId, statusNumber, payload.value);
//     } else if (action === "Cancel") {
//       await cancelTravelRequest(requestId, statusNumber, payload.value);
//     }

//     closeConfirmDialog();
//     await fetchTravelRequests();

//     showSuccessSnackbar.value = true;
//     successMessage.value = `${action} Request completed successfully!`;
//   } catch (error) {
//     console.error(`Failed to ${action} request:`, error);
//     showErrorSnackbar.value = true;
//     errorMessage.value = `Failed to ${action} travel request`;
//   }
// };

const performAction = async () => {
  const { requestId, action } = confirmDialog.value;
  if (!requestId) return;

  let statusNumber = action === "Reject" ? 3 : 4;

  try {
    const dataPayload = {
      vehicleId: Number(travelApproveForm.value.vehicleId),
    };

    if (action === "Reject") {
      await rejectTravelRequest(requestId, statusNumber, dataPayload);
    } else if (action === "Cancel") {
      await cancelTravelRequest(requestId, statusNumber, dataPayload);
    }

    closeConfirmDialog();
    await fetchTravelRequests();

    showSuccessSnackbar.value = true;
    successMessage.value = `${action} Request completed successfully!`;

  } catch (error) {
    console.error(`Failed to ${action} request:`, error);
    showErrorSnackbar.value = true;
    errorMessage.value = `Failed to ${action} travel request`;
  }
};


// Rejuct the request
const confirmAction = async () => {
  try {
    if (actionType.value === "reject") {
      await rejectTravelRequest(selectedReqId.value, "reject");
        showSuccess("Travel Request Rejected Successfully")

    }

    confirmDialog.value = false;
    getTravelRequestList();
  } catch (err) {
    showError("Failed to approve travel request")
  }
};
//feach the start kilometer based on the selected plate number
// const handleVehicleSelect = (vehicleId: number) => {
//   assignedCountMessage.value = ""; // clear old message

//   // No vehicle selected → stop
//   if (!vehicleId) return;
//   const selectedVehicle = vehicleList.value.find((v) => v.id === vehicleId);

//   if (selectedVehicle) {
//     travelApproveForm.value.startKm = selectedVehicle.currentMileage ?? 0;
//   } else {
//     travelApproveForm.value.startKm = 0;
//   }
// };
const handleVehicleSelect = async (vehicleId) => {
  assignedCountMessage.value = "";
  showAssignedSnackbar.value = false;

  if (!vehicleId) return;

  const selectedVehicle = vehicleList.value.find(v => v.id === vehicleId);
  travelApproveForm.value.startKm = selectedVehicle?.currentMileage ?? 0;

  // 🔥 Use today's date instead of request date
  const todayDate = getTodayDate();

  try {
    await getVehicleAssignedPerDay(vehicleId, todayDate);

    const count = assignedVehiclePerDay.value?.length || 0;

    if (count > 1) {
      assignedCountMessage.value =
        `This vehicle is already assigned ${count} times today (${todayDate}).`;
      showAssignedSnackbar.value = true;
    }
  } catch (err) {
    console.error("Failed to fetch assignment history", err);
  }
};



// Fetch data on mount

// Request Travel
const travelForm = ref({
  department: null,
  route: [""], // start with one destination
  travelers: [],
  travelDate: null,
  // for example, replace with real logged-in user ID
});

const addDestination = () => {
  travelForm.value.route.push("");
};
const getUsersHandler = async () => {
  await getUsers();
};

const removeDestination = (index) => {
  travelForm.value.route.splice(index, 1);
};
//snackBar messages
const showSuccessMessage = (message) => {
  successMessage.value = message;
  showSuccessSnackbar.value = true;
};

const showErrorMessage = (message) => {
  errorMessage.value = message;
  showErrorSnackbar.value = true;
};
const groups = [
  {
    id: 1,
    name: "Service",
  },
  {
    id: 2,
    name: "Finance",
  },
  {
    id: 3,
    name: "Sales and Marketing",
  },
  {
    id: 4,
    name: "Development",
  },
  {
    id: 5,
    name: "Engineering",
  },
  {
    id: 6,
    name: "ERM",
  },
  {
    id: 7,
    name: "Human Resource",
  },
];
// submit travel request
// const submitTravel = async () => {
//   try {
//     // destructure inside the function (client-side)
//     const { requestTravel } = useRequestTravel();
//     await requestTravel(travelForm.value);
//     travelDialog.value = false;
//     showSuccessMessage("Travel request submitted successfully!");
//   } catch (error) {
//     console.error(error);
//     showErrorMessage(
//       "Error submitting travel request: " + (error.message || "Unknown")
//     );
//   }
// };

const submitTravel = async () => {
  try {
    const { requestTravel } = useRequestTravel();

    const payload = {
      ...travelForm.value,
      route: travelForm.value.route.join(","),
      travelers: travelForm.value.travelers.join(","),
    };

    const res = await requestTravel(payload);

    if (res?.status === "OK") {
      showSuccessMessage("Travel request submitted successfully!");
      travelDialog.value = false;

      // Reset form after closing dialog
      travelForm.value.department = null;
      travelForm.value.travelDate = null;
      travelForm.value.travelers = [];
      travelForm.value.route = [""];

      // Refresh table
      await fetchTravelRequests();
    } else {
      showErrorMessage("Failed to submit travel request");
    }
  } catch (error) {
    console.error(error);
    showErrorMessage("Error submitting travel request");
  }
};
//approve request
// const approveRequest = async () => {
  
//   if (!selectedReqId.value) return;

//   try {
//     const payload = {
//       ...travelForm.value,
    
//     };
//     await approveTravelRequest(selectedReqId.value, "approve", payload);

//     showSuccessSnackbar.value = true;
//     successMessage.value = "Travel request approved successfully!";

//     approveTravelDialog.value = false;
//     await fetchTravelRequests();
//   } catch (err) {
//     console.error(err);
//     showErrorSnackbar.value = true;
//     errorMessage.value = "Failed to approve travel request";
//   }
// };
const approveRequest = async () => {
  if (!selectedReqId.value) return;

  const status = 2; // approve

  const payload = {
    vehicleId: travelApproveForm.value.vehicleId,
    startKm: travelApproveForm.value.startKm,
    remarks: travelApproveForm.value.remarks,
  };

  try {
    await approveTravelRequest(selectedReqId.value, status, payload);

    showSuccessSnackbar.value = true;
    successMessage.value = "Travel request approved successfully!";
    approveTravelDialog.value = false;

    // await fetchTravelRequests();
  } catch (err) {
    console.error(err);
    showErrorSnackbar.value = true;
    errorMessage.value = "Failed to approve travel request";
  }
};





const getDepartmentName = (id) => {
  const dep = groups.find((g) => g.id === id);
  return dep ? dep.name : "Unknown Department";
};

// const approveTravelRequest
const openTravelDialog = () => {
  travelDialog.value = true;
};

const filterData = () => {
  if (selectedStatus.value) {
    filteredRequests.value = travelRequests.value.filter(
      (item) => item.status === selectedStatus.value
    );
  } else {
    filteredRequests.value = travelRequests.value; // show all
  }
};


onMounted(async () => {
  await getUsersHandler();
  await fetchTravelRequests();
  await getVehicles();
  const vehicleId = travelApproveForm.value.vehicleId;

  if (vehicleId) {
    const todayDate = getTodayDate();
    await getVehicleAssignedPerDay(vehicleId, todayDate);
  }
  // await getVehicleAssignedPerDay(travelApproveForm.value.vehicleId, date);
});
</script>

<style></style>
