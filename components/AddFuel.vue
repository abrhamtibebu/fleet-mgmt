<template>
    <div>
            <v-dialog  @click:outside="emit('close')" v-model="showFuelEntryDialog" max-width="600px">
      <v-card>
        <v-card-title class="text-h6 pa-4">Add Fuel Entry</v-card-title>
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
const {createFuelRecords} = useFuel()
const fuelFormValid = ref(false)
const showFuelEntryDialog = ref(true)
const saving = ref(false)

const emit = defineEmits<{
  close: []
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
  cardId: props.vehicle.cardId
})


const saveFuelEntry = async () => {
  saving.value = true
  try {
    // TODO: Implement save logic
    await createFuelRecords(fuelEntryForm.value)

    console.log('Saving fuel entry:', fuelEntryForm.value)
    emit('showSuccess','Fuel Record Added Successfully')
    emit('close')
    resetFuelForm()
  } catch (error) {
    console.error('Error saving fuel entry:', error)
  } finally {
    saving.value = false
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
    fuelCardId: ''
  }
}
</script>
