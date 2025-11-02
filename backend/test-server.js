// Minimal test server
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Minimal server running' });
});

app.listen(PORT, () => {
    console.log(`✅ Test server running on port ${PORT}`);
});

// Keep process alive
setInterval(() => {}, 1000);
