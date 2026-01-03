<template>
  <div class="p-6">
    <!-- Header projet -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold" :style="{ color: project?.color || '#000' }">
        {{ project?.name || 'Projet' }}
      </h2>
      <div class="flex gap-2">
        <button @click="openEditModal = true"
                class="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500">
          Modifier
        </button>
        <button @click="openDeleteModal = true"
                class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Supprimer
        </button>
      </div>
    </div>

    <!-- Ajouter tâche -->
    <div class="bg-gray-100 p-4 rounded mb-6">
      <h3 class="font-bold mb-2">Ajouter une tâche</h3>
      <input v-model="newTask.title" type="text" placeholder="Titre" class="border p-2 w-full mb-2 rounded" />
      <textarea v-model="newTask.description" placeholder="Description" class="border p-2 w-full mb-2 rounded"></textarea>
      <input v-model="newTask.dueDate" type="date" class="border p-2 mb-2 rounded" />
      <select v-model="newTask.status" class="border p-2 mb-2 rounded w-full">
        <option value="todo">À faire</option>
        <option value="doing">En cours</option>
        <option value="done">Terminé</option>
      </select>
      <button @click="addTask" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Ajouter
      </button>
    </div>

    <!-- Kanban -->
    <div class="flex gap-4">
      <div class="flex-1 bg-gray-100 p-2 rounded">
        <h3 class="font-bold mb-2">À faire</h3>
        <draggable v-model="todoTasks" group="tasks" item-key="id">
          <template #item="{ element }">
            <TaskCard :task="element" @deleteTask="deleteTask(element.id)" />
          </template>
        </draggable>
      </div>

      <div class="flex-1 bg-gray-100 p-2 rounded">
        <h3 class="font-bold mb-2">En cours</h3>
        <draggable v-model="doingTasks" group="tasks" item-key="id">
          <template #item="{ element }">
            <TaskCard :task="element" @deleteTask="deleteTask(element.id)" />
          </template>
        </draggable>
      </div>

      <div class="flex-1 bg-gray-100 p-2 rounded">
        <h3 class="font-bold mb-2">Terminé</h3>
        <draggable v-model="doneTasks" group="tasks" item-key="id">
          <template #item="{ element }">
            <TaskCard :task="element" @deleteTask="deleteTask(element.id)" />
          </template>
        </draggable>
      </div>
    </div>

    <!-- Modale modifier projet -->
    <div v-if="openEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded shadow w-96">
        <h3 class="text-xl font-bold mb-4">Modifier Projet</h3>
        <input v-model="editProjectName" type="text" class="border p-2 w-full mb-2 rounded" placeholder="Nom projet" />
        <input v-model="editProjectColor" type="color" class="border p-2 w-full mb-2 rounded" />
        <div class="flex justify-end gap-2 mt-4">
          <button @click="updateProject" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Enregistrer</button>
          <button @click="openEditModal=false" class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Annuler</button>
        </div>
      </div>
    </div>

    <!-- Modale supprimer projet -->
    <div v-if="openDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded shadow w-96">
        <h3 class="text-xl font-bold mb-4">Supprimer Projet ?</h3>
        <p class="mb-4">Cette action est irréversible !</p>
        <div class="flex justify-end gap-2">
          <button @click="confirmDeleteProject" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Supprimer</button>
          <button @click="openDeleteModal=false" class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Annuler</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '../stores/projectStore'
import TaskCard from '../components/TaskCard.vue'

import draggable from 'vuedraggable'

const route = useRoute()
const router = useRouter()
const projectId = route.params.id

const projectStore = useProjectStore()
const project = ref(null)

// Nouvelle tâche
const newTask = ref({ title: '', description: '', dueDate: '', status: 'todo' })

// Modales
const openEditModal = ref(false)
const openDeleteModal = ref(false)
const editProjectName = ref('')
const editProjectColor = ref('#000000')

// ⚡ Charger projets et tâches correctement
onMounted(async () => {
  await projectStore.fetchProjects()   // ⚡ charger projets
  updateProjectInfo()
  if (project.value && project.value.id) {
    projectStore.fetchTasks(project.value.id)  // ⚡ charger tâches
  }
})

// Mettre à jour le projet si le store change
watch(() => projectStore.projects, () => {
  updateProjectInfo()
  if (project.value && project.value.id) {
    projectStore.fetchTasks(project.value.id)
  }
})

// ⚡ Fonctions
function updateProjectInfo() {
  const found = projectStore.projects.find(p => p.id === projectId)
  project.value = found || { name: '', color: '#000' }
  editProjectName.value = project.value.name
  editProjectColor.value = project.value.color
}

// Colonnes Kanban
const todoTasks = computed({
  get: () => projectStore.tasks?.filter(t => t.status === 'todo') || [],
  set: val => val.forEach(t => projectStore.updateTask(projectId, t.id, { status: 'todo' }))
})
const doingTasks = computed({
  get: () => projectStore.tasks?.filter(t => t.status === 'doing') || [],
  set: val => val.forEach(t => projectStore.updateTask(projectId, t.id, { status: 'doing' }))
})
const doneTasks = computed({
  get: () => projectStore.tasks?.filter(t => t.status === 'done') || [],
  set: val => val.forEach(t => projectStore.updateTask(projectId, t.id, { status: 'done' }))
})

// Ajouter tâche 🔹 FIX
const addTask = async () => {
  if (!newTask.value.title.trim()) return
  if (!project.value?.id) return

  await projectStore.addTask(project.value.id, { 
    title: newTask.value.title,
    description: newTask.value.description || '',
    dueDate: newTask.value.dueDate || '',
    status: newTask.value.status || 'todo'
  })

  // Reset formulaire
  newTask.value = { title: '', description: '', dueDate: '', status: 'todo' }
}

// Supprimer tâche
const deleteTask = taskId => {
  projectStore.deleteTask(projectId, taskId)
}

// Modifier projet
const updateProject = () => {
  projectStore.updateProject(projectId, { name: editProjectName.value, color: editProjectColor.value })
  project.value.name = editProjectName.value
  project.value.color = editProjectColor.value
  openEditModal.value = false
}

// Supprimer projet
const confirmDeleteProject = () => {
  projectStore.deleteProject(projectId)
  router.push('/dashboard')
}
</script>
