<template>
  <div>
    <div class="timer-status">
      <i :class="modeIcon"></i>
      <span v-if="mode === 'work' && currentTask">
        Concéntrate en: <strong>{{ currentTask.text }}</strong>
      </span>
      <span v-else>{{ currentModeLabel }}</span>
    </div>
    <div class="timer-display">{{ formattedTime }}</div>
  </div>
</template>

<script setup>
defineProps({
  formattedTime: {
    type: String,
    required: true,
  },
  currentModeLabel: {
    type: String,
    required: true,
  },
  modeIcon: {
    type: String,
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
  currentTask: {
    type: Object,
    default: null,
  },
})
</script>

<style scoped>
.timer-status {
  font-size: 1.25rem;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.timer-status i {
  margin-right: 0.5rem;
  color: var(--color-primary);
}

.timer-display {
  font-size: 5rem;
  font-weight: 700;
  color: var(--color-heading);
  font-family: 'Roboto Mono', monospace;
  line-height: 1.2;
  letter-spacing: 3px;
}

@media (max-width: 576px) {
  .timer-display {
    font-size: 3.5rem;
  }
}
</style>
