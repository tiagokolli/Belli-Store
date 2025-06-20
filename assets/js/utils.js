// ===== UTILITÁRIOS GERAIS =====
class Utils {
    // Formatar preço para moeda brasileira
    static formatPrice(price) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    }
    
    // Gerar ID único
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Debounce para otimizar performance
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Scroll suave para elemento
    static scrollToElement(elementId, offset = 70) {
        const element = document.getElementById(elementId);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    // Validar email
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Sanitizar string para HTML
    static sanitizeHtml(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }
    
    // Gerar estrelas para rating
    static generateStars(rating, maxStars = 5) {
        let starsHtml = '';
        for (let i = 1; i <= maxStars; i++) {
            if (i <= rating) {
                starsHtml += '<i class="fas fa-star star"></i>';
            } else if (i - 0.5 <= rating) {
                starsHtml += '<i class="fas fa-star-half-alt star"></i>';
            } else {
                starsHtml += '<i class="far fa-star star empty"></i>';
            }
        }
        return starsHtml;
    }
    
    // Calcular desconto percentual
    static calculateDiscount(originalPrice, currentPrice) {
        if (originalPrice <= currentPrice) return 0;
        return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    }
    
    // Truncar texto
    static truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }
    
    // Converter string para slug
    static slugify(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    }
    
    // Detectar dispositivo móvel
    static isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Animar contador
    static animateCounter(element, start, end, duration = 2000) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }
    
    // Lazy loading de imagens
    static setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// ===== SISTEMA DE NOTIFICAÇÕES =====
class NotificationSystem {
    constructor() {
        this.container = document.getElementById('notification-container');
        this.notifications = [];
    }
    
    show(message, type = 'info', duration = 5000) {
        const notification = this.createNotification(message, type, duration);
        this.container.appendChild(notification);
        this.notifications.push(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto remover
        if (duration > 0) {
            setTimeout(() => {
                this.remove(notification);
            }, duration);
        }
        
        return notification;
    }
    
    createNotification(message, type, duration) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="${icons[type] || icons.info}"></i>
                <span class="notification-message">${Utils.sanitizeHtml(message)}</span>
                <button class="notification-close" onclick="notifications.remove(this.closest('.notification'))">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            ${duration > 0 ? `<div class="notification-progress" style="animation-duration: ${duration}ms;"></div>` : ''}
        `;
        
        return notification;
    }
    
    remove(notification) {
        if (notification && notification.parentNode) {
            notification.classList.add('removing');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                const index = this.notifications.indexOf(notification);
                if (index > -1) {
                    this.notifications.splice(index, 1);
                }
            }, 300);
        }
    }
    
    clear() {
        this.notifications.forEach(notification => {
            this.remove(notification);
        });
    }
    
    success(message, duration = 5000) {
        return this.show(message, 'success', duration);
    }
    
    error(message, duration = 7000) {
        return this.show(message, 'error', duration);
    }
    
    warning(message, duration = 6000) {
        return this.show(message, 'warning', duration);
    }
    
    info(message, duration = 5000) {
        return this.show(message, 'info', duration);
    }
}

// ===== SISTEMA DE MODAIS =====
class ModalSystem {
    constructor() {
        this.activeModal = null;
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.close(this.activeModal);
            }
        });
        
        // Fechar modal clicando no backdrop
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal') && this.activeModal) {
                this.close(this.activeModal);
            }
        });
    }
    
    open(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.classList.add('modal-open');
            this.activeModal = modal;
            
            // Focar no primeiro elemento focável
            const focusableElement = modal.querySelector('input, button, select, textarea');
            if (focusableElement) {
                setTimeout(() => focusableElement.focus(), 100);
            }
        }
    }
    
    close(modal) {
        if (typeof modal === 'string') {
            modal = document.getElementById(modal);
        }
        
        if (modal) {
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
            this.activeModal = null;
        }
    }
    
    closeAll() {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => this.close(modal));
    }
}

// ===== SISTEMA DE ARMAZENAMENTO LOCAL =====
class StorageSystem {
    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
            return false;
        }
    }
    
    static get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Erro ao ler do localStorage:', error);
            return defaultValue;
        }
    }
    
    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Erro ao remover do localStorage:', error);
            return false;
        }
    }
    
    static clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Erro ao limpar localStorage:', error);
            return false;
        }
    }
    
    static exists(key) {
        return localStorage.getItem(key) !== null;
    }
}

// ===== SISTEMA DE TEMAS =====
class ThemeSystem {
    constructor() {
        this.currentTheme = StorageSystem.get('theme', 'light');
        this.init();
    }
    
    init() {
        this.applyTheme(this.currentTheme);
        this.setupToggleButton();
        this.detectSystemTheme();
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        StorageSystem.set('theme', theme);
        
        // Atualizar ícone do botão
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    }
    
    toggle() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        
        // Feedback visual
        notifications.info(`Tema ${newTheme === 'dark' ? 'escuro' : 'claro'} ativado!`, 2000);
    }
    
    setupToggleButton() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggle());
        }
    }
    
    detectSystemTheme() {
        // Detectar preferência do sistema se não houver tema salvo
        if (!StorageSystem.exists('theme')) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.applyTheme(prefersDark ? 'dark' : 'light');
        }
        
        // Escutar mudanças na preferência do sistema
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!StorageSystem.exists('theme')) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

// ===== SISTEMA DE ANIMAÇÕES =====
class AnimationSystem {
    static fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.min(progress / duration, 1);
            
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    static fadeOut(element, duration = 300) {
        let start = null;
        const initialOpacity = parseFloat(getComputedStyle(element).opacity);
        
        function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.max(initialOpacity - (progress / duration), 0);
            
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    static slideDown(element, duration = 300) {
        element.style.height = '0';
        element.style.overflow = 'hidden';
        element.style.display = 'block';
        
        const targetHeight = element.scrollHeight;
        let start = null;
        
        function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const height = Math.min((progress / duration) * targetHeight, targetHeight);
            
            element.style.height = height + 'px';
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.height = '';
                element.style.overflow = '';
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    static slideUp(element, duration = 300) {
        const initialHeight = element.offsetHeight;
        element.style.height = initialHeight + 'px';
        element.style.overflow = 'hidden';
        
        let start = null;
        
        function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const height = Math.max(initialHeight - (progress / duration) * initialHeight, 0);
            
            element.style.height = height + 'px';
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
                element.style.height = '';
                element.style.overflow = '';
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    static pulse(element, duration = 600) {
        element.style.transform = 'scale(1)';
        element.style.transition = `transform ${duration}ms ease-in-out`;
        
        setTimeout(() => {
            element.style.transform = 'scale(1.05)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
                setTimeout(() => {
                    element.style.transition = '';
                }, duration / 2);
            }, duration / 2);
        }, 10);
    }
    
    static shake(element, duration = 600) {
        element.style.animation = `shake ${duration}ms ease-in-out`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }
}

// ===== SISTEMA DE VALIDAÇÃO DE FORMULÁRIOS =====
class FormValidator {
    constructor(form) {
        this.form = form;
        this.rules = {};
        this.errors = {};
    }
    
    addRule(fieldName, validations) {
        this.rules[fieldName] = validations;
        return this;
    }
    
    validate() {
        this.errors = {};
        let isValid = true;
        
        for (const [fieldName, validations] of Object.entries(this.rules)) {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (!field) continue;
            
            const value = field.value.trim();
            
            for (const validation of validations) {
                if (!this.runValidation(value, validation)) {
                    this.errors[fieldName] = validation.message;
                    this.showFieldError(field, validation.message);
                    isValid = false;
                    break;
                } else {
                    this.clearFieldError(field);
                }
            }
        }
        
        return isValid;
    }
    
    runValidation(value, validation) {
        switch (validation.type) {
            case 'required':
                return value.length > 0;
            case 'email':
                return Utils.isValidEmail(value);
            case 'minLength':
                return value.length >= validation.value;
            case 'maxLength':
                return value.length <= validation.value;
            case 'pattern':
                return new RegExp(validation.value).test(value);
            case 'custom':
                return validation.validator(value);
            default:
                return true;
        }
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    clearAllErrors() {
        this.errors = {};
        const errorElements = this.form.querySelectorAll('.field-error');
        errorElements.forEach(el => el.remove());
        
        const errorFields = this.form.querySelectorAll('.error');
        errorFields.forEach(field => field.classList.remove('error'));
    }
}

// Instanciar sistemas globais
const notifications = new NotificationSystem();
const modals = new ModalSystem();
const theme = new ThemeSystem();

// Funções globais para compatibilidade
window.openModal = (modalId) => modals.open(modalId);
window.closeModal = (modalId) => modals.close(modalId);
window.scrollToSection = (sectionId) => Utils.scrollToElement(sectionId);

// Exportar para uso em outros arquivos
window.Utils = Utils;
window.NotificationSystem = NotificationSystem;
window.ModalSystem = ModalSystem;
window.StorageSystem = StorageSystem;
window.ThemeSystem = ThemeSystem;
window.AnimationSystem = AnimationSystem;
window.FormValidator = FormValidator;

