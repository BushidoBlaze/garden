/**
 * Класс для управления загрузкой изображений
 */
class ImageUploader {
    /**
     * @param {string} uploadButtonSelector - CSS селектор кнопки загрузки
     * @param {string} imagePreviewSelector - CSS селектор изображения для предпросмотра
     * @param {function} onImageSelected - Колбэк, вызываемый при выборе изображения
     */
    constructor(uploadButtonSelector, imagePreviewSelector, onImageSelected) {
        this.uploadButton = document.querySelector(uploadButtonSelector);
        this.imagePreview = document.querySelector(imagePreviewSelector);
        this.onImageSelected = onImageSelected;
        this.selectedFile = null;
        
        // Создаем скрытое поле для выбора файла
        this.fileInput = document.createElement('input');
        this.fileInput.type = 'file';
        this.fileInput.accept = 'image/*';
        this.fileInput.style.display = 'none';
        document.body.appendChild(this.fileInput);
        
        this.init();
    }
    
    /**
     * Инициализирует обработчики событий
     */
    init() {
        // Обработчик клика по кнопке загрузки
        this.uploadButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.fileInput.click();
        });
        
        // Обработчик выбора файла
        this.fileInput.addEventListener('change', (e) => {
            this.handleFileSelection(e);
        });
        
        // Восстанавливаем изображение из sessionStorage при загрузке страницы
        this.restoreImageFromStorage();
    }
    
    /**
     * Обрабатывает выбор файла пользователем
     * @param {Event} event - Событие изменения состояния input[type="file"]
     */
    handleFileSelection(event) {
        this.selectedFile = event.target.files[0];
        
        if (this.selectedFile) {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                this.imagePreview.src = e.target.result;
                this.imagePreview.style.display = 'block';
                
                // Сохраняем в sessionStorage
                sessionStorage.setItem('uploadedImage', e.target.result);
                
                // Вызываем колбэк с выбранным файлом
                if (this.onImageSelected) {
                    this.onImageSelected(this.selectedFile);
                }
            };
            
            reader.readAsDataURL(this.selectedFile);
        }
    }
    
    /**
     * Восстанавливает изображение из sessionStorage
     */
    restoreImageFromStorage() {
        const savedImage = sessionStorage.getItem('uploadedImage');
        if (savedImage) {
            this.imagePreview.src = savedImage;
            this.imagePreview.style.display = 'block';
        }
    }
    
    /**
     * Возвращает текущий выбранный файл
     * @returns {File} Выбранный файл изображения
     */
    getSelectedFile() {
        return this.selectedFile;
    }
} 