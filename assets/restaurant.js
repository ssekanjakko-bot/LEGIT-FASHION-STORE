const restaurantData = {
  nandos: {
    name: 'Nandos Wandegeya',
    rating: 4.5,
    time: '25-35 min',
    fee: 'UGX 3,000',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    menu: {
      "Chicken": [
        { id: 1, name: '1/4 Chicken + 2 Sides', price: 18000, desc: 'Grilled chicken', image: 'https://images.unsplash.com/photo-1598515214211-89ce2bde4f8e?w=400' },
        { id: 2, name: '1/2 Chicken', price: 32000, desc: 'Full grilled chicken', image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400' },
      ],
      "Burgers": [
        { id: 3, name: 'Chicken Burger', price: 15000, desc: 'With chips', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
        { id: 4, name: 'Beef Burger', price: 17000, desc: 'With cheese', image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400' },
      ],
      "Rice & Wraps": [
        { id: 5, name: 'Peri-Peri Rice', price: 8000, desc: 'Spicy rice', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400' },
      ],
      "Sides": [
        { id: 6, name: 'Chips', price: 7000, desc: 'Crispy chips', image: 'https://images.unsplash.com/photo-1585238341578-3a1cf11a2b74?w=400' },
      ],
      "Drinks": [
        { id: 7, name: 'Coke 500ml', price: 3000, desc: 'Cold drink', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400' },
      ],
      "Platters": [],
      "Salads": [],
      "Desserts": [],
      "Breakfast": [],
      "Combos": []
    }
  }
};

let cart = JSON.parse(localStorage.getItem('gobite_cart')) || [];
let currentRestaurant = null;

function updateCartBar() {
  const cartBar = document.getElementById('cart-bar');
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  document.getElementById('cart-items').innerText = itemCount;
  document.getElementById('cart-total').innerText = total.toLocaleString();
  document.getElementById('cart-count').innerText = itemCount;
  cartBar.style.display = itemCount > 0? 'flex' : 'none';
}

function addToCart(item) {
  const existing = cart.find(c => c.id === item.id);
  if(existing) { existing.qty += 1; }
  else { cart.push({...item, qty: 1}); }
  localStorage.setItem('gobite_cart', JSON.stringify(cart));
  updateCartBar();
}

function goToCart() { window.location = 'cart.html'; }

function showCategory(categoryName, btn) {
  const menuList = document.getElementById('menu-list');
  const items = currentRestaurant.menu[categoryName];

  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  if(!items || items.length === 0) {
    menuList.innerHTML = `<p style="text-align:center; color:#888; padding:40px;">No items in ${categoryName} yet</p>`;
    return;
  }

  menuList.innerHTML = items.map(item => `
    <div class="menu-item">
      <img class="menu-item-img" src="${item.image}" alt="${item.name}">
      <div class="menu-info">
        <h4>${item.name}</h4>
        <p>${item.desc}</p>
        <div class="price">UGX ${item.price.toLocaleString()}</div>
      </div>
      <button class="add-to-cart-btn" onclick='addToCart(${JSON.stringify(item)})'>
        <span>+</span> Add
      </button>
    </div>
  `).join('');
}

window.onload = function() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  currentRestaurant = restaurantData[id];
  if(!currentRestaurant) return;

  document.getElementById('rest-name').innerText = currentRestaurant.name;
  document.getElementById('rest-image').src = currentRestaurant.image;
  document.getElementById('rest-rating').innerText = `⭐ ${currentRestaurant.rating}`;
  document.getElementById('rest-time').innerText = currentRestaurant.time;
  document.getElementById('rest-fee').innerText = `${currentRestaurant.fee} delivery`;

  const tabsContainer = document.getElementById('category-tabs');
  const allCategories = [
    "Chicken", "Burgers", "Rice & Wraps", "Sides", "Drinks",
    "Platters", "Salads", "Desserts", "Breakfast", "Combos"
  ];

  tabsContainer.innerHTML = allCategories.map(cat => `
    <button class="tab-btn" onclick="showCategory('${cat}', this)">${cat}</button>
  `).join('');

  updateCartBar();
};