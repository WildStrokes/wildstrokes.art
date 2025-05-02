(async () => {
  try {
    // Get user's location and currency info
    const geo = await fetch('https://ipapi.co/json/').then(res => res.json());
    const currency = geo.currency || 'USD';

    // If user's currency is USD, no need to convert
    const fxRate = currency === 'USD'
      ? 1
      : await fetch(`https://api.exchangerate.host/convert?from=USD&to=${currency}`)
          .then(res => res.json())
          .then(data => data.result || 1);

    // Update all price elements
    document.querySelectorAll('.price').forEach(el => {
      const usd = parseFloat(el.dataset.usd);
      const converted = (usd * fxRate).toFixed(2);
      el.textContent = currency === 'USD'
        ? `$${converted} USD`
        : `${converted} ${currency}`;
    });
  } catch (err) {
    console.error('Currency conversion failed:', err);
    // Fallback: display USD if anything breaks
    document.querySelectorAll('.price').forEach(el => {
      const usd = parseFloat(el.dataset.usd);
      el.textContent = `$${usd.toFixed(2)} USD`;
    });
  }
})();
