import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, addDoc, collection, onSnapshot, query, orderBy, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDBzSAZ3C8p-jVQLmzeUY7cL4Pqtz-6Ygg",
  authDomain: "odweb-fb187.firebaseapp.com",
  projectId: "odweb-fb187",
  storageBucket: "odweb-fb187.appspot.com",
  messagingSenderId: "730113684965",
  appId: "1:730113684965:web:f55b747fa5e01e5918eb0c",
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
export const authService = getAuth(firebase);
export const dbService = getFirestore(firebase);
export const createUser = createUserWithEmailAndPassword;
export const signAccount = signInWithEmailAndPassword;
export { addDoc, collection, onSnapshot, query, orderBy, deleteDoc, doc };