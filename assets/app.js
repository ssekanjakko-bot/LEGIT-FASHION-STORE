const restaurants = [
  {
    id: 'nandos',
    name: 'Nandos Wandegeya',
    rating: 4.5,
    time: '25-35 min',
    fee: 'UGX 3,000',
    cuisine: 'Portuguese Chicken • Burgers',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'
  },
  {
    id: 'bubus',
    name: 'Bubus Restaurant',
    rating: 4.7,
    time: '30-40 min',
    fee: 'UGX 4,000',
    cuisine: 'Local Dishes • Rolex • Luwombo',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'
  }
];

window.onload = function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    document.getElementById("location-text").innerText = "📍 Kampala";
    renderRestaurants(restaurants);
  }
};

function showPosition() {
  document.getElementById("location-text").innerText = `📍 Restaurants near you`;
  renderRestaurants(restaurants);
}
function showError() {
  document.getElementById("location-text").innerText = "📍 Kampala";
  renderRestaurants(restaurants);
}

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

function filterRestaurants() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filtered = restaurants.filter(r =>
    r.name.toLowerCase().includes(query) ||
    r.cuisine.toLowerCase().includes(query)
  );
  renderRestaurants(filtered);
}