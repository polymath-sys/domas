// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfXIanu2oVItuXWbNsQrCAO0-DkxBkDq4",
  authDomain: "society-a4d63.firebaseapp.com",
  projectId: "society-a4d63",
  storageBucket: "society-a4d63.appspot.com",
  messagingSenderId: "236976809121",
  appId: "1:236976809121:web:fde635e1474370ccb13ce0",
  measurementId: "G-7XXL3GK48M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);        // Firebase Authentication
const db = getFirestore(app);     // Firestore Database

export { auth, db };