<template>
  <div>
    <h1 class="text-h4 mb-2 text-text-primary">Efficiency Analysis</h1>
    <p class="text-subtitle-1 text-text-secondary mb-6">
      Analyze fuel efficiency patterns and identify anomalies
    </p>

    <v-card class="bg-surface pa-6 mb-6">
      <v-card-title class="text-text-primary">Analysis Filters</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-select
              label="Select Vehicle"
              :items="vehicles"
              item-title="licensePlate"
              item-value="id"
              clearable
              v-model="selectedVehicleId"
            ></v-select>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              label="Select Period"
              :items="reportPeriods"
              v-model="selectedPeriod"
            ></v-select>
          </v-col>
        </v-row>
        <v-row v-if="selectedPeriod === 'Custom'">
          <v-col cols="12" md="6">
            <v-text-field
              label="Start Date"
              type="date"
              v-model="customStartDate"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="End Date"
              type="date"
              v-model="customEndDate"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="primary" @click="generateAnalysis">Generate Analysis</v-btn>
      </v-card-actions>
    </v-card>

    <v-row>
      <v-col cols="12" md="6">
        <v-card class="bg-surface pa-4">
          <v-card-title class="text-text-primary">Efficiency Trend (Liters/100km)</v-card-title>
          <v-card-text>
            <canvas ref="efficiencyTrendChart"></canvas>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="bg-surface pa-4">
          <v-card-title class="text-text-primary">Anomaly Detection</v-card-title>
          <v-card-text>
            <v-list class="bg-transparent">
              <v-list-item
                v-for="anomaly in detectedAnomalies"
                :key="anomaly.id"
                class="rounded-lg mb-2 bg-background"
              >
                <v-list-item-title class="text-error font-weight-bold">Anomaly Detected: {{ anomaly.type }}</v-list-item-title>
                <v-list-item-subtitle class="text-text-secondary">Vehicle: {{ getVehiclePlate(anomaly.vehicleId) }} | Date: {{ new Date(anomaly.date).toLocaleDateString() }}</v-list-item-subtitle>
                <v-list-item-subtitle class="text-text-secondary">Details: {{ anomaly.details }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item v-if="detectedAnomalies.length === 0">
                <v-list-item-title class="text-center text-text-secondary">No anomalies detected.</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="bg-surface pa-4 mt-6">
      <v-card-title class="text-text-primary">Detailed Efficiency Data</v-card-title>
      <v-card-text>
        <v-table class="text-text-primary">
          <thead>
            <tr>
              <th class="text-left text-overline">Date</th>
              <th class="text-left text-overline">Vehicle</th>
              <th class="text-left text-overline">Kilometers Driven</th>
              <th class="text-left text-overline">Fuel Consumed (L)</th>
              <th class="text-left text-overline">Efficiency (L/100km)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in efficiencyData" :key="data.date + data.vehicleId">
              <td>{{ new Date(data.date).toLocaleDateString() }}</td>
              <td>{{ getVehiclePlate(data.vehicleId) }}</td>
              <td>{{ data.kilometersDriven.toLocaleString() }} km</td>
              <td>{{ data.fuelConsumed.toLocaleString() }} L</td>
              <td>{{ data.efficiency.toFixed(2) }}</td>
            </tr>
            <tr v-if="efficiencyData.length === 0">
              <td colspan="5" class="text-center text-text-secondary">No efficiency data for the selected criteria.</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useVehicles } from '~/composables/useVehicles'
import { useFuel } from '~/composables/useFuel'
import Chart from 'chart.js/auto'
import type { Vehicle, FuelRecord, MileageRecord } from '~/types/fleet'

const { vehicles, getVehicles } = useVehicles()
const { fuelRecords, getFuelRecords, mileageRecords } = useFuel()

const selectedVehicleId = ref<string | null>(null)
const selectedPeriod = ref<string>('Last 30 Days')
const reportPeriods = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'This Year', 'Custom']
const customStartDate = ref<string | null>(null)
const customEndDate = ref<string | null>(null)

const efficiencyTrendChart = ref<HTMLCanvasElement | null>(null)
let trendChartInstance: Chart | null = null

const getVehiclePlate = (vehicleId: string) => {
  const vehicle = vehicles.value.find((v) => v.id === vehicleId)
  return vehicle?.licensePlate || 'N/A'
}

const filteredRecords = computed(() => {
  let records = [...fuelRecords.value]

  if (selectedVehicleId.value) {
    records = records.filter(record => record.vehicleId === selectedVehicleId.value)
  }

  const endDate = customEndDate.value ? new Date(customEndDate.value) : new Date()
  let startDate = new Date()

  switch (selectedPeriod.value) {
    case 'Last 7 Days':
      startDate.setDate(endDate.getDate() - 7)
      break
    case 'Last 30 Days':
      startDate.setDate(endDate.getDate() - 30)
      break
    case 'Last 90 Days':
      startDate.setDate(endDate.getDate() - 90)
      break
    case 'This Year':
      startDate = new Date(endDate.getFullYear(), 0, 1)
      break
    case 'Custom':
      if (customStartDate.value) {
        startDate = new Date(customStartDate.value)
      }
      break
  }
  
  startDate.setHours(0, 0, 0, 0)
  endDate.setHours(23, 59, 59, 999)

  return records.filter(record => {
    const recordDate = new Date(record.date)
    return recordDate >= startDate && recordDate <= endDate
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
})

const efficiencyData = computed(() => {
  const data: { date: string; vehicleId: string; kilometersDriven: number; fuelConsumed: number; efficiency: number }[] = []

  const vehicleMileageMap = new Map<string, { latestMileage: number; date: string }>()
  mileageRecords.value.forEach(m => {
    const current = vehicleMileageMap.get(m.vehicleId)
    if (!current || new Date(m.date) > new Date(current.date)) {
      vehicleMileageMap.set(m.vehicleId, { latestMileage: m.kilometers, date: m.date })
    }
  })

  const groupedByVehicleAndDate = new Map<string, { fuel: number; mileageAtRefuel: number[] }>()

  filteredRecords.value.forEach(record => {
    const key = `${record.vehicleId}-${record.date}`;
    if (!groupedByVehicleAndDate.has(key)) {
      groupedByVehicleAndDate.set(key, { fuel: 0, mileageAtRefuel: [] });
    }
    const entry = groupedByVehicleAndDate.get(key);
    if (entry) {
      entry.fuel += record.quantity;
      if (record.mileageAtRefuel) {
        entry.mileageAtRefuel.push(record.mileageAtRefuel);
      }
    }
  });

  groupedByVehicleAndDate.forEach((value, key) => {
    const [vehicleId, date] = key.split('-');
    const totalFuel = value.fuel;
    const avgMileageAtRefuel = value.mileageAtRefuel.length > 0 
      ? value.mileageAtRefuel.reduce((a, b) => a + b, 0) / value.mileageAtRefuel.length
      : 0;

    // Simplified: For accurate efficiency, we need mileage *between* refuels.
    // Here, we're using a placeholder for kilometersDriven. This needs to be refined.
    const kilometersDriven = avgMileageAtRefuel || 1; // Avoid division by zero
    const efficiency = kilometersDriven > 0 ? (totalFuel / kilometersDriven) * 100 : 0;

    data.push({
      date: date,
      vehicleId: vehicleId,
      kilometersDriven: kilometersDriven, // This needs proper calculation
      fuelConsumed: totalFuel,
      efficiency: efficiency,
    });
  });

  return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
});

const detectedAnomalies = computed(() => {
  const anomalies: { id: string; type: string; vehicleId: string; date: string; details: string }[] = []

  // Basic anomaly detection: e.g., very low or very high efficiency
  efficiencyData.value.forEach(data => {
    if (data.efficiency > 15) {
      anomalies.push({
        id: `anomaly-${data.vehicleId}-${data.date}`,
        type: 'High Fuel Consumption',
        vehicleId: data.vehicleId,
        date: data.date,
        details: `Efficiency of ${data.efficiency.toFixed(2)} L/100km is unusually high.`,
      })
    } else if (data.efficiency < 3 && data.kilometersDriven > 100) {
      anomalies.push({
        id: `anomaly-${data.vehicleId}-${data.date}`,
        type: 'Unusually Low Efficiency',
        vehicleId: data.vehicleId,
        date: data.date,
        details: `Efficiency of ${data.efficiency.toFixed(2)} L/100km is unusually low for kilometers driven.`,
      })
    }
  })
  return anomalies
})

const renderChart = () => {
  if (trendChartInstance) {
    trendChartInstance.destroy()
  }
  if (efficiencyTrendChart.value) {
    const labels = efficiencyData.value.map(d => new Date(d.date).toLocaleDateString())
    const data = efficiencyData.value.map(d => d.efficiency)

    trendChartInstance = new Chart(efficiencyTrendChart.value, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Fuel Efficiency (L/100km)',
          data: data,
          borderColor: '#f4d609',
          backgroundColor: 'rgba(244, 214, 9, 0.2)',
          tension: 0.1,
          fill: true,
        }],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Liters/100km' },
          },
          x: {
            title: { display: true, text: 'Date' },
          },
        },
      },
    })
  }
}

const generateAnalysis = () => {
  renderChart()
}

watch([selectedVehicleId, selectedPeriod, customStartDate, customEndDate], () => {
  generateAnalysis()
})

onMounted(async () => {
  await Promise.all([getVehicles(), getFuelRecords()])
  generateAnalysis()
})

onBeforeUnmount(() => {
  if (trendChartInstance) {
    trendChartInstance.destroy()
  }
})
</script> 