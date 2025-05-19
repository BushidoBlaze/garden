const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');
const plantRoutes = require('./routes/plantRoutes');
const fs = require('fs');

const app = express();
const port = config.port;

// Проверяем существование директории uploads
if (!fs.existsSync(config.uploadDir)) {
    console.log(`Создание директории для загрузки: ${config.uploadDir}`);
    fs.mkdirSync(config.uploadDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());

// Настройка статических путей
// Загруженные файлы должны быть доступны по URL без префикса
app.use(express.static(config.uploadDir));
// Файлы фронтенда
app.use(express.static(path.join(__dirname, '../frontend')));

// Отладочное логирование запросов
app.use((req, res, next) => {
    console.log(`${new Date().toLocaleTimeString()} [${req.method}] ${req.url}`);
    next();
});

// Routes
app.use('/api', plantRoutes);

// Корневой маршрут - возвращает главную страницу
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Проверка API ключа
if (!config.plantApiKey) {
    console.warn('ПРЕДУПРЕЖДЕНИЕ: API ключ для сервиса растений не настроен!');
    console.warn('Укажите PLANT_API_KEY в файле .env для полноценной работы API.');
}

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error('Ошибка сервера:', err.stack);
    res.status(500).json({
        error: 'Произошла внутренняя ошибка сервера',
        message: err.message
    });
});

app.listen(port, () => {
    console.log(`Сервер запущен и доступен по адресу: http://localhost:${port}`);
}); 