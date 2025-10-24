	// auth.js
	
	import { auth, provider } from "/assets/scripts/firebase.js"
		import {
			createUserWithEmailAndPassword,
			signInWithPopup,
		} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js"

		const form = document.getElementById("signup-form")
		const msg = document.getElementById("signup-msg")
		const googleBtn = document.getElementById("google-signup")

		form.addEventListener("submit", async (e) => {
			e.preventDefault()
			const email = form.email.value
			const password = form.password.value

			try {
				await createUserWithEmailAndPassword(auth, email, password)
				msg.textContent = "✅ Signup successful!"
				msg.style.color = "lime"
				setTimeout(() => (window.location.href = "login.html"), 1000)
			} catch (err) {
				msg.textContent = "❌ " + err.message
				msg.style.color = "red"
			}
		})

		googleBtn.addEventListener("click", async () => {
			try {
				await signInWithPopup(auth, provider)
				msg.textContent = "✅ Google sign-in successful!"
				msg.style.color = "lime"
				setTimeout(() => (window.location.href = "index.html"), 1000)
			} catch (err) {
				msg.textContent = "❌ " + err.message
				msg.style.color = "red"
			}
		})