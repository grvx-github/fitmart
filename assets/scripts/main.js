// assets/scripts/main.js
import { initNavbar } from "./navbar.js";
import { initSearchModal } from "./search.js";
import { initQuickViewModal } from "./modal.js";
import { initNavbarAuth } from "./navbar-auth.js";
import { fetchProducts } from "./fetch-products.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Initialize navbar and other UI parts
  initNavbar();
  initNavbarAuth();
  initSearchModal();

  // Select container inside the Featured Products section
  const productContainer = document.querySelector("#product1 .pro-container");
  if (!productContainer) return;

  try {
    const products = await fetchProducts();

    // Clear existing content
    productContainer.innerHTML = "";

    // Render each product dynamically
    products.forEach((product) => {
      const div = document.createElement("div");
      div.className = "pro";
      div.dataset.id = product.id; // ✅ Store Firebase product ID

      div.innerHTML = `
        <div class="flex flex-col relative image-wrapper">
          <img src="${product.images?.[0] || 'assets/default-product.png'}" alt="${product.title}">
          <button class="quick-view">Quick View</button>
        </div>

        <button class="wishlist-btn"><i class="fa-regular fa-heart"></i></button>

        <div class="des">
          <span>${product.category || "Uncategorized"}</span>
          <h4>Rs ${product.price || "N/A"}</h4>
          <div class="hover-actions">
            <button class="select-options" onclick="window.location.href='sproduct.html?id=${product.id}'">
              <i class="fa-solid fa-cart-shopping"></i> Select Options
            </button>
          </div>
        </div>
      `;

      productContainer.appendChild(div);
    });

    // ✅ Initialize modal *after* products are rendered
    initQuickViewModal();

  } catch (err) {
    console.error("Error rendering products:", err);
  }
});
