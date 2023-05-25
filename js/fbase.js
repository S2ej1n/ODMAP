import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
export const dbService = getFirestore();
