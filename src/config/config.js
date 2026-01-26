module.exports = {
    PORT: process.env.PORT || 3004,
    JWT_SECRET: process.env.JWT_SECRET || 'dev-secret',
    DATA_ADAPTER_URL: process.env.DATA_ADAPTER_URL || 'http://localhost:3001'
};
