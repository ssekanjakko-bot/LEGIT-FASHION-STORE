// partner.js - FIXED FOR ALL USERS
import { db, storage } from './firebase.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { doc, setDoc, getDoc, collection, addDoc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-storage.js";

const auth = getAuth();
let currentUser = null;
let currentRestId = null;

console.log("partner.js loaded - GoBite UG");

// AUTH STATE LISTENER - WORKS FOR EVERYONE
onAuthStateChanged(auth, async (user) => {
  console.log("Auth state:", user? user.email : "logged out");
  const authDiv = document.getElementById('authDiv');
  const profileDiv = document.getElementById('profileDiv');
  const pendingDiv = document.getElementById('pendingDiv');
  const menuDiv = document.getElementById('menuDiv');
  const logoutBtn = document.getElementById('logoutBtn');

  if (user) {
    currentUser = user;
    if(authDiv) authDiv.classList.add('hidden');
    if(logoutBtn) logoutBtn.classList.remove('hidden');
    const emailEl = document.getElementById('userEmail');
    if(emailEl) emailEl.innerText = user.email;
    const titleEl = document.getElementById('headerTitle');
    if(titleEl) titleEl.innerText = 'Dashboard';

    checkProfile(user.uid);
  } else {
    if(authDiv) authDiv.classList.remove('hidden');
    if(profileDiv) profileDiv.classList.add('hidden');
    if(pendingDiv) pendingDiv.classList.add('hidden');
    if(menuDiv) menuDiv.classList.add('hidden');
    if(logoutBtn) logoutBtn.classList.add('hidden');
  }
});

async function checkProfile(uid) {
  try {
    const snap = await getDoc(doc(db, 'restaurants', uid));
    const profileDiv = document.getElementById('profileDiv');
    const pendingDiv = document.getElementById('pendingDiv');
    const menuDiv = document.getElementById('menuDiv');

    if (!snap.exists()) {
      if(profileDiv) profileDiv.classList.remove('hidden');
      return;
    }
    const data = snap.data();
    currentRestId = uid;
    if (data.status === 'pending' || data.status === 'rejected') {
      if(pendingDiv) pendingDiv.classList.remove('hidden');
      const pName = document.getElementById('pendingName');
      const pStatus = document.getElementById('pendingStatus');
      if(pName) pName.innerText = data.name;
      if(pStatus) pStatus.innerText = data.status;
    } else if (data.status === 'approved') {
      if(menuDiv) menuDiv.classList.remove('hidden');
      const aName = document.getElementById('approvedName');
      if(aName) aName.innerText = data.name;
      loadMenu();
    }
  } catch (e) {
    console.error("checkProfile error:", e);
    alert("Firestore error: " + e.message);
  }
}

// GLOBAL FUNCTIONS FOR BUTTONS
window.signup = async () => {
  const email = document.getElementById('email')?.value.trim();
  const pass = document.getElementById('password')?.value.trim();
  const msg = document.getElementById('authMsg');
  if(msg){ msg.style.display='block'; msg.innerText='Creating account...'; }

  if (!email ||!pass) return alert('Enter email & password');
  if (pass.length < 6) return alert('Password must be 6+ chars');

  try {
    await createUserWithEmailAndPassword(auth, email, pass);
    if(msg) msg.innerText = 'Account created!';
  } catch (err) {
    console.error(err);
    const errorText = err.code + " : " + err.message;
    if(msg){ msg.innerText = "❌ " + errorText; }
    alert("SIGNUP FAILED: " + errorText + "\n\nIf it says 'unauthorized-domain', you MUST add your Vercel domain in Firebase > Auth > Authorized domains");
  }
};

window.login = async () => {
  const email = document.getElementById('email')?.value.trim();
  const pass = document.getElementById('password')?.value.trim();
  const msg = document.getElementById('authMsg');
  if(msg){ msg.style.display='block'; msg.innerText='Logging in...'; }

  try {
    await signInWithEmailAndPassword(auth, email, pass);
    if(msg) msg.innerText = 'Logged in!';
  } catch (err) {
    console.error(err);
    if(msg) msg.innerText = "❌ " + err.code + " : " + err.message;
    alert("LOGIN FAILED: " + err.message);
  }
};

window.logout = async () => { await signOut(auth); location.reload(); };

window.useMyLocation = () => {
  if (!navigator.geolocation) return alert('GPS not supported');
  navigator.geolocation.getCurrentPosition(pos => {
    const latEl = document.getElementById('rLat');
    const lngEl = document.getElementById('rLng');
    if(latEl) latEl.value = pos.coords.latitude;
    if(lngEl) lngEl.value = pos.coords.longitude;
    alert('Location saved: ' + pos.coords.latitude.toFixed(5));
  }, () => alert('Enable GPS and allow location'));
};

window.createRestaurant = async () => {
  try {
    const name = document.getElementById('rName')?.value.trim();
    const phone = document.getElementById('rPhone')?.value.trim();
    const lat = document.getElementById('rLat')?.value.trim();
    const lng = document.getElementById('rLng')?.value.trim();
    const cuisine = document.getElementById('rCuisine')?.value || '';
    const address = document.getElementById('rAddress')?.value || '';

    if (!name ||!phone) return alert('Name & Phone required');
    if (!lat ||!lng) return alert('Click Use My Current Location');

    const pMsg = document.getElementById('profileMsg');
    if(pMsg) pMsg.innerText = 'Uploading...';

    let logoUrl = '', coverUrl = '';
    const logoFile = document.getElementById('rLogo')?.files[0];
    if (logoFile) { const r = ref(storage, `restaurants/${currentUser.uid}/logo.jpg`); await uploadBytes(r, logoFile); logoUrl = await getDownloadURL(r); }
    const coverFile = document.getElementById('rCover')?.files[0];
    if (coverFile) { const r = ref(storage, `restaurants/${currentUser.uid}/cover.jpg`); await uploadBytes(r, coverFile); coverUrl = await getDownloadURL(r); }

    await setDoc(doc(db, 'restaurants', currentUser.uid), {
      name, cuisine, phone, address,
      lat: Number(lat), lng: Number(lng),
      logoUrl, coverUrl,
      ownerId: currentUser.uid, ownerEmail: currentUser.email,
      status: 'pending', createdAt: new Date()
    });
    alert('Submitted! Waiting for admin approval in admin774.html');
    location.reload();
  } catch (e) { alert("Create failed: " + e.message); }
};

window.uploadItem = async () => {
  const name = document.getElementById('itemName')?.value.trim();
  const price = document.getElementById('itemPrice')?.value.trim();
  if (!name ||!price) return alert('Enter name & price');
  try {
    let imageUrl = '';
    const file = document.getElementById('itemImage')?.files[0];
    if (file) { const r = ref(storage, `restaurants/${currentUser.uid}/menu/${Date.now()}.jpg`); await uploadBytes(r, file); imageUrl = await getDownloadURL(r); }
    await addDoc(collection(db, 'restaurants', currentRestId, 'menu'), { name, price: Number(price), imageUrl, createdAt: new Date() });
    alert('Product added'); loadMenu();
  } catch (e) { alert(e.message); }
};

async function loadMenu() {
  const snap = await getDocs(collection(db, 'restaurants', currentRestId, 'menu'));
  const list = document.getElementById('itemList');
  if(!list) return;
  list.innerHTML = '';
  snap.forEach(d => { list.innerHTML += `<div class="card"><b>${d.data().name}</b> - UGX ${d.data().price}</div>`; });
}
window.deleteItem = async (id) => { await deleteDoc(doc(db, 'restaurants', currentRestId, 'menu', id)); loadMenu(); }