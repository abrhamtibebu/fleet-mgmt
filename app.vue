<template>
  <NuxtLayout />
</template>

<script setup>
import { onMounted } from 'vue'

const { initializeAuth } = useAuth()

onMounted(async () => {
  await initializeAuth()
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');

html, body {
  font-family: 'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  background: #f8f9fa;
  color: #1a1a1a;
  letter-spacing: 0.01em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
}

::-webkit-scrollbar {
  width: 8px;
  background: #e9ecef;
}
::-webkit-scrollbar-thumb {
  background: #6c757d;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #495057;
}

/* Global dialog look & feel */
.dialog-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 28px rgba(0,0,0,0.08);
  background: #fff;
}
.dialog-title {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  color: #040707;
  font-size: 1.25rem;
  font-weight: 700;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
.dialog-actions {
  padding: 20px 24px;
  background: #fff;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}
.dialog-subtitle {
  color: #6b7280;
  font-size: 0.95rem;
}
.title-icon-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 193, 7, 0.15);
  border-radius: 10px;
  padding: 6px;
}
.section-icon-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 193, 7, 0.12);
  border-radius: 8px;
  padding: 4px;
}
/* Compact grid spacing helper */
.grid-gap-sm > .v-col {
  padding-top: 8px !important;
  padding-bottom: 8px !important;
}
</style>
