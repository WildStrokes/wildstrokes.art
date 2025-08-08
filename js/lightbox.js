// Simple image lightbox for YCH cards
// Creates a hidden overlay and exposes a global function to show it

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.id = 'lightbox';

  const img = document.createElement('img');
  overlay.appendChild(img);

  overlay.addEventListener('click', () => {
    overlay.style.display = 'none';
    img.src = '';
  });

  document.body.appendChild(overlay);

  // Expose helper for other scripts
  window.openLightbox = (src, alt = '') => {
    img.src = src;
    img.alt = alt;
    overlay.style.display = 'flex';
  };
});
