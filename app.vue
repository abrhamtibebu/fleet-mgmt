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
</style>
