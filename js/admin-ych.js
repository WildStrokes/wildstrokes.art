const PASSWORD_HASH = 'b2328a0f5a443e117ca152d1484913faec4df2200ec7ffc7e8939daab16a2455';

async function hashString(str) {
  const data = new TextEncoder().encode(str);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"]|'/g, s => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[s]);
}

const loginDiv = document.getElementById('login');
const adminDiv = document.getElementById('admin');
const passInput = document.getElementById('admin-pass');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const addBtn = document.getElementById('add-btn');
const saveBtn = document.getElementById('save-btn');
const ychList = document.getElementById('ych-list');

// Remote YCH JSON store
// Replace with your own endpoint and API key
const DATA_URL = "https://api.jsonbin.io/v3/b/YOUR_BIN_ID";
const DATA_API_KEY = "YOUR_API_KEY";
let ychs = [];



function renderList() {
  ychList.innerHTML = '';
  ychs.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'ych-card';

    div.innerHTML = `
      <img data-idx="${idx}" src="${escapeHtml(item.image)}" style="max-width:100px;${item.image ? '' : 'display:none;'}"><br>
      <label>Image URL: <input data-idx="${idx}" data-field="image" value="${escapeHtml(item.image)}"></label><br>
      <label>Title: <input data-idx="${idx}" data-field="title" value="${escapeHtml(item.title)}"></label><br>
      <label>USD: <input type="number" data-idx="${idx}" data-field="usd" value="${item.usd}"></label><br>
      <label>Options (comma separated):<br><textarea data-idx="${idx}" data-field="options">${escapeHtml((item.options||[]).join(', '))}</textarea></label><br>
      <button data-idx="${idx}" class="delete-btn">Delete</button>
    `;
    ychList.appendChild(div);
  });

  // update image preview when URL changes
  ychList.querySelectorAll('input[data-field="image"]').forEach(input => {
    input.addEventListener('input', evt => {
      const idx = evt.target.dataset.idx;
      const url = evt.target.value;
      const img = ychList.querySelector(`img[data-idx="${idx}"]`);
      if (img) {
        img.src = url;
        img.style.display = url ? 'block' : 'none';
      }
    });
  });
}

async function loadData() {
  try {
    const headers = { 'X-API-Key': DATA_API_KEY };
    const res = await fetch(DATA_URL, { headers });
    if (res.ok) {
      ychs = await res.json();
      ychs.forEach(item => delete item.undefined);
      renderList();
      return;
    }
  } catch (err) {
    console.error('Failed to load remote ychs', err);
  }

  fetch('ychs.json')
    .then(res => res.json())
    .then(data => {
      ychs = data;
      ychs.forEach(item => delete item.undefined);
      renderList();
    })
    .catch(err => console.error('Failed to load ychs', err));
}

async function saveData() {
  try {
    ychs.forEach(item => delete item.undefined);
    const json = JSON.stringify(ychs, null, 2);
    const headers = { 'Content-Type': 'application/json', 'X-API-Key': DATA_API_KEY };
    const res = await fetch(DATA_URL, { method: 'PUT', headers, body: json });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    alert('Saved to remote data store.');
  } catch (err) {
    console.error('Failed to save data', err);
    alert('Failed to save data.');
  }
}


loginBtn.addEventListener('click', async () => {
  const hash = await hashString(passInput.value);
  if (hash === PASSWORD_HASH) {
    localStorage.setItem('ychAdminAuthed', 'true');
    loginDiv.style.display = 'none';
    adminDiv.style.display = 'block';
    loadData();
  } else {
    alert('Incorrect password');
  }
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('ychAdminAuthed');
  location.reload();
});

addBtn.addEventListener('click', () => {
  ychs.push({image:'', title:'', usd:0, options:[]});
  renderList();
});

saveBtn.addEventListener("click", async () => {
  const inputs = document.querySelectorAll("[data-idx][data-field]");
  inputs.forEach(input => {
    const idx = input.dataset.idx;
    const field = input.dataset.field;
    if (field === "options") {
      ychs[idx][field] = input.value.split(",").map(s => s.trim()).filter(s => s);
    } else if (field === "usd") {
      ychs[idx][field] = Number(input.value);
    } else {
      ychs[idx][field] = input.value;
    }
  });

  const json = JSON.stringify(ychs, null, 2);
  console.log('Updated ychs.json:\n', json);
  await saveData();
  alert('Changes saved.');
  renderList();
});

document.addEventListener('click', evt => {
  if (evt.target.classList.contains('delete-btn')) {
    const idx = evt.target.dataset.idx;
    ychs.splice(idx,1);
    renderList();
  }
});

if (localStorage.getItem('ychAdminAuthed') === 'true') {
  loginDiv.style.display = 'none';
  adminDiv.style.display = 'block';
  loadData();
}
