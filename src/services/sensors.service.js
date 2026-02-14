const dataAdapter = require('../clients/dataAdapter.client');

async function getMeasuresForSensor(userEmail, sensorId) {
    // 1. verify ownership
    const ownsSensor = await dataAdapter.userOwnsSensor(userEmail, sensorId);

    if (!ownsSensor) {
        throw new Error('FORBIDDEN');
    }

    // 2. fetch measures
    return dataAdapter.getMeasuresBySensor(sensorId);
}

async function getMeasuresForSensorRange(userEmail, sensorId, from, to) {
    // 1. verify ownership
    const ownsSensor = await dataAdapter.userOwnsSensor(userEmail, sensorId);

    if (!ownsSensor) {
        throw new Error('FORBIDDEN');
    }

    // 2. fetch measures
    return dataAdapter.getMeasuresBySensorRange(sensorId, from, to);
}

module.exports = {
    getMeasuresForSensor,
    getMeasuresForSensorRange
};
