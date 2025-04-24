<template>
  <header class="bg-primary text-white">
    <div class="container py-3">
      <h1 class="text-center">Pomodoro Timer</h1>
    </div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav mx-auto">
            <li class="nav-item">
              <RouterLink to="/" class="nav-link">Home</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/que-es-pomodoro" class="nav-link">Qué es Pomodoro</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/about" class="nav-link">Sobre nosotros</RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
h1 {
  font-size: 1.5rem;
}
</style>
