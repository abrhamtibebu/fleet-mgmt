<template>
  <v-card class="vehicle-card" elevation="0">
    <div class="d-flex align-center justify-space-between mb-3">
      <div class="d-flex align-center">
        <v-icon icon="mdi-car" class="mr-3 vehicle-main-icon" size="32" />
        <div>
          <div class="font-weight-bold vehicle-id">{{ vehicle.id }}</div>
          <div class="text-caption text-medium-emphasis vehicle-model">{{ vehicle.model }}</div>
        </div>
      </div>
      <StatusBadge :label="vehicle.status" :color="statusColor" :icon="statusIcon" />
    </div>
    <div class="d-flex align-center mb-3">
      <v-icon icon="mdi-speedometer" size="20" class="mr-2" />
      <span class="mr-5 vehicle-metric">{{ vehicle.mileage }} km</span>
      <v-icon icon="mdi-fuel" size="20" class="mr-2" />
      <span class="vehicle-metric">{{ vehicle.fuelLevel }}%</span>
    </div>
    <div class="d-flex align-center mb-2">
      <span class="text-caption">Last Service: {{ vehicle.lastService }}</span>
      <span class="mx-2">|</span>
      <span class="text-caption">Next Service: {{ vehicle.nextService }}</span>
    </div>
    <div class="d-flex align-center mb-2">
      <span class="text-caption">Fuel Card: {{ vehicle.fuelCard }}</span>
      <span class="mx-2">|</span>
      <span class="text-caption">Location: {{ vehicle.location }}</span>
    </div>
    <div class="d-flex align-center mt-4">
      <v-btn variant="outlined" color="primary" size="small" class="mr-2 vehicle-btn">View Details</v-btn>
      <v-btn color="primary" size="small" class="vehicle-btn">Update Mileage</v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import StatusBadge from './StatusBadge.vue'

defineProps<{
  vehicle: {
    id: string
    model: string
    status: string
    mileage: number
    fuelLevel: number
    lastService: string
    nextService: string
    fuelCard: string
    location: string
  }
}>()

const statusColor = computed(() => {
  switch (props.vehicle.status.toLowerCase()) {
    case 'active': return 'success'
    case 'maintenance': return 'warning'
    case 'idle': return 'info'
    case 'out of service': return 'error'
    default: return 'grey'
  }
})

const statusIcon = computed(() => {
  switch (props.vehicle.status.toLowerCase()) {
    case 'active': return 'mdi-check-circle-outline'
    case 'maintenance': return 'mdi-wrench-outline'
    case 'idle': return 'mdi-timer-sand'
    case 'out of service': return 'mdi-alert-circle-outline'
    default: return ''
  }
})
</script>

<style scoped>
.vehicle-card {
  min-width: 320px;
  max-width: 400px;
  padding: 28px 32px;
  border-radius: 20px;
  background: linear-gradient(135deg, #fffde7 0%, #f8fafb 100%);
  box-shadow: 0 2px 12px rgba(16, 30, 54, 0.06);
  margin-bottom: 24px;
  transition: box-shadow 0.2s, transform 0.2s;
}
.vehicle-card:hover {
  box-shadow: 0 8px 32px rgba(80, 80, 80, 0.12);
  transform: translateY(-2px) scale(1.01);
}
.vehicle-main-icon {
  color: #FFD600;
}
.vehicle-id {
  font-size: 1.2rem;
  margin-bottom: 2px;
}
.vehicle-model {
  font-size: 1rem;
}
.vehicle-metric {
  font-size: 1.1rem;
  font-weight: 500;
}
.vehicle-btn {
  font-weight: 600;
  border-radius: 10px;
  min-width: 120px;
}
</style> 