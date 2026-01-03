<template>
  <div class="min-h-screen bg-gray-50">
    <AppNavbar />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-bold text-gray-800">Mes projets</h2>
        <button
          @click="openModal = true"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow"
        >
          + Nouveau Projet
        </button>
      </div>

      <div v-if="projectStore.projects.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="project in projectStore.projects"
          :key="project.id"
          class="p-4 rounded shadow cursor-pointer transform hover:scale-105 transition"
          :style="{ backgroundColor: project.color || '#3b82f6', color: 'white' }"
          @click="$router.push(`/project/${project.id}`)"
        >
          <h3 class="text-xl font-bold mb-2">{{ project.name }}</h3>
          <p class="text-sm mb-2">{{ project.description }}</p>
        </div>
      </div>

      <p v-else class="text-gray-500">Vous n'avez pas encore de projet.</p>
    </div>

    <!-- Modal création / édition projet -->
    <div v-if="openModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded shadow w-96">
        <h3 class="text-lg font-bold mb-4">{{ editingProject ? 'Modifier Projet' : 'Nouveau Projet' }}</h3>

        <input v-model="name" type="text" placeholder="Nom du projet" class="w-full mb-2 p-2 border rounded">
        <input v-model="description" type="text" placeholder="Description" class="w-full mb-2 p-2 border rounded">
        <input v-model="color" type="color" class="mb-4 w-full h-10">

        <div class="flex justify-end gap-2">
          <button @click="closeModal" class="px-4 py-2 rounded border">Annuler</button>
          <button @click="saveProject" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            {{ editingProject ? 'Modifier' : 'Créer' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppNavbar from '../components/AppNavbar.vue'
import { useProjectStore } from '../stores/projectStore'
import { useAuthStore } from '../stores/authStore'

const projectStore = useProjectStore()
const authStore = useAuthStore()

const openModal = ref(false)
const editingProject = ref(null)
const name = ref('')
const description = ref('')
const color = ref('#3b82f6')

// Charger projets
onMounted(() => {
  if(authStore.user) projectStore.fetchProjects()
})

// Modal fonctions
const editProject = (project) => {
  editingProject.value = project
  name.value = project.name
  description.value = project.description
  color.value = project.color || '#3b82f6'
  openModal.value = true
}

const closeModal = () => {
  editingProject.value = null
  name.value = ''
  description.value = ''
  color.value = '#3b82f6'
  openModal.value = false
}

const saveProject = async () => {
  if(!name.value) return alert('Nom requis')
  const data = { name: name.value, description: description.value, color: color.value }
  if(editingProject.value) await projectStore.updateProject(editingProject.value.id, data)
  else await projectStore.addProject(data)
  closeModal()
}
</script>
