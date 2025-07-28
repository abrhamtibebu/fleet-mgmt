<template>
  <div class="coming-soon-container">
    <v-card class="coming-soon-card" elevation="0">
      <div class="text-center pa-8">
        <div class="coming-soon-icon mb-6">
          <v-icon :icon="icon" size="120" color="primary" />
        </div>
        <h1 class="coming-soon-title mb-4">{{ title }}</h1>
        <p class="coming-soon-description mb-6">{{ description }}</p>
        <v-btn
          color="primary"
          variant="outlined"
          prepend-icon="mdi-arrow-left"
          @click="$router.push('/')"
        >
          Back to Dashboard
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  icon: string
}>()
</script>

<style scoped>
.coming-soon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem;
}

.coming-soon-card {
  max-width: 500px;
  width: 100%;
  border-radius: 18px;
  background: linear-gradient(135deg, #fffde7 0%, #f8fafb 100%);
  box-shadow: 0 2px 12px rgba(16, 30, 54, 0.06);
  transition: box-shadow 0.2s, transform 0.2s;
}

.coming-soon-card:hover {
  box-shadow: 0 6px 24px rgba(80, 80, 80, 0.10);
  transform: translateY(-2px);
}

.coming-soon-icon {
  opacity: 0.7;
}

.coming-soon-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--v-theme-text-primary);
  letter-spacing: -0.5px;
}

.coming-soon-description {
  font-size: 1.1rem;
  color: var(--v-theme-text-secondary);
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto;
}
</style> 