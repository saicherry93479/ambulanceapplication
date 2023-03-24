// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCPCp1abDWUWSL_NbifgRT9AAZsqZwnP6c",
  authDomain: "ambulance-e0f0c.firebaseapp.com",
  projectId: "ambulance-e0f0c",
  storageBucket: "ambulance-e0f0c.appspot.com",
  messagingSenderId: "307723327636",
  appId: "1:307723327636:web:2f312b40664c011e143c81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)
export  const db = getFirestore(app);