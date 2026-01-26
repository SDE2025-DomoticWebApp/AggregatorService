const axios = require('axios');
const config = require('../config/config');

async function getSensorsByUser(userEmail) {
    const response = await axios.get(
        `${config.DATA_ADAPTER_URL}/sensors`,
        { params: { userEmail } }
    );
    return response.data;
}

async function userOwnsSensor(userEmail, sensorId) {
    const res = await axios.get(
        `${BASE_URL}/sensors/${sensorId}/owner`,
        { params: { email: userEmail } }
    );
    return res.data.owns;
}

async function getMeasuresBySensor(sensorId) {
    const res = await axios.get(
        `${BASE_URL}/measures/${sensorId}`
    );
    return res.data;
}

module.exports = {
    getSensorsByUser,
    userOwnsSensor,
    getMeasuresBySensor
};
