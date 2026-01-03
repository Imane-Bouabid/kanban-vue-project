<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div class="bg-white rounded p-6 w-96">
      <h2 class="text-xl font-bold mb-4">{{ editProject ? 'Éditer Projet' : 'Nouveau Projet' }}</h2>
      <input v-model="name" type="text" placeholder="Nom du projet" class="border p-2 w-full mb-2 rounded" />
      <input v-model="description" type="text" placeholder="Description" class="border p-2 w-full mb-2 rounded" />
      <input v-model="color" type="color" class="border p-1 w-full mb-4 rounded" />
      <div class="flex justify-end">
        <button @click="closeModal" class="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Annuler</button>
        <button @click="saveProject" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          {{ editProject ? 'Modifier' : 'Créer' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useProjectStore } from '../stores/projectStore'

const props = defineProps({
  show: Boolean,
  editProject: Object
})

const emit = defineEmits(['close'])

const name = ref('')
const description = ref('')
const color = ref('#3b82f6') // bleu par défaut

const projectStore = useProjectStore()

watch(() => props.editProject, (val) => {
  if(val) {
    name.value = val.name
    description.value = val.description
    color.value = val.color
  } else {
    name.value = ''
    description.value = ''
    color.value = '#3b82f6'
  }
})

const closeModal = () => emit('close')

const saveProject = async () => {
  if(props.editProject) {
    await projectStore.updateProject(props.editProject.id, {
      name: name.value,
      description: description.value,
      color: color.value
    })
  } else {
    await projectStore.addProject({
      name: name.value,
      description: description.value,
      color: color.value
    })
  }
  closeModal()
}
</script>
