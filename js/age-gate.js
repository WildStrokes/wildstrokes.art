function initAgeGate(opts = {}) {
  const msg = opts.msg || 'This page contains adult content. Are you 18 years or older?';
  const redirect = opts.redirect || 'https://google.com';
  const content = document.getElementById('content');
  if (content) {
    content.classList.add('age-locked');
  }
  const show = () => {
    if (!content) return;
    content.classList.remove('age-locked');
    content.style.removeProperty('display');
  };
  if (localStorage.getItem('ageVerified') === 'true') {
    show();
    return;
  }

  const overlay = document.createElement('div');
  overlay.className = 'age-gate-overlay';
  overlay.innerHTML = `
    <div class="age-gate-dialog">
      <p>${msg}</p>
      <button id="age-yes">Yes</button>
      <button id="age-no">No</button>
    </div>`;
  document.body.appendChild(overlay);

  document.getElementById('age-yes').addEventListener('click', () => {
    localStorage.setItem('ageVerified', 'true');
    overlay.remove();
    show();
  });

  document.getElementById('age-no').addEventListener('click', () => {
    window.location.href = redirect;
  });
}

function clearAgeVerification() {
  localStorage.removeItem('ageVerified');
  alert('Age verification cleared. You will be asked again next time.');
  window.location.reload();
}
