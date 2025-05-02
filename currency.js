(async () => {
  try {
    const geo = await fetch('https://ipapi.co/json/').then(res => res.json());
    const currency = geo.currency || 'USD';

    const fxData = await fetch(`https://open.er-api.com/v6/latest/USD`).then(res => res.json());
    const fxRate = fxData.rates?.[currency] || 1;

    document.querySelectorAll('.price').forEach(el => {
      const usd = parseFloat(el.dataset.usd);
      const converted = (usd * fxRate).toFixed(2);
      el.textContent = currency === 'USD'
        ? `$${converted} USD`
        : `${converted} ${currency}`;
    });
  } catch (err) {
    console.error('Currency conversion failed:', err);
    document.querySelectorAll('.price').forEach(el => {
      const usd = parseFloat(el.dataset.usd);
      el.textContent = `$${usd.toFixed(2)} USD`;
    });
  }
})();
