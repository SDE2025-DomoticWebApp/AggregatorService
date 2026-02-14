const express = require('express');
const router = express.Router();
const sensorsService = require('../services/sensors.service');

router.get('/:id/measures', async (req, res) => {
    try {
        const user = req.user;
        const sensorId = req.params.id;
        const { from, to } = req.query;

        const measures = from && to
            ? await sensorsService.getMeasuresForSensorRange(user.email, sensorId, from, to)
            : await sensorsService.getMeasuresForSensor(user.email, sensorId);

        res.json(measures);
    } catch (err) {
        if (err.message === 'FORBIDDEN') {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
