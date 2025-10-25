// assets/scripts/search.js
export function initSearchModal() {
	const searchBtn = document.getElementById('search-btn-nav');
	const searchModal = document.getElementById('search-modal');
	const overlay = document.getElementById('overlay');

	if (!searchBtn || !searchModal || !overlay) return;

	searchBtn.addEventListener('click', () => {
		searchModal.style.top = '0';
		overlay.style.display = 'block';
	});

	overlay.addEventListener('click', () => {
		searchModal.style.top = '-50%';
		overlay.style.display = 'none';
	});
}
