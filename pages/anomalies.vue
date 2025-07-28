<template>
  <div class="anomalies-root">
    <div class="anomalies-header">
      <h1 class="anomalies-title">Anomaly Detection</h1>
      <p class="anomalies-subtitle">Monitor and manage fleet anomalies, fuel consumption spikes, and service alerts</p>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-row">
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Total Anomalies"
            :value="anomalies.length.toString()"
            icon="mdi-alert"
            color="error"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Open Alerts"
            :value="openAnomalies.length.toString()"
            icon="mdi-alert-circle"
            color="warning"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="High Severity"
            :value="highSeverityAnomalies.length.toString()"
            icon="mdi-alert-octagon"
            color="error"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <KpiCard
            title="Resolved Today"
            :value="resolvedToday.toString()"
            icon="mdi-check-circle"
            color="success"
          />
        </v-col>
      </v-row>
    </div>

    <!-- Action Bar -->
    <div class="anomalies-actions mb-6">
      <v-row align="center">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            placeholder="Search anomalies by vehicle, type, or description..."
            variant="outlined"
            density="compact"
            hide-details
            class="anomalies-search"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6" class="text-md-right">
          <v-btn
            color="primary"
            prepend-icon="mdi-filter"
            class="anomalies-btn me-2"
            @click="showFilterDialog = true"
          >
            Filter
          </v-btn>
          <v-btn
            color="success"
            prepend-icon="mdi-check-all"
            class="anomalies-btn"
            @click="resolveAllAnomalies"
          >
            Resolve All
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <!-- Anomalies List -->
    <v-card class="anomalies-section-card">
      <v-card-title class="anomalies-section-title">
        <v-icon class="me-2" color="error">mdi-alert</v-icon>
        Active Anomalies
      </v-card-title>
      <v-card-text>
        <div v-if="loading" class="text-center py-8">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
        <div v-else-if="filteredAnomalies.length === 0" class="text-center py-8">
          <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-check-circle</v-icon>
          <h3 class="text-h6 text-muted mb-2">No anomalies found</h3>
          <p class="text-muted">All systems are running normally</p>
        </div>
        <div v-else class="anomalies-list">
          <div
            v-for="anomaly in filteredAnomalies"
            :key="anomaly.id"
            class="anomaly-item"
          >
            <div class="anomaly-header">
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <v-chip
                    :color="getSeverityColor(anomaly.severity)"
                    size="small"
                    class="me-3"
                  >
                    {{ anomaly.severity }}
                  </v-chip>
                  <v-chip
                    :color="getTypeColor(anomaly.type)"
                    size="small"
                    variant="outlined"
                  >
                    {{ formatAnomalyType(anomaly.type) }}
                  </v-chip>
                </div>
                <div class="anomaly-date">
                  {{ formatDate(anomaly.detectedAt) }}
                </div>
              </div>
            </div>
            
            <div class="anomaly-content">
              <div class="anomaly-description">
                <h4 class="text-h6 mb-2">{{ anomaly.description }}</h4>
                <p class="text-muted mb-3">
                  {{ anomaly.licensePlate || anomaly.cardNumber }}
                </p>
                
                <!-- Anomaly Details -->
                <div class="anomaly-details">
                  <div
                    v-for="(value, key) in anomaly.details"
                    :key="key"
                    class="detail-item"
                  >
                    <span class="detail-label">{{ formatDetailKey(key) }}:</span>
                    <span class="detail-value">{{ formatDetailValue(value) }}</span>
                  </div>
                </div>
              </div>
              
              <div class="anomaly-actions">
                <v-btn
                  variant="outlined"
                  size="small"
                  class="anomaly-btn"
                  @click="viewAnomalyDetails(anomaly)"
                >
                  View Details
                </v-btn>
                <v-btn
                  variant="outlined"
                  size="small"
                  class="anomaly-btn"
                  @click="resolveAnomaly(anomaly)"
                >
                  Resolve
                </v-btn>
                <v-btn
                  variant="outlined"
                  size="small"
                  class="anomaly-btn"
                  @click="acknowledgeAnomaly(anomaly)"
                >
                  Acknowledge
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Anomaly Statistics -->
    <v-row class="mt-6">
      <v-col cols="12" md="6">
        <v-card class="anomalies-section-card">
          <v-card-title class="anomalies-section-title">
            <v-icon class="me-2" color="info">mdi-chart-pie</v-icon>
            Anomaly Types
          </v-card-title>
          <v-card-text>
            <div class="stats-grid">
              <div
                v-for="(count, type) in anomalyCountByType"
                :key="type"
                class="stat-item"
              >
                <div class="stat-icon">
                  <v-icon :color="getTypeColor(type)">{{ getTypeIcon(type) }}</v-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ count }}</div>
                  <div class="stat-label">{{ formatAnomalyType(type) }}</div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="6">
        <v-card class="anomalies-section-card">
          <v-card-title class="anomalies-section-title">
            <v-icon class="me-2" color="warning">mdi-trending-up</v-icon>
            Recent Trends
          </v-card-title>
          <v-card-text>
            <div class="text-center py-8">
              <v-icon size="64" color="grey-lighten-1">mdi-chart-line</v-icon>
              <p class="text-muted mt-2">Anomaly trend charts will be displayed here</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Composables
const { anomalies, loading, getAnomalies, openAnomalies, highSeverityAnomalies, getAnomalyCountByType } = useAnomalies()

// Reactive data
const searchQuery = ref('')
const showFilterDialog = ref(false)
const resolvedToday = ref(3) // Placeholder

// Computed properties
const filteredAnomalies = computed(() => {
  if (!searchQuery.value) return openAnomalies.value
  
  const query = searchQuery.value.toLowerCase()
  return openAnomalies.value.filter(anomaly => 
    anomaly.description.toLowerCase().includes(query) ||
    (anomaly.licensePlate && anomaly.licensePlate.toLowerCase().includes(query)) ||
    (anomaly.cardNumber && anomaly.cardNumber.toLowerCase().includes(query)) ||
    anomaly.type.toLowerCase().includes(query)
  )
})

const anomalyCountByType = computed(() => getAnomalyCountByType.value)

// Methods
const getSeverityColor = (severity) => {
  const colors = {
    low: 'success',
    medium: 'warning',
    high: 'error',
    critical: 'error'
  }
  return colors[severity] || 'info'
}

const getTypeColor = (type) => {
  const colors = {
    fuel_consumption_spike: 'warning',
    service_overdue: 'error',
    mileage_without_refuel: 'info',
    low_fuel_card_balance: 'warning',
    refuel_without_mileage: 'info'
  }
  return colors[type] || 'primary'
}

const getTypeIcon = (type) => {
  const icons = {
    fuel_consumption_spike: 'mdi-gas-station',
    service_overdue: 'mdi-wrench',
    mileage_without_refuel: 'mdi-speedometer',
    low_fuel_card_balance: 'mdi-credit-card',
    refuel_without_mileage: 'mdi-gas-station'
  }
  return icons[type] || 'mdi-alert'
}

const formatAnomalyType = (type) => {
  return type.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

const formatDetailKey = (key) => {
  return key.split(/(?=[A-Z])/).map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

const formatDetailValue = (value) => {
  if (typeof value === 'number') {
    return value.toLocaleString()
  }
  return value
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const viewAnomalyDetails = (anomaly) => {
  console.log('View anomaly details:', anomaly)
}

const resolveAnomaly = (anomaly) => {
  console.log('Resolve anomaly:', anomaly)
}

const acknowledgeAnomaly = (anomaly) => {
  console.log('Acknowledge anomaly:', anomaly)
}

const resolveAllAnomalies = () => {
  console.log('Resolve all anomalies')
}

// Lifecycle
onMounted(async () => {
  await getAnomalies()
})
</script>

<style scoped>
.anomalies-root {
  padding-bottom: 32px;
}

.anomalies-header {
  margin-bottom: 32px;
}

.anomalies-title {
  letter-spacing: -0.5px;
  margin-top: 8px;
  font-size: 2rem;
  font-weight: 700;
  color: var(--v-theme-text-primary);
}

.anomalies-subtitle {
  margin-bottom: 32px;
  color: var(--v-theme-text-secondary);
  font-size: 1.1rem;
}

.kpi-row {
  margin-bottom: 32px;
}

.anomalies-actions {
  background: linear-gradient(135deg, #fffde7 0%, #f8fafb 100%);
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(16, 30, 54, 0.06);
}

.anomalies-search {
  max-width: 400px;
}

.anomalies-btn {
  font-weight: 600;
  border-radius: 10px;
  min-width: 140px;
}

.anomalies-section-card {
  border-radius: 18px;
  background: linear-gradient(135deg, #fffde7 0%, #f8fafb 100%);
  box-shadow: 0 2px 12px rgba(16, 30, 54, 0.06);
  margin-bottom: 24px;
  transition: box-shadow 0.2s, transform 0.2s;
}

.anomalies-section-card:hover {
  box-shadow: 0 6px 24px rgba(80, 80, 80, 0.10);
  transform: translateY(-1px);
}

.anomalies-section-title {
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: #212121;
  padding-top: 18px;
  padding-bottom: 8px;
}

.anomalies-list {
  padding: 0 8px 8px 8px;
}

.anomaly-item {
  background: linear-gradient(90deg, #e3f2fd 0%, #f8fafb 100%);
  border-radius: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.08);
  transition: box-shadow 0.2s, transform 0.2s;
  overflow: hidden;
}

.anomaly-item:hover {
  box-shadow: 0 4px 16px rgba(33, 150, 243, 0.12);
  transform: translateY(-1px);
}

.anomaly-header {
  padding: 16px 20px 12px 20px;
  border-bottom: 1px solid #f0f1f3;
  background: rgba(255, 255, 255, 0.5);
}

.anomaly-date {
  font-size: 0.9rem;
  color: var(--v-theme-text-secondary);
}

.anomaly-content {
  padding: 20px;
}

.anomaly-description {
  margin-bottom: 16px;
}

.anomaly-details {
  margin-top: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.detail-label {
  color: var(--v-theme-text-secondary);
  font-weight: 500;
}

.detail-value {
  font-weight: 600;
  color: var(--v-theme-text-primary);
}

.anomaly-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.anomaly-btn {
  font-weight: 600;
  border-radius: 8px;
  min-width: 100px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
}

.stat-icon {
  margin-right: 12px;
}

.stat-content {
  flex-grow: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--v-theme-text-primary);
}

.stat-label {
  font-size: 0.9rem;
  color: var(--v-theme-text-secondary);
}
</style> 