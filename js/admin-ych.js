const PASSWORD = 'artadmin';

const loginDiv = document.getElementById('login');
const adminDiv = document.getElementById('admin');
const passInput = document.getElementById('admin-pass');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const addBtn = document.getElementById('add-btn');
const saveBtn = document.getElementById('save-btn');
const ychList = document.getElementById('ych-list');

const ghOwnerInput = document.getElementById("gh-owner");
const ghRepoInput = document.getElementById("gh-repo");
const ghBranchInput = document.getElementById("gh-branch");
const ghTokenInput = document.getElementById("gh-token");
let ychs = [];
function loadGithubConfig() {
  ghOwnerInput.value = localStorage.getItem("ghOwner") || "";
  ghRepoInput.value = localStorage.getItem("ghRepo") || "";
  ghBranchInput.value = localStorage.getItem("ghBranch") || "main";
  ghTokenInput.value = localStorage.getItem("ghToken") || "";
}

function saveGithubConfig() {
  localStorage.setItem("ghOwner", ghOwnerInput.value);
  localStorage.setItem("ghRepo", ghRepoInput.value);
  localStorage.setItem("ghBranch", ghBranchInput.value);
  localStorage.setItem("ghToken", ghTokenInput.value);
}


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
    .then(data => { ychs = data; renderList(); })
    .catch(err => console.error('Failed to load ychs', err));
}

function saveData() {
  try {
    localStorage.setItem('ychAdmin', JSON.stringify(ychs));
    alert('Saved to localStorage. Updates will appear on the YCH page.');
  } catch (err) {
    console.error('Failed to save data', err);
    alert('Failed to save. Local storage limit may have been exceeded.');
  }

async function githubRequest(method, path, body) {
  const token = ghTokenInput.value.trim();
  const owner = ghOwnerInput.value.trim();
  const repo = ghRepoInput.value.trim();
  const headers = {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json'
  };
  if (body) headers['Content-Type'] = 'application/json';
  const url = `https://api.github.com/repos/${owner}/${repo}/${path}`;
  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

async function uploadFile(filePath, contentBase64, message) {
  saveGithubConfig();
  let sha;
  try {
    const existing = await githubRequest('GET', `contents/${filePath}?ref=${ghBranchInput.value}`);
    sha = existing.sha;
  } catch (_) {}
  const body = { message, content: contentBase64, branch: ghBranchInput.value };
  if (sha) body.sha = sha;
  const result = await githubRequest('PUT', `contents/${filePath}`, body);
  return result.content.path;
}

loginBtn.addEventListener('click', () => {
  if (passInput.value === PASSWORD) {
    localStorage.setItem('ychAdminAuthed', 'true');
    loginDiv.style.display = 'none';
    adminDiv.style.display = 'block';
    loadGithubConfig();
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
  const inputs = document.querySelectorAll("[data-idx]");
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
        const ext = item.image.includes("image/png") ? "png" : "jpg";
        const base64 = item.image.split(",")[1];
        const name = `ych-${Date.now()}-${i}.${ext}`;
        await uploadFile(`ych/${name}`, base64, `Add image ${name}`);
        item.image = `ych/${name}`;
      }
    }
    const json = JSON.stringify(ychs, null, 2);
    const b64 = btoa(unescape(encodeURIComponent(json)));
    await uploadFile("ych/ychs.json", b64, "Update ychs.json via admin");
    alert("Uploaded to GitHub");
  } catch (err) {
    console.error("GitHub upload failed", err);
    alert("Failed to upload to GitHub. Check console for details.");
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
  loadGithubConfig();
  loginDiv.style.display = 'none';
  adminDiv.style.display = 'block';
  loadData();
}
