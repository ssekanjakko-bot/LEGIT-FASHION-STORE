let cart = JSON.parse(localStorage.getItem('gobite_cart')) || [];
let cartRestaurantId = localStorage.getItem('gobite_cart_restaurant');

function renderCart() {
  const emptyDiv = document.getElementById('cart-empty');
  const contentDiv = document.getElementById('cart-content');

  if(cart.length === 0) {
    emptyDiv.style.display = 'block';
    contentDiv.style.display = 'none';
    return;
  }
  emptyDiv.style.display = 'none';
  contentDiv.style.display = 'block';

  // Get restaurant name from first item - we will save it when adding
  const restName = localStorage.getItem('gobite_cart_restaurant_name') || 'Your Order';
  document.getElementById('cart-restaurant-name').innerText = `From: ${restName}`;

  const list = document.getElementById('cart-items-list');
  list.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-info">
        <h4>${item.name}</h4>
        <p>UGX ${item.price.toLocaleString()}</p>
        <div class="qty-control">
          <button onclick="updateQty(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="updateQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <div class="cart-price">UGX ${(item.price * item.qty).toLocaleString()}</div>
      <button class="remove-btn" onclick="removeItem(${item.id})">🗑️</button>
    </div>
  `).join('');

  updateBill();
}

function updateQty(id, change) {
  const item = cart.find(i => i.id === id);
  if(item) {
    item.qty += change;
    if(item.qty <= 0) removeItem(id);
    saveCart();
    renderCart();
  }
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  if(cart.length === 0) {
    localStorage.removeItem('gobite_cart_restaurant');
    localStorage.removeItem('gobite_cart_restaurant_name');
  }
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem('gobite_cart', JSON.stringify(cart));
}

function updateBill() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const delivery = 3000; // Fixed for now
  const total = subtotal + delivery;

  document.getElementById('bill-subtotal').innerText = subtotal.toLocaleString();
  document.getElementById('bill-delivery').innerText = delivery.toLocaleString();
  document.getElementById('bill-total').innerText = total.toLocaleString();
}

function placeOrder() {
  alert(`Order Placed! Total: UGX ${document.getElementById('bill-total').innerText}\n\nWe will call you soon.`);
  localStorage.clear();
  window.location = 'index.html';
}

window.onload = renderCart;