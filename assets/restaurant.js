const urlParams = new URLSearchParams(window.location.search);
const restaurantId = urlParams.get('id');
let cart = JSON.parse(localStorage.getItem('gobite_cart')) || [];
let currentRestaurant = {};

// LOAD RESTAURANT PROFILE
db.collection("restaurants").doc(restaurantId).get().then(doc => {
  if(doc.exists && doc.data().status === 'approved') {
    currentRestaurant = {id: doc.id,...doc.data()};
    document.getElementById('restaurant-header').innerHTML = `
      <img src="${currentRestaurant.coverUrl}" class="header-img">
      <div class="header-info">
        <img src="${currentRestaurant.logoUrl}" class="header-logo">
        <h2>${currentRestaurant.name}</h2>
        <p class="meta">⭐ ${currentRestaurant.rating} • ${currentRestaurant.cuisine} • ${currentRestaurant.time}</p>
      </div>
    `;
    loadMenu();
  } else {
    document.getElementById('restaurant-header').innerHTML = "Restaurant not found or not approved";
  }
});

// LOAD APPROVED MENU GROUPED BY CATEGORY
function loadMenu() {
  db.collection("restaurants").doc(restaurantId).collection("menu")
.where("status", "==", "approved")
.onSnapshot(snapshot => {
    const menuByCategory = {};
    snapshot.forEach(doc => {
      const item = {id: doc.id,...doc.data()};
      if(!menuByCategory[item.category]) menuByCategory[item.category] = [];
      menuByCategory[item.category].push(item);
    });

    let tabsHtml = '';
    let menuHtml = '';
    Object.keys(menuByCategory).forEach((category, index) => {
      tabsHtml += `<button class="tab ${index===0?'active':''}" onclick="scrollToCategory('${category}')">${category}</button>`;
      menuHtml += `<h3 id="cat-${category}" class="category-title">${category}</h3>`;
      menuByCategory[category].forEach(item => {
        menuHtml += `
          <div class="menu-item">
            <img src="${item.imageUrl}">
            <div class="menu-info">
              <h4>${item.name}</h4>
              <p>${item.desc}</p>
              <span class="price">UGX ${Number(item.price).toLocaleString()}</span>
            </div>
            <button class="add-btn" onclick='addToCart(${JSON.stringify(item)})'>+</button>
          </div>
        `;
      });
    });
    document.getElementById('category-tabs').innerHTML = tabsHtml;
    document.getElementById('menu-list').innerHTML = menuHtml;
  });
}

function scrollToCategory(category) {
  document.getElementById('cat-'+category).scrollIntoView({behavior: 'smooth'});
}

// CART FUNCTION
function addToCart(item) {
  item.restaurantId = restaurantId;
  item.restaurantName = currentRestaurant.name;
  const existing = cart.find(c => c.id === item.id);
  if(existing) existing.qty++;
  else { item.qty = 1; cart.push(item); }
  localStorage.setItem('gobite_cart', JSON.stringify(cart));
  updateCartCount();
  alert(item.name + " added to cart");
}

function updateCartCount() {
  document.getElementById('cart-count').innerText = cart.reduce((sum, item) => sum + item.qty, 0);
}
updateCartCount();