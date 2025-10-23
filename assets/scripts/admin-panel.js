
// Dropdown toggles
document.querySelectorAll('.dropdown').forEach(drop => {
	const btn = drop.querySelector('button');
	const menu = drop.querySelector('.dropdown-menu');
	btn.addEventListener('click', () => {
		menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
	});
	// Close dropdown on outside click
	document.addEventListener('click', (e) => {
		if (!drop.contains(e.target)) menu.style.display = 'none';
	});
});

// Dark mode toggle
const darkBtn = document.getElementById('darkModeToggle');
darkBtn.addEventListener('click', () => {
	document.body.classList.toggle('dark-mode');
});
