<template>
  <div class="analytics-reports-root">
    <!-- Modern Header with Filters -->
    <div class="modern-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">
            <v-icon class="title-icon" color="primary">mdi-chart-box</v-icon>
            Fleet Analytics & Reports
          </h1>
          <p class="page-subtitle">Comprehensive fleet performance analysis and operational insights</p>
        </div>
        
        <!-- Advanced Filter Panel -->
        <div class="filter-panel">
          <v-expansion-panels variant="accordion" class="filter-accordion">
            <v-expansion-panel>
              <v-expansion-panel-title class="filter-title">
                <v-icon class="me-2">mdi-filter-variant</v-icon>
                Advanced Filters & Export Options
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-row>
                  <v-col cols="12" md="3">
                    <v-select
                      v-model="filters.timeframe"
                      :items="timeframeOptions"
                      label="Time Period"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-calendar"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-select
                      v-model="filters.vehicleType"
                      :items="vehicleTypeOptions"
                      label="Vehicle Type"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-car"
                      clearable
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-select
                      v-model="filters.status"
                      :items="statusOptions"
                      label="Vehicle Status"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-check-circle"
                      clearable
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-select
                      v-model="filters.reportType"
                      :items="reportTypeOptions"
                      label="Report Type"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-file-chart"
                    />
                  </v-col>
                </v-row>
                
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="filters.searchQuery"
                      label="Search Vehicles"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-magnify"
                      placeholder="Search by plate number, model, or driver"
                      clearable
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      v-model="filters.minCost"
                      label="Min Cost (ETB)"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-currency-usd"
                      type="number"
                      clearable
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      v-model="filters.maxCost"
                      label="Max Cost (ETB)"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-currency-usd"
                      type="number"
                      clearable
                    />
                  </v-col>
                </v-row>
                
                <!-- Export Options -->
                <v-divider class="my-4"></v-divider>
                <div class="export-section">
                  <h4 class="export-title">
                    <v-icon class="me-2">mdi-download</v-icon>
                    Export Reports
                  </h4>
                  <div class="export-buttons">
                    <v-btn
                      color="primary"
                      variant="outlined"
                      prepend-icon="mdi-file-excel"
                      @click="exportReport('excel')"
                      :loading="exporting.excel"
                      class="export-btn"
                    >
                      Export to Excel
                    </v-btn>
                    <v-btn
                      color="success"
                      variant="outlined"
                      prepend-icon="mdi-file-pdf-box"
                      @click="exportReport('pdf')"
                      :loading="exporting.pdf"
                      class="export-btn"
                    >
                      Export to PDF
                    </v-btn>
                    <v-btn
                      color="info"
                      variant="outlined"
                      prepend-icon="mdi-file-csv"
                      @click="exportReport('csv')"
                      :loading="exporting.csv"
                      class="export-btn"
                    >
                      Export to CSV
                    </v-btn>
                    <v-btn
                      color="warning"
                      variant="outlined"
                      prepend-icon="mdi-file-word"
                      @click="exportReport('word')"
                      :loading="exporting.word"
                      class="export-btn"
                    >
                      Export to Word
                    </v-btn>
                  </div>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </div>
    </div>

    <!-- Enhanced Stats Cards - Full Width -->
    <div class="stats-section-full">
      <v-row>
        <v-col cols="12" sm="6" md="4" lg="2">
          <div class="stat-card primary-gradient">
            <div class="stat-icon">
              <v-icon size="24" color="white">mdi-truck</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-value">{{ filteredVehicles.length }}</h3>
              <p class="stat-label">Total Vehicles</p>
              <div class="stat-change positive">
                <v-icon size="14">mdi-trending-up</v-icon>
                <span>+2.5%</span>
              </div>
            </div>
          </div>
        </v-col>
        <v-col cols="12" sm="6" md="4" lg="2">
          <div class="stat-card success-gradient">
            <div class="stat-icon">
              <v-icon size="24" color="white">mdi-check-circle</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-value">{{ activeVehicles.length }}</h3>
              <p class="stat-label">Active Vehicles</p>
              <div class="stat-change positive">
                <v-icon size="14">mdi-trending-up</v-icon>
                <span>+1.8%</span>
              </div>
            </div>
          </div>
        </v-col>
        <v-col cols="12" sm="6" md="4" lg="2">
          <div class="stat-card orange-gradient">
            <div class="stat-icon">
              <v-icon size="24" color="white">mdi-gas-station</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-value">{{ formatCurrency(totalFuelCost) }}</h3>
              <p class="stat-label">Fuel Costs</p>
              <div class="stat-change negative">
                <v-icon size="14">mdi-trending-down</v-icon>
                <span>-2.1%</span>
              </div>
            </div>
          </div>
        </v-col>
        <v-col cols="12" sm="6" md="4" lg="2">
          <div class="stat-card teal-gradient">
            <div class="stat-icon">
              <v-icon size="24" color="white">mdi-wrench</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-value">{{ formatCurrency(totalMaintenanceCost) }}</h3>
              <p class="stat-label">Maintenance Costs</p>
              <div class="stat-change positive">
                <v-icon size="14">mdi-trending-up</v-icon>
                <span>+4.7%</span>
              </div>
            </div>
          </div>
        </v-col>
        <v-col cols="12" sm="6" md="4" lg="2">
          <div class="stat-card info-gradient">
            <div class="stat-icon">
              <v-icon size="24" color="white">mdi-shield-check</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-value">{{ formatCurrency(totalInsuranceCost) }}</h3>
              <p class="stat-label">Insurance Costs</p>
              <div class="stat-change positive">
                <v-icon size="14">mdi-trending-up</v-icon>
                <span>+8.2%</span>
              </div>
            </div>
          </div>
        </v-col>
        <v-col cols="12" sm="6" md="4" lg="2">
          <div class="stat-card warning-gradient">
            <div class="stat-icon">
              <v-icon size="24" color="white">mdi-currency-usd</v-icon>
            </div>
            <div class="stat-content">
              <h3 class="stat-value">{{ formatCurrency(totalOperatingCost) }}</h3>
              <p class="stat-label">Total Operating Cost</p>
              <div class="stat-change negative">
                <v-icon size="14">mdi-trending-down</v-icon>
                <span>-3.2%</span>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- Main Analytics Grid - Full Width -->
    <div class="analytics-grid-full">
      <!-- Fuel Analytics Section -->
      <div class="analytics-section">
        <div class="section-header">
          <h2 class="section-title">
            <v-icon class="me-2" color="warning">mdi-gas-station</v-icon>
            Fuel Analytics
          </h2>
          <div class="section-actions">
            <v-btn
              variant="text"
              size="small"
              prepend-icon="mdi-refresh"
              @click="refreshFuelData"
            >
              Refresh
            </v-btn>
            <v-btn
              variant="text"
              size="small"
              prepend-icon="mdi-download"
              @click="exportFuelReport"
            >
              Export
            </v-btn>
          </div>
        </div>
        
        <v-row>
          <v-col cols="12" lg="8">
            <div class="chart-card">
              <div class="chart-header">
                <h3>Fuel Consumption Trends</h3>
                <v-select
                  v-model="fuelTimeframe"
                  :items="['Last 6 Months', 'Last Year', 'Last 2 Years']"
                  density="compact"
                  variant="outlined"
                  hide-details
                  class="timeframe-select"
                />
              </div>
              <div class="chart-container">
                <div ref="fuelConsumptionChart" class="chart-area"></div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" lg="4">
            <div class="chart-card">
              <div class="chart-header">
                <h3>Fuel Efficiency by Vehicle</h3>
              </div>
              <div class="chart-container">
                <div ref="fuelEfficiencyChart" class="chart-area"></div>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- Maintenance Analytics Section -->
      <div class="analytics-section">
        <div class="section-header">
          <h2 class="section-title">
            <v-icon class="me-2" color="info">mdi-wrench</v-icon>
            Maintenance Analytics
          </h2>
          <div class="section-actions">
            <v-btn
              variant="text"
              size="small"
              prepend-icon="mdi-refresh"
              @click="refreshMaintenanceData"
            >
              Refresh
            </v-btn>
            <v-btn
              variant="text"
              size="small"
              prepend-icon="mdi-download"
              @click="exportMaintenanceReport"
            >
              Export
            </v-btn>
          </div>
        </div>
        
        <v-row>
          <v-col cols="12" lg="6">
            <div class="chart-card">
              <div class="chart-header">
                <h3>Maintenance Cost Trends</h3>
              </div>
              <div class="chart-container">
                <div ref="maintenanceCostChart" class="chart-area"></div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" lg="6">
            <div class="chart-card">
              <div class="chart-header">
                <h3>Maintenance Efficiency Metrics</h3>
              </div>
              <div class="chart-container">
                <div ref="maintenanceEfficiencyChart" class="chart-area"></div>
              </div>
            </div>
          </v-col>
        </v-row>
        
        <v-row>
          <v-col cols="12">
            <div class="chart-card">
              <div class="chart-header">
                <h3>Maintenance Schedule & Status</h3>
              </div>
              <div class="chart-container">
                <v-data-table
                  :headers="maintenanceHeaders"
                  :items="maintenanceData"
                  class="maintenance-table"
                  density="comfortable"
                  hover
                >
                  <template v-slot:item.vehicle="{ item }">
                    <div class="vehicle-cell">
                      <v-avatar size="32" color="primary" class="me-2">
                        <v-icon size="16" color="white">mdi-truck</v-icon>
                      </v-avatar>
                      <div>
                        <div class="vehicle-name">{{ item.vehicle }}</div>
                        <div class="vehicle-plate">{{ item.plateNumber }}</div>
                      </div>
                    </div>
                  </template>
                  
                  <template v-slot:item.lastService="{ item }">
                    <span class="service-date">{{ formatDate(item.lastService) }}</span>
                  </template>
                  
                  <template v-slot:item.nextService="{ item }">
                    <span class="service-date">{{ formatDate(item.nextService) }}</span>
                  </template>
                  
                  <template v-slot:item.status="{ item }">
                    <v-chip
                      :color="getMaintenanceStatusColor(item.status)"
                      size="small"
                      variant="tonal"
                    >
                      {{ item.status }}
                    </v-chip>
                  </template>
                  
                  <template v-slot:item.cost="{ item }">
                    <span class="cost-value">{{ formatCurrency(item.cost) }}</span>
                  </template>
                  
                  <template v-slot:item.mileage="{ item }">
                    <div class="mileage-info">
                      <span class="current-mileage">{{ item.currentMileage.toLocaleString() }} km</span>
                      <v-progress-linear
                        :model-value="(item.currentMileage / item.serviceInterval) * 100"
                        :color="getMileageProgressColor(item.currentMileage, item.serviceInterval)"
                        height="4"
                        class="mileage-progress"
                      />
                    </div>
                  </template>
                  
                  <template v-slot:item.actions="{ item }">
                    <v-btn
                      variant="text"
                      size="small"
                      prepend-icon="mdi-eye"
                      @click="viewMaintenanceDetails(item)"
                    >
                      View
                    </v-btn>
                  </template>
                </v-data-table>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- Cost Analysis Section -->
      <div class="analytics-section">
        <div class="section-header">
          <h2 class="section-title">
            <v-icon class="me-2" color="success">mdi-calculator</v-icon>
            Cost Analysis
          </h2>
          <div class="section-actions">
            <v-btn
              variant="text"
              size="small"
              prepend-icon="mdi-refresh"
              @click="refreshCostData"
            >
              Refresh
            </v-btn>
            <v-btn
              variant="text"
              size="small"
              prepend-icon="mdi-download"
              @click="exportCostReport"
            >
              Export
            </v-btn>
          </div>
        </div>
        
        <v-row>
          <v-col cols="12" lg="8">
            <div class="chart-card">
              <div class="chart-header">
                <h3>Cost per Kilometer Analysis</h3>
              </div>
              <div class="chart-container">
                <div ref="costPerKmChart" class="chart-area"></div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" lg="4">
            <div class="chart-card">
              <div class="chart-header">
                <h3>Vehicle Cost Ranking</h3>
              </div>
              <div class="chart-container">
                <div ref="costRankingChart" class="chart-area"></div>
              </div>
            </div>
          </v-col>
        </v-row>
        
        <v-row>
          <v-col cols="12">
            <div class="chart-card">
              <div class="chart-header">
                <h3>Detailed Cost Breakdown</h3>
              </div>
              <div class="chart-container">
                <v-data-table
                  :headers="costHeaders"
                  :items="costData"
                  class="cost-table"
                  density="comfortable"
                  hover
                >
                  <template v-slot:item.vehicle="{ item }">
                    <div class="vehicle-cell">
                      <v-avatar size="32" color="primary" class="me-2">
                        <v-icon size="16" color="white">mdi-truck</v-icon>
                      </v-avatar>
                      <div>
                        <div class="vehicle-name">{{ item.vehicle }}</div>
                        <div class="vehicle-plate">{{ item.plateNumber }}</div>
                      </div>
                    </div>
                  </template>
                  
                  <template v-slot:item.fuelCost="{ item }">
                    <span class="cost-value">{{ formatCurrency(item.fuelCost) }}</span>
                  </template>
                  
                  <template v-slot:item.maintenanceCost="{ item }">
                    <span class="cost-value">{{ formatCurrency(item.maintenanceCost) }}</span>
                  </template>
                  
                  <template v-slot:item.insuranceCost="{ item }">
                    <span class="cost-value">{{ formatCurrency(item.insuranceCost) }}</span>
                  </template>
                  
                  <template v-slot:item.totalCost="{ item }">
                    <span class="total-cost-value">{{ formatCurrency(item.totalCost) }}</span>
                  </template>
                  
                  <template v-slot:item.costPerKm="{ item }">
                    <div class="cost-per-km">
                      <span class="cost-per-km-value">{{ item.costPerKm.toFixed(2) }}</span>
                      <span class="cost-per-km-unit">ETB/km</span>
                    </div>
                  </template>
                  
                  <template v-slot:item.efficiency="{ item }">
                    <div class="efficiency-cell">
                      <span class="efficiency-value">{{ item.efficiency }}</span>
                      <v-progress-linear
                        :model-value="(item.efficiency / 20) * 100"
                        :color="getEfficiencyColor(item.efficiency)"
                        height="4"
                        class="efficiency-bar"
                      />
                    </div>
                  </template>
                  
                  <template v-slot:item.actions="{ item }">
                    <v-btn
                      variant="text"
                      size="small"
                      prepend-icon="mdi-chart-line"
                      @click="viewCostDetails(item)"
                    >
                      Details
                    </v-btn>
                  </template>
                </v-data-table>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- Insurance & Compliance Analytics -->
      <div class="analytics-section">
        <div class="section-header">
          <h2 class="section-title">
            <v-icon class="me-2" color="info">mdi-shield-check</v-icon>
            Insurance & Compliance Analytics
          </h2>
          <div class="section-actions">
            <v-btn
              variant="text"
              size="small"
              prepend-icon="mdi-refresh"
              @click="refreshInsuranceData"
            >
              Refresh
            </v-btn>
            <v-btn
              variant="text"
              size="small"
              prepend-icon="mdi-download"
              @click="exportInsuranceReport"
            >
              Export
            </v-btn>
          </div>
        </div>
        
        <v-row>
          <v-col cols="12" lg="6">
            <div class="chart-card">
              <div class="chart-header">
                <h3>Insurance Cost Distribution</h3>
              </div>
              <div class="chart-container">
                <div ref="insuranceCostChart" class="chart-area"></div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" lg="6">
            <div class="chart-card">
              <div class="chart-header">
                <h3>Compliance Status Overview</h3>
              </div>
              <div class="chart-container">
                <div ref="complianceChart" class="chart-area"></div>
              </div>
            </div>
          </v-col>
        </v-row>
        
        <v-row>
          <v-col cols="12">
            <div class="chart-card">
              <div class="chart-header">
                <h3>Upcoming Renewals & Due Dates</h3>
              </div>
              <div class="chart-container">
                <v-data-table
                  :headers="complianceHeaders"
                  :items="complianceData"
                  class="compliance-table"
                  density="comfortable"
                  hover
                >
                  <template v-slot:item.vehicle="{ item }">
                    <div class="vehicle-cell">
                      <v-avatar size="32" color="primary" class="me-2">
                        <v-icon size="16" color="white">mdi-truck</v-icon>
                      </v-avatar>
                      <div>
                        <div class="vehicle-name">{{ item.vehicle }}</div>
                        <div class="vehicle-plate">{{ item.plateNumber }}</div>
                      </div>
                    </div>
                  </template>
                  
                  <template v-slot:item.type="{ item }">
                    <v-chip
                      :color="getComplianceTypeColor(item.type)"
                      size="small"
                      variant="tonal"
                    >
                      {{ item.type }}
                    </v-chip>
                  </template>
                  
                  <template v-slot:item.dueDate="{ item }">
                    <span class="due-date">{{ formatDate(item.dueDate) }}</span>
                  </template>
                  
                  <template v-slot:item.status="{ item }">
                    <v-chip
                      :color="getComplianceStatusColor(item.status)"
                      size="small"
                      variant="tonal"
                    >
                      {{ item.status }}
                    </v-chip>
                  </template>
                  
                  <template v-slot:item.cost="{ item }">
                    <span class="cost-value">{{ formatCurrency(item.cost) }}</span>
                  </template>
                  
                  <template v-slot:item.actions="{ item }">
                    <v-btn
                      variant="text"
                      size="small"
                      prepend-icon="mdi-eye"
                      @click="viewComplianceDetails(item)"
                    >
                      View
                    </v-btn>
                  </template>
                </v-data-table>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- Detailed Reports Table -->
      <div class="analytics-section">
        <div class="section-header">
          <h2 class="section-title">
            <v-icon class="me-2" color="primary">mdi-table</v-icon>
            Detailed Reports
          </h2>
          <div class="section-actions">
            <v-btn
              variant="text"
              size="small"
              prepend-icon="mdi-filter"
              @click="showFilters = !showFilters"
            >
              Filters
            </v-btn>
            <v-btn
              variant="text"
              size="small"
              prepend-icon="mdi-download"
              @click="exportTableData"
            >
              Export Table
            </v-btn>
          </div>
        </div>
        
        <div class="table-card">
          <v-data-table
            :headers="tableHeaders"
            :items="filteredTableData"
            :loading="tableLoading"
            :search="filters.searchQuery"
            class="modern-table"
            density="comfortable"
            hover
          >
            <template v-slot:item.vehicle="{ item }">
              <div class="vehicle-cell">
                <v-avatar size="32" color="primary" class="me-2">
                  <v-icon size="16" color="white">mdi-truck</v-icon>
                </v-avatar>
                <div>
                  <div class="vehicle-name">{{ item.vehicle }}</div>
                  <div class="vehicle-plate">{{ item.plateNumber }}</div>
                </div>
              </div>
            </template>
            
            <template v-slot:item.status="{ item }">
              <v-chip
                :color="getStatusColor(item.status)"
                size="small"
                variant="tonal"
              >
                {{ item.status }}
              </v-chip>
            </template>
            
            <template v-slot:item.cost="{ item }">
              <span class="cost-value">{{ formatCurrency(item.cost) }}</span>
            </template>
            
            <template v-slot:item.efficiency="{ item }">
              <div class="efficiency-cell">
                <span class="efficiency-value">{{ item.efficiency }}</span>
                <v-progress-linear
                  :model-value="(item.efficiency / 20) * 100"
                  :color="getEfficiencyColor(item.efficiency)"
                  height="4"
                  class="efficiency-bar"
                />
              </div>
            </template>
            
            <template v-slot:item.actions="{ item }">
              <v-menu>
                <template #activator="{ props }">
                  <v-btn
                    icon="mdi-dots-vertical"
                    variant="text"
                    size="small"
                    v-bind="props"
                  />
                </template>
                <v-list>
                  <v-list-item @click="viewVehicleDetails(item)">
                    <v-list-item-title>View Details</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="exportVehicleReport(item)">
                    <v-list-item-title>Export Report</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-data-table>
        </div>
      </div>
    </div>

    <!-- Success/Error Notifications -->
    <v-snackbar
      v-model="showSuccessSnackbar"
      color="success"
      timeout="3000"
      location="top right"
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
      location="top right"
    >
      {{ errorMessage }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="showErrorSnackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

// Composables
const { vehicleList, getVehicles, activeVehicles } = useVehicles()
const { fuelRecords, fuelCards, getFuelRecords, getFuelCards } = useFuel()
const { anomalies, getAnomalies } = useAnomalies()

// Chart refs
const fuelConsumptionChart = ref(null)
const fuelEfficiencyChart = ref(null)
const maintenanceCostChart = ref(null)
const maintenanceEfficiencyChart = ref(null)
const costPerKmChart = ref(null)
const costRankingChart = ref(null)
const insuranceCostChart = ref(null)
const complianceChart = ref(null)

// Reactive data
const loading = ref(false)
const tableLoading = ref(false)
const showSuccessSnackbar = ref(false)
const showErrorSnackbar = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const fuelTimeframe = ref('Last 6 Months')
const showFilters = ref(false)

// Filter state
const filters = ref({
  timeframe: 'Last 6 Months',
  vehicleType: null,
  status: null,
  reportType: 'All Reports',
  searchQuery: '',
  minCost: null,
  maxCost: null
})

// Export state
const exporting = ref({
  excel: false,
  pdf: false,
  csv: false,
  word: false
})

// Filter options
const timeframeOptions = [
  'Last Week',
  'Last Month',
  'Last 3 Months',
  'Last 6 Months',
  'Last Year',
  'Last 2 Years',
  'Custom Range'
]

const vehicleTypeOptions = [
  'Fuel-powered Car',
  'Electric-powered Car',
  'Truck',
  'Van',
  'Bus'
]

const statusOptions = [
  'Active',
  'Maintenance',
  'Inactive',
  'Retired'
]

const reportTypeOptions = [
  'All Reports',
  'Fuel Reports',
  'Maintenance Reports',
  'Cost Reports',
  'Performance Reports'
]

// Table headers
const tableHeaders = [
  { title: 'Vehicle', key: 'vehicle', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Total Cost', key: 'cost', sortable: true },
  { title: 'Fuel Efficiency (km/l)', key: 'efficiency', sortable: true },
  { title: 'Last Service', key: 'lastService', sortable: true },
  { title: 'Next Service', key: 'nextService', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
]

// Compliance headers
const complianceHeaders = [
  { title: 'Vehicle', key: 'vehicle', sortable: true },
  { title: 'Type', key: 'type', sortable: true },
  { title: 'Due Date', key: 'dueDate', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Cost', key: 'cost', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
]

// Maintenance headers
const maintenanceHeaders = [
  { title: 'Vehicle', key: 'vehicle', sortable: true },
  { title: 'Last Service', key: 'lastService', sortable: true },
  { title: 'Next Service', key: 'nextService', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Cost', key: 'cost', sortable: true },
  { title: 'Mileage', key: 'mileage', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
]

// Cost headers
const costHeaders = [
  { title: 'Vehicle', key: 'vehicle', sortable: true },
  { title: 'Fuel Cost', key: 'fuelCost', sortable: true },
  { title: 'Maintenance Cost', key: 'maintenanceCost', sortable: true },
  { title: 'Insurance Cost', key: 'insuranceCost', sortable: true },
  { title: 'Total Cost', key: 'totalCost', sortable: true },
  { title: 'Cost/km', key: 'costPerKm', sortable: true },
  { title: 'Efficiency (km/l)', key: 'efficiency', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
]

// Compliance data
const complianceData = ref([
  {
    id: 1,
    vehicle: 'John Smith',
    plateNumber: 'ABC-123',
    type: 'Insurance',
    dueDate: '2024-02-15',
    status: 'Due Soon',
    cost: 45000
  },
  {
    id: 2,
    vehicle: 'Mike Johnson',
    plateNumber: 'DEF-456',
    type: 'Registration',
    dueDate: '2024-01-30',
    status: 'Overdue',
    cost: 15000
  },
  {
    id: 3,
    vehicle: 'Sarah Wilson',
    plateNumber: 'GHI-789',
    type: 'Insurance',
    dueDate: '2024-03-01',
    status: 'Active',
    cost: 52000
  },
  {
    id: 4,
    vehicle: 'David Brown',
    plateNumber: 'JKL-012',
    type: 'Safety Inspection',
    dueDate: '2024-02-10',
    status: 'Due Soon',
    cost: 8000
  },
  {
    id: 5,
    vehicle: 'Lisa Davis',
    plateNumber: 'MNO-345',
    type: 'Registration',
    dueDate: '2024-01-25',
    status: 'Overdue',
    cost: 18000
  }
])

// Maintenance data
const maintenanceData = ref([
  {
    id: 1,
    vehicle: 'John Smith',
    plateNumber: 'ABC-123',
    lastService: '2024-01-15',
    nextService: '2024-02-15',
    status: 'Due Soon',
    cost: 25000,
    currentMileage: 87500,
    serviceInterval: 90000
  },
  {
    id: 2,
    vehicle: 'Mike Johnson',
    plateNumber: 'DEF-456',
    lastService: '2024-01-10',
    nextService: '2024-01-30',
    status: 'Overdue',
    cost: 35000,
    currentMileage: 152000,
    serviceInterval: 150000
  },
  {
    id: 3,
    vehicle: 'Sarah Wilson',
    plateNumber: 'GHI-789',
    lastService: '2024-01-20',
    nextService: '2024-03-01',
    status: 'Active',
    cost: 18000,
    currentMileage: 45200,
    serviceInterval: 50000
  },
  {
    id: 4,
    vehicle: 'David Brown',
    plateNumber: 'JKL-012',
    lastService: '2024-01-05',
    nextService: '2024-02-10',
    status: 'Due Soon',
    cost: 22000,
    currentMileage: 78000,
    serviceInterval: 80000
  },
  {
    id: 5,
    vehicle: 'Lisa Davis',
    plateNumber: 'MNO-345',
    lastService: '2024-01-12',
    nextService: '2024-01-25',
    status: 'Overdue',
    cost: 28000,
    currentMileage: 125000,
    serviceInterval: 120000
  }
])

// Cost data
const costData = ref([
  {
    id: 1,
    vehicle: 'John Smith',
    plateNumber: 'ABC-123',
    fuelCost: 45000,
    maintenanceCost: 25000,
    insuranceCost: 15000,
    totalCost: 85000,
    costPerKm: 2.8,
    efficiency: 14.2
  },
  {
    id: 2,
    vehicle: 'Mike Johnson',
    plateNumber: 'DEF-456',
    fuelCost: 52000,
    maintenanceCost: 35000,
    insuranceCost: 18000,
    totalCost: 105000,
    costPerKm: 3.2,
    efficiency: 12.8
  },
  {
    id: 3,
    vehicle: 'Sarah Wilson',
    plateNumber: 'GHI-789',
    fuelCost: 38000,
    maintenanceCost: 18000,
    insuranceCost: 12000,
    totalCost: 68000,
    costPerKm: 2.5,
    efficiency: 13.5
  },
  {
    id: 4,
    vehicle: 'David Brown',
    plateNumber: 'JKL-012',
    fuelCost: 42000,
    maintenanceCost: 22000,
    insuranceCost: 14000,
    totalCost: 78000,
    costPerKm: 2.9,
    efficiency: 11.9
  },
  {
    id: 5,
    vehicle: 'Lisa Davis',
    plateNumber: 'MNO-345',
    fuelCost: 48000,
    maintenanceCost: 28000,
    insuranceCost: 16000,
    totalCost: 92000,
    costPerKm: 3.1,
    efficiency: 12.3
  }
])

// Computed properties
const filteredVehicles = computed(() => {
  let filtered = vehicleList.value

  if (filters.value.vehicleType) {
    filtered = filtered.filter(v => v.type === filters.value.vehicleType)
  }

  if (filters.value.status) {
    filtered = filtered.filter(v => v.status === filters.value.status)
  }

  if (filters.value.searchQuery) {
    const query = filters.value.searchQuery.toLowerCase()
    filtered = filtered.filter(v => 
      v.plateNo?.toLowerCase().includes(query) ||
      v.driver?.toLowerCase().includes(query)
    )
  }

  return filtered
})

const totalOperatingCost = computed(() => {
  const fuelCost = fuelCards.value.reduce((sum, card) => sum + card.amountSpent, 0)
  const maintenanceCost = 150000 // Mock data
  return fuelCost + maintenanceCost
})

const maintenanceBacklogCount = computed(() => {
  return vehicleList.value.filter(v => v.currentMileage >= v.serviceInterval).length
})

// Enhanced computed properties for new stats
const totalInsuranceCost = computed(() => {
  return 850000 // Mock data - replace with actual insurance data
})

const overdueItemsCount = computed(() => {
  return 23 // Mock data - count of overdue maintenance, insurance, registration, etc.
})

const totalFuelCost = computed(() => {
  return fuelCards.value.reduce((sum, card) => sum + card.amountSpent, 0)
})

const totalMaintenanceCost = computed(() => {
  return 150000 // Mock data - replace with actual maintenance data
})

const dueThisMonthCount = computed(() => {
  return 8 // Mock data - items due this month
})

const averageVehicleAge = computed(() => {
  const currentYear = new Date().getFullYear()
  const totalAge = vehicleList.value.reduce((sum, vehicle) => sum + (currentYear - vehicle.year), 0)
  return vehicleList.value.length > 0 ? (totalAge / vehicleList.value.length).toFixed(1) : '0.0'
})

const averageEfficiency = computed(() => {
  return vehicleList.value.length > 0 ? 
    (vehicleList.value.reduce((sum, v) => sum + (v.fuelEfficiency || 12), 0) / vehicleList.value.length).toFixed(1) : '12.0'
})

const criticalAlertsCount = computed(() => {
  return anomalies.value.filter(a => a.severity === 'critical').length
})

const filteredTableData = computed(() => {
  return filteredVehicles.value.map(vehicle => ({
    vehicle: vehicle.driver || 'Unknown Driver',
    plateNumber: vehicle.plateNo,
    status: getStatusLabel(vehicle.status),
    cost: calculateVehicleCost(vehicle),
    efficiency: calculateEfficiency(vehicle),
    lastService: '2024-01-15',
    nextService: '2024-02-15'
  }))
})

// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 0
  }).format(amount)
}

const getStatusLabel = (status) => {
  const statusMap = {
    1: 'Active',
    2: 'Maintenance',
    3: 'Inactive'
  }
  return statusMap[status] || 'Unknown'
}

const getStatusColor = (status) => {
  const colors = {
    'Active': 'success',
    'Maintenance': 'warning',
    'Inactive': 'error'
  }
  return colors[status] || 'info'
}

const getEfficiencyColor = (efficiency) => {
  if (efficiency >= 15) return 'success'
  if (efficiency >= 10) return 'warning'
  return 'error'
}

const calculateVehicleCost = (vehicle) => {
  // Mock calculation
  return Math.floor(Math.random() * 50000) + 10000
}

const calculateEfficiency = (vehicle) => {
  // Mock calculation
  return (Math.random() * 10 + 8).toFixed(1)
}

const getComplianceTypeColor = (type) => {
  const colors = {
    'Insurance': 'info',
    'Registration': 'warning',
    'Safety Inspection': 'success',
    'Emission Test': 'primary'
  }
  return colors[type] || 'default'
}

const getComplianceStatusColor = (status) => {
  const colors = {
    'Active': 'success',
    'Due Soon': 'warning',
    'Overdue': 'error',
    'Pending': 'info'
  }
  return colors[status] || 'default'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getMaintenanceStatusColor = (status) => {
  const colors = {
    'Active': 'success',
    'Due Soon': 'warning',
    'Overdue': 'error',
    'In Progress': 'info'
  }
  return colors[status] || 'default'
}

const getMileageProgressColor = (currentMileage, serviceInterval) => {
  const percentage = (currentMileage / serviceInterval) * 100
  if (percentage >= 100) return 'error'
  if (percentage >= 80) return 'warning'
  return 'success'
}

// Chart initialization
const initializeCharts = () => {
  // Fuel Consumption Chart
  if (fuelConsumptionChart.value) {
    const chart = echarts.init(fuelConsumptionChart.value)
    chart.setOption({
      tooltip: { 
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e2e8f0',
        textStyle: { color: '#1e293b' }
      },
      legend: { 
        data: ['Fuel Consumption (L)', 'Fuel Cost (ETB)'],
        textStyle: { color: '#64748b' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: { 
        type: 'category', 
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        axisLine: { lineStyle: { color: '#e2e8f0' } },
        axisLabel: { color: '#64748b' }
      },
      yAxis: [
        { 
          type: 'value', 
          name: 'Liters', 
          position: 'left',
          axisLine: { lineStyle: { color: '#e2e8f0' } },
          axisLabel: { color: '#64748b' }
        },
        { 
          type: 'value', 
          name: 'ETB', 
          position: 'right',
          axisLine: { lineStyle: { color: '#e2e8f0' } },
          axisLabel: { color: '#64748b' }
        }
      ],
      series: [
        {
          name: 'Fuel Consumption (L)',
          type: 'line',
          data: [1200, 1350, 1100, 1400, 1300, 1450],
          color: '#f3d70e',
          smooth: true,
          lineStyle: { width: 3 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(243, 215, 14, 0.3)' },
                { offset: 1, color: 'rgba(243, 215, 14, 0.1)' }
              ]
            }
          }
        },
        {
          name: 'Fuel Cost (ETB)',
          type: 'line',
          yAxisIndex: 1,
          data: [24000, 27000, 22000, 28000, 26000, 29000],
          color: '#fbb339',
          smooth: true,
          lineStyle: { width: 3 }
        }
      ]
    })
  }

  // Initialize other charts similarly...
  initializeOtherCharts()
}

const initializeOtherCharts = () => {
  // Fuel Efficiency Chart
  if (fuelEfficiencyChart.value) {
    const chart = echarts.init(fuelEfficiencyChart.value)
    chart.setOption({
      tooltip: { trigger: 'item' },
      series: [{
        name: 'Efficiency',
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 14.2, name: 'ABC-123' },
          { value: 12.8, name: 'DEF-456' },
          { value: 13.5, name: 'GHI-789' },
          { value: 11.9, name: 'JKL-012' }
        ],
        itemStyle: {
          color: function(params) {
            const colors = ['#f3d70e', '#fbb339', '#f5e35e', '#040707']
            return colors[params.dataIndex]
          }
        }
      }]
    })
  }

  // Maintenance Cost Chart
  if (maintenanceCostChart.value) {
    const chart = echarts.init(maintenanceCostChart.value)
    const maintenanceCosts = maintenanceData.value.map(item => item.cost)
    const vehicleNames = maintenanceData.value.map(item => item.plateNumber)
    
    chart.setOption({
      tooltip: { 
        trigger: 'axis',
        formatter: function(params) {
          return `${params[0].name}<br/>Maintenance Cost: ${formatCurrency(params[0].value)}`
        }
      },
      xAxis: { 
        type: 'category', 
        data: vehicleNames,
        axisLabel: { 
          color: '#64748b',
          fontSize: 10,
          rotate: 45
        }
      },
      yAxis: { 
        type: 'value', 
        name: 'ETB',
        axisLabel: { color: '#64748b' }
      },
      series: [{
        data: maintenanceCosts,
        type: 'bar',
        itemStyle: { 
          color: function(params) {
            const colors = ['#f3d70e', '#fbb339', '#10b981', '#3b82f6', '#8b5cf6']
            return colors[params.dataIndex % colors.length]
          },
          borderRadius: [8, 8, 0, 0]
        },
        barWidth: 40
      }]
    })
  }

  // Maintenance Efficiency Metrics Chart
  if (maintenanceEfficiencyChart.value) {
    const chart = echarts.init(maintenanceEfficiencyChart.value)
    
    // Calculate efficiency metrics for each vehicle
    const efficiencyData = maintenanceData.value.map(item => {
      // Calculate service interval compliance (how close to scheduled interval)
      const serviceIntervalCompliance = Math.max(0, 100 - Math.abs((item.currentMileage - item.serviceInterval) / item.serviceInterval * 100))
      
      // Calculate cost efficiency (lower cost per km is better)
      const costPerKm = item.cost / (item.currentMileage / 1000) // Cost per 1000km
      const costEfficiency = Math.max(0, 100 - (costPerKm / 50 * 100)) // Assuming 50 ETB per 1000km is baseline
      
      // Calculate status efficiency (on-time services get higher score)
      let statusEfficiency = 100
      if (item.status === 'Overdue') statusEfficiency = 30
      else if (item.status === 'Due Soon') statusEfficiency = 70
      
      // Overall efficiency score (weighted average)
      const overallEfficiency = (serviceIntervalCompliance * 0.4 + costEfficiency * 0.3 + statusEfficiency * 0.3)
      
      return {
        name: item.plateNumber,
        vehicle: item.vehicle,
        serviceCompliance: serviceIntervalCompliance,
        costEfficiency: costEfficiency,
        statusEfficiency: statusEfficiency,
        overallEfficiency: overallEfficiency,
        currentMileage: item.currentMileage,
        serviceInterval: item.serviceInterval,
        cost: item.cost
      }
    })
    
    // Sort by overall efficiency (descending)
    efficiencyData.sort((a, b) => b.overallEfficiency - a.overallEfficiency)
    
    chart.setOption({
      tooltip: { 
        trigger: 'axis',
        formatter: function(params) {
          const data = efficiencyData[params[0].dataIndex]
          return `
            <div style="padding: 8px;">
              <strong>${data.vehicle}</strong><br/>
              ${data.name}<br/>
              <br/>
              <strong>Efficiency Metrics:</strong><br/>
              • Overall Efficiency: ${data.overallEfficiency.toFixed(1)}%<br/>
              • Service Compliance: ${data.serviceCompliance.toFixed(1)}%<br/>
              • Cost Efficiency: ${data.costEfficiency.toFixed(1)}%<br/>
              • Status Efficiency: ${data.statusEfficiency.toFixed(1)}%<br/>
              <br/>
              <strong>Details:</strong><br/>
              • Mileage: ${data.currentMileage.toLocaleString()} km<br/>
              • Service Interval: ${data.serviceInterval.toLocaleString()} km<br/>
              • Maintenance Cost: ${formatCurrency(data.cost)}
            </div>
          `
        }
      },
      legend: {
        data: ['Overall Efficiency', 'Service Compliance', 'Cost Efficiency', 'Status Efficiency'],
        textStyle: { color: '#64748b' },
        top: 10
      },
      xAxis: { 
        type: 'category', 
        data: efficiencyData.map(item => item.name),
        axisLabel: { 
          color: '#64748b',
          fontSize: 10,
          rotate: 45
        }
      },
      yAxis: { 
        type: 'value', 
        name: 'Efficiency Score (%)',
        min: 0,
        max: 100,
        axisLabel: { color: '#64748b' }
      },
      series: [
        {
          name: 'Overall Efficiency',
          type: 'bar',
          data: efficiencyData.map(item => ({
            value: item.overallEfficiency,
            itemStyle: {
              color: item.overallEfficiency >= 80 ? '#10b981' : 
                     item.overallEfficiency >= 60 ? '#f59e0b' : '#ef4444'
            }
          })),
          itemStyle: { borderRadius: [8, 8, 0, 0] },
          barWidth: 30
        },
        {
          name: 'Service Compliance',
          type: 'line',
          data: efficiencyData.map(item => item.serviceCompliance),
          itemStyle: { color: '#3b82f6' },
          lineStyle: { color: '#3b82f6', width: 3 },
          symbol: 'circle',
          symbolSize: 6
        },
        {
          name: 'Cost Efficiency',
          type: 'line',
          data: efficiencyData.map(item => item.costEfficiency),
          itemStyle: { color: '#8b5cf6' },
          lineStyle: { color: '#8b5cf6', width: 3 },
          symbol: 'circle',
          symbolSize: 6
        },
        {
          name: 'Status Efficiency',
          type: 'line',
          data: efficiencyData.map(item => item.statusEfficiency),
          itemStyle: { color: '#f97316' },
          lineStyle: { color: '#f97316', width: 3 },
          symbol: 'circle',
          symbolSize: 6
        }
      ]
    })
  }

  // Cost per KM Chart
  if (costPerKmChart.value) {
    const chart = echarts.init(costPerKmChart.value)
    const costPerKm = costData.value.map(item => item.costPerKm)
    const vehicleNames = costData.value.map(item => item.plateNumber)
    
    chart.setOption({
      tooltip: { 
        trigger: 'axis',
        formatter: function(params) {
          return `${params[0].name}<br/>Cost per KM: ${params[0].value.toFixed(2)} ETB`
        }
      },
      xAxis: { 
        type: 'category', 
        data: vehicleNames,
        axisLabel: { 
          color: '#64748b',
          fontSize: 10,
          rotate: 45
        }
      },
      yAxis: { 
        type: 'value', 
        name: 'ETB/km',
        axisLabel: { color: '#64748b' }
      },
      series: [{
        data: costPerKm,
        type: 'bar',
        itemStyle: { 
          color: function(params) {
            const value = costPerKm[params.dataIndex]
            if (value >= 3.0) return '#ef4444'
            if (value >= 2.5) return '#f59e0b'
            return '#10b981'
          },
          borderRadius: [8, 8, 0, 0]
        },
        barWidth: 40
      }]
    })
  }

  // Cost Ranking Chart
  if (costRankingChart.value) {
    const chart = echarts.init(costRankingChart.value)
    const totalCosts = costData.value.map(item => item.totalCost)
    const vehicleNames = costData.value.map(item => item.plateNumber)
    
    chart.setOption({
      tooltip: { 
        trigger: 'item',
        formatter: function(params) {
          return `${params.name}<br/>Total Cost: ${formatCurrency(params.value)}`
        }
      },
      series: [{
        name: 'Total Cost',
        type: 'pie',
        radius: '50%',
        data: vehicleNames.map((name, index) => ({
          value: totalCosts[index],
          name: name,
          itemStyle: { 
            color: function() {
              const colors = ['#f3d70e', '#fbb339', '#10b981', '#3b82f6', '#8b5cf6']
              return colors[index % colors.length]
            }
          }
        })),
        itemStyle: { borderRadius: 10, borderColor: '#ffffff', borderWidth: 2 }
      }]
    })
  }

  // Add other chart initializations...
  
  // Insurance Cost Chart
  if (insuranceCostChart.value) {
    const chart = echarts.init(insuranceCostChart.value)
    chart.setOption({
      tooltip: { trigger: 'item' },
      legend: { top: 'bottom' },
      series: [{
        name: 'Insurance Cost',
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 450000, name: 'Comprehensive', itemStyle: { color: '#06b6d4' } },
          { value: 250000, name: 'Third Party', itemStyle: { color: '#8b5cf6' } },
          { value: 150000, name: 'Liability', itemStyle: { color: '#f97316' } }
        ],
        itemStyle: { borderRadius: 10, borderColor: '#ffffff', borderWidth: 2 }
      }]
    })
  }

  // Compliance Chart
  if (complianceChart.value) {
    const chart = echarts.init(complianceChart.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['Insurance', 'Registration', 'Safety Inspection', 'Emission Test'] },
      yAxis: { type: 'value', name: 'Count' },
      series: [{
        data: [85, 92, 78, 88],
        type: 'bar',
        itemStyle: { 
          color: function(params) {
            const colors = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b']
            return colors[params.dataIndex]
          },
          borderRadius: [8, 8, 0, 0]
        },
        barWidth: 40
      }]
    })
  }
}

// Export functions
const exportReport = async (format) => {
  exporting.value[format] = true
  
  try {
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    showSuccessMessage(`${format.toUpperCase()} report exported successfully`)
  } catch (error) {
    showErrorMessage(`Failed to export ${format.toUpperCase()} report`)
  } finally {
    exporting.value[format] = false
  }
}

const exportFuelReport = () => exportReport('excel')
const exportMaintenanceReport = () => exportReport('pdf')
const exportCostReport = () => exportReport('csv')
const exportInsuranceReport = () => exportReport('pdf')
const exportTableData = () => exportReport('excel')

// Refresh functions
const refreshFuelData = () => {
  showSuccessMessage('Fuel data refreshed successfully')
}

const refreshMaintenanceData = () => {
  showSuccessMessage('Maintenance data refreshed successfully')
}

const refreshCostData = () => {
  showSuccessMessage('Cost data refreshed successfully')
}

const refreshInsuranceData = () => {
  showSuccessMessage('Insurance data refreshed successfully')
}

// Vehicle actions
const viewVehicleDetails = (item) => {
  console.log('Viewing vehicle details:', item)
}

const exportVehicleReport = (item) => {
  console.log('Exporting vehicle report:', item)
  showSuccessMessage(`Vehicle report for ${item.vehicle} exported successfully`)
}

const viewComplianceDetails = (item) => {
  console.log('Viewing compliance details:', item)
  showSuccessMessage(`Compliance details for ${item.vehicle} opened`)
}

const viewMaintenanceDetails = (item) => {
  console.log('Viewing maintenance details:', item)
  showSuccessMessage(`Maintenance details for ${item.vehicle} opened`)
}

const viewCostDetails = (item) => {
  console.log('Viewing cost details:', item)
  showSuccessMessage(`Cost details for ${item.vehicle} opened`)
}

// Message functions
const showSuccessMessage = (message) => {
  successMessage.value = message
  showSuccessSnackbar.value = true
}

const showErrorMessage = (message) => {
  errorMessage.value = message
  showErrorSnackbar.value = true
}

// Watch for filter changes
watch(filters, () => {
  // Recalculate data when filters change
  console.log('Filters changed:', filters.value)
}, { deep: true })

// Lifecycle
onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      getVehicles(),
      getFuelRecords(),
      getFuelCards(),
      getAnomalies()
    ])
    
    // Initialize charts after data is loaded
    setTimeout(() => {
      initializeCharts()
    }, 100)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.analytics-reports-root {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%);
  padding: 0;
}

/* Modern Header - Full Width */
.modern-header {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  padding: 32px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(20px);
  width: 100%;
}

.header-content {
  width: 100%;
  margin: 0;
  padding: 0 24px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  letter-spacing: -0.025em;
}

.title-icon {
  margin-right: 16px;
  padding: 12px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(243, 215, 14, 0.1), rgba(251, 179, 57, 0.1));
}

.page-subtitle {
  font-size: 1.125rem;
  color: #64748b;
  margin: 0;
  font-weight: 400;
}

/* Filter Panel */
.filter-panel {
  margin-top: 24px;
}

.filter-accordion {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  overflow: hidden;
}

.filter-title {
  font-weight: 600;
  color: #0f172a;
}

.export-section {
  margin-top: 16px;
}

.export-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.export-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.export-btn {
  border-radius: 8px;
  font-weight: 500;
  text-transform: none;
}

/* Stats Section - Full Width */
.stats-section-full {
  padding: 24px 24px;
  width: 100%;
  margin: 0;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-height: 80px;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover::before {
  opacity: 1;
}

.primary-gradient::before { background: linear-gradient(90deg, #3b82f6, #1d4ed8); }
.success-gradient::before { background: linear-gradient(90deg, #10b981, #059669); }
.warning-gradient::before { background: linear-gradient(90deg, #f59e0b, #d97706); }
.error-gradient::before { background: linear-gradient(90deg, #ef4444, #dc2626); }

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.primary-gradient .stat-icon { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
.success-gradient .stat-icon { background: linear-gradient(135deg, #10b981, #059669); }
.warning-gradient .stat-icon { background: linear-gradient(135deg, #f59e0b, #d97706); }
.error-gradient .stat-icon { background: linear-gradient(135deg, #ef4444, #dc2626); }
.info-gradient .stat-icon { background: linear-gradient(135deg, #06b6d4, #0891b2); }
.purple-gradient .stat-icon { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
.orange-gradient .stat-icon { background: linear-gradient(135deg, #f97316, #ea580c); }
.teal-gradient .stat-icon { background: linear-gradient(135deg, #14b8a6, #0d9488); }
.indigo-gradient .stat-icon { background: linear-gradient(135deg, #6366f1, #4f46e5); }
.deep-purple-gradient .stat-icon { background: linear-gradient(135deg, #a855f7, #9333ea); }
.cyan-gradient .stat-icon { background: linear-gradient(135deg, #06b6d4, #0891b2); }
.amber-gradient .stat-icon { background: linear-gradient(135deg, #f59e0b, #d97706); }

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 2px 0;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0 0 4px 0;
  font-weight: 500;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 0.625rem;
  font-weight: 600;
}

.stat-change.positive {
  color: #10b981;
}

.stat-change.negative {
  color: #ef4444;
}

.stat-change.warning {
  color: #f59e0b;
}

.stat-change.neutral {
  color: #6b7280;
}

/* Analytics Grid - Full Width */
.analytics-grid-full {
  width: 100%;
  margin: 0;
  padding: 0 24px 48px 24px;
}

.analytics-section {
  margin-bottom: 48px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  letter-spacing: -0.025em;
}

.section-actions {
  display: flex;
  gap: 8px;
}

/* Chart Cards */
.chart-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(226, 232, 240, 0.8);
  overflow: hidden;
  transition: all 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
}

.chart-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(248, 250, 252, 0.5);
}

.chart-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.timeframe-select {
  max-width: 160px;
}

.chart-container {
  padding: 24px;
}

.chart-area {
  height: 300px;
  width: 100%;
}

/* Table Card */
.table-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(226, 232, 240, 0.8);
  overflow: hidden;
}

.modern-table {
  background: transparent !important;
}

.modern-table :deep(.v-data-table-header) {
  background: rgba(248, 250, 252, 0.8) !important;
}

.modern-table :deep(.v-data-table-header th) {
  background: rgba(248, 250, 252, 0.8) !important;
  color: #475569 !important;
  font-weight: 600 !important;
  font-size: 0.875rem !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  border-bottom: 2px solid rgba(226, 232, 240, 0.8) !important;
}

.modern-table :deep(.v-data-table__td) {
  border-bottom: 1px solid rgba(226, 232, 240, 0.4) !important;
  color: #334155 !important;
  font-weight: 500 !important;
}

.modern-table :deep(.v-data-table__tr:hover) {
  background: rgba(243, 215, 14, 0.05) !important;
}

.compliance-table {
  background: transparent !important;
}

.compliance-table :deep(.v-data-table-header) {
  background: rgba(248, 250, 252, 0.8) !important;
}

.compliance-table :deep(.v-data-table-header th) {
  background: rgba(248, 250, 252, 0.8) !important;
  color: #475569 !important;
  font-weight: 600 !important;
  font-size: 0.875rem !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  border-bottom: 2px solid rgba(226, 232, 240, 0.8) !important;
}

.compliance-table :deep(.v-data-table__td) {
  border-bottom: 1px solid rgba(226, 232, 240, 0.4) !important;
  color: #334155 !important;
  font-weight: 500 !important;
}

.compliance-table :deep(.v-data-table__tr:hover) {
  background: rgba(6, 182, 212, 0.05) !important;
}

.due-date {
  font-weight: 600;
  color: #0f172a;
}

.service-date {
  font-weight: 500;
  color: #0f172a;
  font-size: 0.875rem;
}

.mileage-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.current-mileage {
  font-weight: 600;
  color: #0f172a;
  font-size: 0.875rem;
}

.mileage-progress {
  border-radius: 2px;
}

.total-cost-value {
  font-weight: 700;
  color: #0f172a;
  font-size: 0.875rem;
}

.cost-per-km {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cost-per-km-value {
  font-weight: 600;
  color: #0f172a;
  font-size: 0.875rem;
}

.cost-per-km-unit {
  font-size: 0.75rem;
  color: #64748b;
}

.maintenance-table,
.cost-table {
  background: transparent !important;
}

.maintenance-table :deep(.v-data-table-header),
.cost-table :deep(.v-data-table-header) {
  background: rgba(248, 250, 252, 0.8) !important;
}

.maintenance-table :deep(.v-data-table-header th),
.cost-table :deep(.v-data-table-header th) {
  background: rgba(248, 250, 252, 0.8) !important;
  color: #475569 !important;
  font-weight: 600 !important;
  font-size: 0.875rem !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  border-bottom: 2px solid rgba(226, 232, 240, 0.8) !important;
}

.maintenance-table :deep(.v-data-table__td),
.cost-table :deep(.v-data-table__td) {
  border-bottom: 1px solid rgba(226, 232, 240, 0.4) !important;
  color: #334155 !important;
  font-weight: 500 !important;
}

.maintenance-table :deep(.v-data-table__tr:hover),
.cost-table :deep(.v-data-table__tr:hover) {
  background: rgba(6, 182, 212, 0.05) !important;
}

/* Vehicle Cell */
.vehicle-cell {
  display: flex;
  align-items: center;
}

.vehicle-name {
  font-weight: 600;
  color: #0f172a;
  font-size: 0.875rem;
}

.vehicle-plate {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

/* Cost Value */
.cost-value {
  font-weight: 600;
  color: #0f172a;
}

/* Efficiency Cell */
.efficiency-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.efficiency-value {
  font-weight: 600;
  color: #0f172a;
  font-size: 0.875rem;
}

.efficiency-bar {
  border-radius: 2px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .page-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 1.25rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
  
  .chart-area {
    height: 250px;
  }
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
  }
  
  .modern-header {
    padding: 24px 0;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .stats-section {
    padding: 24px 16px;
  }
  
  .analytics-grid {
    padding: 0 16px 32px 16px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .export-buttons {
    justify-content: stretch;
  }
  
  .export-btn {
    flex: 1;
  }
  
  .stat-card {
    padding: 20px;
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
  }
  
  .stat-value {
    font-size: 1.25rem;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .timeframe-select {
    max-width: 100%;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.5rem;
  }
  
  .title-icon {
    margin-right: 12px;
    padding: 8px;
  }
  
  .stat-card {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .chart-container {
    padding: 16px;
  }
  
  .chart-area {
    height: 200px;
  }
}
</style> 