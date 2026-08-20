import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyD03wRNk-iF3_0esTdYPEn4zzCGyjyYK88",
  authDomain: "gobite-ug.firebaseapp.com",
  projectId: "gobite-ug",
  storageBucket: "gobite-ug.firebasestorage.app",
  messagingSenderId: "479330891516",
  appId: "1:479330891516:web:dff4620fc3344a45b3c979",
  measurementId: "G-90RHYD791R"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
try { getAnalytics(app); } catch(e){}