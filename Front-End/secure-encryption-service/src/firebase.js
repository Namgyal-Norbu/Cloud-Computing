// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMdnZKz3Sgpdk0K_7GUtPU3oeLPfoNQzI",
  authDomain: "crypto-cloud-eab94.firebaseapp.com",
  projectId: "crypto-cloud-eab94",
  storageBucket: "crypto-cloud-eab94.firebasestorage.app",
  messagingSenderId: "130536241882",
  appId: "1:130536241882:web:ff0d25eac107d2f26a03e3",
  measurementId: "G-RWB92P7KQX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app); // Initialize Firestore

export { db }; // Export Firestore instance for use in other parts of your app
