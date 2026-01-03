import { defineStore } from 'pinia'
import { db } from '../firebase/config'
import { collection, doc, addDoc, deleteDoc, updateDoc, onSnapshot, query, where } from 'firebase/firestore'
import { useAuthStore } from './authStore'

export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: [],
    tasks: []  // toutes les tâches du projet sélectionné
  }),
  actions: {
    fetchProjects() {
      const authStore = useAuthStore()
      if (!authStore.user) return
      const q = query(collection(db, "projects"), where("userId", "==", authStore.user.uid))
      onSnapshot(q, (snapshot) => {
        this.projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      })
    },

    async addProject(data) {
      const authStore = useAuthStore()
      await addDoc(collection(db, "projects"), { ...data, userId: authStore.user.uid })
    },

    async updateProject(projectId, data) {
      const projectRef = doc(db, "projects", projectId)
      await updateDoc(projectRef, data)
    },

    async deleteProject(projectId) {
      await deleteDoc(doc(db, "projects", projectId))
      // Supprime aussi les tâches du store
      this.tasks = []
    },

    fetchTasks(projectId) {
      const tasksRef = collection(db, "projects", projectId, "tasks")
      onSnapshot(tasksRef, (snapshot) => {
        // ⚡ Important : on reset d’abord pour éviter doublons
        this.tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      })
    },

    async addTask(projectId, task) {
      await addDoc(collection(db, "projects", projectId, "tasks"), task)
      // Pas besoin de push dans tasks ici : onSnapshot va mettre à jour automatiquement
    },

    async updateTask(projectId, taskId, task) {
      await updateDoc(doc(db, "projects", projectId, "tasks", taskId), task)
    },

    async deleteTask(projectId, taskId) {
      await deleteDoc(doc(db, "projects", projectId, "tasks", taskId))
    }
  }
})
