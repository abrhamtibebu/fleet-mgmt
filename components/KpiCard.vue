<template>
  <v-card class="kpi-card" :color="color" elevation="0">
    <div class="d-flex align-center">
      <div class="kpi-icon-bg mr-4">
        <v-icon :icon="icon" class="kpi-icon" size="36" />
      </div>
      <div>
        <div class="kpi-title text-caption text-medium-emphasis">{{ title }}</div>
        <div class="kpi-value text-h5 font-weight-bold">{{ value }}</div>
        <div v-if="trend" class="kpi-trend text-caption" :class="trendClass">{{ trend }}</div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  icon: string
  color?: string
  trend?: string
  trendClass?: string
}>()
</script>

<style scoped>
.kpi-card {
  min-width: 220px;
  min-height: 90px;
  padding: 24px 28px;
  border-radius: 18px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  transition: box-shadow 0.2s, transform 0.2s;
}
.kpi-card:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px) scale(1.02);
}
.kpi-icon-bg {
  background: linear-gradient(135deg, #ffc107 0%, #ffca2c 100%);
  border-radius: 50%;
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(255, 193, 7, 0.2);
}
.kpi-icon {
  color: #ffffff;
}
.kpi-title {
  margin-bottom: 2px;
  font-weight: 500;
}
.kpi-value {
  margin-bottom: 2px;
  font-size: 1.7rem;
}
.kpi-trend {
  margin-top: 2px;
}
</style> 