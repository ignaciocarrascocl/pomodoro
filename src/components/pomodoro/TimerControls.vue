<template>
  <div class="controls mt-4">
    <button
      class="btn control-btn"
      :class="isRunning ? 'btn-warning' : 'btn-success'"
      @click="isRunning ? onPause() : onStart()"
    >
      <i :class="isRunning ? 'bi bi-pause-fill' : 'bi bi-play-fill'"></i>
      {{ isRunning ? 'Pausar' : 'Iniciar' }}
    </button>
    <button class="btn btn-danger control-btn ms-2" @click="onReset">
      <i class="bi bi-arrow-clockwise"></i> Reiniciar
    </button>
  </div>
</template>

<script setup>
defineProps({
  isRunning: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['start', 'pause', 'reset'])

const onStart = () => emit('start')
const onPause = () => emit('pause')
const onReset = () => emit('reset')
</script>

<style scoped>
.control-btn {
  padding: 10px 25px;
  font-size: 1.1rem;
  border-radius: 50px;
  border: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-success {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn-success:hover {
  background-color: #34495a;
  border-color: #34495a;
}

.btn-warning {
  background-color: var(--silver-lake-blue);
  border-color: var(--silver-lake-blue);
}

.btn-warning:hover {
  background-color: #6b7f94;
  border-color: #6b7f94;
}

.btn-danger {
  background-color: var(--oxford-blue);
  border-color: var(--oxford-blue);
}

.btn-danger:hover {
  background-color: #15202e;
  border-color: #15202e;
}
</style>
