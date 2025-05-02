(async () => {
  try {
    const geo = await fetch('https://ipapi.co/json/').then(res => res.json());
    const currency = geo.currency || 'USD';

    let fxRate = 1;

    if (currency !== 'USD') {
      const fxData = await fetch(`https://api.exchangerate.host/latest?base=USD&symbols=${currency}`)
        .then(res => res.json());

      fxRate = fxData.rates?.[currency] || 1;

      // Show debug info
      const debug = document.createElement('div');
      debug.style = "background: #ffeecc; padding: 10px; font-size: 14px; margin: 10px;";
      debug.innerText = `Currency: ${currency}, Rate: ${fxRate}`;
      document.body.prepend(debug);
    }

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
