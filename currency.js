(async () => {
  try {
    const geo = await fetch('https://ipapi.co/json/').then(res => res.json());
    const currency = geo.currency || 'USD';

    const fxRes = await fetch(`https://api.exchangerate.host/convert?from=USD&to=${currency}`);
    const fxData = await fxRes.json();

    // Show debug info on screen for iPad users
    const debug = document.createElement('div');
    debug.style = "background: #ffeecc; padding: 10px; font-size: 14px; margin: 10px;";
    debug.innerText = `Currency: ${currency}, Rate: ${fxData.result}`;
    document.body.prepend(debug);

    const fxRate = (fxData && typeof fxData.result === 'number') ? fxData.result : 1;

    document.querySelectorAll('.price').forEach(el => {
      const usd = parseFloat(el.dataset.usd);
      const converted = (usd * fxRate).toFixed(2);
      el.textContent = currency === 'USD'
        ? `$${converted} USD`
        : `${converted} ${currency}`;
    });

  } catch (err) {
    const fallback = document.createElement('div');
    fallback.style = "background: #ffcccc; padding: 10px; font-size: 14px; margin: 10px;";
    fallback.innerText = "Currency detection failed. Showing USD.";
    document.body.prepend(fallback);

    document.querySelectorAll('.price').forEach(el => {
      const usd = parseFloat(el.dataset.usd);
      el.textContent = `$${usd.toFixed(2)} USD`;
    });
  }
})();
