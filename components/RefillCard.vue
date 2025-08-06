<template>
  <v-dialog v-model="showDialog" max-width="500px" persistent>
    <v-card class="dialog-card">
      <v-card-title class="dialog-title">
        <v-icon class="me-2" color="success">mdi-gas-station</v-icon>
        Refill Fuel Card
      </v-card-title>
      <v-card-text>
        <div v-if="selectedCard" class="refill-info mb-4">
          <v-alert type="info" variant="tonal" class="mb-4">
            <div class="d-flex align-center">
              <v-icon class="me-2">mdi-credit-card</v-icon>
              <div>
                <div class="font-weight-medium">{{ maskCardNumber(selectedCard.cardNumber) }}</div>
                <div class="text-caption">Current Balance: {{ selectedCard.remainingBalance.toLocaleString() }} ETB</div>
                <div class="text-caption">Cardholder: {{ selectedCard.cardHolder }}</div>
              </div>
            </div>
          </v-alert>
        </div>
        
        <v-form ref="refillFormRef" v-model="formValid">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="refillForm.amount"
                label="Refill Amount (ETB)"
                type="number"
                variant="outlined"
                :rules="[
                  v => !!v || 'Amount is required',
                  v => v > 0 || 'Amount must be greater than 0',
                  v => v <= 50000 || 'Maximum refill amount is 50,000 ETB'
                ]"
                required
                min="1"
                max="50000"
                step="100"
                prepend-inner-icon="mdi-currency-usd"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="refillForm.notes"
                label="Refill Notes (Optional)"
                variant="outlined"
                rows="3"
                placeholder="Reason for refill, location, or any additional notes..."
              ></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-alert type="warning" variant="tonal" class="mb-0">
                <div class="d-flex align-center">
                  <v-icon class="me-2">mdi-alert</v-icon>
                  <div>
                    <div class="font-weight-medium">Important</div>
                    <div class="text-caption">This action will add the specified amount to the card balance. The transaction will be recorded in the fuel records.</div>
                  </div>
                </div>
              </v-alert>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="dialog-actions">
        <v-spacer></v-spacer>
        <v-btn
          variant="outlined"
          @click="closeDialog"
        >
          Cancel
        </v-btn>
        <v-btn
          color="success"
          :loading="processing"
          :disabled="!formValid"
          @click="processRefill"
        >
          <v-icon class="me-2">mdi-gas-station</v-icon>
          Process Refill
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface FuelCard {
  id: string
  cardNumber: string
  cardHolder: string
  totalValueIssued: number
  amountSpent: number
  remainingBalance: number
  status: string
  lowBalanceThreshold: number
  isLowBalance: boolean
  lastTransactionDate: string
  createdAt: string
  updatedAt: string
}

interface RefillForm {
  amount: string
  notes: string
}

const props = defineProps<{
  modelValue: boolean
  card?: FuelCard | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'refill-processed': [cardId: string, amount: number, notes: string]
}>()

const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const selectedCard = computed(() => props.card)

const refillForm = ref<RefillForm>({
  amount: '',
  notes: ''
})

const formValid = ref(false)
const processing = ref(false)

const maskCardNumber = (cardNumber: string) => {
  if (!cardNumber) return ''
  const parts = cardNumber.split('-')
  if (parts.length >= 4) {
    return `****-****-****-${parts[3]}`
  }
  return cardNumber.replace(/\d(?=\d{4})/g, '*')
}

const processRefill = async () => {
  if (!selectedCard.value || !formValid.value) return
  
  processing.value = true
  try {
    const refillAmount = parseFloat(refillForm.value.amount)
    const notes = refillForm.value.notes
    
    // Emit the refill event for parent component to handle
    emit('refill-processed', selectedCard.value.id, refillAmount, notes)
    
    // Close dialog and reset form
    closeDialog()
  } catch (error) {
    console.error('Error processing refill:', error)
  } finally {
    processing.value = false
  }
}

const closeDialog = () => {
  showDialog.value = false
  resetForm()
}

const resetForm = () => {
  refillForm.value = {
    amount: '',
    notes: ''
  }
  formValid.value = false
}
</script>

<style scoped>
.dialog-card {
  border-radius: 16px;
}

.dialog-title {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  border-radius: 16px 16px 0 0;
  padding: 20px 24px;
}

.dialog-actions {
  padding: 16px 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

.refill-info {
  background: rgba(33, 150, 243, 0.1);
  border-radius: 8px;
  padding: 16px;
}
</style> 