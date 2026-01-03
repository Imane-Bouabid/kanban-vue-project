<template>
  <nav class="bg-blue-600 text-white p-4 flex justify-between items-center">
    <h1 class="font-bold text-lg cursor-pointer" @click="$router.push('/')">Kanban Vue</h1>

    <div v-if="authStore.user" class="flex items-center gap-4">
      <span>Bonjour, {{ authStore.user.email }}</span>
      <button @click="logout" class="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100">
        Déconnexion
      </button>
    </div>

    <div v-else>
      <router-link to="/auth" class="hover:underline">Connexion / Inscription</router-link>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = async () => {
  await authStore.logout()
  router.push('/')
}
</script>
