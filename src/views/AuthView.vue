<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="bg-white p-6 rounded shadow w-96">
      <h2 class="text-xl font-bold mb-4">Connexion / Inscription</h2>

      <input v-model="email" type="email" placeholder="Email" class="border p-2 w-full mb-2 rounded" />
      <input v-model="password" type="password" placeholder="Mot de passe" class="border p-2 w-full mb-2 rounded" />

      <div class="flex justify-between mb-4">
        <button @click="loginUser" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Se connecter
        </button>
        <button @click="registerUser" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          S'inscrire
        </button>
      </div>

      <button @click="loginGoogleUser" class="bg-red-500 text-white px-4 py-2 rounded w-full hover:bg-red-600">
        Google
      </button>

      <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')

const loginUser = async () => {
  try {
    await authStore.login(email.value, password.value)
    await authStore.fetchUser()
    router.push('/dashboard')
  } catch(e) { error.value = e.message }
}

const registerUser = async () => {
  try {
    await authStore.register(email.value, password.value)
    await authStore.fetchUser()
    router.push('/dashboard')
  } catch(e) { error.value = e.message }
}

const loginGoogleUser = async () => {
  try {
    await authStore.loginWithGoogle()
    await authStore.fetchUser()
    router.push('/dashboard')
  } catch(e) { error.value = e.message }
}
</script>
