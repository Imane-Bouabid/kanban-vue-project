// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC82O7pp5kgDOFoddFutR1ABokUdKMxqFY",
  authDomain: "kanban-vue-project.firebaseapp.com",
  projectId: "kanban-vue-project",
  storageBucket: "kanban-vue-project.appspot.com",
  messagingSenderId: "913190322190",
  appId: "1:913190322190:web:c5628c2161232e2797fc5f"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);

// Auth + Google Auth Provider
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider(); // ✅ ajouté

// Firestore
const db = getFirestore(app);

// Export correct
export { auth, googleProvider, db }; // ✅ googleProvider exporté
