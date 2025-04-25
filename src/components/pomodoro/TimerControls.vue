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
}
</style>
