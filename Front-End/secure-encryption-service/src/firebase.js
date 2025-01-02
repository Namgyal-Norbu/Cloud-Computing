// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCX-ks8zzZ6XqNtXwyfv5wZt7jFlDTbP-o",
  authDomain: "awesome-flash-444017-g4.firebaseapp.com",
  projectId: "awesome-flash-444017-g4",
  storageBucket: "awesome-flash-444017-g4.firebasestorage.app",
  messagingSenderId: "137566307653",
  appId: "1:137566307653:web:243fc2641833c59713aa2c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const db = getFirestore(app); // Initialize Firestore

export { db }; // Export Firestore instance for use in other parts of your app
