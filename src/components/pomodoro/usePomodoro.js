import { ref, computed, watch } from 'vue'

export default function usePomodoro(tasks) {
  let alarmAudioInstance = null;
  let currentAlarmPlayPromise = Promise.resolve(); // Added for serializing alarm plays

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

  // Función para reproducir sonidos
  const playSound = (soundFile) => {
    console.log(`[playSound] Attempting to play sound: ${soundFile}`);

    if (soundFile === 'alarm.mp3') {
      // Chain the new alarm play attempt to ensure sequential execution
      currentAlarmPlayPromise = currentAlarmPlayPromise
        .catch(() => {
          // Ignore errors from the previous promise in the chain,
          // allowing the current alarm attempt to proceed.
          console.log('[playSound] Previous alarm promise in chain rejected or completed, proceeding with new alarm.');
        })
        .then(() => {
          // This block executes only after the previous alarm operation in the chain is fully finished.
          if (alarmAudioInstance) {
            // If an alarm instance still exists from a previous operation.
            console.log('[playSound] Cleaning up existing alarm instance before starting new one.');
            alarmAudioInstance.pause();
            alarmAudioInstance.currentTime = 0;
            alarmAudioInstance.loop = false;
            // alarmAudioInstance will be reassigned, no need to nullify explicitly here.
          }

          console.log('[playSound] Creating new alarm instance.');
          // Assign to the shared alarmAudioInstance *inside* this serialized block
          alarmAudioInstance = new Audio('/sounds/alarm.mp3');
          alarmAudioInstance.loop = true;
          alarmAudioInstance.volume = 1.0;

          alarmAudioInstance.addEventListener('loadeddata', () => {
            console.log('[playSound] Alarm audio loaded successfully for current instance');
          });
          alarmAudioInstance.addEventListener('error', (e) => {
            console.error('[playSound] Error loading alarm audio for current instance:', e.target.error ? e.target.error.message : 'Unknown error');
          });

          const playPromise = alarmAudioInstance.play();
          if (playPromise !== undefined) {
            return playPromise
              .then(() => {
                console.log('[playSound] 🔔 ALARM IS NOW PLAYING (Promise resolved for current instance)');
              })
              .catch((error) => {
                console.error('[playSound] Failed to play current alarm instance:', error.name, error.message);
                // Ensure the instance is cleaned up if play fails
                if (alarmAudioInstance) {
                    if (!alarmAudioInstance.paused) {
                        alarmAudioInstance.pause();
                    }
                    alarmAudioInstance.loop = false;
                    // Consider if alarmAudioInstance should be nullified here if play fails catastrophically
                }
                document.title = '⏰ ¡TIEMPO TERMINADO!';
                throw error; // Re-throw to be caught by the caller (e.g., startTimer)
              });
          } else {
            console.error("[playSound] Audio play did not return a promise for current instance.");
            document.title = '⏰ ¡TIEMPO TERMINADO!';
            // Clean up the newly created instance if play didn't return a promise
            if (alarmAudioInstance) {
                alarmAudioInstance.loop = false;
            }
            return Promise.reject(new Error("[playSound] Audio play did not return a promise."));
          }
        });
      return currentAlarmPlayPromise; // Return the promise representing this play attempt in the chain
    } else {
      // Non-alarm sounds
      const audio = new Audio(`/sounds/${soundFile}`);
      audio.volume = 0.6;
      return audio.play().catch((error) => {
        console.error(`[playSound] Error playing sound ${soundFile}:`, error.name, error.message);
        // Original code does not re-throw here for non-alarm sounds.
      });
    }
  };

  const stopCurrentAlarm = () => {
    console.log('[stopCurrentAlarm] Attempting to stop alarm...');
    if (alarmAudioInstance) {
      if (!alarmAudioInstance.paused) {
        console.log('[stopCurrentAlarm] Pausing alarm.');
        alarmAudioInstance.pause();
        alarmAudioInstance.currentTime = 0;
        alarmAudioInstance.loop = false; // Importante para detener la repetición
        console.log('[stopCurrentAlarm] Alarm stopped.');
      } else {
        console.log('[stopCurrentAlarm] Alarm was already paused or not playing.');
        // Asegurar que loop esté en false incluso si ya estaba pausado
        alarmAudioInstance.loop = false;
        // Reset currentTime even if paused, to ensure it starts from beginning if played again
        alarmAudioInstance.currentTime = 0;
      }
      document.title = 'Pomodoro';
    } else {
      console.log('[stopCurrentAlarm] No alarm instance to stop.');
    }
  };

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
    console.log(`[switchMode] Switching to ${newMode}. isRunning: ${isRunning.value}`);
    if (isRunning.value) {
      pauseTimer(); // pauseTimer ya reproduce el sonido de 'stop' y actualiza isRunning
    } else {
      playSound('ui.mp3');
    }
    stopCurrentAlarm(); // Detener alarma si estaba sonando por alguna razón

    if (newMode === 'work') {
      currentTask.value = findPendingTask();
      if (!currentTask.value && tasks.value.length > 0) {
        alert('Todas las tareas están completadas. Considera crear nuevas tareas.');
      }
    }
    setMode(newMode); // Esto actualiza el modo y timeLeft
    // No iniciar el temporizador automáticamente al cambiar manualmente, el usuario debe hacerlo.
  };

  // Iniciar el temporizador
  const startTimer = () => {
    console.log(`[startTimer] Called. Current mode: ${mode.value}, isRunning: ${isRunning.value}, timeLeft: ${timeLeft.value}`);
    if (isRunning.value) {
      console.log('[startTimer] Timer already running. Exiting.');
      return;
    }

    // Asegurar que timeLeft sea positivo antes de iniciar
    if (timeLeft.value <= 0) {
        console.warn(`[startTimer] timeLeft is ${timeLeft.value}. Resetting time for mode ${mode.value} before starting.`);
        // Forzar reseteo de tiempo para el modo actual si es cero o negativo
        if (mode.value === 'work') timeLeft.value = workMinutes.value * 60;
        else if (mode.value === 'shortBreak') timeLeft.value = shortBreakMinutes.value * 60;
        else if (mode.value === 'longBreak') timeLeft.value = longBreakMinutes.value * 60;
        console.log(`[startTimer] timeLeft reset to ${timeLeft.value}`);
    }


    if (mode.value === 'shortBreak' || mode.value === 'longBreak') {
      console.log(`[startTimer] Starting timer for ${mode.value}.`);
      isRunning.value = true;
      playSound('start.mp3'); // Reproducir sonido de inicio para descansos
      timerInterval = setInterval(() => {
        if (timeLeft.value > 0) {
          timeLeft.value--;
        } else {
          console.log(`[startTimer] ${mode.value} timer ended. Clearing interval. isRunning before: ${isRunning.value}`);
          clearInterval(timerInterval);
          isRunning.value = false; // Actualizar estado síncronamente
          console.log(`[startTimer] isRunning after clear: ${isRunning.value}. Triggering alarm.`);

          playSound('alarm.mp3')
            .then(() => {
              console.log(`[startTimer] Alarm play promise resolved for ${mode.value}. Calling handleTimerEnd.`);
              handleTimerEnd();
            })
            .catch(error => {
              console.error(`[startTimer] Alarm failed to play (${mode.value}), but proceeding:`, error.name, error.message);
              handleTimerEnd();
            });
        }
      }, 1000);
      return;
    }

    console.log('[startTimer] Checking conditions for work mode.');
    if (tasks.value.length === 0 && mode.value === 'work') {
      alert('Por favor, crea una tarea primero.');
      console.log('[startTimer] No tasks for work mode. Exiting.');
      return;
    }

    if (mode.value === 'work') {
        const pendingTask = findPendingTask();
        if (!pendingTask) {
          alert('Todas las tareas están completadas. ¡Crea una nueva!');
          console.log('[startTimer] No pending tasks for work mode. Exiting.');
          return;
        }
        currentTask.value = pendingTask;
    }

    console.log(`[startTimer] Starting timer for ${mode.value} mode.`);
    isRunning.value = true;
    if (mode.value === 'work') playSound('start.mp3');

    timerInterval = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--;
      } else {
        console.log(`[startTimer] ${mode.value} timer ended. Clearing interval. isRunning before: ${isRunning.value}`);
        clearInterval(timerInterval);
        isRunning.value = false; // Actualizar estado síncronamente
        console.log(`[startTimer] isRunning after clear: ${isRunning.value}. Triggering alarm.`);

        playSound('alarm.mp3')
          .then(() => {
            console.log(`[startTimer] Alarm play promise resolved for ${mode.value}. Calling handleTimerEnd.`);
            handleTimerEnd();
          })
          .catch(error => {
            console.error(`[startTimer] Alarm failed to play (${mode.value}), pero procediendo:`, error.name, error.message);
            handleTimerEnd();
          });
      }
    }, 1000);
  };

  // Manejar el final del temporizador
  const handleTimerEnd = () => {
    console.log(`[handleTimerEnd] Called. Current mode at start: ${mode.value}, isRunning: ${isRunning.value}`);
    let alertMessage = '';
    let nextMode = '';

    if (mode.value === 'work') {
      completedFocusBlocks.value++;
      if (completedFocusBlocks.value >= focusBlocks.value) {
        alertMessage = `¡Concentración Finalizada! ¿Iniciar Descanso Largo (${longBreakMinutes.value} min)?`;
        nextMode = 'longBreak';
        completedFocusBlocks.value = 0;
      } else {
        alertMessage = `¡Concentración Finalizada! ¿Iniciar Descanso Corto (${shortBreakMinutes.value} min)?`;
        nextMode = 'shortBreak';
      }
    } else if (mode.value === 'shortBreak') {
      alertMessage = `¡Descanso Corto Finalizado! ¿Iniciar Concentración (${workMinutes.value} min)?`;
      nextMode = 'work';
    } else {
      alertMessage = `¡Descanso Largo Finalizado! ¿Iniciar Concentración (${workMinutes.value} min)?`;
      nextMode = 'work';
    }

    console.log(`[handleTimerEnd] Alerting: "${alertMessage}". Next mode will be: ${nextMode}. Alarm should be playing.`);
    alert(alertMessage);

    console.log('[handleTimerEnd] Alert dismissed by user.');
    stopCurrentAlarm();

    console.log(`[handleTimerEnd] Setting mode to: ${nextMode}`);
    setMode(nextMode);

    console.log(`[handleTimerEnd] Calling startTimer for new mode ${mode.value} (which should be ${nextMode}).`);
    startTimer();
    console.log('[handleTimerEnd] Finished.');
  };

  // Pausar el temporizador
  const pauseTimer = () => {
    console.log(`[pauseTimer] Called. isRunning: ${isRunning.value}`);
    if (isRunning.value) {
        clearInterval(timerInterval);
        isRunning.value = false;
        playSound('stop.mp3');
        console.log('[pauseTimer] Timer paused.');
    } else {
        console.log('[pauseTimer] Timer was not running.');
    }
  };

  // Reiniciar el temporizador
  const resetTimer = () => {
    console.log(`[resetTimer] Called. Current mode: ${mode.value}, isRunning: ${isRunning.value}`);
    if (isRunning.value) {
        clearInterval(timerInterval);
        isRunning.value = false;
    }
    stopCurrentAlarm();
    setMode(mode.value); // Restablece timeLeft para el modo actual
    playSound('ui.mp3');
    console.log('[resetTimer] Timer reset.');
  };

  // Cambiar entre modos
  const setMode = (newMode) => {
    console.log(`[setMode] Changing mode from ${mode.value} to ${newMode}`);
    mode.value = newMode;
    if (newMode === 'work') {
      timeLeft.value = workMinutes.value * 60;
    } else if (newMode === 'shortBreak') {
      timeLeft.value = shortBreakMinutes.value * 60;
    } else if (newMode === 'longBreak') {
      timeLeft.value = longBreakMinutes.value * 60;
    }
    console.log(`[setMode] Mode changed. New timeLeft: ${timeLeft.value}, New mode: ${mode.value}`);
  }

  // Aplicar configuraciones
  const applySettings = () => {
    resetTimer() // resetTimer ya llama a stopCurrentAlarm y playSound('ui.mp3')
  }

  // Observar cambios en las tareas
  watch(
    tasks,
    (newTasks, oldTasks) => {
      console.log('[watch tasks] Tasks changed.');
      if (mode.value === 'work' && isRunning.value) {
        const newCurrentTask = findPendingTask();
        if (!newCurrentTask && currentTask.value) { // Estaba en una tarea y ya no hay pendientes
          alert('La tarea actual fue completada o eliminada y no hay más tareas pendientes. El temporizador de trabajo se pausará.');
          console.log('[watch tasks] No pending tasks while work timer was running. Pausing.');
          stopCurrentAlarm();
          pauseTimer();
        }
        currentTask.value = newCurrentTask;
      } else if (mode.value === 'work' && !isRunning.value) {
        // Si no está corriendo, simplemente actualiza la tarea actual para la UI si es necesario
        currentTask.value = findPendingTask();
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
