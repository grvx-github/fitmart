// Sample cart data
const cart = [
  { name: 'Dumbbell Set', price: 1200, quantity: 1, discount: 100, image: 'assets/images/dumbbell.jpg' },
  { name: 'Yoga Mat', price: 400, quantity: 2, discount: 0, image: 'assets/images/yogamat.jpg' },
  { name: 'Resistance Bands', price: 500, quantity: 1, discount: 50, image: 'assets/images/resistance_bands.jpg' }
];

const orderCarousel = document.getElementById('order-carousel');
let subtotal = 0;
let totalDiscount = 0;

// Populate carousel
cart.forEach(item => {
	const div = document.createElement('div');
	div.classList.add('carousel-item');
	div.innerHTML = `
    <img src="${item.image}" alt="${item.name}">
    <h4>${item.name}</h4>
    <p>Qty: ${item.quantity}</p>
    <p>Price: ₹${item.price * item.quantity}</p>
    ${item.discount > 0 ? `<p>Discount: ₹${item.discount}</p>` : ''}
    <p class="price">₹${item.price * item.quantity - item.discount}</p>
  `;
	orderCarousel.appendChild(div);

	subtotal += item.price * item.quantity;
	totalDiscount += item.discount;
});

// Update summary
document.getElementById('subtotal').textContent = subtotal;
document.getElementById('discount').textContent = totalDiscount;
document.getElementById('total').textContent = subtotal - totalDiscount;

// Carousel functionality
let currentIndex = 0;

function showCarouselItem(index) {
	const width = orderCarousel.clientWidth;
	orderCarousel.style.transform = `translateX(-${index * width}px)`;
}

document.querySelector('.next').addEventListener('click', () => {
	currentIndex = (currentIndex + 1) % cart.length;
	showCarouselItem(currentIndex);
});

document.querySelector('.prev').addEventListener('click', () => {
	currentIndex = (currentIndex - 1 + cart.length) % cart.length;
	showCarouselItem(currentIndex);
});

// Initial display
showCarouselItem(currentIndex);

// Modal Elements
const modal = document.getElementById('address-modal');
const addAddressBtn = document.querySelector('.add-address-btn');
const closeModalBtn = document.querySelector('.close-modal');

// Open modal on button click
addAddressBtn.addEventListener('click', () => {
	modal.style.display = 'block';
});

// Close modal on X click
closeModalBtn.addEventListener('click', () => {
	modal.style.display = 'none';
});

// Close modal on clicking outside the modal content
window.addEventListener('click', (e) => {
	if (e.target === modal) {
		modal.style.display = 'none';
	}
});

// Handle form submission inside modal
document.getElementById('new-address-form').addEventListener('submit', (e) => {
	e.preventDefault();
	const name = document.getElementById('new-address-name').value;
	const details = document.getElementById('new-address-details').value;

	// Save in localStorage
	let addresses = JSON.parse(localStorage.getItem('addresses')) || [];
	addresses.push({ name, details });
	localStorage.setItem('addresses', JSON.stringify(addresses));

	// Update address dropdown
	const addressSelect = document.getElementById('address-select');
	const option = document.createElement('option');
	option.value = addresses.length - 1;
	option.textContent = `${name}: ${details}`;
	addressSelect.appendChild(option);
	addressSelect.value = addresses.length - 1;

	// Close modal and reset form
	modal.style.display = 'none';
	e.target.reset();
});
