const ADMIN_PASS = "admin123"; // CHANGE THIS

const restaurantData = {
  nandos: { name: 'Nandos Wandegeya', menu: { "Chicken": [{id:1,name:'1/4 Chicken',price:18000}], "Burgers": [{id:3,name:'Chicken Burger',price:15000}] } },
  bubus: { name: 'Bubus Restaurant', menu: { "Local Dishes": [{id:8,name:'Luwombo',price:22000}] } }
};

function login() {
  if(document.getElementById('admin-pass').value === ADMIN_PASS) {
    localStorage.setItem('gobite_admin_loggedin', 'true');
    showDashboard();
  } else { alert("Wrong Password"); }
}
function logout() { localStorage.removeItem('gobite_admin_loggedin'); location.reload(); }
function showDashboard() {
  document.getElementById('login-box').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  loadOrders(); loadAllMenu();
}
window.onload = function() {
  if(localStorage.getItem('gobite_admin_loggedin') === 'true') showDashboard();
}

let lastOrderCount = 0;
function loadOrders() {
  const orders = JSON.parse(localStorage.getItem('gobite_orders')) || [];
  if(orders.length > lastOrderCount) { new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play(); alert("🔔 NEW ORDER!"); }
  lastOrderCount = orders.length;
  document.getElementById('order-count').innerText = orders.filter(o => o.status === 'new').length;
  document.getElementById('orders-list').innerHTML = orders.length === 0? "No orders yet" : orders.map(o => `
    <div style="border:1px solid #ddd; padding:14px; margin-bottom:10px; border-radius:12px; background:white;">
      <b>Order #${o.id}</b> - ${o.restaurantName} <br>
      ${o.items.map(i => `${i.name} x${i.qty}`).join(', ')} <br>
      <b>Total:</b> UGX ${o.total.toLocaleString()} <br>
      <b>Status:</b> <span class="${o.status === 'new'? 'status-new' : 'status-accepted'}">${o.status}</span> <br><br>
      ${o.status === 'new'? `<button class="add-to-cart-btn" onclick="updateOrderStatus('${o.id}', 'accepted')">Accept Order</button>` : ''}
    </div>
  `).join('');
}
function updateOrderStatus(id, status) {
  let orders = JSON.parse(localStorage.getItem('gobite_orders')) || [];
  localStorage.setItem('gobite_orders', JSON.stringify(orders.map(o => o.id === id? {...o, status} : o)));
  loadOrders();
}
function loadAllMenu() {
  let count = 0;
  let html = '';
  Object.keys(restaurantData).forEach(restId => {
    const r = restaurantData[restId];
    Object.keys(r.menu).forEach(cat => {
      r.menu[cat].forEach(item => {
        count++;
        html += `<tr><td>${r.name}</td><td>${cat}</td><td>${item.name}</td><td>UGX ${item.price.toLocaleString()}</td></tr>`;
      });
    });
  });
  document.getElementById('item-count').innerText = count;
  document.getElementById('menu-list-admin').innerHTML = html;
}