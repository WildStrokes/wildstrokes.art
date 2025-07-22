const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_PATH = path.join(__dirname, 'ych', 'ychs.json');
const ADMIN_HASH = process.env.ADMIN_HASH || 'b2328a0f5a443e117ca152d1484913faec4df2200ec7ffc7e8939daab16a2455';

app.use(express.json());
app.use(express.static(__dirname));

app.get('/api/ychs', (req, res) => {
  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read data' });
    try {
      const json = JSON.parse(data);
      res.json(json);
    } catch (e) {
      res.status(500).json({ error: 'Invalid JSON' });
    }
  });
});

app.put('/api/ychs', (req, res) => {
  const hash = req.headers['x-admin-hash'] || '';
  if (hash !== ADMIN_HASH) return res.status(401).json({ error: 'Unauthorized' });
  const json = req.body;
  fs.writeFile(DATA_PATH, JSON.stringify(json, null, 2), err => {
    if (err) return res.status(500).json({ error: 'Failed to save data' });
    res.json({ status: 'ok' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
