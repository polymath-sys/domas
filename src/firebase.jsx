// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBfXIanu2oVItuXWbNsQrCAO0-DkxBkDq4",
//   authDomain: "society-a4d63.firebaseapp.com",
//   projectId: "society-a4d63",
//   storageBucket: "society-a4d63.appspot.com",
//   messagingSenderId: "236976809121",
//   appId: "1:236976809121:web:fde635e1474370ccb13ce0",
//   measurementId: "G-7XXL3GK48M"
// };
// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9XK5th4jzn3iflboqyAPuLFAf5TQYiCA",
  authDomain: "domas-2bddf.firebaseapp.com",
  projectId: "domas-2bddf",
  storageBucket: "domas-2bddf.firebasestorage.app",
  messagingSenderId: "285585562079",
  appId: "1:285585562079:web:1b98a153519cca3801cc6a"
};

// Initialize Firebase
//const app = initializeApp(firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);        // Firebase Authentication
const db = getFirestore(app);     // Firestore Database

export { auth, db };
