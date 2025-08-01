<template>
  <div class="vendor-management-root">
    <!-- Header Section -->
    <div class="vendor-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="vendor-title">Vendor Management</h1>
          <p class="vendor-subtitle">Manage vehicle brands, models, and fuel cards for your fleet operations</p>
        </div>
        <div class="header-actions">
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            class="header-btn"
            @click="showBrandDialog = true"
          >
            Add Brand
          </v-btn>
          <v-btn
            color="success"
            prepend-icon="mdi-car"
            class="header-btn"
            @click="showModelDialog = true"
          >
            Add Model
          </v-btn>
          <v-btn
            color="info"
            prepend-icon="mdi-credit-card"
            class="header-btn"
            @click="showCardDialog = true"
          >
            Add Card
          </v-btn>
        </div>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-section">
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Total Brands"
            :value="vendorList.length.toString()"
            icon="mdi-tag"
            color="primary"
            @click="filterByBrands"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Total Models"
            :value="modelList.length.toString()"
            icon="mdi-car"
            color="success"
            @click="filterByModels"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Active Cards"
            :value="cardList.length.toString()"
            icon="mdi-credit-card"
            color="info"
            @click="filterByActiveCards"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Total Value"
            :value="`${totalCardValue.toLocaleString()} ETB`"
            icon="mdi-currency-usd"
            color="warning"
            @click="showValueBreakdown"
          />
        </v-col>
      </v-row>
    </div>

    <!-- Search and Filter Bar -->
    <div class="search-filter-section">
      <v-card class="search-card">
        <v-card-text>
          <v-row align="center">
            <v-col cols="12" md="4">
              <v-text-field
                v-model="searchQuery"
                prepend-inner-icon="mdi-magnify"
                placeholder="Search brands, models, cards..."
                variant="outlined"
                density="compact"
                hide-details
                class="search-field"
                @input="filterVendorData"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="categoryFilter"
                :items="categoryOptions"
                label="Category Filter"
                variant="outlined"
                density="compact"
                hide-details
                @update:model-value="filterVendorData"
              ></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="statusFilter"
                :items="statusOptions"
                label="Status Filter"
                variant="outlined"
                density="compact"
                hide-details
                @update:model-value="filterVendorData"
              ></v-select>
            </v-col>
            <v-col cols="12" md="2" class="text-right">
              <v-btn
                color="primary"
                variant="outlined"
                prepend-icon="mdi-filter-variant"
                @click="showAdvancedFilters = !showAdvancedFilters"
              >
                Filters
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>

    <!-- Main Content Grid -->
    <div class="main-content">
      <v-row>
        <!-- Brands Section -->
        <v-col cols="12" lg="6">
          <v-card class="content-card brands-card">
            <v-card-title class="card-title">
              <div class="title-content">
                <v-icon class="title-icon" color="primary">mdi-tag</v-icon>
                <span>Vehicle Brands</span>
                <v-chip color="primary" size="small" class="ms-2">{{ vendorList.length }}</v-chip>
              </div>
              <v-btn
                icon="mdi-plus"
                variant="text"
                size="small"
                @click="resetBrandForm(), editingBrand = false, showBrandDialog = true"
              ></v-btn>
            </v-card-title>
            <v-card-text>
              <div v-if="vendorList.length === 0" class="empty-state">
                <v-icon size="64" color="primary" class="mb-4">mdi-tag-outline</v-icon>
                <h3 class="text-h6 text-muted mb-2">No brands added yet</h3>
                <p class="text-muted">Add your first vehicle brand to get started</p>
              </div>
              <div v-else>
                <v-list class="brand-list">
                  <v-list-item
                    v-for="brand in vendorList"
                    :key="brand.id"
                    class="brand-item"
                    @click="editBrand(brand)"
                  >
                    <template v-slot:prepend>
                      <v-avatar color="primary" size="40">
                        <v-icon color="white">{{ brand.icon || 'mdi-tag' }}</v-icon>
                      </v-avatar>
                    </template>
                    <v-list-item-title class="font-weight-medium">{{ brand.name }}</v-list-item-title>
                    <!-- <v-list-item-subtitle>{{ brand.models.length }} models</v-list-item-subtitle> -->
                    <v-list-item-subtitle>{{modelList.filter(x => x.vendorId == brand.id).length}} {{modelList.filter(x => x.vendorId == brand.id).length <= 1 ? 'model' : 'models'}}</v-list-item-subtitle>
                    <template v-slot:append>
                      <div class="brand-actions">
                        <v-btn
                          icon="mdi-pencil"
                          size="small"
                          variant="text"
                          color="primary"
                          @click.stop="editBrand(brand)"
                        ></v-btn>
                        <v-btn
                          icon="mdi-delete"
                          size="small"
                          variant="text"
                          color="error"
                          @click.stop="deleteBrandItem(brand)"
                        ></v-btn>
                      </div>
                    </template>
                  </v-list-item>
                </v-list>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Models Section -->
        <v-col cols="12" lg="6">
          <v-card class="content-card models-card">
            <v-card-title class="card-title">
              <div class="title-content">
                <v-icon class="title-icon" color="success">mdi-car</v-icon>
                <span>Vehicle Models</span>
                <v-chip color="success" size="small" class="ms-2">{{ modelList.length }}</v-chip>
              </div>
              <v-btn
                icon="mdi-plus"
                variant="text"
                size="small"
                @click="showModelDialog = true"
              ></v-btn>
            </v-card-title>
            <v-card-text>
              <div v-if="modelList.length === 0" class="empty-state">
                <v-icon size="64" color="success" class="mb-4">mdi-car-outline</v-icon>
                <h3 class="text-h6 text-muted mb-2">No models added yet</h3>
                <p class="text-muted">Add vehicle models to your brands</p>
              </div>
              <div v-else>
                <v-list class="model-list">
                  <v-list-item
                    v-for="model in modelList"
                    :key="model.id"
                    class="model-item"
                    @click="editModel(model)"
                  >
                    <template v-slot:prepend>
                      <v-avatar color="success" size="40">
                        <v-icon color="white">mdi-car</v-icon>
                      </v-avatar>
                    </template>
                    <v-list-item-title class="font-weight-medium">{{ model.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ model.year }} • {{ model.engine }}cc</v-list-item-subtitle>
                    <template v-slot:append>
                      <div class="model-actions">
                        <v-btn
                          icon="mdi-pencil"
                          size="small"
                          variant="text"
                          color="success"
                          @click.stop="editModel(model)"
                        ></v-btn>
                        <v-btn
                          icon="mdi-delete"
                          size="small"
                          variant="text"
                          color="error"
                          @click.stop="deleteModelItem(model)"
                        ></v-btn>
                      </div>
                    </template>
                  </v-list-item>
                </v-list>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Cards Section -->
      <v-row>
        <v-col cols="12">
          <v-card class="content-card cards-card">
            <v-card-title class="card-title">
              <div class="title-content">
                <v-icon class="title-icon" color="info">mdi-credit-card</v-icon>
                <span>Fuel Cards</span>
                <v-chip color="info" size="small" class="ms-2">{{ cardList.length }}</v-chip>
              </div>
              <v-btn
                icon="mdi-plus"
                variant="text"
                size="small"
                @click="showCardDialog = true"
              ></v-btn>
            </v-card-title>
            <v-card-text>
              <div v-if="cardList.length === 0" class="empty-state">
                <v-icon size="64" color="info" class="mb-4">mdi-credit-card-outline</v-icon>
                <h3 class="text-h6 text-muted mb-2">No fuel cards added yet</h3>
                <p class="text-muted">Add fuel cards for your fleet operations</p>
              </div>
              <div v-else>
                <v-data-table
                  :headers="cardHeaders"
                  :items="cardList"
                  :loading="loading"
                  class="modern-table"
                  density="comfortable"
                >
                  <!-- <template v-slot:item.cardNumber="{ item }"> -->
                    <template v-slot:item_cardNumber="{ item }">

                    <div class="card-info">
                      <v-icon size="small" class="me-2">mdi-credit-card</v-icon>
                      <span class="font-weight-medium">{{ maskCardNumber(item.cardNumber) }}</span>
                    </div>
                  </template>
                  <!-- <template v-slot:item.balance="{ item }"> -->
                    <template v-slot:item_balance="{ item }">

                    <span class="font-weight-medium">{{ item.balance.toLocaleString() }} ETB</span>
                  </template>
                  <!-- <template v-slot:item.status="{ item }"> -->
                  <template v-slot:item.status="{ item }">

                    <v-chip
                      :color="getCardStatusColor(item.status)"
                      size="small"
                      variant="flat"
                    >
                      {{ getCardStatusLabel(item.status) }}
                    </v-chip>
                  </template>

                    <template v-slot:item.holder="{ item }">
                      {{usersList.find(x => x.id == item.holder).name}}
                    </template>

                  <!-- <template v-slot:item.actions="{ item }"> -->
                    <template v-slot:item_actions="{ item }">

                    <div class="action-buttons">
                      <v-btn
                        icon="mdi-eye"
                        size="small"
                        variant="text"
                        color="primary"
                        @click="viewCardDetails(item)"
                        :title="'View details for ' + maskCardNumber(item.cardNumber)"
                      ></v-btn>
                      <v-btn
                        icon="mdi-pencil"
                        size="small"
                        variant="text"
                        color="warning"
                        @click="editCard(item)"
                        :title="'Edit ' + maskCardNumber(item.cardNumber)"
                      ></v-btn>
                                              <v-btn
                          icon="mdi-delete"
                          size="small"
                          variant="text"
                          color="error"
                          @click="deleteCardItem(item)"
                          :title="'Delete ' + maskCardNumber(item.cardNumber)"
                        ></v-btn>
                    </div>
                  </template>
                </v-data-table>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Brand Dialog -->
    <v-dialog v-model="showBrandDialog" max-width="500px" persistent>
      <v-card class="dialog-card">
        <v-card-title class="dialog-title">
          <v-icon class="me-2" color="primary">mdi-tag</v-icon>
          {{ editingBrand ? 'Edit Brand' : 'Add New Brand' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="brandFormRef" v-model="brandFormValid">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="brandForm.name"
                  label="Brand Name"
                  variant="outlined"
                  :rules="[v => !!v || 'Brand name is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="brandForm.description"
                  label="Description"
                  variant="outlined"
                  rows="3"
                  placeholder="Brief description of the brand..."
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="dialog-actions">
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            @click="showBrandDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            :loading="savingBrand"
            :disabled="!brandFormValid"
            @click="saveBrand"
          >
            {{ editingBrand ? 'Update Brand' : 'Add Brand' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Model Dialog -->
    <v-dialog v-model="showModelDialog" max-width="600px" persistent>
      <v-card class="dialog-card">
        <v-card-title class="dialog-title">
          <v-icon class="me-2" color="success">mdi-car</v-icon>
          {{ editingModel ? 'Edit Model' : 'Add New Model' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="modelFormRef" v-model="modelFormValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="modelForm.vendorId"
                  :items="vendorList"
                  item-title="name"
                  item-value="id"
                  label="Brand"
                  variant="outlined"
                  :rules="[v => !!v || 'Brand is required']"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="modelForm.name"
                  label="Model Name"
                  variant="outlined"
                  :rules="[v => !!v || 'Model name is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  hide-spin-buttons
                  v-model="modelForm.year"
                  label="Year"
                  type="number"
                  variant="outlined"
                  :rules="[v => !!v || 'Year is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="modelForm.engine"
                  label="Engine Size (L)"
                  variant="outlined"
                  placeholder="2.0"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="modelForm.description"
                  label="Description"
                  variant="outlined"
                  rows="3"
                  placeholder="Model specifications and features..."
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="dialog-actions">
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            @click="showModelDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="success"
            :loading="savingModel"
            :disabled="!modelFormValid"
            @click="saveModel"
          >
            {{ editingModel ? 'Update Model' : 'Add Model' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Card Dialog -->
    <v-dialog v-model="showCardDialog" max-width="600px" persistent>
      <v-card class="dialog-card">
        <v-card-title class="dialog-title">
          <v-icon class="me-2" color="info">mdi-credit-card</v-icon>
          {{ editingCard ? 'Edit Card' : 'Add New Card' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="cardFormRef" v-model="cardFormValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="cardForm.vendorId"
                  label="Vendor"
                  variant="outlined"
                  :rules="[v => !!v || 'Vendor is required']"
                  required
                  :items="cardVendors"
                  item-title="name"
                  item-value="id"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="cardForm.number"
                  label="Card Number"
                  variant="outlined"
                  :rules="[v => !!v || 'Card number is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="cardForm.holder"
                  label="Card Holder"
                  variant="outlined"
                  :rules="[v => !!v || 'Card holder is required']"
                  required
                  item-title="name"
                  item-value="id"
                  :items="usersList"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  hide-spin-buttons
                  v-model="cardForm.balance"
                  label="Balance (ETB)"
                  type="number"
                  variant="outlined"
                  :rules="[v => !!v || 'Balance is required']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="cardForm.status"
                  :items="cardStatusOptions"
                  label="Status"
                  variant="outlined"
                  :rules="[v => !!v || 'Status is required']"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="cardForm.remark"
                  label="Notes"
                  variant="outlined"
                  rows="3"
                  placeholder="Additional notes about the card..."
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="dialog-actions">
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            @click="showCardDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="info"
            :loading="savingCard"
            :disabled="!cardFormValid"
            @click="saveCard"
          >
            {{ editingCard ? 'Update Card' : 'Add Card' }}
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'



const {createVendor, getVendor, vendorList, editVendor} = useVendor()
const {createModel, getModel, modelList} = useModel()
const {createCard, getCard, getUsers, cardList, usersList} = useCard()

// Reactive data
const totalCardValue = ref(0)
const searchQuery = ref('')
const categoryFilter = ref('all')
const statusFilter = ref('all')
const showAdvancedFilters = ref(false)
const loading = ref(false)
const savingBrand = ref(false)
const savingModel = ref(false)
const savingCard = ref(false)
const cardVendors = ref([{
  id: 1,
  name: "NOC"
}])

// Dialog states
const showBrandDialog = ref(false)
const showModelDialog = ref(false)
const showCardDialog = ref(false)
const showSuccessSnackbar = ref(false)
const showErrorSnackbar = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Form refs and validation
const brandFormRef = ref(null)
const modelFormRef = ref(null)
const cardFormRef = ref(null)
const brandFormValid = ref(false)
const modelFormValid = ref(false)
const cardFormValid = ref(false)

// Editing states
const editingBrand = ref(null)
const editingModel = ref(null)
const editingCard = ref(null)

// Form data
const brandForm = ref({
  name: '',
  description: '',
})

const modelForm = ref({
  vendorId: '',
  name: '',
  year: '',
  engine: '',
  description: ''
})

const cardForm = ref({
  vendorId: 1,
  number: '',
  holder: '',
  balance: '',
  status: 1,
  remark: ''
})

// Options
const categoryOptions = [
  { title: 'All Categories', value: 'all' },
  { title: 'Brands', value: 'brands' },
  { title: 'Models', value: 'models' },
  { title: 'Cards', value: 'cards' }
]

const statusOptions = [
  { title: 'All Status', value: 'all' },
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
  { title: 'Suspended', value: 'suspended' }
]

const cardStatusOptions = [
  { title: 'Active', value: 1 },
  { title: 'Inactive', value: 2 },
  { title: 'Suspended', value: 3 },
  { title: 'Expired', value: 4 }
]

// Table headers
const cardHeaders = [
  { title: 'Card Number', key: 'number', sortable: true },
  { title: 'Card Holder', key: 'holder', sortable: true },
  { title: 'Balance', key: 'balance', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
]





const getCardStatusColor = (status) => {
  const colors = {
    1: 'success',
    2: 'grey',
    3: 'warning',
    4: 'error'
  }
  return colors[status] || 'grey'
}

const getCardStatusLabel = (status) => {
    return cardStatusOptions.find(x => x.value = status).title
}

// Action methods
const editBrand = (brand) => {
  editingBrand.value = brand
  brandForm.value = { ...brand }
  showBrandDialog.value = true
}

const editModel = (model) => {
  editingModel.value = model
  modelForm.value = { ...model }
  showModelDialog.value = true
}

const editCard = (card) => {
  editingCard.value = card
  cardForm.value = { ...card }
  showCardDialog.value = true
}

const deleteBrandItem = async (brand) => {
  if (confirm(`Are you sure you want to delete the brand "${brand.name}"?`)) {
    try {
      deleteBrand(brand.id)
      showSuccessMessage('Brand deleted successfully')
    } catch (error) {
      showErrorMessage('Failed to delete brand')
    }
  }
}

const deleteModelItem = async (model) => {
  if (confirm(`Are you sure you want to delete the model "${model.name}"?`)) {
    try {
      deleteModel(model.id)
      showSuccessMessage('Model deleted successfully')
    } catch (error) {
      showErrorMessage('Failed to delete model')
    }
  }
}

const deleteCardItem = async (card) => {
  if (confirm(`Are you sure you want to delete the card "${maskCardNumber(card.cardNumber)}"?`)) {
    try {
      deleteCard(card.id)
      showSuccessMessage('Card deleted successfully')
    } catch (error) {
      showErrorMessage('Failed to delete card')
    }
  }
}

const saveBrand = async () => {
  savingBrand.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (editingBrand.value) {
      // Update existing brand
      await editVendor(editingBrand.value.id, {'name' : brandForm.value.name, 'description' : brandForm.value.description})
    } else {
      console.log('brandForm.value', brandForm.value);
      
      // Add new brand
      await createVendor(brandForm.value)
    }
    
    showBrandDialog.value = false
    resetBrandForm()
    showSuccessMessage(editingBrand.value ? 'Brand updated successfully' : 'Brand added successfully')
  } catch (error) {
    showErrorMessage('Failed to save brand')
  } finally {
    savingBrand.value = false
    editingBrand.value = null
  }
}

const saveModel = async () => {
  savingModel.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (editingModel.value) {
      // Update existing model
      updateModel(editingModel.value.id, modelForm.value)
    } else {
      // Add new model
      // addModel(modelForm.value)
      createModel(modelForm.value)
    }
    

    
    showModelDialog.value = false
    resetModelForm()
    showSuccessMessage(editingModel.value ? 'Model updated successfully' : 'Model added successfully')
  } catch (error) {
    showErrorMessage('Failed to save model')
  } finally {
    savingModel.value = false
    editingModel.value = null
  }
}

const saveCard = async () => {
  savingCard.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (editingCard.value) {
      // Update existing card
      updateCard(editingCard.value.id, {
        ...cardForm.value,
        balance: parseFloat(cardForm.value.balance)
      })
    } else {
      // Add new card
      await createCard(cardForm.value)
    }
    
    showCardDialog.value = false
    resetCardForm()
    showSuccessMessage(editingCard.value ? 'Card updated successfully' : 'Card added successfully')
  } catch (error) {
    showErrorMessage('Failed to save card')
  } finally {
    savingCard.value = false
    editingCard.value = null
  }
}

const resetBrandForm = () => {
  brandForm.value = {
    name: '',
    description: '',
    icon: 'mdi-tag'
  }
}

const resetModelForm = () => {
  modelForm.value = {
    brandId: '',
    name: '',
    year: '',
    engineSize: '',
    description: ''
  }
}

const resetCardForm = () => {
  cardForm.value = {
    cardNumber: '',
    cardHolder: '',
    balance: '',
    status: 'active',
    notes: ''
  }
}

const filterVendorData = () => {
  // Filter logic is handled by computed properties
  console.log('Filtering vendor data...')
}

const viewCardDetails = (card) => {
  console.log('View card details:', card)
  // Could open a detailed view dialog
}

const filterByBrands = () => {
  categoryFilter.value = 'brands'
  showSuccessMessage('Filtered by brands')
}

const filterByModels = () => {
  categoryFilter.value = 'models'
  showSuccessMessage('Filtered by models')
}

const filterByActiveCards = () => {
  statusFilter.value = 'active'
  showSuccessMessage('Filtered by active cards')
}

const showValueBreakdown = () => {
  console.log('Showing value breakdown...')
  // Could open a dialog with detailed value analysis
}

const showSuccessMessage = (message) => {
  successMessage.value = message
  showSuccessSnackbar.value = true
}

const showErrorMessage = (message) => {
  errorMessage.value = message
  showErrorSnackbar.value = true
}

const getVendors = async () => {
  await getVendor()
}

const getModels = async () => {
   await getModel()
}

const getUsersHandler = async () => {
  await getUsers()
}

const getCards = async () => {
  await getCard()

  cardList.value.forEach(aa => {
      totalCardValue.value += aa.balance
  });
}
// Lifecycle
onMounted(async () => {
  // Initialize vendor data
 await getVendors()
 await getModels()
 await getUsersHandler()
 await getCards()
  

})
</script>

<style scoped>
.vendor-management-root {
  padding: 24px;
  min-height: 100vh;
}

.vendor-header {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
}

.header-text {
  flex: 1;
}

.vendor-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1976d2;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.vendor-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
  opacity: 0.8;
}

.header-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.header-btn {
  font-weight: 600;
  border-radius: 12px;
  text-transform: none;
  padding: 12px 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.header-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.kpi-section {
  margin-bottom: 32px;
}

.search-filter-section {
  margin-bottom: 32px;
}

.search-card {
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(25, 118, 210, 0.15);
  border: 1px solid rgba(25, 118, 210, 0.2);
}

.search-field {
  border-radius: 12px;
}

.main-content {
  margin-bottom: 32px;
}

.content-card {
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(15px);
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.12);
  border: 1px solid rgba(25, 118, 210, 0.15);
  transition: all 0.3s ease;
  overflow: hidden;
}

.content-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(25, 118, 210, 0.2);
  border-color: rgba(25, 118, 210, 0.3);
}

.brands-card {
  background: linear-gradient(135deg, #ffffff 0%, #e3f2fd 30%, #bbdefb 100%);
}

.models-card {
  background: linear-gradient(135deg, #ffffff 0%, #e8f5e8 40%, #c8e6c9 100%);
}

.cards-card {
  background: linear-gradient(135deg, #ffffff 0%, #e3f2fd 20%, #bbdefb 100%);
}

.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 16px 24px;
  border-bottom: 2px solid rgba(25, 118, 210, 0.3);
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(227, 242, 253, 0.1) 100%);
}

.title-content {
  display: flex;
  align-items: center;
}

.title-icon {
  margin-right: 12px;
}

.modern-table {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.brand-list, .model-list {
  border-radius: 12px;
  overflow: hidden;
}

.brand-item, .model-item {
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.brand-item:hover, .model-item:hover {
  background: rgba(25, 118, 210, 0.1) !important;
  transform: translateX(4px);
}

.brand-actions, .model-actions {
  display: flex;
  gap: 4px;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.card-info {
  display: flex;
  align-items: center;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: #666;
  opacity: 0.7;
}

.dialog-card {
  border-radius: 20px;
  overflow: hidden;
}

.dialog-title {
  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  padding: 24px;
}

.dialog-actions {
  padding: 24px;
  background: linear-gradient(135deg, #ffffff 0%, #e3f2fd 20%);
}

/* Responsive Design */
@media (max-width: 768px) {
  .vendor-management-root {
    padding: 16px;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-actions {
    width: 100%;
    justify-content: stretch;
  }
  
  .header-btn {
    flex: 1;
  }
  
  .vendor-title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .card-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style> 