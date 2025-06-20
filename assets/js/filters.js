// ===== SISTEMA DE FILTROS E BUSCA =====
class PetFiltersSystem {
    constructor() {
        this.allPets = [];
        this.filteredPets = [];
        this.currentFilters = {
            search: '',
            category: '',
            rarity: '',
            price: '',
            sort: 'featured'
        };
        this.itemsPerPage = 6;
        this.currentPage = 1;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadPets();
    }
    
    setupEventListeners() {
        // Busca
        const searchInput = document.getElementById('search-input');
        const clearSearch = document.getElementById('clear-search');
        
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce((e) => {
                this.updateFilter('search', e.target.value);
                this.toggleClearButton();
            }, 300));
        }
        
        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                searchInput.value = '';
                this.updateFilter('search', '');
                this.toggleClearButton();
            });
        }
        
        // Filtros
        const categoryFilter = document.getElementById('category-filter');
        const rarityFilter = document.getElementById('rarity-filter');
        const priceFilter = document.getElementById('price-filter');
        const sortFilter = document.getElementById('sort-filter');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.updateFilter('category', e.target.value);
            });
        }
        
        if (rarityFilter) {
            rarityFilter.addEventListener('change', (e) => {
                this.updateFilter('rarity', e.target.value);
            });
        }
        
        if (priceFilter) {
            priceFilter.addEventListener('change', (e) => {
                this.updateFilter('price', e.target.value);
            });
        }
        
        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.updateFilter('sort', e.target.value);
            });
        }
        
        // Limpar filtros
        const clearFilters = document.getElementById('clear-filters');
        if (clearFilters) {
            clearFilters.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }
        
        // Carregar mais
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMorePets();
            });
        }
    }
    
    async loadPets() {
        try {
            const response = await fetch('data/pets.json');
            this.allPets = await response.json();
            window.petsData = this.allPets; // Disponibilizar globalmente
            
            this.applyFilters();
            this.populateFilterOptions();
        } catch (error) {
            console.error('Erro ao carregar pets:', error);
            notifications.error('Erro ao carregar pets. Tente novamente.');
        }
    }
    
    populateFilterOptions() {
        // Popular select de pets no formulário de contato
        const petInterestSelect = document.getElementById('pet-interest');
        if (petInterestSelect) {
            // Limpar opções existentes (exceto as padrão)
            const defaultOptions = petInterestSelect.querySelectorAll('option[value=""], option[value="custom"]');
            petInterestSelect.innerHTML = '';
            defaultOptions.forEach(option => petInterestSelect.appendChild(option));
            
            // Adicionar pets
            this.allPets.forEach(pet => {
                const option = document.createElement('option');
                option.value = pet.name;
                option.textContent = `${pet.name} - ${Utils.formatPrice(pet.price)}`;
                petInterestSelect.appendChild(option);
            });
        }
    }
    
    updateFilter(filterType, value) {
        this.currentFilters[filterType] = value;
        this.currentPage = 1; // Reset para primeira página
        this.applyFilters();
    }
    
    applyFilters() {
        let filtered = [...this.allPets];
        
        // Aplicar busca
        if (this.currentFilters.search) {
            const searchTerm = this.currentFilters.search.toLowerCase();
            filtered = filtered.filter(pet => 
                pet.name.toLowerCase().includes(searchTerm) ||
                pet.description.toLowerCase().includes(searchTerm) ||
                pet.category.toLowerCase().includes(searchTerm) ||
                pet.abilities.some(ability => ability.toLowerCase().includes(searchTerm))
            );
        }
        
        // Aplicar filtro de categoria
        if (this.currentFilters.category) {
            filtered = filtered.filter(pet => pet.category === this.currentFilters.category);
        }
        
        // Aplicar filtro de raridade
        if (this.currentFilters.rarity) {
            filtered = filtered.filter(pet => pet.rarity === this.currentFilters.rarity);
        }
        
        // Aplicar filtro de preço
        if (this.currentFilters.price) {
            const [min, max] = this.currentFilters.price.split('-').map(p => p.replace('+', ''));
            filtered = filtered.filter(pet => {
                if (max) {
                    return pet.price >= parseInt(min) && pet.price <= parseInt(max);
                } else {
                    return pet.price >= parseInt(min);
                }
            });
        }
        
        // Aplicar ordenação
        this.sortPets(filtered);
        
        this.filteredPets = filtered;
        this.renderPets();
        this.updateResultsInfo();
    }
    
    sortPets(pets) {
        switch (this.currentFilters.sort) {
            case 'price-low':
                pets.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                pets.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                pets.sort((a, b) => b.rating - a.rating);
                break;
            case 'name':
                pets.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'featured':
            default:
                pets.sort((a, b) => {
                    // Primeiro por destaque, depois por rating
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return b.rating - a.rating;
                });
                break;
        }
    }
    
    renderPets() {
        const petsGrid = document.getElementById('pets-grid');
        if (!petsGrid) return;
        
        const startIndex = 0;
        const endIndex = this.currentPage * this.itemsPerPage;
        const petsToShow = this.filteredPets.slice(startIndex, endIndex);
        
        if (petsToShow.length === 0) {
            petsGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>Nenhum pet encontrado</h3>
                    <p>Tente ajustar os filtros ou fazer uma nova busca.</p>
                    <button class="btn btn-secondary" onclick="petFilters.clearAllFilters()">
                        <i class="fas fa-undo"></i>
                        Limpar Filtros
                    </button>
                </div>
            `;
        } else {
            petsGrid.innerHTML = petsToShow.map(pet => this.createPetCard(pet)).join('');
            
            // Atualizar botões de favorito
            setTimeout(() => {
                favorites.updateFavoriteButtons();
            }, 100);
        }
        
        this.updateLoadMoreButton();
    }
    
    createPetCard(pet) {
        const discount = Utils.calculateDiscount(pet.originalPrice, pet.price);
        const isInStock = pet.inStock;
        
        return `
            <div class="pet-card ${!isInStock ? 'out-of-stock' : ''}" onclick="openPetModal(${pet.id})">
                <div class="pet-card-image">
                    <img src="${pet.image}" alt="${pet.name}" loading="lazy">
                    
                    <div class="pet-card-badges">
                        ${pet.featured ? '<span class="pet-badge badge-featured">Destaque</span>' : ''}
                        ${discount > 0 ? `<span class="pet-badge badge-discount">-${discount}%</span>` : ''}
                        ${!isInStock ? '<span class="pet-badge badge-out-of-stock">Esgotado</span>' : ''}
                    </div>
                    
                    <div class="pet-card-actions">
                        <button class="action-btn" data-action="favorite" data-pet-id="${pet.id}" 
                                onclick="event.stopPropagation(); toggleFavorite(${pet.id})" 
                                title="Adicionar aos favoritos">
                            <i class="far fa-heart"></i>
                        </button>
                        ${isInStock ? `
                            <button class="action-btn" onclick="event.stopPropagation(); showContactModal(${pet.id})" 
                                    title="Entrar em contato">
                                <i class="fas fa-comments"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
                
                <div class="pet-card-content">
                    <div class="pet-card-header">
                        <h3 class="pet-name">${pet.name}</h3>
                        <span class="pet-rarity rarity-${pet.rarity.toLowerCase().replace('ário', 'ario')}">${pet.rarity}</span>
                    </div>
                    
                    <p class="pet-description">${Utils.truncateText(pet.description, 80)}</p>
                    
                    <div class="pet-rating">
                        <div class="stars">${Utils.generateStars(pet.rating)}</div>
                        <span class="rating-text">(${pet.reviews})</span>
                    </div>
                    
                    <div class="pet-price">
                        <span class="current-price">${Utils.formatPrice(pet.price)}</span>
                        ${pet.originalPrice > pet.price ? `<span class="original-price">${Utils.formatPrice(pet.originalPrice)}</span>` : ''}
                    </div>
                    
                    <div class="pet-card-footer">
                        ${isInStock ? `
                            <button class="btn btn-primary btn-add-cart" onclick="event.stopPropagation(); showContactModal(${pet.id})">
                                <i class="fas fa-comments"></i>
                                Entrar em contato
                            </button>
                        ` : `
                            <button class="btn btn-secondary" disabled>
                                <i class="fas fa-times"></i>
                                Esgotado
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `;
    }
    
    loadMorePets() {
        this.currentPage++;
        this.renderPets();
        
        // Scroll suave para os novos itens
        setTimeout(() => {
            const petsGrid = document.getElementById('pets-grid');
            const newItems = petsGrid.children;
            if (newItems.length > 0) {
                const lastVisibleIndex = (this.currentPage - 1) * this.itemsPerPage;
                if (newItems[lastVisibleIndex]) {
                    newItems[lastVisibleIndex].scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }
            }
        }, 100);
    }
    
    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (!loadMoreBtn) return;
        
        const totalShown = this.currentPage * this.itemsPerPage;
        const hasMore = totalShown < this.filteredPets.length;
        
        loadMoreBtn.style.display = hasMore ? 'inline-flex' : 'none';
        
        if (hasMore) {
            const remaining = this.filteredPets.length - totalShown;
            loadMoreBtn.innerHTML = `
                <i class="fas fa-plus"></i>
                Carregar Mais (${remaining} restantes)
            `;
        }
    }
    
    updateResultsInfo() {
        // Atualizar informações de resultados se houver um elemento para isso
        const resultsInfo = document.querySelector('.results-info');
        if (resultsInfo) {
            const total = this.filteredPets.length;
            const shown = Math.min(this.currentPage * this.itemsPerPage, total);
            
            resultsInfo.textContent = `Mostrando ${shown} de ${total} pets`;
        }
    }
    
    toggleClearButton() {
        const clearSearch = document.getElementById('clear-search');
        const searchInput = document.getElementById('search-input');
        
        if (clearSearch && searchInput) {
            clearSearch.classList.toggle('show', searchInput.value.length > 0);
        }
    }
    
    clearAllFilters() {
        // Limpar inputs
        const searchInput = document.getElementById('search-input');
        const categoryFilter = document.getElementById('category-filter');
        const rarityFilter = document.getElementById('rarity-filter');
        const priceFilter = document.getElementById('price-filter');
        const sortFilter = document.getElementById('sort-filter');
        
        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = '';
        if (rarityFilter) rarityFilter.value = '';
        if (priceFilter) priceFilter.value = '';
        if (sortFilter) sortFilter.value = 'featured';
        
        // Reset filtros
        this.currentFilters = {
            search: '',
            category: '',
            rarity: '',
            price: '',
            sort: 'featured'
        };
        
        this.currentPage = 1;
        this.applyFilters();
        this.toggleClearButton();
        
        notifications.info('Filtros limpos!');
    }
    
    // Método para filtrar por IDs específicos (usado pelos favoritos)
    filterByIds(petIds) {
        this.filteredPets = this.allPets.filter(pet => petIds.includes(pet.id));
        this.currentPage = 1;
        this.renderPets();
        this.updateResultsInfo();
    }
    
    // Método para filtrar por categoria (usado pelo footer)
    filterByCategory(category) {
        this.clearAllFilters();
        
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.value = category;
        }
        
        this.updateFilter('category', category);
        notifications.info(`Filtrando por: ${category}`);
    }
}

// Instanciar sistema de filtros
const petFilters = new PetFiltersSystem();

// Funções globais
window.petFilters = petFilters;
window.filterByCategory = (category) => petFilters.filterByCategory(category);

// Exportar para uso global
window.PetFiltersSystem = PetFiltersSystem;

