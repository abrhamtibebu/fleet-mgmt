<template>
  <NuxtLayout />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');

html, body {
  font-family: 'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  background: #F5F7F8;
  color: #333;
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
  background: #f0f1f3;
}
::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 4px;
}
</style>
