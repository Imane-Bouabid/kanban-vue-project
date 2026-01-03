import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/authStore'

// ⚡ Tailwind import
import './assets/tailwind.css'


const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.mount('#app')

// ⚡ fetchUser pour garder session
const authStore = useAuthStore()
authStore.fetchUser().then(() => console.log('Utilisateur chargé :', authStore.user))
