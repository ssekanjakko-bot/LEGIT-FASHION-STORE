const PARTNER_KEY = "partner2026"; // Change this
const firebaseConfig = { /* PASTE YOUR CONFIG */ };
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

let currentRestCode = '';
let imageFile = null;
let profileCoverFile = null;
let profileLogoFile = null;

const validRestaurants = { nandos: "Nandos Wandegeya", bubus: "Bubus Restaurant" };

function restLogin() {
  const code = document.getElementById('rest-code').value.toLowerCase().trim();
  const key = document.getElementById('rest-key').value;
  if(key!== PARTNER_KEY) { alert("Wrong Secret Key"); return; }
  if(validRestaurants[code]) {
    currentRestCode = code;
    sessionStorage.setItem('gobite_rest_loggedin', code);
    document.getElementById('rest-login').style.display = 'none';
    document.getElementById('upload-section').style.display = 'block';
    document.getElementById('rest-name-show').innerText = validRestaurants[code];
    loadProfile();
    loadMyMenu();
  } else { alert("Invalid Restaurant Code"); }
}

function restLogout() { sessionStorage.removeItem('gobite_rest_loggedin'); location.reload(); }
function showTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('#tab-profile, #tab-menu').forEach(t=>t.style.display='none');
  document.getElementById('tab-'+tab).style.display='block';
  event.target.classList.add('active');
}

window.onload = function() {
  const loggedIn = sessionStorage.getItem('gobite_rest_loggedin');
  if(loggedIn && validRestaurants[loggedIn]) {
    currentRestCode = loggedIn;
    document.getElementById('rest-login').style.display = 'none';
    document.getElementById('upload-section').style.display = 'block';
    document.getElementById('rest-name-show').innerText = validRestaurants[loggedIn];
    loadProfile(); loadMyMenu();
  }
}

function previewImage(event) { /* same as before for food image */
  imageFile = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function() { document.getElementById('image-preview').src = reader.result; document.getElementById('image-preview').style.display = 'block'; }
  reader.readAsDataURL(imageFile);
}
function previewProfileImage(event, id) {
  const file = event.target.files[0];
  if(id==='cover-preview') profileCoverFile = file;
  if(id==='logo-preview') profileLogoFile = file;
  const reader = new FileReader();
  reader.onload = function() { document.getElementById(id).src = reader.result; document.getElementById(id).style.display = 'block'; }
  reader.readAsDataURL(file);
}

// SAVE PROFILE
async function saveProfile() {
  let coverUrl = '', logoUrl = '';
  if(profileCoverFile) {
    const ref = storage.ref(`restaurants/${currentRestCode}/cover.jpg`);
    coverUrl = await (await ref.put(profileCoverFile)).ref.getDownloadURL();
  }
  if(profileLogoFile) {
    const ref = storage.ref(`restaurants/${currentRestCode}/logo.jpg`);
    logoUrl = await (await ref.put(profileLogoFile)).ref.getDownloadURL();
  }
  await db.collection("restaurants").doc(currentRestCode).set({
    name: document.getElementById('profile-name').value,
    cuisine: document.getElementById('profile-cuisine').value,
    time: document.getElementById('profile-time').value,
    rating: parseFloat(document.getElementById('profile-rating').value),
    coverUrl, logoUrl,
    status: "pending" // Admin approves restaurant too
  }, {merge: true});
  alert("Profile Saved! Waiting for Admin Approval");
}

// LOAD PROFILE
function loadProfile() {
  db.collection("restaurants").doc(currentRestCode).onSnapshot(doc=>{
    if(doc.exists){
      const data = doc.data();
      document.getElementById('profile-name').value = data.name || '';
      document.getElementById('profile-cuisine').value = data.cuisine || '';
      document.getElementById('profile-time').value = data.time || '';
      document.getElementById('profile-rating').value = data.rating || '';
      if(data.coverUrl) { document.getElementById('cover-preview').src = data.coverUrl; document.getElementById('cover-preview').style.display = 'block'; }
      if(data.logoUrl) { document.getElementById('logo-preview').src = data.logoUrl; document.getElementById('logo-preview').style.display = 'block'; }
    }
  });
}

// ADD FOOD - same as last message
async function addFood() { /* paste the addFood function from previous message */ }
function loadMyMenu() { /* paste the loadMyMenu function from previous message */ }