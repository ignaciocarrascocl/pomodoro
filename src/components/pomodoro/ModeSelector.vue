<template>
  <div class="mode-selector mt-4">
    <button
      class="mode-btn"
      :class="{ active: currentMode === 'work' }"
      @click="onSwitchMode('work')"
    >
      <i class="bi bi-briefcase"></i>
      <span>Concentración</span>
    </button>
    <button
      class="mode-btn"
      :class="{ active: currentMode === 'shortBreak' }"
      @click="onSwitchMode('shortBreak')"
    >
      <i class="bi bi-cup"></i>
      <span>Descanso corto</span>
    </button>
    <button
      class="mode-btn"
      :class="{ active: currentMode === 'longBreak' }"
      @click="onSwitchMode('longBreak')"
    >
      <i class="bi bi-cup-hot"></i>
      <span>Descanso largo</span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  currentMode: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['switch-mode'])

const onSwitchMode = (mode) => emit('switch-mode', mode)
</script>

<style scoped>
.mode-selector {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 1.5rem 0;
  flex-wrap: wrap;
}

.mode-btn {
  background: transparent;
  border: none;
  padding: 10px 15px;
  border-radius: 10px;
  color: var(--color-text-muted);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.mode-btn i {
  font-size: 1.5rem;
  margin-bottom: 5px;
}

.mode-btn:hover {
  background-color: rgba(65, 90, 119, 0.2);
  color: var(--color-text);
}

.mode-btn.active {
  background-color: rgba(65, 90, 119, 0.3);
  color: var(--color-primary);
  font-weight: 600;
}

@media (max-width: 576px) {
  .mode-selector {
    flex-direction: column;
    align-items: center;
  }

  .mode-btn {
    width: 100%;
    flex-direction: row;
    justify-content: center;
  }

  .mode-btn i {
    margin-right: 10px;
    margin-bottom: 0;
  }
}
</style>
