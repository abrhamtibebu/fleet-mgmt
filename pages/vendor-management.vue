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
    <v-list-item-subtitle>{{ modelList.filter(x => x.vendorId == brand.id).length }} {{ modelList.filter(x => x.vendorId == brand.id).length <= 1 ? 'model' : 'models' }}</v-list-item-subtitle>
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
      icon
      size="small"
      variant="text"
      :color="brand.status === 1 ? 'success' : 'error'"
      @click.stop="toggleVendorStatus(brand)"
      :title="brand.status === 1 ? 'Active (click to deactivate)' : 'Inactive (click to activate)'"
    >
      <v-icon>{{ brand.status === 1 ? 'mdi-check' : 'mdi-close' }}</v-icon>
    </v-btn>
        <!-- DELETE BUTTON GOES HERE -->
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
      icon
      size="small"
      variant="text"
      :color="model.status === 1 ? 'success' : 'error'"
      @click.stop="toggleModelStatus(model)"
      :title="model.status === 1 ? 'Active (click to deactivate)' : 'Inactive (click to activate)'"
    >
      <v-icon>{{ model.status === 1 ? 'mdi-check' : 'mdi-close' }}</v-icon>
    </v-btn>
                        
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
                    <template v-slot:item.number="{ item }">

                    <div class="card-info">
                      <v-icon size="small" class="me-2">mdi-credit-card</v-icon>
                      <span class="font-weight-medium">{{(item.cardNumber) }}</span>
                    </div>
                  </template>
                  <!-- <template v-slot:item.balance="{ item }"> -->
                    <template v-slot:item.balance="{ item }">

                    <span class="font-weight-medium">{{ item.balance.toLocaleString() }} ETB</span>
                  </template>
                  <!-- <template v-slot:item.status="{ item }"> -->
                  <template v-slot:item.status="{ item }">

                    <v-chip
                      :color="getCardStatusColor(item.status)"
                      size="small"
                      variant="flat"
                          class="status-chip"

                    >
                      {{ getCardStatusLabel(item.status)}}
                    </v-chip>
                  </template>

                    <template v-slot:item.holder="{ item }">
                      {{usersList.find(x => x.id == item.holder).name}}
                    </template>                    
                  <template v-slot:item.actions="{ item }">
  <div class="action-buttons">
    <!-- <v-btn
      icon="mdi-eye"
      size="small"
      variant="text"
      color="primary"
      @click.stop="viewCardDetails(item)"
      :title="'View details for ' + (item.number)"
    ></v-btn> -->
    <v-btn
      icon
      size="small"
      variant="text"
      :color="item.status === 1 ? 'success' : 'error'"
      @click.stop="toggleCardStatus(item)"
      :title="item.status === 1 ? 'Active (click to deactivate)' : 'Inactive (click to activate)'"
>
      <v-icon>{{ item.status === 1 ? 'mdi-check' : 'mdi-close' }}</v-icon>
    </v-btn>
    <v-btn
      icon="mdi-pencil"
      size="small"
      variant="text"
      color="warning"
      @click.stop="editCard(item)"
      :title="'Edit ' + (item.number)"
    ></v-btn>
    <!-- <v-btn
  icon="mdi-delete"
  size="small"
  variant="text"
  color="error"
  @click.stop="deleteCardItem(item)"
  :title="'Delete ' +(item.number)"
></v-btn> -->
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
                <v-text-field
                  v-model="cardForm.expiryDate"
                  label="Expiry Date"
                  type="date"
                  variant="outlined"
                  :rules="[v => !!v || 'Expiry date is required']"
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

    <!-- neww Delete Confirmation Dialog -->
<!-- Brand Delete Dialog -->
<v-dialog v-model="showDeleteBrandDialog" max-width="500px" persistent>
  <v-card class="dialog-card">
    <v-card-title class="dialog-title">
      <v-icon class="me-2" color="error">mdi-alert-circle</v-icon>
      Confirm Brand Deletion
    </v-card-title>
    <v-card-text>
      Are you sure you want to delete brand "{{ brandToDelete?.name }}"?
      <!-- <span v-if="modelList.filter(x => x.vendorId === brandToDelete?.id).length" class="text-error d-block mt-2">
        Warning: This will also delete {{ modelList.filter(x => x.vendorId === brandToDelete?.id).length }} associated models!
      </span> -->
    </v-card-text>
    <v-card-actions class="dialog-actions">
      <v-spacer></v-spacer>
      <v-btn variant="outlined" @click="showDeleteBrandDialog = false">Cancel</v-btn>
      <v-btn color="error" :loading="deletingBrand" @click="confirmDeleteBrand">Delete</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<!-- Model Delete Dialog -->
<v-dialog v-model="showDeleteModelDialog" max-width="500px" persistent>
  <v-card class="dialog-card">
    <v-card-title class="dialog-title">
      <v-icon class="me-2" color="error">mdi-alert-circle</v-icon>
      Confirm Model Deletion
    </v-card-title>
    <v-card-text>
      Are you sure you want to delete model "{{ modelToDelete?.name }}"?
    </v-card-text>
    <v-card-actions class="dialog-actions">
      <v-spacer></v-spacer>
      <v-btn variant="outlined" @click="showDeleteModelDialog = false">Cancel</v-btn>
      <v-btn color="error" :loading="deletingModel" @click="confirmDeleteModel">Delete</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<!-- Card Delete Dialog -->
<v-dialog v-model="showDeleteCardDialog" max-width="500px" persistent>
  <v-card class="dialog-card">
    <v-card-title class="dialog-title">
      <v-icon class="me-2" color="error">mdi-alert-circle</v-icon>
      Confirm Card Deletion
    </v-card-title>
    <v-card-text>
      Are you sure you want to delete Card Number  "{{(cardToDelete?.number) }}"?
    </v-card-text>
    <v-card-actions class="dialog-actions">
      <v-spacer></v-spacer>
      <v-btn variant="outlined" @click="showDeleteCardDialog = false">Cancel</v-btn>
      <v-btn color="error" :loading="deletingCard" @click="confirmDeleteCard">Delete</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
    <!-- Card Details Dialog -->
    <v-dialog v-model="showCardDetailsDialog" max-width="600px">
      <v-card class="dialog-card">
        <v-card-title class="dialog-title">
          <v-icon class="me-2" color="info">mdi-credit-card</v-icon>
          Card Details
        </v-card-title>
        <v-card-text v-if="selectedCard" class="pa-6">
          <v-row>
            <v-col cols="12" md="6">
              <div class="detail-item">
                <label class="detail-label">Card Number</label>
                <div class="detail-value">
                  <v-icon size="small" class="me-2">mdi-credit-card</v-icon>
                  {{ maskCardNumber(selectedCard.number) }}
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="detail-item">
                <label class="detail-label">Card Holder</label>
                <div class="detail-value">
                  <v-icon size="small" class="me-2">mdi-account</v-icon>
                  {{ usersList.find(x => x.id == selectedCard.holder)?.name || 'Unknown' }}
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="detail-item">
                <label class="detail-label">Balance</label>
                <div class="detail-value">
                  <v-icon size="small" class="me-2">mdi-currency-usd</v-icon>
                  {{ selectedCard.balance.toLocaleString() }} ETB
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="detail-item">
                <label class="detail-label">Status</label>
                <div class="detail-value">
                  <v-chip
                    :color="getCardStatusColor(selectedCard.status)"
                    size="small"
                    variant="flat"
                  >
                    {{ getCardStatusLabel(selectedCard.status) }}
                  </v-chip>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="detail-item">
                <label class="detail-label">Expiry Date</label>
                <div class="detail-value">
                  <v-icon size="small" class="me-2">mdi-calendar</v-icon>
                  {{ selectedCard.expiryDate || 'Not set' }}
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="detail-item">
                <label class="detail-label">Vendor</label>
                <div class="detail-value">
                  <v-icon size="small" class="me-2">mdi-store</v-icon>
                  {{ cardVendors.find(v => v.id === selectedCard.vendorId)?.name || 'Unknown' }}
                </div>
              </div>
            </v-col>
            <v-col cols="12" v-if="selectedCard.remark">
              <div class="detail-item">
                <label class="detail-label">Remarks</label>
                <div class="detail-value">
                  <v-icon size="small" class="me-2">mdi-note-text</v-icon>
                  {{ selectedCard.remark }}
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="dialog-actions">
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            @click="showCardDetailsDialog = false"
          >
            Close
          </v-btn>
          <v-btn
            color="warning"
            @click="editCard(selectedCard); showCardDetailsDialog = false"
          >
            Edit Card
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Refill Card Dialog -->
    <v-dialog v-model="showRefillDialog" max-width="500px" persistent>
      <v-card class="dialog-card">
        <v-card-title class="dialog-title">
          <v-icon class="me-2" color="success">mdi-gas-station</v-icon>
          Refill Fuel Card
        </v-card-title>
        <v-card-text>
          <div v-if="selectedCardForRefill" class="refill-info mb-4">
            <v-alert type="info" variant="tonal" class="mb-4">
              <div class="d-flex align-center">
                <v-icon class="me-2">mdi-credit-card</v-icon>
                <div>
                  <div class="font-weight-medium">{{ maskCardNumber(selectedCardForRefill.number) }}</div>
                  <div class="text-caption">Current Balance: {{ selectedCardForRefill.balance.toLocaleString() }} ETB</div>
                </div>
              </div>
            </v-alert>
          </div>
          
          <v-form ref="refillFormRef" v-model="refillFormValid">
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
            @click="showRefillDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="success"
            :loading="refilling"
            :disabled="!refillFormValid"
            @click="processRefill"
          >
            <v-icon class="me-2">mdi-gas-station</v-icon>
            Process Refill
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="showSuccessSnackbar"
      color="success"
      timeout="3000"
      location="top"
      size="5000px"


    >
      {{ successMessage }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="showSuccessSnackbar = false"
          location="top"


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



const {createVendor, getVendor, vendorList, editVendor, deleteVendor, changeVendorStatus} = useVendor()
const {createModel, getModel, modelList, deleteModel, changeModelStatus} = useModel()
const {createCard, getCard, getUsers, cardList, usersList , deleteCard, changeCardStatus} = useCard()

// Reactive data
// neww



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
const showCardDetailsDialog = ref(false)
const showRefillDialog = ref(false)
const showSuccessSnackbar = ref(false)
const showErrorSnackbar = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Form refs and validation
const brandFormRef = ref(null)
const modelFormRef = ref(null)
const cardFormRef = ref(null)
const refillFormRef = ref(null)
const brandFormValid = ref(false)
const modelFormValid = ref(false)
const cardFormValid = ref(false)
const refillFormValid = ref(false)

// Editing states
const editingBrand = ref(null)
const editingModel = ref(null)
const editingCard = ref(null)
const selectedCard = ref(null)
const selectedCardForRefill = ref(null)
const refilling = ref(false)

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
  expiryDate: '',
  status: 1,
  remark: ''
})

const refillForm = ref({
  amount: '',
  notes: ''
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
  { title: 'Inactive', value: 0 },
  { title: 'Suspended', value: 2 },
  { title: 'Expired', value: 3 }
]

// Table headers
const cardHeaders = [
  { title: 'Card Number', key: 'number', sortable: true },
  { title: 'Card Holder', key: 'holder', sortable: true },
  { title: 'Balance', key: 'balance', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Expiry Date', key: 'expiryDate', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
]





const getCardStatusColor = (status) => {
  const colors = {
    1: 'success',
    0: 'red',
    2: 'warning',
    3: 'error'
  }
  return colors[status] || 'grey'
}

// newwwwww Add these methods
// Delete dialog states
const showDeleteBrandDialog = ref(false)
const showDeleteModelDialog = ref(false)
const showDeleteCardDialog = ref(false)

// Items to delete
const brandToDelete = ref(null)
const modelToDelete = ref(null)
const cardToDelete = ref(null)

// Loading states
const deletingBrand = ref(false)
const deletingModel = ref(false)
const deletingCard = ref(false)

// Delete methods
const deleteBrandItem = (brand) => {
  brandToDelete.value = brand
  showDeleteBrandDialog.value = true
}
const getCardStatusLabel = (status) => {
    const option = cardStatusOptions.find(x => x.value === status)
    return option ? option.title : 'Unknown'
}

const deleteModelItem = (model) => {
  modelToDelete.value = model
  showDeleteModelDialog.value = true
}

const deleteCardItem = (card) => {
  cardToDelete.value = card
  showDeleteCardDialog.value = true
}

// Confirmation methods
const confirmDeleteBrand = async () => {
  deletingBrand.value = true
  try {
    await deleteVendor(brandToDelete.value.id)
    vendorList.value = vendorList.value.filter(v => v.id !== brandToDelete.value.id)
    showSuccessMessage('Brand deleted successfully')
    showDeleteBrandDialog.value = false
  } catch (error) {
    showErrorMessage('Failed to delete brand: ' + (error.value || error.message))
  } finally {
    deletingBrand.value = false
    brandToDelete.value = null
  }
}

const confirmDeleteModel = async () => {
  deletingModel.value = true
  try {
    await deleteModel(modelToDelete.value.id)
    modelList.value = modelList.value.filter(m => m.id !== modelToDelete.value.id)
    showSuccessMessage('Model deleted successfully')
    showDeleteModelDialog.value = false
  } catch (error) {
    showErrorMessage('Failed to delete model: ' + (error.value || error.message))
  } finally {
    deletingModel.value = false
    modelToDelete.value = null
  }
}

const confirmDeleteCard = async () => {
  deletingCard.value = true
  try {
    await deleteCard(cardToDelete.value.id)
    cardList.value = cardList.value.filter(c => c.id !== cardToDelete.value.id)
    showSuccessMessage('Card deleted successfully')
    showDeleteCardDialog.value = false
  } catch (error) {
    showErrorMessage('Failed to delete card: ' + (error.value || error.message))
  } finally {
    deletingCard.value = false
    cardToDelete.value = null
  }
}
// changing status
const toggleVendorStatus = async (vendor) => {
  try {
    const newStatus = vendor.status === 1 ? 0 : 1 // Assuming 1=active, 0=inactive
    await changeVendorStatus(vendor.id, newStatus)
    await getVendors() // Refresh the list
    showSuccessMessage(`Brand ${newStatus === 1 ? 'activated' : 'deactivated'} successfully`)
  } catch (error) {
    showErrorMessage(`Failed to change status: ${error.message}`)
  }
}

const toggleModelStatus = async (model) => {
  try {
    const newStatus = model.status === 1 ? 0 : 1
    await changeModelStatus(model.id, newStatus)
    await getModels()
    showSuccessMessage(`Model ${newStatus === 1 ? 'activated' : 'deactivated'} successfully`)
  } catch (error) {
    showErrorMessage(`Failed to change status: ${error.message}`)
  }
}

const toggleCardStatus = async (card) => {
  try {
    const newStatus = card.status === 1 ? 0 : 1
    await changeCardStatus(card.id, newStatus)
    await getCards()
    showSuccessMessage(`Card ${newStatus === 1 ? 'activated' : 'deactivated'} successfully`)
  } catch (error) {
    showErrorMessage(`Failed to change status: ${error.message}`)
  }
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

// const deleteBrandItem = async (brand) => {
//   if (confirm(`Are you sure you want to delete the brand "${brand.name}"?`)) {
//     try {
//       deleteBrand(brand.id)
//       showSuccessMessage('Brand deleted successfully')
//     } catch (error) {
//       showErrorMessage('Failed to delete brand')
//     }
//   }
// }

// const deleteModelItem = async (model) => {
//   if (confirm(`Are you sure you want to delete the model "${model.name}"?`)) {
//     try {
//       deleteModel(model.id)
//       showSuccessMessage('Model deleted successfully')
//     } catch (error) {
//       showErrorMessage('Failed to delete model')
//     }
//   }
// }

// const deleteCardItem = async (card) => {
//   if (confirm(`Are you sure you want to delete the card "${(card.cardNumber)}"?`)) {
//     try {
//       deleteCard(card.id)
//       showSuccessMessage('Card deleted successfully')
//     } catch (error) {
//       showErrorMessage('Failed to delete card')
//     }
//   }
// }


const refreshCardBalance = async (card) => {
  try {
    // Add loading state to the specific card
    card.refreshing = true
    
    // Simulate API call to refresh balance
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Update the balance (in a real app, this would come from the API)
    const cardIndex = cardList.value.findIndex(c => c.id === card.id)
    if (cardIndex !== -1) {
      // Simulate a new balance (in real app, this would be from API)
      const newBalance = Math.floor(Math.random() * 10000) + 1000
      cardList.value[cardIndex].balance = newBalance.toString()
    }
    
    showSuccessMessage('Card balance refreshed successfully')
  } catch (error) {
    showErrorMessage('Failed to refresh card balance')
  } finally {
    card.refreshing = false
  }
}

const openRefillDialog = (card) => {
  selectedCardForRefill.value = card
  refillForm.value = {
    amount: '',
    notes: ''
  }
  showRefillDialog.value = true
}

const processRefill = async () => {
  refilling.value = true
  try {
    // Simulate API call to process refill
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const refillAmount = parseFloat(refillForm.value.amount)
    const cardIndex = cardList.value.findIndex(c => c.id === selectedCardForRefill.value.id)
    
    if (cardIndex !== -1) {
      // Update the card balance
      const currentBalance = parseFloat(cardList.value[cardIndex].balance)
      const newBalance = currentBalance + refillAmount
      cardList.value[cardIndex].balance = newBalance.toString()
      
      // In a real app, you would also create a fuel record entry here
      // await createFuelRecord({
      //   cardId: selectedCardForRefill.value.id,
      //   amount: refillAmount,
      //   type: 'refill',
      //   notes: refillForm.value.notes,
      //   date: new Date().toISOString()
      // })
    }
    
    showRefillDialog.value = false
    resetRefillForm()
    showSuccessMessage(`Card refilled successfully with ${refillAmount.toLocaleString()} ETB`)
  } catch (error) {
    showErrorMessage('Failed to process refill')
  } finally {
    refilling.value = false
    selectedCardForRefill.value = null
  }
}

const resetRefillForm = () => {
  refillForm.value = {
    amount: '',
    notes: ''
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
    vendorId: 1,
    number: '',
    holder: '',
    balance: '',
    expiryDate: '',
    status: 1,
    remark: ''
  }
}

const filterVendorData = () => {
  // Filter logic is handled by computed properties
  console.log('Filtering vendor data...')
}

const viewCardDetails = (card) => {
  selectedCard.value = card
  showCardDetailsDialog.value = true
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

// Utility function to mask card numbers
const maskCardNumber = (cardNumber) => {
  if (!cardNumber) return 'N/A'
  const str = cardNumber.toString()
  if (str.length <= 8) return str
  return str.slice(0, 4) + '****' + str.slice(-4)
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
  padding: 32px;
  min-height: 100vh;
  background: #fafafa;
}

.vendor-header {
  margin-bottom: 40px;
  background: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
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
  font-size: 2.75rem;
  font-weight: 900;
  color: #040707;
  margin-bottom: 12px;
  letter-spacing: -1px;
  line-height: 1.1;
}

.vendor-subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0;
  font-weight: 400;
  line-height: 1.5;
}

.header-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.header-btn {
  font-weight: 600;
  border-radius: 16px;
  text-transform: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.95rem;
  letter-spacing: 0.025em;
}

.header-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.kpi-section {
  margin-bottom: 40px;
}

.search-filter-section {
  margin-bottom: 40px;
}

.search-card {
  border-radius: 20px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.search-field {
  border-radius: 16px;
}

.main-content {
  margin-bottom: 40px;
}

.content-card {
  border-radius: 24px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.content-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  border-color: rgba(0, 0, 0, 0.1);
}

.brands-card {
  background: white;
}

.models-card {
  background: white;
}

.cards-card {
  background: white;
}

.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28px 28px 20px 28px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  font-size: 1.375rem;
  font-weight: 700;
  color: #040707;
  background: white;
}

.title-content {
  display: flex;
  align-items: center;
}

.title-icon {
  margin-right: 16px;
  font-size: 1.5rem;
}

.modern-table {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.brand-list, .model-list {
  border-radius: 16px;
  overflow: hidden;
}

.brand-item, .model-item {
  border-radius: 12px;
  margin-bottom: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 16px;
}

.brand-item:hover, .model-item:hover {
  background: rgba(0, 0, 0, 0.04) !important;
  transform: translateX(6px);
}

.brand-actions, .model-actions {
  display: flex;
  gap: 4px;
}

/* .action-buttons {
  display: flex;
  gap: 4px;
  color:red
} */

.card-actions {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: flex-end;
  padding: 4px 0;
}

.action-btn {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  min-width: 32px;
  height: 32px;
}

.action-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.action-btn:active {
  transform: scale(0.95);
}

.detail-item {
  margin-bottom: 16px;
}

.detail-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.detail-value {
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 500;
  color: #111827;
  padding: 8px 0;
}

.card-info {
  display: flex;
  align-items: center;
  font-weight: 600;
}

.expiry-date-info {
  display: flex;
  align-items: center;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 64px 32px;
  color: #6b7280;
  opacity: 0.8;
}

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

.dialog-actions {
  padding: 28px;
  background: white;
}

.refill-info {
  margin-bottom: 24px;
}

.refill-info .v-alert {
  border-radius: 12px;
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