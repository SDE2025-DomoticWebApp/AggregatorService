const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.json());

// protected routes
const authMiddleware = require('./middleware/auth.middleware');
app.use(authMiddleware);

app.use('/dashboard', require('./routes/dashboard.routes'));

// health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Aggregator Service running on port ${PORT}`);
});
