// document.addEventListener('DOMContentLoaded', () => {
// const bar =document.getElementById('bar');
// const close =document.getElementById('close');
// const nav =document.getElementById('navbar');

// if (bar){
//     bar.addEventListener('click', () => {
//             nav.classList.add('active');
//         });
// }

// if (close){
//     close.addEventListener('click', () => {
//             nav.classList.remove('active');
//         });
// }
// });


// Get existing cart from localStorage or create an empty one
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ---------- NAVBAR TOGGLE ----------
document.addEventListener('DOMContentLoaded', () => {
  const bar = document.getElementById('bar');
  const close = document.getElementById('close');
  const nav = document.getElementById('navbar');

  if (bar) {
    bar.addEventListener('click', () => {
      nav.classList.add('active');
    });
  }

  if (close) {
    close.addEventListener('click', () => {
      nav.classList.remove('active');
    });
  }

  // ---------- CART FUNCTIONALITY ----------
  const cartTable = document.querySelector('#cart table tbody');
  const subTotalElement = document.querySelector('#sub-total table tr:nth-child(1) td:last-child');
  const totalElement = document.querySelector('#sub-total table tr:last-child td strong');

  // Function to update totals
  function updateCartTotal() {
    let total = 0;

    const rows = cartTable.querySelectorAll('tr');
    rows.forEach(row => {
      const priceCell = row.querySelector('td:nth-child(4)');
      const quantityInput = row.querySelector('td:nth-child(5) input');
      const subtotalCell = row.querySelector('td:nth-child(6)');

      const price = parseFloat(priceCell.textContent.replace('$', '')) || 0;
      const quantity = parseInt(quantityInput.value) || 0;

      const subtotal = price * quantity;
      subtotalCell.textContent = `$${subtotal.toFixed(2)}`;
      total += subtotal;
    });

    subTotalElement.textContent = `$${total.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
  }

  // When quantity changes, recalculate totals
  cartTable.addEventListener('input', (e) => {
    if (e.target.type === 'number') {
      updateCartTotal();
    }
  });

  // Remove product row when ❌ clicked
  cartTable.addEventListener('click', (e) => {
    if (e.target.classList.contains('fa-circle-xmark')) {
      e.target.closest('tr').remove();
      updateCartTotal();
    }
  });

  // Initialize total once on page load
  updateCartTotal();
});

function addToCart(productId) {
    // Find the product by id
    let product = products.find(p => p.id === productId);

    if (!product) {
        alert("Product not found!");
        return;
    }

    // Check if product already in cart
    let cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.qty += 1; // Increase quantity
    } else {
        cart.push({ ...product, qty: 1 }); // Add new product
    }

    // Save cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart`);
}


let cartContainer = document.getElementById("cart-items");

cart.forEach(item => {
    let div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <h4>${item.name}</h4>
        <p>Price: Rs ${item.price}</p>
        <p>Qty: ${item.qty}</p>
        <button onclick="removeFromCart(${item.id})">Remove</button>
    `;
    cartContainer.appendChild(div);
});

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload();
}