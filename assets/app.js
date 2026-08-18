// MOCK RESTAURANT DATA - Later we pull this from Firebase
// lat, lng = approximate Kampala locations
const restaurants = [
  {
    id: 'nandos',
    name: 'Nandos Wandegeya',
    rating: 4.5,
    time: '25-35 min',
    fee: 'UGX 3,000',
    cuisine: 'Portuguese Chicken • Burgers',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    lat: 0.3326, lng: 32.5792 // Wandegeya
  },
  {
    id: 'bubus',
    name: 'Bubus Restaurant',
    rating: 4.7,
    time: '30-40 min',
    fee: 'UGX 4,000',
    cuisine: 'Local Dishes • Rolex • Luwombo',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    lat: 0.3476, lng: 32.5825 // Kamwokya
  },
  {
    id: 'kfc',
    name: 'KFC Acacia Mall',
    rating: 4.3,
    time: '20-30 min',
    fee: 'UGX 3,500',
    cuisine: 'Chicken • Burgers • Fries',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
    lat: 0.3261, lng: 32.5950 // Acacia
  },
  {
    id: 'java',
    name: 'Java House Lugogo',
    rating: 4.6,
    time: '30-45 min',
    fee: 'UGX 4,500',
    cuisine: 'Coffee • Pastries • Sandwiches',
    image: 'https://images.unsplash.com/photo-1554118828-eeeafb15a89d?w=400',
    lat: 0.3178, lng: 32.6021 // Lugogo
  }
];

let userLat = null;
let userLng = null;

// 1. GET GPS LOCATION ON LOAD
window.onload = function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    document.getElementById("location-text").innerText = "📍 Location not supported";
    renderRestaurants(restaurants); // Show all if no GPS
  }
};

function showPosition(position) {
  userLat = position.coords.latitude;
  userLng = position.coords.longitude;
  document.getElementById("location-text").innerText = `📍 Restaurants near you`;
  renderRestaurants(restaurants); // For now show all. Later we filter by distance
}

function showError() {
  document.getElementById("location-text").innerText = "📍 Kampala";
  renderRestaurants(restaurants);
}

// 2. RENDER RESTAURANTS
function renderRestaurants(list) {
  const container = document.getElementById("restaurant-list");
  const noResults = document.getElementById("no-results");
  
  if(list.length === 0) {
    container.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }
  
  noResults.style.display = 'none';
  
  container.innerHTML = list.map(r => `
    <div class="restaurant-card" onclick="window.location='restaurant.html?id=${r.id}'">
      <img src="${r.image}" alt="${r.name}">
      <div class="info">
        <h3>${r.name}</h3>
        <div class="meta">
          <span>⭐ ${r.rating}</span>
          <span>•</span>
          <span>${r.time}</span>
          <span>•</span>
          <span>${r.fee} delivery</span>
        </div>
        <p class="cuisine">${r.cuisine}</p>
      </div>
      <div class="arrow">→</div>
    </div>
  `).join('');
}

// 3. SEARCH FUNCTION
function filterRestaurants() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filtered = restaurants.filter(r => 
    r.name.toLowerCase().includes(query) || 
    r.cuisine.toLowerCase().includes(query)
  );
  renderRestaurants(filtered);
}