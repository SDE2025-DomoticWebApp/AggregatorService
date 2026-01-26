const dataAdapterClient = require('../clients/dataAdapter.client');

async function getDashboard(user) {
    // fetch sensors for this user
    const sensors = await dataAdapterClient.getSensorsByUser(user.email);

    return {
        user: {
            email: user.email,
            name: user.name,
            surname: user.surname
        },
        sensors
    };
}

module.exports = {
    getDashboard
};
