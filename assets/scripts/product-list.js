import { products as mockProducts } from './mock-products.js';
import { db } from './firebase.js';
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const tableBody = document.querySelector('#productTable tbody');
const searchInput = document.getElementById('searchInput');
const entriesSelect = document.getElementById('entriesPerPage');
const pagination = document.getElementById('pagination');

let currentPage = 1;
let rowsPerPage = parseInt(entriesSelect.value);

// Separate arrays
let firebaseProducts = [];
let filteredProducts = [...mockProducts]; // Start with mock products

// Merge firebase + mock for rendering without overwriting mock permanently
function getMergedProducts() {
	return [...firebaseProducts, ...mockProducts];
}

// Render table
function renderTable() {
	const start = (currentPage - 1) * rowsPerPage;
	const end = start + rowsPerPage;

	// Always filter on merged array
	const query = searchInput.value.toLowerCase();
	const visibleProducts = getMergedProducts()
		.filter(p =>
			p.title.toLowerCase().includes(query) ||
			p.category.toLowerCase().includes(query)
		)
		.slice(start, end);

	tableBody.innerHTML = '';
	visibleProducts.forEach(p => {
		const row = document.createElement('tr');
		row.innerHTML = `
      <td class="product-cell"><img src="${p.images[0]}" alt="${p.title}"> </td><td><span>${p.title}</span></td>
      <td>${p.category}</td>
      <td>₹${p.price}</td>
      <td>${p.quantity}</td>
      <td class="table-actions">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </td>
    `;
		tableBody.appendChild(row);
	});

	renderPagination();
}

// Pagination
function renderPagination() {
	const query = searchInput.value.toLowerCase();
	const totalItems = getMergedProducts().filter(p =>
		p.title.toLowerCase().includes(query) ||
		p.category.toLowerCase().includes(query)
	).length;

	const pageCount = Math.ceil(totalItems / rowsPerPage);
	pagination.innerHTML = '';
	for (let i = 1; i <= pageCount; i++) {
		const btn = document.createElement('button');
		btn.textContent = i;
		btn.classList.toggle('active', i === currentPage);
		btn.addEventListener('click', () => {
			currentPage = i;
			renderTable();
		});
		pagination.appendChild(btn);
	}
}

// Entries change
entriesSelect.addEventListener('change', () => {
	rowsPerPage = parseInt(entriesSelect.value);
	currentPage = 1;
	renderTable();
});

// Search input
searchInput.addEventListener('input', () => {
	currentPage = 1;
	renderTable();
});

// Initial render
renderTable();

// Firebase listener
onSnapshot(collection(db, "products"), snapshot => {
	firebaseProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	currentPage = 1;
	renderTable();
}, err => console.error(err));
