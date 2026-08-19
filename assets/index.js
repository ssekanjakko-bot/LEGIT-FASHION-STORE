const restaurantList = document.getElementById('restaurant-list');
const searchInput = document.getElementById('search-input');
let allRestaurants = [];
let userLat = null, userLng = null;

// LOAD APPROVED RESTAURANTS FROM FIREBASE
db.collection("restaurants").where("status", "==", "approved").onSnapshot(snapshot => {
  allRestaurants = [];
  snapshot.forEach(doc => {
    allRestaurants.push({id: doc.id,...doc.data()});
  });
  renderRestaurants(allRestaurants);
});

// RENDER CARDS
function renderRestaurants(restaurants) {
  let html = '';
  restaurants.forEach(rest => {
    let distanceTxt = '';
    if(userLat && rest.lat && rest.lng) {
      const dist = getDistance(userLat, userLng, rest.lat, rest.lng).toFixed(1);
      distanceTxt = `<span class="distance-badge">${dist} km away</span>`;
    }
    html += `
      <div class="restaurant-card" onclick="window.location='restaurant.html?id=${rest.id}'">
        <img src="${rest.coverUrl || 'assets/placeholder.jpg'}" alt="${rest.name}">
        <div class="restaurant-info">
          <img class="restaurant-logo" src="${rest.logoUrl || 'assets/logo-placeholder.png'}" alt="logo">
          <h3>${rest.name} ${distanceTxt}</h3>
          <p class="meta">
            <span>⭐ ${rest.rating || '4.5'}</span>
            <span>• ${rest.cuisine || 'Food'}</span>
            <span>• ${rest.time || '30 min'}</span>
          </p>
        </div>
      </div>
    `;
  });
  restaurantList.innerHTML = html || "No restaurants found";
}

// SEARCH BAR
searchInput.addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = allRestaurants.filter(r => 
    r.name.toLowerCase().includes(term) || 
    r.cuisine.toLowerCase().includes(term)
  );
  renderRestaurants(filtered);
});

// GPS
function getLocation() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      userLat = pos.coords.latitude;
      userLng = pos.coords.longitude;
      alert("Location found! Sorting by nearest...");
      allRestaurants.sort((a,b) => {
        const distA = getDistance(userLat, userLng, a.lat || 0, a.lng || 0);
        const distB = getDistance(userLat, userLng, b.lat || 0, b.lng || 0);
        return distA - distB;
      });
      renderRestaurants(allRestaurants);
    }, () => alert("Could not get location"));
  } else { alert("GPS not supported"); }
}

// DISTANCE FORMULA KM
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2-lat1) * Math.PI / 180;
  const dLon = (lon2-lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)*Math.sin(dLat/2) +
            Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*
            Math.sin(dLon/2)*Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// CART COUNT
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('gobite_cart')) || [];
  document.getElementById('cart-count').innerText = cart.reduce((sum, item) => sum + item.qty, 0);
}
updateCartCount();