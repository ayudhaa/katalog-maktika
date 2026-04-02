import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCHONKYvShnF2Lt9k09ohV0Too17lGN8co",
  authDomain: "katalog-maktika-ec9f7.firebaseapp.com",
  databaseURL: "https://katalog-maktika-ec9f7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "katalog-maktika-ec9f7",
  storageBucket: "katalog-maktika-ec9f7.firebasestorage.app",
  messagingSenderId: "1059196317716",
  appId: "1:1059196317716:web:a71424e58b6cbb56bc7701"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };