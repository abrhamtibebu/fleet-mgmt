<template>
    <div>
            <v-dialog  @click:outside="emit('close')" v-model="showFuelEntryDialog" max-width="600px">
      <v-card>
        <v-card-title class="text-h6 pa-4">
                  <v-icon class="me-2  ml-5" color="green">mdi-fuel</v-icon>
          Add Fuel Entry</v-card-title>
        <v-card-text class="pa-4">
          <v-form ref="fuelForm" v-model="fuelFormValid">
            <v-row>
              <!-- <v-col cols="12">
                <v-select
                  v-model="fuelEntryForm.vehicleId"
                  :items="vehicles"
                  item-title="licensePlate"
                  item-value="id"
                  label="Vehicle"
                  variant="outlined"
                  :rules="[v => !!v || 'Vehicle is required']"
                  required
                ></v-select>
              </v-col> -->
              <v-col cols="12" sm="6">
                <v-text-field
                  hide-spin-buttons
                  density="compact"
                  v-model="fuelEntryForm.quantity"
                  label="Quantity (Liters)"
                  type="number"
                  variant="outlined"
                  :rules="[v => !!v || 'Quantity is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  hide-spin-buttons
        
                  density="compact"
                  v-model="fuelEntryForm.amount"
                  label="Amount (ETB)"
                  type="number"
                  variant="outlined"
                  :rules="[v => !!v || 'Amount is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  hide-spin-buttons
                  density="compact"
                  v-model="fuelEntryForm.odometerReading"
                  label="Odometer Reading (km)"
                  type="number"
                  variant="outlined"
                  :rules="[v => !!v || 'Odometer reading is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  density="compact"
                  v-model="fuelEntryForm.fuelStation"
                  label="Fuel Station"
                  variant="outlined"
                  :rules="[v => !!v || 'Station is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="fuelEntryForm.refillOn"
                  label="Service Date"
                  type="date"
                  variant="outlined"
                  :rules="[v => !!v || 'Date is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  density="compact"
                  v-model="fuelEntryForm.cardId"
                  :items="cardList"
                  item-title="number"
                  item-value="id"
                  label="Fuel Card"
                  variant="outlined"
                  :rules="[v => !!v || 'Fuel card is required']"
                  required
                ></v-autocomplete
                >
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="outlined" @click="emit('close')">Cancel</v-btn>
          <v-btn
            color="success"
            :loading="saving"
            :disabled="!fuelFormValid"
            @click="saveFuelEntry"
          >
            Add Entry
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </div>
</template>


<script lang="ts" setup>

const {getCard,cardList } = useCard()
const {createFuelRecords, error} = useFuel()
const fuelFormValid = ref(false)
const showFuelEntryDialog = ref(true)
const saving = ref(false)

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

const fuelEntryForm = ref({
  vehicleId: props.vehicle.id,
  quantity: 0,
  amount: 0,
  odometerReading: 0,
  fuelStation: '',
  cardId: props.vehicle.cardId,
  refillOn: ''
})


const saveFuelEntry = async () => {
  saving.value = true
  try {
    // TODO: Implement save logic
    const res = await createFuelRecords(fuelEntryForm.value)
    
    if(res.status == 'OK'){      
      console.log('Saving fuel entry:', fuelEntryForm.value)
      emit('showSuccess','Fuel Record Added Successfully')
      emit('close')
      resetFuelForm()
    }
  } catch (er) {  
    console.error('Error saving fuel entry:', error)
    emit('showError',error.value.data.error)
    emit('close')
  }
}

onMounted(async () => {
    await getCard()    
})
const resetFuelForm = () => {
  fuelEntryForm.value = {
    vehicleId: '',
    quantity: 0,
    amount: 0,
    odometerReading: 0,
    station: '',
    fuelCardId: '',   
    date: '',

  }
}
</script>
