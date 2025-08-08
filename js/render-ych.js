
const DATA_URL = "https://api.jsonbin.io/v3/b/YOUR_BIN_ID";
const DATA_API_KEY = "YOUR_API_KEY";

document.addEventListener('DOMContentLoaded', async () => {
  try {
    let ychs;
    try {
      const headers = { 'X-API-Key': DATA_API_KEY };
      const res = await fetch(DATA_URL, { headers });
      if (res.ok) {
        ychs = await res.json();
      }
    } catch (err) {
      console.error('Failed to fetch remote ychs', err);
    }

    if (!ychs) {
      const res = await fetch('ychs.json');
      ychs = await res.json();
    }
    const grid = document.querySelector('.ych-grid');
    if (!grid) return;
    ychs.forEach(item => {
      const fig = document.createElement('figure');
      fig.className = 'ych-card';

      const img = document.createElement('img');
      img.src = item.image;
      img.alt = `${item.title} YCH`;
      img.loading = 'lazy';
      img.addEventListener('click', () => openLightbox(img.src, img.alt));
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
