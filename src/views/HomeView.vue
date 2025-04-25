<template>
  <div>
    <PomodoroTimer :tasks="tasks" />
    <TodoList v-model:tasks="tasks" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PomodoroTimer from '../components/PomodoroTimer.vue'
import TodoList from '../components/TodoList.vue'

const tasks = ref([])
</script>

<style scoped>
/* Sin estilos adicionales */
</style>
