require('dotenv').config();
const path = require('path');

// Определяем абсолютный путь к директории uploads
const uploadDir = path.join(__dirname, '..', 'uploads');

module.exports = {
    port: process.env.PORT || 3000,
    plantApiKey: process.env.PLANT_API_KEY,
    uploadDir: uploadDir
}; 