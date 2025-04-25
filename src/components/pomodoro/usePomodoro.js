import { ref, computed, watch } from 'vue'

export default function usePomodoro(tasks) {
  // Configuración inicial
  const workMinutes = ref(25)
  const shortBreakMinutes = ref(5)
  const longBreakMinutes = ref(15)
  const focusBlocks = ref(4)

  const timeLeft = ref(workMinutes.value * 60)
  const isRunning = ref(false)
  const mode = ref('work')
  const completedFocusBlocks = ref(0)
  const currentTask = ref(null)
  let timerInterval = null

  // Etiqueta e icono del modo actual
  const currentModeLabel = computed(() => {
    if (mode.value === 'work') return 'Concentración'
    if (mode.value === 'shortBreak') return 'Descanso corto'
    if (mode.value === 'longBreak') return 'Descanso largo'
    return 'Modo desconocido'
  })

  const modeIcon = computed(() => {
    if (mode.value === 'work') return 'bi bi-briefcase'
    if (mode.value === 'shortBreak') return 'bi bi-cup'
    if (mode.value === 'longBreak') return 'bi bi-cup-hot'
    return 'bi bi-question-circle'
  })

  // Formatear el tiempo en minutos y segundos
  const formattedTime = computed(() => {
    const minutes = Math.floor(timeLeft.value / 60)
      .toString()
      .padStart(2, '0')
    const seconds = (timeLeft.value % 60).toString().padStart(2, '0')
    return `${minutes}:${seconds}`
  })

  // Buscar la primera tarea pendiente
  const findPendingTask = () => {
    return tasks.value.find((task) => !task.completed)
  }

  // Cambiar entre modos manualmente
  const switchMode = (newMode) => {
    if (isRunning.value) {
      pauseTimer()
    }

    // Si cambiamos a modo trabajo, buscar una tarea pendiente
    if (newMode === 'work') {
      currentTask.value = findPendingTask()
      if (!currentTask.value && tasks.value.length > 0) {
        alert('Todas las tareas están completadas. Considera crear nuevas tareas.')
      }
    }

    setMode(newMode)
  }

  // Iniciar el temporizador
  const startTimer = () => {
    if (tasks.value.length === 0) {
      alert('Por favor, crea una tarea primero.')
      return
    }

    // Si estamos en modo trabajo, necesitamos una tarea
    if (mode.value === 'work') {
      const pendingTask = findPendingTask()
      if (!pendingTask) {
        alert('Todas las tareas están completadas. ¡Crea una nueva!')
        return
      }
      currentTask.value = pendingTask
    }

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
      // Buscar la siguiente tarea pendiente cuando volvemos a trabajar
      currentTask.value = findPendingTask()
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

  // Cambiar entre modos
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

  // Aplicar configuraciones
  const applySettings = () => {
    resetTimer()
  }

  // Observar cambios en las tareas
  watch(
    tasks,
    () => {
      if (mode.value === 'work') {
        const pendingTask = findPendingTask()
        if (pendingTask) {
          currentTask.value = pendingTask
        } else if (tasks.value.length > 0) {
          if (currentTask.value !== null) {
            currentTask.value = null
            if (isRunning.value) {
              alert('Todas las tareas están completadas. Considera añadir nuevas tareas.')
            }
          }
        }
      }
    },
    { deep: true },
  )

  return {
    // Estado
    workMinutes,
    shortBreakMinutes,
    longBreakMinutes,
    focusBlocks,
    timeLeft,
    isRunning,
    mode,
    currentTask,

    // Computed
    currentModeLabel,
    modeIcon,
    formattedTime,

    // Métodos
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    applySettings,
  }
}
