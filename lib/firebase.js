// GoBite Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyD03wRNk-iF3_0esTdYPEn4zzCGyjyYK88",
  authDomain: "gobite-ug.firebaseapp.com",
  projectId: "gobite-ug",
  storageBucket: "gobite-ug.firebasestorage.app", // note: this is the new format
  messagingSenderId: "479330891516",
  appId: "1:479330891516:web:dff4620fc3344a45b3c979",
  measurementId: "G-90RHYD791R"
};

// Initialize Firebase using COMPAT
firebase.initializeApp(firebaseConfig);

// Make these available globally
const db = firebase.firestore();
const storage = firebase.storage();
const analytics = firebase.analytics();