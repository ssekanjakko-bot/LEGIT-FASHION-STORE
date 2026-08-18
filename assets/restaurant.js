const restaurantData = {
  nandos: {
    name: 'Nandos Wandegeya',
    rating: 4.5,
    time: '25-35 min',
    fee: 'UGX 3,000',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    menu: {
      "Chicken": [
        { 
          id: 1, 
          name: '1/4 Chicken + 2 Sides', 
          price: 18000, 
          desc: 'Grilled chicken with 2 regular sides',
          image: 'https://images.unsplash.com/photo-1598515214211-89ce2bde4f8e?w=400' 
        },
        { 
          id: 2, 
          name: '1/2 Chicken', 
          price: 32000, 
          desc: 'Full grilled chicken',
          image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400' 
        },
      ],
      "Burgers": [
        { 
          id: 3, 
          name: 'Chicken Burger', 
          price: 15000, 
          desc: 'Grilled chicken breast with chips',
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' 
        },
        { 
          id: 4, 
          name: 'Beef Burger', 
          price: 17000, 
          desc: 'Beef patty with cheese',
          image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400' 
        },
      ],
      "Drinks": [
        { 
          id: 5, 
          name: 'Coke 500ml', 
          price: 3000, 
          desc: 'Cold drink',
          image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400' 
        }
      ]
    }
  },
  bubus: {
    name: 'Bubus Restaurant',
    rating: 4.7,
    time: '30-40 min',
    fee: 'UGX 4,000',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
    menu: {
      "Local Dishes": [
        { 
          id: 6, 
          name: 'Luwombo Chicken', 
          price: 22000, 
          desc: 'Steamed in banana leaves',
          image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400' 
        },
        { 
          id: 7, 
          name: 'Beef Stew + Matooke', 
          price: 20000, 
          desc: 'Traditional meal',
          image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400' 
        }
      ]
    }
  }
};

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
  if(existing) { existing.qty += 1; }
  else { cart.push({...item, qty: 1}); }
  localStorage.setItem('gobite_cart', JSON.stringify(cart));
  updateCartBar();
}

function goToCart() { window.location = 'cart.html'; }
function scrollToCategory(cat) {
  document.getElementById(`cat-${cat}`).scrollIntoView({ behavior: 'smooth' });
}

window.onload = function() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const restaurant = restaurantData[id];
  if(!restaurant) return;

  document.getElementById('rest-name').innerText = restaurant.name;
  document.getElementById('rest-image').src = restaurant.image;
  document.getElementById('rest-rating').innerText = `⭐ ${restaurant.rating}`;
  document.getElementById('rest-time').innerText = restaurant.time;
  document.getElementById('rest-fee').innerText = `${restaurant.fee} delivery`;
  document.title = `${restaurant.name} - GoBite`;

  // RENDER CATEGORY TABS
  const tabsContainer = document.getElementById('category-tabs');
  const categories = Object.keys(restaurant.menu);
  tabsContainer.innerHTML = categories.map(cat => `
    <button class="tab-btn" onclick="scrollToCategory('${cat}')">${cat}</button>
  `).join('');

  // RENDER MENU WITH IMAGES + PRICE
  const menuList = document.getElementById('menu-list');
  menuList.innerHTML = categories.map(cat => `
    <div class="menu-category" id="cat-${cat}">
      <h3>${cat}</h3>
      ${restaurant.menu[cat].map(item => `
        <div class="menu-item">
          <img class="menu-item-img" src="${item.image}" alt="${item.name}">
          <div class="menu-info">
            <h4>${item.name}</h4>
            <p>${item.desc}</p>
            <div class="price">UGX ${item.price.toLocaleString()}</div>
          </div>
          <button class="add-btn" onclick='addToCart(${JSON.stringify(item)})'>+</button>
        </div>
      `).join('')}
    </div>
  `).join('');

  updateCartBar();
};