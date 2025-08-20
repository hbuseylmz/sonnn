require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static uploaded files
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/events', require('./routes/events'));
app.use('/event-participants', require('./routes/participants'));
app.use('/club-members', require('./routes/clubMembers'));
app.use('/clubs', require('./routes/clubs'));
app.use('/profile', require('./routes/profile')); // "/" yerine "/profile" daha doğru olur
app.use('/media', require('./routes/uploads'));

// Root test endpoint
app.get('/', (req, res) => {
  res.send('🎉 Sosyal Kulüp API çalışıyor!');
});

// Server başlat
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Sunucu ${port} portunda çalışıyor...`);
});

