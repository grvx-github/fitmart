import { app } from "/assets/scripts/firebase.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const db = getFirestore(app);

const CLOUD_NAME = "dpiuvabci";
const UPLOAD_PRESET = "fitmart_unsigned";

// Elements
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const priceInput = document.getElementById("price");
const quantityInput = document.getElementById("quantity");
const descriptionInput = document.getElementById("description");
const addBtn = document.getElementById("addProductBtn");
const uploadBoxes = document.querySelectorAll(".upload-box");
const progressContainer = document.querySelector(".progress-container");
const progressBar = document.getElementById("progressBar");
const toast = document.getElementById("toast");

// Toast helper
function showToast(msg, type = "info") {
	toast.textContent = msg;
	toast.style.background = type === "error" ? "#d9534f" : type === "success" ? "#28a745" : "rgba(0,0,0,0.85)";
	toast.classList.add("show");
	setTimeout(() => toast.classList.remove("show"), 2500);
}

// Attributes logic
const attrName = document.getElementById("attrName");
const attrValue = document.getElementById("attrValue");
const addAttrBtn = document.getElementById("addAttrBtn");
const attrList = document.getElementById("attrList");
let attributes = [];

addAttrBtn.addEventListener("click", () => {
	const name = attrName.value.trim();
	const value = attrValue.value.trim();
	if (!name || !value) return showToast("Enter both name and value", "error");

	const attr = { name, value };
	attributes.push(attr);

	const tag = document.createElement("div");
	tag.classList.add("attr-tag");
	tag.innerHTML = `${name}: ${value} <span>✖</span>`;
	tag.querySelector("span").addEventListener("click", () => {
		tag.remove();
		attributes = attributes.filter(a => !(a.name === name && a.value === value));
	});
	attrList.appendChild(tag);

	attrName.value = "";
	attrValue.value = "";
});

// Upload preview
let selectedFiles = [];

uploadBoxes.forEach((box) => {
	const fileInput = box.querySelector("input");
	const imgPreview = box.querySelector(".preview");

	box.addEventListener("click", () => fileInput.click());

	fileInput.addEventListener("change", (e) => {
		const file = e.target.files[0];
		if (file) {
			selectedFiles.push(file);
			imgPreview.src = URL.createObjectURL(file);
			imgPreview.style.display = "block";
			box.querySelector(".upload-placeholder").style.display = "none";
		}
	});
});

addBtn.addEventListener("click", async () => {
	if (!titleInput.value || !categoryInput.value || !priceInput.value || !quantityInput.value || selectedFiles.length < 2) {
		showToast("Please fill all fields and upload at least 2 images", "error");
		return;
	}

	progressContainer.style.display = "block";

	try {
		let imageUrls = [];
		for (let i = 0; i < selectedFiles.length; i++) {
			const formData = new FormData();
			formData.append("file", selectedFiles[i]);
			formData.append("upload_preset", UPLOAD_PRESET);

			const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
				method: "POST",
				body: formData,
			});
			const data = await res.json();
			imageUrls.push(data.secure_url);
			progressBar.style.width = `${((i + 1) / selectedFiles.length) * 100}%`;
		}

		await addDoc(collection(db, "products"), {
			title: titleInput.value,
			category: categoryInput.value,
			price: parseFloat(priceInput.value),
			quantity: parseInt(quantityInput.value),
			description: descriptionInput.value,
			images: imageUrls,
			attributes,
			createdAt: serverTimestamp(),
		});

		showToast("✅ Product added successfully!", "success");
		setTimeout(() => location.reload(), 1500);
	} catch (err) {
		console.error(err);
		showToast("Upload failed. Try again.", "error");
		progressContainer.style.display = "none";
	}
});
