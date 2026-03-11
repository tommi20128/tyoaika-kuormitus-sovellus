//Config.js
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"
import { getAuth,  } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcEAgqH42LpdUb83P5AddTc6aTi17DIBY",
  authDomain: "workbalance-859f1.firebaseapp.com",
  projectId: "workbalance-859f1",
  storageBucket: "workbalance-859f1.firebasestorage.app",
  messagingSenderId: "591603411256",
  appId: "1:591603411256:web:deb4db9d6adc02288db9cd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export {
  app,
  auth,
  db,
  doc,
  getDoc,
  setDoc,
  getAuth,
  collection, 
  addDoc, 
  serverTimestamp
}