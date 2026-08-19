// 1. PASTE YOUR FIREBASE CONFIG HERE
const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "PASTE_YOUR_AUTH_DOMAIN",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_STORAGE_BUCKET",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID"
};

// 2. INITIALIZE FIREBASE
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

let currentRestCode = '';
let imageFile = null;

// 3. RESTAURANT CODES - Add more here
const validRestaurants = {
  nandos: "Nandos Wandegeya",
  bubus: "Bubus Restaurant"
  // add: kfc: "KFC Kampala"
};

function restLogin() {
  const code = document.getElementById('rest-code').value.toLowerCase().trim();
  if(validRestaurants[code]) {
    currentRestCode = code;
    sessionStorage.setItem('gobite_rest_loggedin', code);
    document.getElementById('rest-login').style.display = 'none';
    document.getElementById('upload-section').style.display = 'block';
    document.getElementById('rest-name-show').innerText = validRestaurants[code];
    loadMyMenu();
  } else { 
    alert("Invalid Restaurant Code. Contact Admin"); 
  }
}

function restLogout() {
  sessionStorage.removeItem('gobite_rest_loggedin');
  location.reload();
}

// Auto login if already logged in
window.onload = function() {
  const loggedIn = sessionStorage.getItem('gobite_rest_loggedin');
  if(loggedIn && validRestaurants[loggedIn]) {
    currentRestCode = loggedIn;
    document.getElementById('rest-login').style.display = 'none';
    document.getElementById('upload-section').style.display = 'block';
    document.getElementById('rest-name-show').innerText = validRestaurants[loggedIn];
    loadMyMenu();
  }
}

function previewImage(event) {
  imageFile = event.target.files[0];
  if(!imageFile) return;
  const reader = new FileReader();
  reader.onload = function() {
    document.getElementById('image-preview').src = reader.result;
    document.getElementById('image-preview').style.display = 'block';
  }
  reader.readAsDataURL(imageFile);
}

// 4. UPLOAD FOOD TO FIREBASE
async function addFood() {
  const name = document.getElementById('food-name').value.trim();
  const category = document.getElementById('food-category').value;
  const price = parseInt(document.getElementById('food-price').value);
  const desc = document.getElementById('food-desc').value.trim();

  if(!name ||!price ||!imageFile) { 
    alert("Please fill name, price and upload image"); 
    return; 
  }

  document.querySelector('.btn-primary').innerText = "Uploading...";
  document.querySelector('.btn-primary').disabled = true;

  try {
    // A. Upload image to Firebase Storage
    const fileName = `${Date.now()}_${imageFile.name}`;
    const imageRef = storage.ref(`restaurants/${currentRestCode}/foods/${fileName}`);
    const snapshot = await imageRef.put(imageFile);
    const imageUrl = await snapshot.ref.getDownloadURL();

    // B. Save food data to Firestore. Status = pending until admin approves
    await db.collection("restaurants").doc(currentRestCode).collection("menu").add({
      name, 
      category, 
      price, 
      desc, 
      imageUrl,
      status: "pending", // Admin must approve
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("Food Submitted! Waiting for Admin Approval.");
    
    // Reset form
    document.getElementById('food-name').value = '';
    document.getElementById('food-price').value = '';
    document.getElementById('food-desc').value = '';
    document.getElementById('image-preview').style.display = 'none';
    imageFile = null;

  } catch(error) {
    alert("Error: " + error.message);
  }

  document.querySelector('.btn-primary').innerText = "Save Food Item";
  document.querySelector('.btn-primary').disabled = false;
}

// 5. LOAD MY MENU FROM FIREBASE
function loadMyMenu() {
  db.collection("restaurants").doc(currentRestCode).collection("menu")
.orderBy("createdAt", "desc")
.onSnapshot(snapshot => {
    let html = '';
    snapshot.forEach(doc => {
      const item = doc.data();
      const statusColor = item.status === 'approved'? 'var(--green)' : '#ffeb3b';
      html += `
        <div class="item-card">
          <img src="${item.imageUrl}">
          <div>
            <b>${item.name}</b> <span style="font-size:11px; background:${statusColor}; padding:2px 6px; border-radius:4px;">${item.status}</span><br>
            <small>${item.category} • UGX ${item.price.toLocaleString()}</small>
          </div>
        </div>
      `;
    });
    document.getElementById('my-menu').innerHTML = html || "No items yet";
  });
}