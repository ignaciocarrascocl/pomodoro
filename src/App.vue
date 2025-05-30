<script setup>
import HeaderComponent from './components/HeaderComponent.vue'
import FooterComponent from './components/FooterComponent.vue'
</script>

<template>
  <div class="app-container d-flex flex-column min-vh-100">
    <HeaderComponent />
    <main class="flex-grow-1 text-center py-5">
      <RouterView />
    </main>
    <FooterComponent />
  </div>
</template>

<style scoped>
.app-container {
  background-color: var(--color-background);
  color: var(--color-text);
  min-height: 100vh;
}

main {
  font-size: 1.2rem;
  background-color: var(--color-background);
}
</style>
