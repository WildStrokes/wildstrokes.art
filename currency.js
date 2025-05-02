(async () => {
  const geo = await fetch('https://ipapi.co/json/').then(res => res.json());
  const country = geo.country_code || 'US';

  const currencyMap = {
    US: 'USD', CA: 'CAD', GB: 'GBP', EU: 'EUR', AU: 'AUD', JP: 'JPY'
    // Add more as needed
  };
  const currency = currencyMap[country] || 'USD';

  const fxRate = currency === 'USD' 
    ? 1 
    : await fetch(`https://api.exchangerate.host/convert?from=USD&to=${currency}`)
        .then(res => res.json())
        .then(data => data.result || 1);

  document.querySelectorAll('.price').forEach(el => {
    const usd = parseFloat(el.dataset.usd);
    const converted = (usd * fxRate).toFixed(2);
    el.textContent = currency === 'USD' 
      ? `$${converted} USD`
      : `${converted} ${currency}`;
  });
})();
