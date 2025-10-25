// cart.js
import { auth, db } from "/assets/scripts/firebase.js";
import {
	onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {
	doc,
	updateDoc,
	arrayUnion,
	arrayRemove,
	getDoc,
	collection,
	getDocs,
	query,
	where,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { products as mockProducts } from "/assets/scripts/mock-products.js";

// Add product to cart
export async function addToCart(productId) {
	const user = auth.currentUser;

	if (!user) {
		alert("Please login to add items to your cart.");
		window.location.href = "login.html";
		return;
	}

	try {
		const userRef = doc(db, "users", user.uid);
		await updateDoc(userRef, { cart: arrayUnion(productId) });
		alert("Item added to cart!");
		console.log(`✅ Added product ${productId} to ${user.email}'s cart.`);
	} catch (err) {
		console.error("❌ Failed to update cart:", err);
		alert("Error adding to cart. Check console for details.");
	}
}

// Load and display user cart
export async function loadUserCart() {
	onAuthStateChanged(auth, async (user) => {
		if (!user) {
			alert("Please log in to view your cart.");
			window.location.href = "login.html";
			return;
		}

		try {
			const userRef = doc(db, "users", user.uid);
			const userSnap = await getDoc(userRef);

			if (!userSnap.exists()) {
				console.warn("User document not found.");
				return;
			}

			const userData = userSnap.data();
			let cartIds = userData.cart || [];

			const tbody = document.querySelector("#cart tbody");
			tbody.innerHTML = "";

			if (cartIds.length === 0) {
				tbody.innerHTML =
					`<tr class='empty-cart'><td colspan="6" style="text-align:center;">Your cart is empty 🛒</td></tr>`;
				document.getElementById("subtotal-value").innerText = `Rs 0`;
				document.getElementById("total-value").innerText = `Rs 0`;
				return;
			}

			// Fetch Firestore products in cart
			const productsRef = collection(db, "products");
			let firestoreProducts = [];
			if (cartIds.length > 0) {
				const q = query(productsRef, where("__name__", "in", cartIds));
				const productsSnap = await getDocs(q);
				productsSnap.forEach(docSnap => {
					firestoreProducts.push({
						id: docSnap.id,
						title: docSnap.data().title,
						price: docSnap.data().price,
						img: docSnap.data().images[0] || "/assets/default-product.png",
						category: docSnap.data().category || "Fitness",
					});
				});
			}

			// Merge mockProducts + Firestore products
			const allProducts = [...mockProducts, ...firestoreProducts];

			// Filter only products in user's cart
			const cartProducts = allProducts.filter(p => cartIds.includes(p.id));
			console.log("Cart Products:", cartProducts);

			// Render cart
			let subtotal = 0;
			cartProducts.forEach((p) => {
				const price = parseFloat(p.price) || 0;
				subtotal += price;

				tbody.innerHTML += `
          <tr>
            <td><i class="fa-solid fa-trash remove-item" data-id="${p.id}"></i></td>
            <td><img src="${p.images ? p.images[0] : p.img}" alt="${p.title}" style="width:80px;height:80px;object-fit:cover"></td>
            <td>${p.title}</td>
            <td>Rs ${price}</td>
            <td>1</td>
            <td>Rs ${price}</td>
          </tr>`;
			});

			document.getElementById("subtotal-value").innerText = `Rs ${subtotal}`;
			document.getElementById("total-value").innerText = `Rs ${subtotal}`;

			// Attach remove-item click listeners
			tbody.querySelectorAll(".remove-item").forEach(btn => {
				btn.addEventListener("click", async () => {
					const productId = btn.dataset.id;
					try {
						// Remove from Firestore
						await updateDoc(userRef, { cart: arrayRemove(productId) });
						// Update local cartIds array and re-render
						cartIds = cartIds.filter(id => id !== productId);
						loadUserCart(); // re-render cart
					} catch (err) {
						console.error("❌ Failed to remove item:", err);
						alert("Failed to remove item from cart.");
					}
				});
			});

		} catch (err) {
			console.error("❌ Failed to load cart:", err);
		}
	});
}
