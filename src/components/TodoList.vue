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

    <!-- Lista de tareas arrastrables -->
    <draggable
      v-model="localTasks"
      :animation="200"
      item-key="id"
      class="list-group"
      handle=".drag-handle"
      @change="updateTasks"
    >
      <template #item="{ element, index }">
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center flex-grow-1">
            <span class="drag-handle me-2 text-muted" title="Arrastrar para reordenar">
              <i class="bi bi-grip-vertical"></i>
            </span>
            <input
              type="checkbox"
              class="form-check-input me-2"
              :checked="element.completed"
              @change="toggleTask(index)"
            />
            <span :class="{ 'text-decoration-line-through': element.completed }">
              {{ element.text }}
            </span>
          </div>
          <div class="d-flex">
            <button class="btn btn-sm btn-danger" @click="removeTask(index)" title="Eliminar">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </li>
      </template>
    </draggable>

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
import { ref, onMounted, watch, computed } from 'vue'
import draggable from 'vuedraggable'

const props = defineProps({
  tasks: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update:tasks'])
const newTask = ref('')

// Crear una copia local de las tareas con identificadores únicos
const localTasks = computed({
  get: () => {
    return props.tasks.map((task) => {
      if (!task.id) {
        return { ...task, id: Date.now() + Math.random() }
      }
      return task
    })
  },
  set: (value) => {
    emit('update:tasks', value)
  },
})

// Cargar tareas desde localStorage al inicio
onMounted(() => {
  const storedTasks = JSON.parse(localStorage.getItem('tasks')) || []
  if (storedTasks.length > 0 && props.tasks.length === 0) {
    // Añadir IDs si no existen
    const tasksWithIds = storedTasks.map((task) => {
      if (!task.id) {
        return { ...task, id: Date.now() + Math.random() }
      }
      return task
    })
    emit('update:tasks', tasksWithIds)
  }
})

// Actualizar tareas después de arrastrar
const updateTasks = () => {
  // La actualización se realiza automáticamente a través del v-model
}

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
    const updatedTasks = [
      ...props.tasks,
      {
        id: Date.now(),
        text: newTask.value.trim(),
        completed: false,
      },
    ]
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
  color: var(--color-heading);
}

h3 i {
  color: var(--color-primary);
  margin-right: 0.5rem;
}

.input-group .form-control {
  border-color: var(--color-border);
  background-color: var(--color-background-soft);
  color: var(--color-text);
}

.input-group .form-control:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(65, 90, 119, 0.3);
  background-color: var(--color-background-mute);
  color: var(--color-heading);
}

.input-group .form-control::placeholder {
  color: var(--color-text-muted);
  opacity: 0.7;
}

.btn-success {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn-success:hover {
  background-color: #34495a;
  border-color: #34495a;
}

.list-group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-color: var(--color-border);
  background-color: var(--color-background-soft);
  color: var(--color-text);
}

.list-group-item:hover {
  background-color: var(--color-background-mute);
}

.text-decoration-line-through {
  color: var(--color-text-muted);
  opacity: 0.6;
}

.drag-handle {
  cursor: grab;
  color: var(--color-text-muted);
  opacity: 0.7;
}

.drag-handle:active {
  cursor: grabbing;
}

.drag-handle:hover {
  color: var(--color-primary);
  opacity: 1;
}

.btn-danger {
  background-color: var(--oxford-blue);
  border-color: var(--oxford-blue);
  font-size: 0.8rem;
}

.btn-danger:hover {
  background-color: #15202e;
  border-color: #15202e;
}

.text-muted {
  color: var(--color-text-muted) !important;
  opacity: 0.7;
}

.text-muted i {
  color: var(--color-primary);
}

/* Custom checkbox styling for dark theme */
.form-check-input {
  background-color: var(--color-background-mute);
  border-color: var(--color-border);
}

.form-check-input:checked {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.form-check-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 0.25rem rgba(65, 90, 119, 0.25);
}
</style>
