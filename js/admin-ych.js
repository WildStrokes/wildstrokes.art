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

const imgbbApiKeyInput = document.getElementById("imgbb-api-key");
let ychs = [];
function loadImgbbConfig() {
  imgbbApiKeyInput.value = localStorage.getItem("imgbbApiKey") || "";
}

function saveImgbbConfig() {
  localStorage.setItem("imgbbApiKey", imgbbApiKeyInput.value);
}


function renderList() {
  ychList.innerHTML = '';
  ychs.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'ych-card';

    div.innerHTML = `
      <img data-idx="${idx}" src="${escapeHtml(item.image)}" style="max-width:100px;${item.image ? '' : 'display:none;'}"><br>
      <input type="file" class="img-file" data-idx="${idx}" accept="image/*"><br>
      <label>Image URL: <input data-idx="${idx}" data-field="image" value="${escapeHtml(item.image)}"></label><br>
      <label>Title: <input data-idx="${idx}" data-field="title" value="${escapeHtml(item.title)}"></label><br>
      <label>USD: <input type="number" data-idx="${idx}" data-field="usd" value="${item.usd}"></label><br>
      <label>Options (comma separated):<br><textarea data-idx="${idx}" data-field="options">${escapeHtml((item.options||[]).join(', '))}</textarea></label><br>
      <button data-idx="${idx}" class="delete-btn">Delete</button>
    `;
    ychList.appendChild(div);
  });

  // file upload listeners
  ychList.querySelectorAll('.img-file').forEach(input => {
    input.addEventListener('change', evt => {
      const file = evt.target.files[0];
      if (!file) return;
      const idx = evt.target.dataset.idx;
      const reader = new FileReader();
      reader.onload = e => {
        const imgObj = new Image();
        imgObj.onload = () => {
          const MAX = 800;
          let { width, height } = imgObj;
          if (width > MAX || height > MAX) {
            if (width > height) {
              height = height * (MAX / width);
              width = MAX;
            } else {
              width = width * (MAX / height);
              height = MAX;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(imgObj, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/png');
          ychs[idx].image = dataUrl;
          const textInput = ychList.querySelector(`input[data-idx="${idx}"][data-field="image"]`);
          if (textInput) textInput.value = dataUrl;
          const img = ychList.querySelector(`img[data-idx="${idx}"]`);
          if (img) { img.src = dataUrl; img.style.display = 'block'; }
        };
        imgObj.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  });
}

function loadData() {
  const stored = localStorage.getItem('ychAdmin');
  if (stored) {
    try { ychs = JSON.parse(stored); } catch(e) { ychs = []; }
    renderList();
    return;
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

function saveData() {
  try {
    ychs.forEach(item => delete item.undefined);
    localStorage.setItem('ychAdmin', JSON.stringify(ychs));
    alert('Saved to localStorage. Updates will appear on the YCH page.');
  } catch (err) {
    console.error('Failed to save data', err);
    alert('Failed to save. Local storage limit may have been exceeded.');
  }
}

async function uploadImage(dataUrl) {
  saveImgbbConfig();
  const apiKey = imgbbApiKeyInput.value.trim();
  const form = new FormData();
  form.append('image', dataUrl.split(',')[1]);
  const res = await fetch('https://api.imgbb.com/1/upload?key=' + apiKey, {
    method: 'POST',
    body: form
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const json = await res.json();
  return json.data.display_url;
}

loginBtn.addEventListener('click', async () => {
  const hash = await hashString(passInput.value);
  if (hash === PASSWORD_HASH) {
    localStorage.setItem('ychAdminAuthed', 'true');
    loginDiv.style.display = 'none';
    adminDiv.style.display = 'block';
    loadImgbbConfig();
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
      ychs[idx][field] = input.value.split(",").map(s => s.trim()).filter(s=>s);
    } else if (field === "usd") {
      ychs[idx][field] = Number(input.value);
    } else {
      ychs[idx][field] = input.value;
    }
  });
  try {
    for (let i = 0; i < ychs.length; i++) {
      const item = ychs[i];
      if (/^data:/.test(item.image)) {
        item.image = await uploadImage(item.image);
      }
    }
    const json = JSON.stringify(ychs, null, 2);
    console.log('Updated ychs.json:\n', json);
    alert('Images uploaded to ImgBB. Copy the JSON from the console and update ychs.json in your repo.');
  } catch (err) {
    console.error('Image upload failed', err);
    alert('Failed to upload images. Check console for details.');
  }
  saveData();
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
  loadImgbbConfig();
  loginDiv.style.display = 'none';
  adminDiv.style.display = 'block';
  loadData();
}
