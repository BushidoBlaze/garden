const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const plantService = require('../services/plantService');
const config = require('../config/config');
const fs = require('fs');

// Убедимся, что папка uploads существует
const uploadsDir = path.resolve(config.uploadDir);
if (!fs.existsSync(uploadsDir)) {
    console.log(`Создание директории для загрузки: ${uploadsDir}`);
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(`Сохранение файла в: ${uploadsDir}`);
        cb(null, config.uploadDir);
    },
    filename: function (req, file, cb) {
        const filename = Date.now() + path.extname(file.originalname);
        console.log(`Сохранение файла с именем: ${filename}`);
        cb(null, filename);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        console.log(`Проверка типа файла: ${file.mimetype}, расширение: ${path.extname(file.originalname)}`);

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Разрешены только форматы .png, .jpg и .jpeg'));
    }
});

// Маршрут для идентификации растения
router.post('/identify-plant', upload.single('image'), async (req, res) => {
    try {
        console.log('Получен запрос на идентификацию растения');
        
        if (!req.file) {
            console.error('Ошибка: Файл не получен');
            return res.status(400).json({ error: 'Изображение не загружено' });
        }

        console.log(`Файл успешно загружен: ${req.file.path}`);
        const imageUrl = `${req.protocol}://${req.get('host')}/${req.file.filename}`;
        console.log(`URL изображения: ${imageUrl}`);
        
        // Вызываем сервис идентификации растения
        console.log('Вызов сервиса идентификации растения');
        const plantInfo = await plantService.identifyPlant(imageUrl);
        console.log('Ответ от сервиса получен:', JSON.stringify(plantInfo).substring(0, 100) + '...');
        
        res.json(plantInfo);
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        res.status(500).json({ error: 'Не удалось обработать изображение', details: error.message });
    }
});

module.exports = router; 