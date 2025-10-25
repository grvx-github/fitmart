// assets/scripts/fetchProducts.js
import { db, collection, getDocs } from "./firebase.js";
import { products as mockProducts } from "./mock-products.js"; // import your mock products

export async function fetchProducts() {
	try {
		console.log('first')
		const productsCol = collection(db, "products");
		const snapshot = await getDocs(productsCol);

		const fetchedProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

		// Merge fetched products with mock products
		const allProducts = [...fetchedProducts, ...mockProducts];

		console.log("Fetched products from Firestore:", fetchedProducts);
		return allProducts;
	} catch (error) {
		console.error("Error fetching products:", error);
		// If fetch fails, fallback to mock products
		return [...mockProducts];
	}
}
