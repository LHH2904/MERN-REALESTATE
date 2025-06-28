// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-estate-e1a6f.firebaseapp.com",
    projectId: "mern-estate-e1a6f",
    storageBucket: "mern-estate-e1a6f.firebasestorage.app",
    messagingSenderId: "667413460387",
    appId: "1:667413460387:web:84e7c8cc986aa87d255616"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);