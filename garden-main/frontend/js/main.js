document.addEventListener('DOMContentLoaded', function() {
    // Создаем экземпляры классов
    const plantService = new PlantService();
    const plantInfoRenderer = new PlantInfoRenderer('.form__container');
    
    let selectedFile = null;
    
    // Инициализируем загрузчик изображений
    const imageUploader = new ImageUploader(
        '.form__upload-button', 
        '.form__uploaded-image',
        (file) => {
            selectedFile = file;
        }
    );
    
    // Обработчик отправки формы
    const form = document.querySelector('.form');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Проверяем, что файл выбран
        if (!selectedFile && !imageUploader.getSelectedFile()) {
            alert('Пожалуйста, выберите изображение');
            return;
        }
        
        const fileToSend = selectedFile || imageUploader.getSelectedFile();
        
        try {
            // Показываем уведомление о загрузке
            plantInfoRenderer.showLoading();
            
            // Отправляем изображение на сервер
            const plantInfo = await plantService.identifyPlant(fileToSend);
            
            // Отображаем информацию о растении
            plantInfoRenderer.renderPlantInfo(plantInfo);
        } catch (error) {
            console.error('Ошибка:', error);
            plantInfoRenderer.showError('Не удалось определить растение');
        }
    });
}); 