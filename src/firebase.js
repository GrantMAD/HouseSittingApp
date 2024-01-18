import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAocJShPY2sQCXd0xURJcvZpOYcgNvsXXE",
  authDomain: "housesittingapp.firebaseapp.com",
  projectId: "housesittingapp",
  storageBucket: "housesittingapp.appspot.com",
  messagingSenderId: "42560782154",
  appId: "1:42560782154:web:a72bb8bbaa41a21e6a8bb3"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth, storage };