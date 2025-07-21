function initAgeGate(opts = {}) {
  const msg = opts.msg || 'This page contains adult content. Are you 18 years or older?';
  const redirect = opts.redirect || 'https://google.com';
  const content = document.getElementById('content');
  const show = () => { if (content) content.style.display = 'block'; };
  if (localStorage.getItem('ageVerified') === 'true') {
    show();
  } else {
    const confirmed = confirm(msg);
    if (confirmed) {
      localStorage.setItem('ageVerified', 'true');
      show();
    } else {
      window.location.href = redirect;
    }
  }
}

function clearAgeVerification() {
  localStorage.removeItem('ageVerified');
  alert('Age verification cleared. You will be asked again next time.');
  window.location.reload();
}
