const express = require('express');
const router = express.Router();
const dashboardService = require('../services/dashboard.service');

// GET /dashboard
router.get('/', async (req, res) => {
    try {
        const data = await dashboardService.getDashboard(req.user);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
