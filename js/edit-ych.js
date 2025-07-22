document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('ychs.json');
    const data = await res.json();
    renderEditor(data);

    const add = document.getElementById('addButton');
    if (add) add.addEventListener('click', () => addItem());
  } catch (err) {
    console.error('Failed to load YCH data', err);
  }
});

function createInput(labelText, value = '', type = 'text') {
  const wrapper = document.createElement('label');
  wrapper.textContent = labelText;
  const br = document.createElement('br');
  const input = document.createElement(type === 'textarea' ? 'textarea' : 'input');
  if (type !== 'textarea') input.type = type;
  input.value = value;
  input.className = 'ych-edit-input';
  wrapper.appendChild(br);
  wrapper.appendChild(input);
  return { wrapper, input };
}

function renderEditor(items) {
  const container = document.getElementById('ychContainer');
  if (!container) return;
  container.innerHTML = '';
  (items || []).forEach(item => addItem(item));
}

function addItem(item = { image: '', title: '', usd: '', options: [] }) {
  const container = document.getElementById('ychContainer');
  if (!container) return;

  const div = document.createElement('div');
  div.className = 'ych-edit-item';

  const img = createInput('Image', item.image);
  const title = createInput('Title', item.title);
  const price = createInput('USD', item.usd, 'number');
  price.input.step = '1';
  const opts = createInput('Options (one per line)', (item.options || []).join('\n'), 'textarea');

  const remove = document.createElement('button');
  remove.textContent = 'Remove';
  remove.className = 'button';
  remove.addEventListener('click', () => div.remove());

  div.append(img.wrapper, title.wrapper, price.wrapper, opts.wrapper, remove);
  container.appendChild(div);
}

function collectData() {
  const rows = document.querySelectorAll('.ych-edit-item');
  const data = [];
  rows.forEach(row => {
    const inputs = row.querySelectorAll('.ych-edit-input');
    if (inputs.length < 4) return;
    const [img, title, price, opts] = inputs;
    data.push({
      image: img.value.trim(),
      title: title.value.trim(),
      usd: Number(price.value),
      options: opts.value.split('\n').map(s => s.trim()).filter(Boolean)
    });
  });
  return data;
}

function downloadYCHs() {
  const items = collectData();
  const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ychs.json';
  a.click();
  URL.revokeObjectURL(url);
}

