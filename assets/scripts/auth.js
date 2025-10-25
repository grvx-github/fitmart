// assets/scripts/auth.js
import { auth, provider, db } from "/assets/scripts/firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const form = document.getElementById("signup-form");
const msg = document.getElementById("signup-msg");
const googleBtn = document.getElementById("google-signup");

// ✅ helper function to create user document
async function createUserDoc(user) {
  try {
    const userRef = doc(db, "users", user.uid);
    const existingDoc = await getDoc(userRef);

    // If user doc doesn't exist, create it
    if (!existingDoc.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName || "",
        email: user.email,
        createdAt: new Date().toISOString(),
        cart: [],
        wishlist: [],
      });
      console.log("✅ User document created in Firestore");
    } else {
      console.log("ℹ️ User document already exists");
    }
  } catch (err) {
    console.error("🔥 Error creating user doc:", err);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = form.email.value;
  const password = form.password.value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await createUserDoc(user); // ✅ create Firestore doc

    msg.textContent = "✅ Signup successful!";
    msg.style.color = "lime";
    setTimeout(() => (window.location.href = "login.html"), 1000);
  } catch (err) {
    msg.textContent = "❌ " + err.message;
    msg.style.color = "red";
  }
});

googleBtn.addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    await createUserDoc(user); // ✅ create Firestore doc

    msg.textContent = "✅ Google sign-in successful!";
    msg.style.color = "lime";
    setTimeout(() => (window.location.href = "index.html"), 1000);
  } catch (err) {
    msg.textContent = "❌ " + err.message;
    msg.style.color = "red";
  }
});
