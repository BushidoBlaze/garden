const axios = require('axios');
const config = require('../config/config');
const fs = require('fs');
const path = require('path');

// Используем предоставленный API ключ
const API_KEY = "8uHFK9i5c3Oi0kpFeZ88Sg5x27FS67tR9lrGU0uRlFl60smh6Z";

/**
 * Сервис для идентификации растений через API Plant.id
 */
class PlantService {
    /**
     * Определяет растение по изображению через Plant.id API
     * @param {string} imageUrl URL изображения
     * @returns {Promise<Object>} Информация о растении
     */
    async identifyPlant(imageUrl) {
        try {
            console.log(`[PlantService] Начало идентификации растения по URL: ${imageUrl}`);
            
            // Проверим наличие файла
            const filename = path.basename(imageUrl);
            const filepath = path.join(config.uploadDir, filename);
            
            if (!fs.existsSync(filepath)) {
                console.error(`[PlantService] Ошибка: Файл не найден - ${filepath}`);
                throw new Error('Файл изображения не найден на сервере');
            }
            
            console.log(`[PlantService] Файл найден: ${filepath}`);
            
            // Читаем файл в base64
            const imageData = fs.readFileSync(filepath);
            const base64Image = Buffer.from(imageData).toString('base64');
            
            // Настройка запроса к API Plant.id
            const identificationRequest = {
                api_key: API_KEY,
                images: [base64Image],
                modifiers: ["crops_fast", "similar_images"],
                plant_language: "ru",
                plant_details: ["common_names", "url", "wiki_description", "taxonomy", "synonyms", "watering", "sunlight"]
            };
            
            console.log('[PlantService] Отправка запроса к API Plant.id');
            
            // Запрос к API
            const response = await axios.post(
                'https://api.plant.id/v2/identify',
                identificationRequest
            );
            
            // Обработка ответа
            if (response.data && response.data.suggestions && response.data.suggestions.length > 0) {
                const suggestion = response.data.suggestions[0];
                console.log(`[PlantService] Растение идентифицировано как: ${suggestion.plant_name}`);
                
                // Формируем удобную структуру данных для фронтенда
                const plantInfo = {
                    name: suggestion.plant_name,
                    scientificName: suggestion.plant_details.scientific_name || suggestion.plant_name,
                    probability: Math.round(suggestion.probability * 100),
                    care: {
                        watering: suggestion.plant_details.watering?.text || "Информация о поливе отсутствует",
                        sunlight: suggestion.plant_details.sunlight?.join(', ') || "Информация об освещении отсутствует",
                        soil: "Рекомендуется подходящая для растения почвенная смесь"
                    },
                    imageUrl: imageUrl,
                    additionalInfo: suggestion.plant_details.wiki_description?.value || "Дополнительная информация отсутствует"
                };
                
                return plantInfo;
            } else {
                console.error('[PlantService] API не вернул результатов по изображению');
                throw new Error('Не удалось идентифицировать растение по изображению');
            }
            
        } catch (error) {
            console.error(`[PlantService] Ошибка при идентификации растения: ${error.message}`);
            
            // Если это ошибка от API
            if (error.response) {
                console.error(`[PlantService] API вернул ошибку: ${JSON.stringify(error.response.data)}`);
                throw new Error(`Ошибка API: ${error.response.status} - ${error.response.data.message || 'Неизвестная ошибка'}`);
            }
            
            throw new Error(`Не удалось определить растение: ${error.message}`);
        }
    }
}

module.exports = new PlantService(); 