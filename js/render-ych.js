
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('ychs.json');
    const ychs = await res.json();
    const grid = document.querySelector('.ych-grid');
    if (!grid) return;
    ychs.forEach(item => {
      const fig = document.createElement('figure');
      fig.className = 'ych-card';

      const img = document.createElement('img');
      img.src = item.image;
      img.alt = `${item.title} YCH`;
      fig.appendChild(img);

      const cap = document.createElement('figcaption');

      const h2 = document.createElement('h2');
      h2.textContent = `${item.title} - $${item.usd}`;
      cap.appendChild(h2);

      const price = document.createElement('span');
      price.className = 'price';
      price.dataset.usd = Number(item.usd).toFixed(2);
      cap.appendChild(price);

      const ul = document.createElement('ul');
      ul.className = 'ych-options';
      (item.options || []).forEach(opt => {
        const li = document.createElement('li');
        li.textContent = opt;
        ul.appendChild(li);
      });
      cap.appendChild(ul);

      fig.appendChild(cap);
      grid.appendChild(fig);
    });
  } catch (err) {
    console.error('Failed to render YCHs:', err);
  }
});

