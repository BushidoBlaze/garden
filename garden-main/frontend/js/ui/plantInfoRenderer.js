/**
 * Класс для отображения информации о растении на странице
 */
class PlantInfoRenderer {
    /**
     * @param {string} containerSelector - CSS селектор контейнера для вставки информации
     */
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
    }

    /**
     * Отображает информацию о растении
     * @param {Object} plantInfo - Информация о растении
     */
    renderPlantInfo(plantInfo) {
        // Удаляем существующую информацию, если есть
        this.clearExistingInfo();

        // Создаем контейнер для информации о растении
        const plantInfoContainer = document.createElement('div');
        plantInfoContainer.className = 'plant-info';
        
        // Добавляем основную информацию
        plantInfoContainer.innerHTML = `
            <h2>${plantInfo.name}</h2>
            <p class="scientific-name">${plantInfo.scientificName}</p>
            ${plantInfo.probability ? 
                `<div class="probability-bar">
                    <div class="probability-fill" style="width: ${plantInfo.probability}%"></div>
                    <span class="probability-text">Уверенность: ${plantInfo.probability}%</span>
                </div>` : ''
            }
            ${plantInfo.additionalInfo ? 
                `<div class="plant-description">
                    <h3>Описание:</h3>
                    <p>${plantInfo.additionalInfo}</p>
                </div>` : ''
            }
            <div class="care-info">
                <h3>Рекомендации по уходу:</h3>
                <ul>
                    <li>🌧 Полив: ${plantInfo.care.watering}</li>
                    <li>☀️ Освещение: ${plantInfo.care.sunlight}</li>
                    <li>🌱 Почва: ${plantInfo.care.soil}</li>
                </ul>
            </div>
            <div class="plant-image">
                <img src="${plantInfo.imageUrl}" alt="${plantInfo.name}" />
            </div>
        `;

        // Вставляем после формы
        this.container.parentNode.insertBefore(plantInfoContainer, this.container.nextSibling);
    }

    /**
     * Очищает существующую информацию о растении
     */
    clearExistingInfo() {
        const existingInfo = document.querySelector('.plant-info');
        if (existingInfo) {
            existingInfo.remove();
        }
    }

    /**
     * Отображает уведомление о загрузке
     */
    showLoading() {
        this.clearExistingInfo();
        
        const loadingElement = document.createElement('div');
        loadingElement.className = 'plant-info loading';
        loadingElement.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Анализируем изображение...</p>
            <p class="loading-details">Это может занять до 20 секунд</p>
        `;
        
        this.container.parentNode.insertBefore(loadingElement, this.container.nextSibling);
    }

    /**
     * Отображает сообщение об ошибке
     * @param {string} errorMessage - Текст ошибки
     */
    showError(errorMessage) {
        this.clearExistingInfo();
        
        const errorElement = document.createElement('div');
        errorElement.className = 'plant-info error';
        errorElement.innerHTML = `
            <p class="error-message">⚠️ Ошибка: ${errorMessage}</p>
            <p>Пожалуйста, убедитесь, что на фотографии хорошо видно растение.</p>
            <ul class="error-help">
                <li>Фотография должна быть хорошего качества и с хорошим освещением</li>
                <li>Растение должно быть в фокусе и занимать большую часть изображения</li>
                <li>Лучше использовать фото листьев, цветов и общего вида растения</li>
            </ul>
        `;
        
        this.container.parentNode.insertBefore(errorElement, this.container.nextSibling);
    }
} 