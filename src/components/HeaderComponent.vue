<template>
  <header class="app-header">
    <div class="container header-container">
      <div class="logo-container">
        <i class="bi bi-alarm logo-icon"></i>
        <h1 class="app-title">Pomodoro Timer</h1>
      </div>

      <button
        class="navbar-toggler"
        type="button"
        @click="toggleNavbar"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <i class="bi bi-list"></i>
      </button>

      <nav class="navbar-collapse" :class="{ show: isNavbarOpen }" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link" @click="closeNavbar">
              <i class="bi bi-house-door"></i>
              <span>Inicio</span>
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/que-es-pomodoro" class="nav-link" @click="closeNavbar">
              <i class="bi bi-info-circle"></i>
              <span>Qué es Pomodoro</span>
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

// Estado para manejar la visibilidad del menú
const isNavbarOpen = ref(false)

// Toggle del menú de navegación
const toggleNavbar = () => {
  isNavbarOpen.value = !isNavbarOpen.value
}

// Cerrar el menú al hacer clic en un enlace (móviles)
const closeNavbar = () => {
  isNavbarOpen.value = false
}
</script>

<style scoped>
.app-header {
  background-color: var(--color-background-soft);
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.4);
  padding: 0;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  flex-wrap: nowrap;
}

.logo-container {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.logo-icon {
  font-size: 1.8rem;
  color: var(--color-primary);
  margin-right: 10px;
}

.app-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0;
}

.navbar-toggler {
  background: transparent;
  border: none;
  color: var(--color-heading);
  font-size: 1.5rem;
  padding: 8px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
  display: none;
}

.navbar-toggler:hover {
  background-color: var(--color-background-mute);
}

.navbar-collapse {
  display: flex;
  align-items: center;
}

.navbar-nav {
  display: flex;
  flex-direction: row;
  list-style: none;
  margin: 0 0 0 auto;
  padding: 0;
  gap: 0.5rem;
}

.nav-item {
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  color: var(--color-text);
  text-decoration: none;
  padding: 0.5rem 1rem;
  font-weight: 500;
  border-radius: 50px;
  transition: all 0.3s ease;
}

.nav-link i {
  margin-right: 6px;
  font-size: 1.1rem;
}

.nav-link:hover,
.router-link-active {
  color: var(--color-primary);
  background-color: rgba(65, 90, 119, 0.2);
}

/* Media query para dispositivos móviles */
@media (max-width: 768px) {
  .header-container {
    flex-wrap: wrap; /* Permitir que los elementos se apilen en móvil */
    padding: 1rem 15px;
  }

  .navbar-toggler {
    display: block; /* Visible en móvil */
    order: 2;
  }

  .navbar-collapse {
    flex-basis: 100%;
    display: none; /* Oculto por defecto en móvil */
    order: 3;
    margin-top: 1rem;
  }

  .navbar-collapse.show {
    display: block; /* Visible cuando se activa en móvil */
  }

  .navbar-nav {
    flex-direction: column; /* Vertical en móvil */
    width: 100%;
    gap: 0.5rem;
  }

  .nav-link {
    border-radius: 8px;
    padding: 0.7rem 1rem;
  }
}
</style>
