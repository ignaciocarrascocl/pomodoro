<template>
  <div class="pomodoro-container text-center">
    <div class="timer-card">
      <!-- Botón de configuración en esquina superior derecha -->
      <div class="settings-wrapper">
        <button
          class="btn settings-btn"
          data-bs-toggle="modal"
          data-bs-target="#configModal"
          title="Configuración"
        >
          <i class="bi bi-gear-fill"></i>
        </button>
      </div>

      <!-- Temporizador -->
      <TimerDisplay
        :formatted-time="formattedTime"
        :current-mode-label="currentModeLabel"
        :mode-icon="modeIcon"
        :mode="mode"
        :current-task="currentTask"
      />

      <!-- Controles -->
      <TimerControls
        :is-running="isRunning"
        @start="startTimer"
        @pause="pauseTimer"
        @reset="resetTimer"
      />

      <!-- Selector de modo -->
      <ModeSelector :current-mode="mode" @switch-mode="switchMode" />
    </div>

    <!-- Modal de configuración -->
    <ConfigModal
      :work-minutes="workMinutes"
      :short-break-minutes="shortBreakMinutes"
      :long-break-minutes="longBreakMinutes"
      :focus-blocks="focusBlocks"
      @save="saveConfig"
    />
  </div>
</template>

<script setup>
import { toRef } from 'vue'
import TimerDisplay from './pomodoro/TimerDisplay.vue'
import TimerControls from './pomodoro/TimerControls.vue'
import ModeSelector from './pomodoro/ModeSelector.vue'
import ConfigModal from './pomodoro/ConfigModal.vue'
import usePomodoro from './pomodoro/usePomodoro.js'

// Props para recibir las tareas desde el componente padre
const props = defineProps({
  tasks: {
    type: Array,
    required: true,
  },
})

// Convertir props.tasks a ref para usar en el composable
const tasksRef = toRef(props, 'tasks')

// Usar el composable para la lógica del temporizador
const {
  workMinutes,
  shortBreakMinutes,
  longBreakMinutes,
  focusBlocks,
  isRunning,
  mode,
  currentTask,
  currentModeLabel,
  modeIcon,
  formattedTime,
  startTimer,
  pauseTimer,
  resetTimer,
  switchMode,
} = usePomodoro(tasksRef)

// Guardar configuración
const saveConfig = (config) => {
  workMinutes.value = config.workMinutes
  shortBreakMinutes.value = config.shortBreakMinutes
  longBreakMinutes.value = config.longBreakMinutes
  focusBlocks.value = config.focusBlocks
  resetTimer()
}
</script>

<style scoped>
.pomodoro-container {
  max-width: 650px;
  margin: 0 auto;
}

.timer-card {
  position: relative;
  background-color: #ffffff;
  border-radius: 15px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.settings-wrapper {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 10;
}

.settings-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  color: #777;
  transition: all 0.3s ease;
  border: none;
}

.settings-btn:hover {
  background-color: #f0f0f0;
  color: #333;
  transform: rotate(30deg);
}

.settings-btn i {
  font-size: 1.2rem;
}

@media (max-width: 576px) {
  .timer-card {
    padding: 1.5rem;
  }
}
</style>
