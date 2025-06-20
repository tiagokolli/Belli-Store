// Variáveis globais
let isLoading = false;

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Remover loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }
    }, 100); // Alterado para 100ms para carregamento mais rápido

    // Configurar navegação
    setupNavigation();

    // Configurar formulários
    setupForms();

    // Configurar chat
    setupChat();

    // Configurar calculadora
    setupCalculator();

    // Configurar lazy loading
    Utils.setupLazyLoading();

    // Configurar scroll effects
    setupScrollEffects();

    // Configurar PWA
    setupPWA();

    console.log("🚀 Adopt Me Pets Shop carregado com sucesso!");
} // <<< ESTA CHAVE ESTAVA FALTANDO AQUI

// ===== NAVEGAÇÃO =====
function setupNavigation() {
    // Scroll spy para navegação
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Navbar scroll effect
    function updateNavbar() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', Utils.debounce(() => {
        updateActiveNav();
        updateNavbar();
    }, 10));

    // Mobile menu
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });

        // Fechar menu ao clicar em link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
}
        // ===== FORMULÁRIOS =====
function setupForms() {    // Formulário de contato
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const validator = new FormValidator(contactForm)
            .addRule('name', [
                { type: 'required', message: 'Nome é obrigatório' },
                { type: 'minLength', value: 2, message: 'Nome deve ter pelo menos 2 caracteres' }
            ])
            .addRule('roblox-user', [
                { type: 'required', message: 'Usuário do Roblox é obrigatório' },
                { type: 'minLength', value: 3, message: 'Usuário deve ter pelo menos 3 caracteres' }
            ])
            .addRule('message', [
                { type: 'required', message: 'Mensagem é obrigatória' },
                { type: 'minLength', value: 10, message: 'Mensagem deve ter pelo menos 10 caracteres' }
            ]);
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validator.validate()) {
                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData);
                
                // Simular envio
                notifications.info('Enviando mensagem...', 2000);
                
                setTimeout(() => {
                    notifications.success('Mensagem enviada com sucesso! Entraremos em contato em breve.');
                    contactForm.reset();
                    validator.clearAllErrors();
                }, 2000);
            } else {
                notifications.error('Por favor, corrija os erros no formulário.');
            }
        });
    }
    
    // Newsletter
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!Utils.isValidEmail(email)) {
                notifications.error('Por favor, insira um e-mail válido.');
                return;
            }
            
            // Simular cadastro
            notifications.info('Cadastrando...', 1500);
            
            setTimeout(() => {
                notifications.success('E-mail cadastrado com sucesso! Você receberá nossas novidades.');
                emailInput.value = '';
            }, 1500);
        });
    }
}

// ===== CHAT =====
function setupChat() {
    const chatWidget = document.getElementById('chat-widget');
    const chatMessages = document.getElementById('chat-messages');
    const chatInputField = document.getElementById('chat-input-field');
    
    if (!chatWidget) return;
    
    // Respostas automáticas do bot
    const botResponses = [
        'Olá! Como posso ajudar você hoje? 😊',
        'Estou aqui para esclarecer suas dúvidas sobre nossos pets!',
        'Você pode me perguntar sobre preços, disponibilidade ou qualquer coisa!',
        'Nossos pets são 100% seguros e entregues rapidamente!',
        'Tem alguma dúvida específica sobre algum pet?',
        'Posso ajudar você a escolher o pet perfeito!',
        'Todos os nossos pets vêm com garantia de qualidade!',
        'Aceito pagamento via PIX, cartão ou transferência!',
        'A entrega é feita em até 24 horas após a confirmação do pagamento!'
    ];
    
    // Input do chat
    if (chatInputField) {
        chatInputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    window.sendMessage = function() {
        const message = chatInputField.value.trim();
        if (!message) return;
        
        // Adicionar mensagem do usuário
        addChatMessage(message, 'user');
        chatInputField.value = '';
        
        // Simular digitação do bot
        setTimeout(() => {
            const response = botResponses[Math.floor(Math.random() * botResponses.length)];
            addChatMessage(response, 'bot');
        }, 1000 + Math.random() * 2000);
    };
    
    function addChatMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        
        const time = new Date().toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageElement.innerHTML = `
            <div class="message-content">${Utils.sanitizeHtml(message)}</div>
            <div class="message-time">${time}</div>
        `;
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Animar entrada
        setTimeout(() => messageElement.classList.add('show'), 10);
    }
}

function toggleChat() {
    const chatWidget = document.getElementById('chat-widget');
    const chatBody = document.getElementById('chat-body');
    
    if (chatWidget && chatBody) {
        const isOpen = chatBody.style.display === 'block';
        chatBody.style.display = isOpen ? 'none' : 'block';
        chatWidget.classList.toggle('open', !isOpen);
        
        if (!isOpen) {
            // Focar no input quando abrir
            const chatInput = document.getElementById('chat-input-field');
            if (chatInput) {
                setTimeout(() => chatInput.focus(), 100);
            }
        }
    }
}
// ===== EFEITOS DE SCROLL =====
function setupScrollEffects() {
    // Intersection Observer para animações
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animar contadores se existirem
                const counters = entry.target.querySelectorAll('[data-count]');
                counters.forEach(counter => {
                    const target = parseInt(counter.dataset.count);
                    Utils.animateCounter(counter, 0, target);
                });
            }
        });
    }, observerOptions);
    
    // Observar elementos animáveis
    const animatableElements = document.querySelectorAll('.feature, .pet-card, .stat, .contact-method');
    animatableElements.forEach(el => observer.observe(el));
}

// ===== PWA =====
function setupPWA() {
    // Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registrado com sucesso:', registration);
                })
                .catch(registrationError => {
                    console.log('Falha ao registrar SW:', registrationError);
                });
        });
    }
    
    // Install prompt
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Mostrar botão de instalação personalizado
        const installBtn = document.createElement('button');
        installBtn.className = 'install-btn btn btn-primary';
        installBtn.innerHTML = '<i class="fas fa-download"></i> Instalar App';
        installBtn.onclick = () => {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    notifications.success('App instalado com sucesso!');
                }
                deferredPrompt = null;
                installBtn.remove();
            });
        };
        
        // Adicionar ao hero
        const heroActions = document.querySelector('.hero-actions');
        if (heroActions) {
            heroActions.appendChild(installBtn);
        }
    });
}

// ===== FUNÇÕES UTILITÁRIAS GLOBAIS =====
window.showNotification = (message, type = 'info') => {
    notifications.show(message, type);
};

window.copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        notifications.success('Copiado para a área de transferência!');
    } catch (err) {
        notifications.error('Erro ao copiar texto.');
    }
};

window.shareContent = async (title, text, url) => {
    if (navigator.share) {
        try {
            await navigator.share({ title, text, url });
        } catch (err) {
            console.log('Erro ao compartilhar:', err);
        }
    } else {
        // Fallback para dispositivos sem Web Share API
        copyToClipboard(url);
        notifications.info('Link copiado! Compartilhe onde quiser.');
    }
};

// ===== TRATAMENTO DE ERROS GLOBAIS =====
window.addEventListener('error', (e) => {
    console.error('Erro global:', e.error);
    notifications.error('Ops! Algo deu errado. Tente recarregar a página.');
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise rejeitada:', e.reason);
    notifications.error('Erro de conexão. Verifique sua internet.');
});

// ===== PERFORMANCE =====
// Preload de recursos críticos
function preloadResources() {
    const criticalImages = [
        'assets/images/pets/neon-dragon.png',
        'assets/images/pets/bat-dragon.jpg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Executar preload
preloadResources();



// Função para exibir mensagem do WhatsApp
function showWhatsAppMessage() {
    notifications.info('Para adicionar ao carrinho, clique no símbolo do WhatsApp no canto inferior direito da tela.', 5000);
}

// Disponibilizar a função globalmente
window.showWhatsAppMessage = showWhatsAppMessage;
            

// ===== MODAL DE CONTATO =====
function showContactModal(petId = null) {
    // Criar o modal se não existir
    let modal = document.getElementById('contact-modal');
    if (!modal) {
        modal = createContactModal();
        document.body.appendChild(modal);
    }
    
    // Preencher informações do pet se fornecido
    if (petId && window.petsData) {
        const pet = window.petsData.find(p => p.id === petId);
        if (pet) {
            const petNameElement = modal.querySelector('#selected-pet-name');
            if (petNameElement) {
                petNameElement.textContent = pet.name;
            }
        }
    }
    
    // Mostrar modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Focar no botão do WhatsApp após um pequeno delay
    setTimeout(() => {
        const whatsappBtn = modal.querySelector('.whatsapp-btn');
        if (whatsappBtn) {
            whatsappBtn.focus();
        }
    }, 300);
}

function createContactModal() {
    const modal = document.createElement('div');
    modal.id = 'contact-modal';
    modal.className = 'modal-overlay';
    
    modal.innerHTML = `
        <div class="modal-content contact-modal">
            <div class="modal-header">
                <button class="modal-close" onclick="closeContactModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="modal-body">
                <div class="contact-message">
                    <div class="contact-icon">
                        💌
                    </div>
                    
                    <h3>Agradecemos pela sua solicitação de compra! ‹𝟹</h3>
                    <p class="subtitle">Vamos aos passos⇣:</p>
                    
                    <div class="contact-steps">
                        <div class="step">
                            <span class="step-number">1.</span>
                            <p>Clique no símbolo do WhatsApp abaixo. Esse número é o contato de um dos nossos administradores.</p>
                        </div>
                        
                        <div class="step">
                            <span class="step-number">2.</span>
                            <p>Assim que você adicionar o número, será enviada uma mensagem automática. Em breve, você receberá uma resposta.</p>
                        </div>
                        
                        <div class="step">
                            <span class="step-number">3.</span>
                            <p>Informe qual pet deseja (<span id="selected-pet-name">pet selecionado</span>) e siga as orientações do administrador.</p>
                        </div>
                    </div>
                    
                    <div class="whatsapp-contact">
                        <a href="https://wa.me/5521987366408?text=Olá! tenho interesse nos pets. Pode me ajudar?" 
                           target="_blank" 
                           class="whatsapp-btn">
                            <i class="fab fa-whatsapp"></i>
                            <span>Entrar em contato via WhatsApp</span>
                        </a>
                    </div>
                    
                    <p class="footer-message">
                        ᯓ★ Agradecemos pelo contato e esperamos te atender em breve ᶻ 𝗓 𐰁
                    </p>
                </div>
            </div>
        </div>
    `;
    
    // Fechar modal ao clicar fora
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeContactModal();
        }
    });
    
    return modal;
}

function closeContactModal() {
    const modal = document.getElementById('contact-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        
        // Remover modal após animação
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}

// Disponibilizar funções globalmente
window.showContactModal = showContactModal;
window.closeContactModal = closeContactModal;

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeContactModal();
    }
});

