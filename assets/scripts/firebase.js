import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
	apiKey: "AIzaSyA_rDZmlS-UTE5Ea2JuVquc7owh1cAi1nQ",
	authDomain: "fitmart-grvx.firebaseapp.com",
	projectId: "fitmart-grvx",
	storageBucket: "fitmart-grvx.firebasestorage.app",
	messagingSenderId: "405165700561",
	appId: "1:405165700561:web:e8fd3516cf0e98f40f9cf0"
};

export const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // export Firestore instance
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export { db, collection, getDocs };
