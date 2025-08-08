document.addEventListener('DOMContentLoaded', () => {
  const placeholder = document.getElementById('nav-placeholder');
  if (!placeholder) return;
  fetch('/nav.html')
    .then(res => res.text())
    .then(html => {
      placeholder.innerHTML = html;
    });
});
