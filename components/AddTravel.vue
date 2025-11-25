<template>
    <div>
            <!-- <v-dialog  @click:outside="emit('close')" v-model="vehicleTravelsDialog" max-width="600px"> -->
      <v-dialog   @click:outside="emit('close')" v-model="vehicleTravelsDialog" max-width="600px">
      <v-card class="dialog-card">
        <v-card-title class="dialog-title">
          <span class="title-icon-badge"><v-icon size="20" color="warning">mdi-train-car</v-icon></span>
           Travels 
        </v-card-title>
        <v-card-text class="pa-4">
          <v-form ref="fuelForm" v-model="DepartmentFormValid">
            <v-row>
              <v-col cols="12" sm="6">
                  <v-text-field
                    density="compact"
                    v-model="travelEntryForm.date"
                    label=" travel Date"
                    placeholder="Select  Date"
                    type="date"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                <v-text-field
                  type="number"
                  v-model="travelEntryForm.startKm"
                  label= "Start Kilometer"
                  variant="outlined"
                  :rules="[v => !!v || 'Start kilo metre is required']"
                  required
                  readonly
                ></v-text-field>
              </v-col>
               <v-col cols="12" sm="6">
                <v-text-field
                  type="number"
                  v-model="travelEntryForm.endKm"
                  label="End kilo metre"
                  variant="outlined"
                  :rules="[v => !!v || 'End kilo metre is required']"
                  required
                ></v-text-field>
              </v-col>
               <v-col cols="12" sm="6">
                <v-text-field
                  v-model="travelEntryForm.travelkm"
                  label="Travel kilo metre "
                  variant="outlined"
                  :rules="[v => !!v || 'travel kilo meter is required']"
                  required
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="travelEntryForm.travelRoute"
                  label="Travel Route "
                  variant="outlined"
                  :rules="[v => !!v || 'Travel Route is required']"
                  required
                ></v-text-field>
              </v-col>
               <v-col cols="12" sm="6">
                <v-textarea
                  v-model="travelEntryForm.purposeOfTravel"
                  label="Purpose Of Travel"
                  variant="outlined"
                  :rules="[v => !!v || 'Purpose Of Travel is required']"
                  required
                ></v-textarea>
              </v-col>
                
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="dialog-actions">
          <v-spacer></v-spacer>
          <v-btn variant="outlined" @click="vehicleTravelsDialog = false">Cancel</v-btn>
          <!-- :disabled="!DepartmentFormValid" -->
          <v-btn color="warning" :loading="saving"  @click="savetravelEntry" prepend-icon="mdi-content-save">Add Travels</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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


<script lang="ts" setup>

const {getCard,cardList } = useCard()
const {createFuelRecords, error} = useFuel()
const TravelFormValid = ref(false)
const showFuelEntryDialog = ref(true)
const vehicleTravelsDialog = ref(true)
const saving = ref(false)
const selectedVehicle = ref<any>(null);


const emit = defineEmits<{
  (e: 'close'):void,
  (e: 'showSuccess', message: string): void,
  (e: 'showError', message: string): void
}>()

const props = defineProps({
    vehicle: {
        type: Object,
        default: {}
    }
})

const travelEntryForm = ref({
  date: '',
  startKm: '',
  endKm: '',
  travelkm: '',
  purposeOfTravel: '',
  travelRoute: '',
  
})

const showSuccessSnackbar = ref(false)
const showErrorSnackbar = ref(false)
const successMessage = ref('')
const errorMessage = ref('')


const resetTravelForm = () => {
  travelEntryForm.value = {
    vehicleId: '',
    quantity: 0,
    amount: 0,
    odometerReading: 0,
    station: '',
    fuelCardId: '',   
    date: '',

  }
}
const saveFuelEntry = async () => {
  saving.value = true
  try {
    // TODO: Implement save logic
    const res = await createFuelRecords(travelEntryForm.value)
    
    if(res.status == 'OK'){      
      console.log('Saving fuel entry:', travelEntryForm.value)
      emit('showSuccess','Fuel Record Added Successfully')
      emit('close')
      resetTravelForm()
    }
  } catch (er) {  
    console.error('Error saving fuel entry:', error)
    emit('showError',error.value.data.error)
    emit('close')
  }
}
const showSuccess = async (message: string) => {
  try {  
    showSuccessMessage(message)
  } catch (error) {
    showErrorMessage(message)
  }
}
const showSuccessMessage = (message: string) => {
  successMessage.value = message
  showSuccessSnackbar.value = true
}

const showErrorMessage = (message: string) => {
  errorMessage.value = message
  showErrorSnackbar.value = true
}

const savetravelEntry = async () => {
      console.log('FFFFFF:', travelEntryForm)

  saving.value = true;
  try {
    // if (!selectedVehicleId.value || !travelEntryForm.value.startKm) {
    //   throw new Error('Vehicle or Department not selected');
    // }

    // await addDepartment(selectedVehicleId.value, departmentEntryForm.value.department);

    vehicleTravelsDialog.value = false;
    // resetDepartmentForm();

    showSuccessMessage("Travles Register Successfully"); 
  } catch (error: any) {
    console.error('Error While  Travles  Register :', error);

    // If it's an API error, show the backend message if available
    const backendMessage = error.data?.error || 
                          error.data?.message || 
                          error.message 
                         
    
    showErrorMessage(backendMessage);
  } finally {
    saving.value = false;
  }
};
watch(
  () => [travelEntryForm.value.startKm, travelEntryForm.value.endKm],
  ([startKm, endKm]) => {
    travelEntryForm.value.travelkm = (endKm || 0) - (startKm || 0);
  }
);

onMounted(async () => {
    await getCard()    
})

const openTravelsDialog = (vehicleId) => {
  selectedVehicleId.value = vehicleId;
  vehicleTravelsDialog.value = true;

  const selectedVehicle = vehicleList.value.find(v => v.id === vehicleId);

  travelEntryForm.value = {
    startKm: selectedVehicle ? selectedVehicle.currentMileage : 0,
    endKm: 0,
    travelkm: 0
  };
};
</script>
