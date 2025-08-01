<template>
  <v-chip :color="props.status.color" class="status-badge" size="small" props.status.label>
    {{ props.status.label }}
  </v-chip>
</template>

<script setup lang="ts">
const props = defineProps<{
  status: Object
}>()
</script>

<style scoped>
.status-badge {
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: capitalize;
  padding: 0 14px;
  border-radius: 999px;
  background: linear-gradient(90deg, #ffffff 0%, #f8f9fa 100%);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  min-height: 28px;
}
.status-badge-icon {
  margin-right: 4px;
}
</style> 