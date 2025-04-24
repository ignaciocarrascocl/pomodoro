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
        <div class="d-flex align-items-center flex-grow-1">
          <input
            type="checkbox"
            class="form-check-input me-2"
            :checked="task.completed"
            @change="toggleTask(index)"
          />
          <span :class="{ 'text-decoration-line-through': task.completed }">
            {{ task.text }}
          </span>
        </div>
        <div class="d-flex">
          <button
            class="btn btn-sm btn-outline-secondary me-1"
            @click="moveTaskUp(index)"
            :disabled="index === 0"
            title="Mover arriba"
          >
            <i class="bi bi-arrow-up"></i>
          </button>
          <button
            class="btn btn-sm btn-outline-secondary me-1"
            @click="moveTaskDown(index)"
            :disabled="index === tasks.length - 1"
            title="Mover abajo"
          >
            <i class="bi bi-arrow-down"></i>
          </button>
          <button class="btn btn-sm btn-danger" @click="removeTask(index)" title="Eliminar">
            <i class="bi bi-trash"></i>
          </button>
        </div>
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
import { ref, onMounted, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  tasks: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update:tasks'])
const newTask = ref('')

// Cargar tareas desde localStorage al inicio
onMounted(() => {
  const storedTasks = JSON.parse(localStorage.getItem('tasks')) || []
  if (storedTasks.length > 0 && props.tasks.length === 0) {
    emit('update:tasks', storedTasks)
  }
})

// Guardar tareas en localStorage cuando cambien
watch(
  () => props.tasks,
  (newTasks) => {
    localStorage.setItem('tasks', JSON.stringify(newTasks))
  },
  { deep: true },
)

// Agregar una nueva tarea
const addTask = () => {
  if (newTask.value.trim() !== '') {
    const updatedTasks = [...props.tasks, { text: newTask.value.trim(), completed: false }]
    emit('update:tasks', updatedTasks)
    newTask.value = ''
  }
}

// Marcar tarea como completada/no completada
const toggleTask = (index) => {
  const updatedTasks = [...props.tasks]
  updatedTasks[index].completed = !updatedTasks[index].completed
  emit('update:tasks', updatedTasks)
}

// Eliminar una tarea
const removeTask = (index) => {
  const updatedTasks = props.tasks.filter((_, i) => i !== index)
  emit('update:tasks', updatedTasks)
}

// Eliminar tareas completadas
const removeCompletedTasks = () => {
  const updatedTasks = props.tasks.filter((task) => !task.completed)
  emit('update:tasks', updatedTasks)
}

// Mover tarea hacia arriba
const moveTaskUp = (index) => {
  if (index === 0) return // Ya está en la parte superior
  const updatedTasks = [...props.tasks]
  const temp = updatedTasks[index]
  updatedTasks[index] = updatedTasks[index - 1]
  updatedTasks[index - 1] = temp
  emit('update:tasks', updatedTasks)
}

// Mover tarea hacia abajo
const moveTaskDown = (index) => {
  if (index === props.tasks.length - 1) return // Ya está en la parte inferior
  const updatedTasks = [...props.tasks]
  const temp = updatedTasks[index]
  updatedTasks[index] = updatedTasks[index + 1]
  updatedTasks[index + 1] = temp
  emit('update:tasks', updatedTasks)
}
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
