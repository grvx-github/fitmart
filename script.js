// Lightweight cart implementation using localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function parsePriceString(s) {
  // Extract numeric value from strings like "Rs 2,999" or "Rs2999"
  return Number(String(s).replace(/[^0-9.-]+/g, '')) || 0;
}

function formatRs(n) {
  return 'Rs ' + n.toLocaleString('en-IN');
}

// Nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const bar = document.getElementById('bar');
  const close = document.getElementById('close');
  const nav = document.getElementById('navbar');

  if (bar) bar.addEventListener('click', () => nav.classList.add('active'));
  if (close) close.addEventListener('click', () => nav.classList.remove('active'));

  // Render cart if cart table exists on the page
  renderCart();

  // Coupon apply button
  const applyBtn = document.getElementById('apply-coupon-btn');
  const couponInput = document.getElementById('coupon-input');
  if (applyBtn && couponInput) {
    applyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      applyCoupon(couponInput.value || '');
    });
  }

  // If coupon input exists, prefill from storage
  const stored = getStoredCoupon();
  if (stored && couponInput) couponInput.value = stored.code || '';

  // Wire up table interactions (delegation)
  const cartTable = document.querySelector('#cart table tbody');
  if (cartTable) {
    cartTable.addEventListener('input', (e) => {
      if (e.target.matches('input.quantity')) {
        const id = parseInt(e.target.dataset.id);
        const qty = parseInt(e.target.value) || 0;
        updateQuantity(id, qty);
      }
    });

    cartTable.addEventListener('click', (e) => {
      if (e.target.classList.contains('fa-circle-xmark')) {
        const id = parseInt(e.target.dataset.id);
        removeFromCart(id);
      }
    });
  }
  // Search from header (works on index.html and shop.html)
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-bar');
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const q = String(searchInput.value || '').trim();
      performSearch(q);
    });
    // allow Enter key
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const q = String(searchInput.value || '').trim();
        performSearch(q);
      }
    });
  }
});

function addToCart(index) {
  // Gather product info from .pro at given index
  const pro = document.querySelectorAll('.pro')[index];
  if (!pro) {
    alert('Product not found');
    return;
  }
  const img = pro.querySelector('img') ? pro.querySelector('img').getAttribute('src') : '';
  const nameEl = pro.querySelector('.des h5') || pro.querySelector('.des h4') || pro.querySelector('.des span');
  const name = nameEl ? nameEl.textContent.trim() : 'Product';
  const priceText = pro.querySelector('.des h4') ? pro.querySelector('.des h4').textContent : '0';
  const price = parsePriceString(priceText);

  const id = index; // Use index as product id (stable for this static site)
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, image: img, qty: 1 });
  }
  saveCart();
  alert(`${name} added to cart`);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
}

function updateQuantity(id, qty) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  if (qty <= 0) {
    removeFromCart(id);
    return;
  }
  item.qty = qty;
  saveCart();
  renderCart();
}

function getStoredCoupon() {
  try {
    return JSON.parse(localStorage.getItem('cartCoupon')) || null;
  } catch (e) {
    return null;
  }
}

function setStoredCoupon(c) {
  if (!c) localStorage.removeItem('cartCoupon');
  else localStorage.setItem('cartCoupon', JSON.stringify(c));
}

function applyCoupon(codeRaw) {
  const msgEl = document.getElementById('coupon-msg');
  if (msgEl) msgEl.textContent = '';
  const code = String(codeRaw || '').trim().toUpperCase();
  if (!code) {
    // remove coupon if empty
    setStoredCoupon(null);
    renderCart();
    if (msgEl) msgEl.style.color = '#080';
    if (msgEl) msgEl.textContent = 'Coupon removed';
    return;
  }

  // Validate: 1-3 uppercase letters then exactly 2 digits
  const m = code.match(/^([A-Z]{1,3})(\d{2})$/);
  if (!m) {
    if (msgEl) {
      msgEl.style.color = '#b00';
      msgEl.textContent = 'Invalid coupon format. Use up to 3 letters + 2 digits, e.g. AYC20';
    }
    return;
  }
  const percent = parseInt(m[2], 10);
  if (isNaN(percent)) {
    if (msgEl) {
      msgEl.style.color = '#b00';
      msgEl.textContent = 'Invalid coupon percentage.';
    }
    return;
  }
  if (percent > 70) {
    if (msgEl) {
      msgEl.style.color = '#b00';
      msgEl.textContent = 'We could not apply the coupon: discount exceeds 70% limit.';
    }
    return;
  }

  // Accept coupon
  setStoredCoupon({ code, percent });
  if (msgEl) {
    msgEl.style.color = '#080';
    msgEl.textContent = `Coupon ${code} applied (${percent}%).`;
  }
  renderCart();
}

function removeCoupon() {
  setStoredCoupon(null);
  const msgEl = document.getElementById('coupon-msg');
  if (msgEl) {
    msgEl.style.color = '#080';
    msgEl.textContent = 'Coupon removed';
  }
  const input = document.getElementById('coupon-input');
  if (input) input.value = '';
  renderCart();
}

function renderCart() {
  const tbody = document.querySelector('#cart table tbody');
  const subTotalCell = document.getElementById('subtotal-value');
  const couponRow = document.getElementById('coupon-row');
  const couponCodeEl = document.getElementById('coupon-code');
  const couponValueEl = document.getElementById('coupon-value');
  const totalEl = document.getElementById('total-value');
  if (!tbody) return;

  tbody.innerHTML = '';
  let subtotal = 0;

  if (cart.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="6">Your cart is empty</td>';
    tbody.appendChild(tr);
  } else {
    cart.forEach(item => {
      const line = item.price * item.qty;
      subtotal += line;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><i class="fa-solid fa-circle-xmark" data-id="${item.id}"></i></td>
        <td><img src="${item.image}" alt="${item.name}" style="max-width:120px"></td>
        <td>${item.name}</td>
        <td>${formatRs(item.price)}</td>
        <td><input type="number" class="quantity" data-id="${item.id}" value="${item.qty}" min="1"></td>
        <td>${formatRs(line)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Coupon handling
  const storedCoupon = getStoredCoupon();
  let discountAmount = 0;
  if (storedCoupon && storedCoupon.percent && subtotal > 0) {
    const pct = Math.min(Number(storedCoupon.percent) || 0, 70);
    discountAmount = Math.round((subtotal * pct) / 100);
    if (couponRow) couponRow.style.display = '';
    if (couponCodeEl) couponCodeEl.textContent = storedCoupon.code;
    if (couponValueEl) couponValueEl.textContent = `- ${formatRs(discountAmount)} (${pct}%)`;
  } else {
    if (couponRow) couponRow.style.display = 'none';
    if (couponCodeEl) couponCodeEl.textContent = '';
    if (couponValueEl) couponValueEl.textContent = '';
  }

  const finalTotal = Math.max(subtotal - discountAmount, 0);

  if (subTotalCell) subTotalCell.textContent = formatRs(subtotal);
  if (totalEl) totalEl.textContent = formatRs(finalTotal);

  // Attach remove button to coupon row (small UX improvement)
  if (couponRow && storedCoupon) {
    // add small remove link if not present
    if (!document.getElementById('remove-coupon-btn')) {
      const removeBtn = document.createElement('button');
      removeBtn.id = 'remove-coupon-btn';
      removeBtn.textContent = 'Remove';
      removeBtn.style.marginLeft = '8px';
      removeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        removeCoupon();
      });
      couponRow.querySelector('td').appendChild(removeBtn);
    }
  } else {
    const existing = document.getElementById('remove-coupon-btn');
    if (existing) existing.remove();
  }
}

// ----------------- Search helpers -----------------
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function performSearch(query) {
  const q = String(query || '').trim();
  // If we are already on shop.html, filter in place, otherwise redirect with query
  const path = window.location.pathname.replace(/^.*\//, '');
  if (!q) {
    // empty search -> go to shop page without query
    if (path !== 'shop.html') window.location.href = 'shop.html';
    else filterProducts('');
    return;
  }
  if (path === 'shop.html') {
    filterProducts(q);
  } else {
    window.location.href = `shop.html?q=${encodeURIComponent(q)}`;
  }
}

function filterProducts(query) {
  const q = String(query || '').trim().toLowerCase();
  const products = document.querySelectorAll('.pro');
  if (!products) return;
  let any = false;
  products.forEach(pro => {
    const title = (pro.querySelector('.des h5') ? pro.querySelector('.des h5').textContent : '') || '';
    const cat = (pro.querySelector('.des span') ? pro.querySelector('.des span').textContent : '') || '';
    const price = (pro.querySelector('.des h4') ? pro.querySelector('.des h4').textContent : '') || '';
    const combined = (title + ' ' + cat + ' ' + price).toLowerCase();
    if (!q || combined.indexOf(q) !== -1) {
      pro.style.display = '';
      any = true;
    } else {
      pro.style.display = 'none';
    }
  });
  // Optionally show a message if no products found
  // We'll create a simple message element under .pro-container if needed
  const container = document.querySelector('.pro-container');
  if (!container) return;
  let msg = document.getElementById('no-results-msg');
  if (!any) {
    if (!msg) {
      msg = document.createElement('div');
      msg.id = 'no-results-msg';
      msg.style.padding = '20px';
      msg.style.color = '#333';
      msg.textContent = `No products found for "${query}"`;
      container.parentNode.insertBefore(msg, container.nextSibling);
    } else {
      msg.textContent = `No products found for "${query}"`;
      msg.style.display = '';
    }
  } else if (msg) {
    msg.style.display = 'none';
  }
}

// On shop page load, apply query param filter if present
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname.replace(/^.*\//, '');
  if (path === 'shop.html') {
    const q = getQueryParam('q');
    if (q) {
      // prefill search input if present
      const searchInput = document.getElementById('search-bar');
      if (searchInput) searchInput.value = q;
      filterProducts(q);
    }
  }
});