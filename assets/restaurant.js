// SAME MOCK DATA + MENU DATA
const restaurantData = {
  nandos: {
    name: 'Nandos Wandegeya',
    rating: 4.5,
    time: '25-35 min',
    fee: 'UGX 3,000',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    menu: [
      { id: 1, name: '1/4 Chicken + 2 Sides', price: 18000, desc: 'Grilled chicken with 2 regular sides' },
      { id: 2, name: 'Chicken Burger', price: 15000, desc: 'Grilled chicken breast with chips' },
      { id: 3, name: 'Peri-Peri Rice', price: 8000, desc: 'Spicy rice with veggies' },
      { id: 4, name: 'Coke 500ml', price: 3000, desc: 'Cold drink' }
    ]
  },
  bubus: {
    name: 'Bubus Restaurant',
    rating: 4.7,
    time: '30-40 min',
    fee: 'UGX 4,000',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
    menu: [
      { id: 5, name: 'Luwombo Chicken', price: 22000, desc: 'Steamed in banana leaves' },
      { id: 6, name: 'Rolex', price: 5000, desc: 'Chapati + eggs + veggies' },
      { id: 7, name: 'Beef Stew + Matooke', price: 20000, desc: 'Traditional meal' }
    ]
  },
  kfc: {
    name: 'KFC Acacia Mall',
    rating: 4.3,
    time: '20-30 min',
    fee: 'UGX 3,500',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    menu: [
      { id: 8, name: 'Zinger Burger', price: 17000, desc: 'Spicy chicken fillet' },
      { id: 9, name: '8 Piece Bucket', price: 45000, desc: '8 pieces chicken + chips' }
    ]
  }
};

// CART LOGIC
let cart = JSON.parse(localStorage.getItem('gobite_cart')) || [];

function updateCartBar() {
  const cartBar = document.getElementById('cart-bar');
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  document.getElementById('cart-items').innerText = itemCount;
  document.getElementById('cart-total').innerText = total.toLocaleString();
  document.getElementById('cart-count').innerText = itemCount;
  
  cartBar.style.display = itemCount > 0 ? 'flex' : 'none';
}

function addToCart(item) {
  const existing = cart.find(c => c.id === item.id);
  if(existing) {
    existing.qty += 1;
  } else {
    cart.push({...item, qty: 1});
  }
  localStorage.setItem('gobite_cart', JSON.stringify(cart));
  updateCartBar();
  alert(`${item.name} added to cart!`);
}

function goToCart() {
  window.location = 'cart.html';
}

// LOAD RESTAURANT ON PAGE LOAD
window.onload = function() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const restaurant = restaurantData[id];

  if(!restaurant) {
    document.getElementById('rest-name').innerText = 'Restaurant not found';
    return;
  }

  // Set hero info
  document.getElementById('rest-name').innerText = restaurant.name;
  document.getElementById('rest-image').src = restaurant.image;
  document.getElementById('rest-rating').innerText = `⭐ ${restaurant.rating}`;
  document.getElementById('rest-time').innerText = restaurant.time;
  document.getElementById('rest-fee').innerText = `${restaurant.fee} delivery`;
  document.title = `${restaurant.name} - GoBite`;

  // Render menu
  const menuList = document.getElementById('menu-list');
  menuList.innerHTML = restaurant.menu.map(item => `
    <div class="menu-item">
      <div class="menu-info">
        <h4>${item.name}</h4>
        <p>${item.desc}</p>
        <div class="price">UGX ${item.price.toLocaleString()}</div>
      </div>
      <button class="add-btn" onclick='addToCart(${JSON.stringify(item)})'>+</button>
    </div>
  `).join('');

  updateCartBar();
};