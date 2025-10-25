// Wishlist toggle
document.querySelectorAll('.wishlist-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation(); // prevent triggering parent hover actions
    btn.classList.toggle('active');

    const heartIcon = btn.querySelector('i');
    if (btn.classList.contains('active')) {
      heartIcon.classList.remove('fa-regular');
      heartIcon.classList.add('fa-solid');
    } else {
      heartIcon.classList.remove('fa-solid');
      heartIcon.classList.add('fa-regular');
    }
  });
});
