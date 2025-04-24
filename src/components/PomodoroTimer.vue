<template>
  <div class="text-center">
    <h3><i class="bi bi-clock-history"></i> {{ currentModeLabel }}</h3>
    <h2>{{ formattedTime }}</h2>
    <div class="mt-3">
      <button class="btn btn-success mx-2" @click="startTimer" :disabled="isRunning">
        <i class="bi bi-play-fill"></i> Iniciar
      </button>
      <button class="btn btn-warning mx-2" @click="pauseTimer" :disabled="!isRunning">
        <i class="bi bi-pause-fill"></i> Pausar
      </button>
      <button class="btn btn-danger mx-2" @click="resetTimer">
        <i class="bi bi-arrow-clockwise"></i> Reiniciar
      </button>
    </div>
    <div class="mt-4">
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#configModal">
        <i class="bi bi-gear-fill"></i> Configuración
      </button>
    </div>

    <!-- Modal de configuración -->
    <div
      class="modal fade"
      id="configModal"
      tabindex="-1"
      aria-labelledby="configModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="configModalLabel">
              <i class="bi bi-sliders"></i> Configuración
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="workTime" class="form-label">Concentración (min):</label>
              <input
                id="workTime"
                type="number"
                v-model.number="workMinutes"
                class="form-control"
                min="1"
              />
            </div>
            <div class="mb-3">
              <label for="shortBreak" class="form-label">Descanso corto (min):</label>
              <input
                id="shortBreak"
                type="number"
                v-model.number="shortBreakMinutes"
                class="form-control"
                min="1"
              />
            </div>
            <div class="mb-3">
              <label for="longBreak" class="form-label">Descanso largo (min):</label>
              <input
                id="longBreak"
                type="number"
                v-model.number="longBreakMinutes"
                class="form-control"
                min="1"
              />
            </div>
            <div class="mb-3">
              <label for="focusBlocks" class="form-label"
                >Bloques de concentración antes de descanso largo:</label
              >
              <input
                id="focusBlocks"
                type="number"
                v-model.number="focusBlocks"
                class="form-control"
                min="1"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-circle"></i> Cerrar
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="applySettings"
              data-bs-dismiss="modal"
            >
              <i class="bi bi-check-circle"></i> Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Configuración inicial
const workMinutes = ref(25)
const shortBreakMinutes = ref(5)
const longBreakMinutes = ref(15)
const focusBlocks = ref(4) // Número de bloques de concentración antes de un descanso largo

const timeLeft = ref(workMinutes.value * 60)
const isRunning = ref(false)
const mode = ref('work') // Puede ser 'work', 'shortBreak', o 'longBreak'
const completedFocusBlocks = ref(0) // Contador de bloques completados
let timerInterval = null

// Etiqueta del modo actual
const currentModeLabel = computed(() => {
  if (mode.value === 'work') return 'Concentración'
  if (mode.value === 'shortBreak') return 'Descanso corto'
  if (mode.value === 'longBreak') return 'Descanso largo'
  return 'Modo desconocido' // Default return value
})

// Formatear el tiempo en minutos y segundos
const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
    .toString()
    .padStart(2, '0')
  const seconds = (timeLeft.value % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
})

// Iniciar el temporizador
const startTimer = () => {
  if (!isRunning.value) {
    isRunning.value = true
    timerInterval = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        clearInterval(timerInterval)
        isRunning.value = false
        handleTimerEnd()
      }
    }, 1000)
  }
}

// Manejar el final del temporizador
const handleTimerEnd = () => {
  if (mode.value === 'work') {
    completedFocusBlocks.value++
    if (completedFocusBlocks.value >= focusBlocks.value) {
      setMode('longBreak')
      completedFocusBlocks.value = 0
    } else {
      setMode('shortBreak')
    }
  } else {
    setMode('work')
  }
  alert('¡Tiempo terminado!')
}

// Pausar el temporizador
const pauseTimer = () => {
  isRunning.value = false
  clearInterval(timerInterval)
}

// Reiniciar el temporizador
const resetTimer = () => {
  isRunning.value = false
  clearInterval(timerInterval)
  setMode(mode.value)
}

// Cambiar entre modos (concentración, descanso corto, descanso largo)
const setMode = (newMode) => {
  mode.value = newMode
  if (newMode === 'work') {
    timeLeft.value = workMinutes.value * 60
  } else if (newMode === 'shortBreak') {
    timeLeft.value = shortBreakMinutes.value * 60
  } else if (newMode === 'longBreak') {
    timeLeft.value = longBreakMinutes.value * 60
  }
}

// Aplicar configuraciones desde el modal
const applySettings = () => {
  resetTimer()
}
</script>

<style scoped>
h2 {
  font-size: 3rem;
  font-weight: bold;
}
h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
button {
  font-size: 1.2rem;
}
input {
  width: 100%;
  text-align: center;
}
</style>
