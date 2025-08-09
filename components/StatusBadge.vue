<template>
  <v-chip :color="status?.color || 'primary'" class="status-badge" size="small">
    {{ status?.label || 'Unknown' }}
  </v-chip>
</template>

<script setup lang="ts">
interface Status {
  id?: number
  color?: string
  label?: string
}

const props = defineProps<{
  status?: Status
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
  box-shadow: 0 1px 4px rgba(4, 7, 7, 0.1);
  border: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  min-height: 28px;
}
.status-badge-icon {
  margin-right: 4px;
}
</style> 