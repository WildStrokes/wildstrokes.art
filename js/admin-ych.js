const PASSWORD = 'artadmin';

const loginDiv = document.getElementById('login');
const adminDiv = document.getElementById('admin');
const passInput = document.getElementById('admin-pass');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const addBtn = document.getElementById('add-btn');
const saveBtn = document.getElementById('save-btn');
const ychList = document.getElementById('ych-list');

let ychs = [];

function renderList() {
  ychList.innerHTML = '';
  ychs.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'ych-card';

    div.innerHTML = `
      <img data-idx="${idx}" src="${item.image}" style="max-width:100px;${item.image ? '' : 'display:none;'}"><br>
      <input type="file" class="img-file" data-idx="${idx}" accept="image/*"><br>
      <label>Image URL: <input data-idx="${idx}" data-field="image" value="${item.image}"></label><br>
      <label>Title: <input data-idx="${idx}" data-field="title" value="${item.title}"></label><br>
      <label>USD: <input type="number" data-idx="${idx}" data-field="usd" value="${item.usd}"></label><br>
      <label>Options (comma separated):<br><textarea data-idx="${idx}" data-field="options">${(item.options||[]).join(', ')}</textarea></label><br>
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
        ychs[idx].image = e.target.result;
        const textInput = ychList.querySelector(`input[data-idx="${idx}"][data-field="image"]`);
        if (textInput) textInput.value = e.target.result;
        const img = ychList.querySelector(`img[data-idx="${idx}"]`);
        if (img) { img.src = e.target.result; img.style.display = 'block'; }
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
    .then(data => { ychs = data; renderList(); })
    .catch(err => console.error('Failed to load ychs', err));
}

function saveData() {
  localStorage.setItem('ychAdmin', JSON.stringify(ychs));
  alert('Saved to localStorage. Updates will appear on the YCH page.');
}

loginBtn.addEventListener('click', () => {
  if (passInput.value === PASSWORD) {
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

saveBtn.addEventListener('click', () => {
  const inputs = document.querySelectorAll('[data-idx]');
  inputs.forEach(input => {
    const idx = input.dataset.idx;
    const field = input.dataset.field;
    if (field === 'options') {
      ychs[idx][field] = input.value.split(',').map(s => s.trim()).filter(s=>s);
    } else if (field === 'usd') {
      ychs[idx][field] = Number(input.value);
    } else {
      ychs[idx][field] = input.value;
    }
  });
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
  loginDiv.style.display = 'none';
  adminDiv.style.display = 'block';
  loadData();
}
