import { defineStore } from 'pinia';
import { auth, googleProvider } from '../firebase/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null
  }),
  actions: {
    async register(email, password) {
      await createUserWithEmailAndPassword(auth, email, password);
    },
    async login(email, password) {
      await signInWithEmailAndPassword(auth, email, password);
    },
    async loginWithGoogle() {
      await signInWithPopup(auth, googleProvider);
    },
    async logout() {
      await signOut(auth);
      this.user = null;
    },
    fetchUser() {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
          this.user = user ? user : null;
          resolve(user);
        });
      });
    }
  }
});
