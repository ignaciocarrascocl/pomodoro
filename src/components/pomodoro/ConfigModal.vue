vue
<template>
  <div
    class="modal fade"
    id="configModal"
    tabindex="-1"
    aria-labelledby="configModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content custom-modal">
        <div class="modal-header border-0">
          <h5 class="modal-title" id="configModalLabel">
            <i class="bi bi-sliders"></i> Configuración
          </h5>
          <button
            type="button"
            class="btn-close custom-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body pb-0">
          <div class="config-item">
            <label for="workTime" class="config-label">
              <i class="bi bi-briefcase"></i> Tiempo de concentración
            </label>
            <div class="config-control">
              <input
                id="workTime"
                type="number"
                v-model.number="localWorkMinutes"
                class="form-control custom-input"
                min="1"
              />
              <span class="config-unit">minutos</span>
            </div>
          </div>

          <div class="config-item">
            <label for="shortBreak" class="config-label">
              <i class="bi bi-cup"></i> Descanso corto
            </label>
            <div class="config-control">
              <input
                id="shortBreak"
                type="number"
                v-model.number="localShortBreakMinutes"
                class="form-control custom-input"
                min="1"
              />
              <span class="config-unit">minutos</span>
            </div>
          </div>

          <div class="config-item">
            <label for="longBreak" class="config-label">
              <i class="bi bi-cup-hot"></i> Descanso largo
            </label>
            <div class="config-control">
              <input
                id="longBreak"
                type="number"
                v-model.number="localLongBreakMinutes"
                class="form-control custom-input"
                min="1"
              />
              <span class="config-unit">minutos</span>
            </div>
          </div>

          <div class="config-item">
            <label for="focusBlocks" class="config-label">
              <i class="bi bi-collection"></i> Bloques antes del descanso largo
            </label>
            <div class="config-control">
              <input
                id="focusBlocks"
                type="number"
                v-model.number="localFocusBlocks"
                class="form-control custom-input"
                min="1"
              />
              <span class="config-unit">bloques</span>
            </div>
          </div>
        </div>
        <div class="modal-footer border-0 pt-2">
          <button
            type="button"
            class="btn btn-outline-secondary btn-rounded"
            data-bs-dismiss="modal"
          >
            <i class="bi bi-x-circle"></i> Cancelar
          </button>
          <button
            type="button"
            class="btn btn-primary btn-rounded"
            @click="saveConfig"
            data-bs-dismiss="modal"
          >
            <i class="bi bi-check-circle"></i> Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  workMinutes: {
    type: Number,
    required: true,
  },
  shortBreakMinutes: {
    type: Number,
    required: true,
  },
  longBreakMinutes: {
    type: Number,
    required: true,
  },
  focusBlocks: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['save'])

const localWorkMinutes = ref(props.workMinutes)
const localShortBreakMinutes = ref(props.shortBreakMinutes)
const localLongBreakMinutes = ref(props.longBreakMinutes)
const localFocusBlocks = ref(props.focusBlocks)

// Actualizar valores locales cuando cambian las props
watch(
  () => props.workMinutes,
  (val) => {
    localWorkMinutes.value = val
  },
)
watch(
  () => props.shortBreakMinutes,
  (val) => {
    localShortBreakMinutes.value = val
  },
)
watch(
  () => props.longBreakMinutes,
  (val) => {
    localLongBreakMinutes.value = val
  },
)
watch(
  () => props.focusBlocks,
  (val) => {
    localFocusBlocks.value = val
  },
)

const saveConfig = () => {
  emit('save', {
    workMinutes: localWorkMinutes.value,
    shortBreakMinutes: localShortBreakMinutes.value,
    longBreakMinutes: localLongBreakMinutes.value,
    focusBlocks: localFocusBlocks.value,
  })
}
</script>

<style scoped>
/* Estilos del modal personalizado */
.custom-modal {
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.modal-title {
  font-weight: 600;
  color: #333;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
}

.modal-title i {
  margin-right: 10px;
  color: #0d6efd;
}

.custom-close {
  background: transparent;
  opacity: 0.6;
  transition: all 0.3s;
}

.custom-close:hover {
  opacity: 1;
  transform: scale(1.1);
}

/* Elementos de configuración */
.config-item {
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.config-label {
  font-weight: 500;
  color: #555;
  display: flex;
  align-items: center;
  font-size: 1.05rem;
}

.config-label i {
  margin-right: 10px;
  color: #0d6efd;
  font-size: 1.1rem;
}

.config-control {
  display: flex;
  align-items: center;
  width: 140px;
}

.custom-input {
  text-align: center;
  font-weight: 600;
  width: 80px;
  border-radius: 8px;
  border: 1px solid #ddd;
  transition: all 0.3s;
}

.custom-input:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
}

.config-unit {
  color: #777;
  margin-left: 8px;
  width: 60px;
  font-size: 0.9rem;
}

/* Botones del pie del modal */
.btn-rounded {
  border-radius: 50px;
  padding: 8px 20px;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-outline-secondary {
  border-color: #ddd;
}

.btn-outline-secondary:hover {
  background-color: #f5f5f5;
  border-color: #ccc;
}

.btn-primary {
  background-color: #0d6efd;
  box-shadow: 0 4px 10px rgba(13, 110, 253, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(13, 110, 253, 0.4);
}

@media (max-width: 576px) {
  .config-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .config-label {
    margin-bottom: 8px;
  }

  .config-control {
    width: 100%;
  }

  .custom-input {
    width: calc(100% - 70px);
  }
}
</style>
