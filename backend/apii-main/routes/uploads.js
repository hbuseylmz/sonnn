const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// POST /media/upload { dataUri: "data:image/png;base64,..." }
router.post('/upload', (req, res) => {
  try {
    const { dataUri } = req.body || {};
    if (!dataUri || !dataUri.startsWith('data:')) {
      return res.status(400).json({ error: 'Geçersiz resim verisi' });
    }
    const match = /^data:(.+);base64,(.*)$/.exec(dataUri);
    if (!match) return res.status(400).json({ error: 'Geçersiz data URI' });
    const mime = match[1];
    const base64 = match[2];
    const ext = mime.split('/')[1] || 'png';
    const fileName = `event_${Date.now()}.${ext}`;
    const filePath = path.join(__dirname, '..', 'uploads', fileName);
    fs.writeFileSync(filePath, Buffer.from(base64, 'base64'));
    // Public URL path served by express static
    const publicPath = `/uploads/${fileName}`;
    res.json({ path: publicPath, url: publicPath });
  } catch (e) {
    console.error('Upload error:', e);
    res.status(500).json({ error: 'Yükleme başarısız' });
  }
});

module.exports = router;


