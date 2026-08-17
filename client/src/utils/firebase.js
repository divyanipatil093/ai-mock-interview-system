
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-c85fc.firebaseapp.com",
  projectId: "interviewiq-c85fc",
  storageBucket: "interviewiq-c85fc.firebasestorage.app",
  messagingSenderId: "105771556750",
  appId: "1:105771556750:web:580714c46ab9684d5b8edf"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export { auth, provider }