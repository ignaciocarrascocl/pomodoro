<template>
  <footer class="text-center py-3">
    <p>© 2025 Pomodoro App. Todos los derechos reservados.</p>
    <p class="developed-by">Desarrollado por <a href="https://estudiodospuntos.cl" target="_blank" rel="noopener">estudiodospuntos.cl</a></p>
  </footer>
</template>

<script setup>
// No se necesita lógica adicional
</script>

<style scoped>
footer {
  background-color: var(--color-surface-dark);
  color: var(--color-text);
  font-size: 0.9rem;
}

footer p {
  margin: 0.25rem 0;
}

.developed-by {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.developed-by a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.developed-by a:hover {
  color: var(--color-heading);
  text-decoration: underline;
}
</style>
