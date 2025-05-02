(async () => {
  try {
    const geo = await fetch('https://ipapi.co/json/').then(res => res.json());
    const currency = geo.currency || 'USD';

    let fxRate = 1;
    let debugMsg = '';

    if (currency !== 'USD') {
      const fxRes = await fetch(`https://api.exchangerate.host/latest?base=USD&symbols=${currency}`);
      const fxData = await fxRes.json();

      fxRate = fxData.rates?.[currency] || 1;
      debugMsg = `Currency: ${currency}\nRate: ${fxRate}\nFull API Response:\n${JSON.stringify(fxData, null, 2)}`;
    } else {
      debugMsg = `Currency: USD (no conversion needed)`;
    }

    const debug = document.createElement('pre');
    debug.style = "background: #ffeecc; padding: 10px; font-size: 13px; margin: 10px; white-space: pre-wrap;";
    debug.textContent = debugMsg;
    document.body.prepend(debug);

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
