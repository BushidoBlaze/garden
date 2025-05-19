/**
 * Сервис для работы с API идентификации растений
 */
class PlantService {
    constructor() {
        // Используем текущий хост вместо хардкода localhost
        this.apiUrl = `${window.location.protocol}//${window.location.host}/api`;
    }

    /**
     * Отправляет изображение на сервер для определения растения
     * @param {File} imageFile - Файл изображения для анализа
     * @returns {Promise<Object>} Информация о растении
     */
    async identifyPlant(imageFile) {
        try {
            console.log('Отправка изображения на сервер:', imageFile.name, imageFile.size, 'байт');
            
            const formData = new FormData();
            formData.append('image', imageFile);

            const response = await fetch(`${this.apiUrl}/identify-plant`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (!response.ok) {
                console.error('Сервер вернул ошибку:', data);
                throw new Error(data.error || data.details || `Ошибка сервера: ${response.status}`);
            }

            console.log('Данные о растении получены:', data);
            return data;
        } catch (error) {
            console.error('Ошибка при отправке изображения:', error);
            throw error;
        }
    }
} 