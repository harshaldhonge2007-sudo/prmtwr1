const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// Absolute Path Logic
const publicPath = path.resolve(__dirname, 'public');
console.log('Serving from:', publicPath);

app.use(express.static(publicPath));

app.post('/api/chat', (req, res) => {
  res.json({ reply: "I'm your assistant! Ask me anything about Indian elections." });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, () => console.log(`Server live on ${PORT}`));
