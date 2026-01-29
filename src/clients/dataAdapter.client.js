const axios = require('axios');
const config = require('../config/config');

const BASE_URL = config.DATA_ADAPTER_URL;

async function getSensorsByUser(userEmail) {
    const response = await axios.get(
        `${BASE_URL}/sensors`,
        { params: { userEmail } }
    );
    return response.data;
}

async function getSensorById(sensorId) {
    const response = await axios.get(
        `${BASE_URL}/sensors/${sensorId}`
    );
    return response.data;
}

async function userOwnsSensor(userEmail, sensorId) {
    const sensor = await getSensorById(sensorId);
    return sensor?.user_email === userEmail;
}

async function getMeasuresBySensor(sensorId) {
    const res = await axios.get(
        `${BASE_URL}/measures/sensor/${sensorId}`
    );
    return res.data;
}

module.exports = {
    getSensorsByUser,
    getSensorById,
    userOwnsSensor,
    getMeasuresBySensor
};
