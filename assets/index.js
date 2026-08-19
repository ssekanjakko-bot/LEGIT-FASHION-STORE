const restaurantList = document.getElementById('restaurant-list');

// LOAD APPROVED RESTAURANTS
db.collection("restaurants").where("status", "==", "approved").onSnapshot(snapshot => {
  let html = '';
  snapshot.forEach(doc => {
    const rest = doc.data();
    const id = doc.id;
    html += `
      <div class="restaurant-card" onclick="window.location='restaurant.html?id=${id}'">
        <img src="${rest.coverUrl || 'assets/placeholder.jpg'}" alt="${rest.name}">
        <div class="restaurant-info">
          <img class="restaurant-logo" src="${rest.logoUrl || 'assets/logo-placeholder.png'}" alt="logo">
          <h3>${rest.name}</h3>
          <p class="meta">
            <span>⭐ ${rest.rating || '4.5'}</span>
            <span>• ${rest.cuisine || 'Food'}</span>
            <span>• ${rest.time || '30 min'}</span>
          </p>
        </div>
      </div>
    `;
  });
  restaurantList.innerHTML = html || "No restaurants yet";
});

// CART COUNT
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('gobite_cart')) || [];
  document.getElementById('cart-count').innerText = cart.reduce((sum, item) => sum + item.qty, 0);
}
updateCartCount();