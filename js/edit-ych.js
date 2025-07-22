document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('ychs.json');
    const data = await res.json();
    const textarea = document.getElementById('ychEditor');
    if (textarea) {
      textarea.value = JSON.stringify(data, null, 2);
    }
  } catch (err) {
    console.error('Failed to load YCH data', err);
  }
});

function downloadYCHs() {
  const textarea = document.getElementById('ychEditor');
  if (!textarea) return;
  const blob = new Blob([textarea.value], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ychs.json';
  a.click();
  URL.revokeObjectURL(url);
}
