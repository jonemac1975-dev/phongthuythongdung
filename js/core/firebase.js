// js/core/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyABykQguvm_NQ6SEtZ8GubjSXMnRHpqK4o",
  authDomain: "phongthuy-5966c.firebaseapp.com",
  databaseURL: "https://phongthuy-5966c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "phongthuy-5966c",
  storageBucket: "phongthuy-5966c.firebasestorage.app",
  messagingSenderId: "300833259394",
  appId: "1:300833259394:web:3347646acc7bad2564d99b"
};

export const app = initializeApp(firebaseConfig);
export const db  = getDatabase(app);

// helper load node
export async function loadNode(path) {
  const snap = await get(ref(db, path));
  return snap.exists() ? snap.val() : null;
}
