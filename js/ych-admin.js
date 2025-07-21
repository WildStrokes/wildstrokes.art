(function() {
  document.addEventListener('DOMContentLoaded', async function() {
    const pw = prompt('Password:');
    if (pw !== 'change-me') {
      alert('Incorrect password');
      window.location.href = '../index.html';
      return;
    }

    const textarea = document.getElementById('ych-json');
    try {
      const res = await fetch('ychs.json?cache=' + Date.now());
      textarea.value = await res.text();
    } catch (err) {
      console.error(err);
      alert('Failed to load current YCHs');
    }

    document.getElementById('saveButton').addEventListener('click', async () => {
      const token = prompt('GitHub token:');
      if (!token) return;

      const repo = 'USERNAME/wildstrokes.art'; // TODO: update to your repo
      const path = 'ych/ychs.json';
      const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;
      try {
        const infoRes = await fetch(apiUrl, { headers: { Authorization: `token ${token}` } });
        const info = await infoRes.json();
        const body = {
          message: 'Update YCHs via admin page',
          content: btoa(unescape(encodeURIComponent(textarea.value)) ),
          sha: info.sha
        };
        const putRes = await fetch(apiUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `token ${token}` },
          body: JSON.stringify(body)
        });
        if (putRes.ok) {
          alert('Updated!');
        } else {
          const t = await putRes.text();
          alert('Failed: ' + t);
        }
      } catch (e) {
        console.error(e);
        alert('Error updating file');
      }
    });
  });
})();
