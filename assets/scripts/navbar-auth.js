import { auth, provider } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

const navbar = document.getElementById('navbar'); // assuming this is your navbar ul

// Create user elements
const userContainer = document.createElement('li');
userContainer.id = 'user-nav';
userContainer.style.position = 'relative'; // for dropdown positioning

// Dropdown content
const dropdown = document.createElement('div');
dropdown.id = 'user-dropdown';
dropdown.style.position = 'absolute';
dropdown.style.top = '40px';
dropdown.style.right = '0';
dropdown.style.background = '#fff';
dropdown.style.border = '1px solid #ccc';
dropdown.style.borderRadius = '8px';
dropdown.style.display = 'none';
dropdown.style.minWidth = '150px';
dropdown.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
dropdown.innerHTML = `
  <a href="profile.html" style="display:block;padding:10px;">Profile</a>
  <a href="settings.html" style="display:block;padding:10px;">Settings</a>
  <a href="#" id="logout-btn" style="display:block;padding:10px;color:red;">Logout</a>
`;

// Append dropdown to user container
userContainer.appendChild(dropdown);
navbar.appendChild(userContainer);

// Toggle dropdown
userContainer.addEventListener('click', () => {
	dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
});

// Logout handler
userContainer.addEventListener('click', (e) => {
	if (e.target.id === 'logout-btn') {
		e.preventDefault();
		signOut(auth).then(() => location.reload());
	}
});

// Observe auth state
onAuthStateChanged(auth, (user) => {
	if (user) {
		// User is logged in
		userContainer.innerHTML = `
      <img src="${user.photoURL || 'assets/default-avatar.png'}" 
           alt="User" style="width:35px;height:35px;border-radius:50%;cursor:pointer;">
    `;
		userContainer.appendChild(dropdown); // append dropdown again
	} else {
		// Not logged in
		userContainer.innerHTML = `<button onclick="location.href='login.html'" class="btn">Login</button>`;
	}
});
