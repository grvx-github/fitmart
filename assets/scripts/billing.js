document.addEventListener("DOMContentLoaded", async () => {
	const checkoutData = JSON.parse(sessionStorage.getItem("checkoutData")) || {};
	const { products = [], userName = "", userEmail = "" } = checkoutData;

	// Prefill user info
	document.getElementById("fullname").value = userName;
	document.getElementById("email").value = userEmail;

	const orderCarousel = document.getElementById("order-carousel");
	let subtotal = 0;
	let totalDiscount = 0;

	// Populate carousel
	products.forEach(item => {
		const div = document.createElement("div");
		div.classList.add("carousel-item");
		div.innerHTML = `
      <img src="${item.img}" alt="${item.title}">
      <h4>${item.title}</h4>
      <p>Qty: ${item.quantity}</p>
      <p>Price: ₹${item.price * item.quantity}</p>
      ${item.discount ? `<p>Discount: ₹${item.discount}</p>` : ""}
      <p class="price">₹${item.price * item.quantity - item.discount}</p>
    `;
		orderCarousel.appendChild(div);

		subtotal += item.price * item.quantity;
		totalDiscount += item.discount || 0;
	});

	// Update totals
	document.getElementById("subtotal").textContent = subtotal;
	document.getElementById("discount").textContent = totalDiscount;
	document.getElementById("total").textContent = subtotal - totalDiscount;

	// Carousel logic
	let currentIndex = 0;
	const showCarouselItem = index => {
		const width = orderCarousel.clientWidth;
		orderCarousel.style.transform = `translateX(-${index * width}px)`;
	};
	document.querySelector(".next").addEventListener("click", () => {
		currentIndex = (currentIndex + 1) % products.length;
		showCarouselItem(currentIndex);
	});
	document.querySelector(".prev").addEventListener("click", () => {
		currentIndex = (currentIndex - 1 + products.length) % products.length;
		showCarouselItem(currentIndex);
	});
	showCarouselItem(currentIndex);

	// Modal logic for addresses (your existing code)
	const modal = document.getElementById("address-modal");
	const addAddressBtn = document.querySelector(".add-address-btn");
	const closeModalBtn = document.querySelector(".close-modal");

	addAddressBtn.addEventListener("click", () => (modal.style.display = "block"));
	closeModalBtn.addEventListener("click", () => (modal.style.display = "none"));
	window.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

	document.getElementById("new-address-form").addEventListener("submit", (e) => {
		e.preventDefault();
		const name = document.getElementById("new-address-name").value;
		const details = document.getElementById("new-address-details").value;
		let addresses = JSON.parse(localStorage.getItem("addresses")) || [];
		addresses.push({ name, details });
		localStorage.setItem("addresses", JSON.stringify(addresses));
		const addressSelect = document.getElementById("address-select");
		const option = document.createElement("option");
		option.value = addresses.length - 1;
		option.textContent = `${name}: ${details}`;
		addressSelect.appendChild(option);
		addressSelect.value = addresses.length - 1;
		modal.style.display = "none";
		e.target.reset();
	});
});
