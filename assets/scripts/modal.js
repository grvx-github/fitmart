// assets/scripts/modal.js

import { addToCart } from "/assets/scripts/cart.js";

export function initQuickViewModal() {
	const modal = document.getElementById("quickViewModal");
	const modalBody = document.getElementById("modal-body");
	const closeModal = modal.querySelector(".close-modal");
	const container = document.querySelector(".pro-container");

	// Attach ONE click listener on the container
	container.addEventListener("click", e => {
		if (e.target.classList.contains("quick-view")) {
			const product = e.target.closest(".pro");
			const name = product.querySelector("span").innerText;
			const price = product.querySelector("h4").innerText;
			const img = product.querySelector("img").src;
			const category = product.dataset.category || "Fitness";
			const productId = product.dataset.id;
			const tags = ["fitness", "gym", "equipment"];

			modalBody.innerHTML = `
        <div class="modal-body flex">
          <div class="modal-left">
            <img src="${img}" alt="${name}">
          </div>
          <div class="modal-right">
            <h2>${name}</h2>
            <h4>${price}</h4>
            <p>Lorem ipsum dolor sit amet...</p>
            <div class="action-row flex">
              <input type="number" min="1" value="1" class="modalQty">
              <button class="add-to-cart-btn btn">Add to Cart</button>
              <button class="buy-now-btn btn">Buy Now</button>
              <button class="wishlist-btn-modal btn"><i class="fa-regular fa-heart"></i></button>
            </div>
          </div>
        </div>
      `;


      // Add to cart (Firestore version)
      const qtyInput = modalBody.querySelector(".modalQty");
      modalBody.querySelector(".add-to-cart-btn").onclick = () => {
        addToCart(productId);
      };


			modalBody.querySelector(".buy-now-btn").onclick = () => alert("Redirecting to checkout...");

			modal.style.display = "flex";
		}
	});

	closeModal.onclick = () => (modal.style.display = "none");
	window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };
}
