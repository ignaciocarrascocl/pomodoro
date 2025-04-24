<template>
  <div class="todo-list mt-5">
    <h3><i class="bi bi-list-task"></i> Lista de Tareas</h3>
    <div class="input-group my-3">
      <input
        type="text"
        class="form-control"
        placeholder="Agregar nueva tarea..."
        v-model="newTask"
        @keyup.enter="addTask"
      />
      <button class="btn btn-success" @click="addTask">
        <i class="bi bi-plus-circle"></i> Agregar
      </button>
    </div>
    <ul class="list-group">
      <li
        v-for="(task, index) in tasks"
        :key="index"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div>
          <input type="checkbox" class="form-check-input me-2" v-model="task.completed" />
          <span :class="{ 'text-decoration-line-through': task.completed }">
            {{ task.text }}
          </span>
        </div>
        <button class="btn btn-danger btn-sm" @click="removeTask(index)">
          <i class="bi bi-trash"></i>
        </button>
      </li>
    </ul>
    <p v-if="tasks.length === 0" class="text-muted mt-3">
      <i class="bi bi-info-circle"></i> No hay tareas. ¡Agrega una nueva!
    </p>
    <button
      v-if="tasks.some((task) => task.completed)"
      class="btn btn-danger mt-3"
      @click="removeCompletedTasks"
    >
      <i class="bi bi-trash"></i> Eliminar tareas completadas
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// Lista de tareas
const tasks = ref(JSON.parse(localStorage.getItem('tasks')) || [])
const newTask = ref('') // Nueva tarea

// Agregar una nueva tarea
const addTask = () => {
  if (newTask.value.trim() !== '') {
    tasks.value.push({ text: newTask.value.trim(), completed: false })
    newTask.value = ''
    saveTasks()
  }
}

// Eliminar una tarea
const removeTask = (index) => {
  tasks.value.splice(index, 1)
  saveTasks()
}

// Eliminar tareas completadas
const removeCompletedTasks = () => {
  tasks.value = tasks.value.filter((task) => !task.completed)
  saveTasks()
}

// Guardar tareas en Local Storage
const saveTasks = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks.value))
}

// Observar cambios en la lista de tareas y guardar automáticamente
watch(tasks, saveTasks, { deep: true })
</script>

<style scoped>
.todo-list {
  max-width: 600px;
  margin: 0 auto;
  text-align: left;
}

h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.list-group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text-decoration-line-through {
  color: gray;
}
</style>
