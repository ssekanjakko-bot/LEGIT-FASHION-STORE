let currentRestId = null;

// SIMPLE LOGIN
function restLogin() {
  const code = document.getElementById('rest-code').value.toLowerCase();
  const key = document.getElementById('rest-key').value;
  if(key === 'partner2026' && code) { // Change key later
    currentRestId = code;
    localStorage.setItem('gobite_rest', code);
    document.getElementById('rest-login').style.display = 'none';
    document.getElementById('upload-section').style.display = 'block';
    loadProfile();
    loadMyMenu();
  } else { alert("Wrong code or key"); }
}

function restLogout() {
  localStorage.removeItem('gobite_rest');
  location.reload();
}

function showTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`[onclick="showTab('${tab}')"]`).classList.add('active');
  document.getElementById('tab-profile').style.display = tab==='profile'? 'block' : 'none';
  document.getElementById('tab-menu').style.display = tab==='menu'? 'block' : 'none';
}

// 1. SAVE PROFILE
function saveProfile() {
  const data = {
    name: document.getElementById('profile-name').value,
    cuisine: document.getElementById('profile-cuisine').value,
    time: document.getElementById('profile-time').value,
    rating: Number(document.getElementById('profile-rating').value),
    lat: Number(document.getElementById('profile-lat').value),
    lng: Number(document.getElementById('profile-lng').value),
    status: 'pending' // Admin must approve
  };

  const coverFile = document.getElementById('profile-cover').files[0];
  const logoFile = document.getElementById('profile-logo').files[0];

  let uploads = [];
  if(coverFile) uploads.push(uploadFile(coverFile, `restaurants/${currentRestId}/cover.jpg`).then(url => data.coverUrl = url));
  if(logoFile) uploads.push(uploadFile(logoFile, `restaurants/${currentRestId}/logo.jpg`).then(url => data.logoUrl = url));

  Promise.all(uploads).then(() => {
    db.collection("restaurants").doc(currentRestId).set(data, {merge: true});
    alert("Profile saved! Waiting for admin approval");
  });
}

// 2. ADD FOOD
function addFood() {
  const data = {
    name: document.getElementById('food-name').value,
    category: document.getElementById('food-category').value,
    price: Number(document.getElementById('food-price').value),
    desc: document.getElementById('food-desc').value,
    status: 'pending' // Admin must approve
  };
  const file = document.getElementById('food-image').files[0];
  if(!file) return alert("Add image");

  uploadFile(file, `restaurants/${currentRestId}/menu/${Date.now()}.jpg`).then(url => {
    data.imageUrl = url;
    db.collection("restaurants").doc(currentRestId).collection("menu").add(data);
    alert("Food added! Waiting for admin approval");
    document.getElementById('food-name').value = '';
    document.getElementById('food-price').value = '';
    document.getElementById('food-desc').value = '';
    document.getElementById('image-preview').style.display = 'none';
  });
}

// 3. LOAD MENU
function loadMyMenu() {
  db.collection("restaurants").doc(currentRestId).collection("menu").onSnapshot(snapshot => {
    let html = '';
    snapshot.forEach(doc => {
      const item = doc.data();
      html += `
        <div class="item-card">
          <img src="${item.imageUrl}">
          <div>
            <h4>${item.name}</h4>
            <p>UGX ${item.price} • ${item.status}</p>
          </div>
        </div>
      `;
    });
    document.getElementById('my-menu').innerHTML = html || "No items yet";
  });
}

// 4. LOAD PROFILE
function loadProfile() {
  db.collection("restaurants").doc(currentRestId).get().then(doc => {
    if(doc.exists) {
      const data = doc.data();
      document.getElementById('rest-name-show').innerText = data.name || currentRestId;
      document.getElementById('profile-name').value = data.name || '';
      document.getElementById('profile-cuisine').value = data.cuisine || '';
      document.getElementById('profile-time').value = data.time || '';
      document.getElementById('profile-rating').value = data.rating || '';
      document.getElementById('profile-lat').value = data.lat || '';
      document.getElementById('profile-lng').value = data.lng || '';
    }
  });
}

// HELPER: UPLOAD TO STORAGE
function uploadFile(file, path) {
  const storageRef = storage.ref(path);
  return storageRef.put(file).then(snapshot => snapshot.ref.getDownloadURL());
}

// HELPER: PREVIEW
function previewImage(event) {
  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById('image-preview').src = reader.result;
    document.getElementById('image-preview').style.display = 'block';
  }
  reader.readAsDataURL(event.target.files[0]);
}
function previewProfileImage(event, id) {
  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById(id).src = reader.result;
    document.getElementById(id).style.display = 'block';
  }
  reader.readAsDataURL(event.target.files[0]);
}

// AUTO LOGIN
window.onload = () => {
  const saved = localStorage.getItem('gobite_rest');
  if(saved) { currentRestId = saved; restLogin(); document.getElementById('rest-code').value = saved; }
}