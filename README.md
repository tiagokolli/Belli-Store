# 🌟 Adopt Me Pets Shop - Versão 2.0

Uma loja moderna e completa de pets do Adopt Me (Roblox) com design profissional e funcionalidades avançadas.

## 🚀 Funcionalidades Principais

### 🛒 Sistema de Compras
- **Carrinho de Compras** - Adicione, remova e gerencie pets
- **Sistema de Favoritos** - Marque seus pets preferidos
- **Calculadora de Preços** - Converta valores para moedas do jogo
- **Checkout Simulado** - Processo completo de compra

### 🔍 Busca e Filtros
- **Busca Inteligente** - Pesquise por nome, descrição ou habilidades
- **Filtros Avançados** - Por categoria, raridade, preço
- **Ordenação Múltipla** - Por destaque, preço, avaliação, nome
- **Resultados Dinâmicos** - Atualizações em tempo real

### 🎨 Design e UX
- **Tema Dark/Light** - Alternância entre temas com transições suaves
- **Design Responsivo** - Otimizado para desktop, tablet e mobile
- **Animações Modernas** - Transições e efeitos visuais
- **Interface Intuitiva** - Navegação fácil e clara

### 💬 Interação
- **Chat de Suporte** - Widget de chat com respostas automáticas
- **Sistema de Notificações** - Feedback visual para ações
- **Modais Interativos** - Detalhes dos pets, carrinho, calculadora
- **Formulários Inteligentes** - Validação em tempo real

### 📱 Recursos Técnicos
- **PWA Ready** - Instalável como aplicativo
- **Armazenamento Local** - Dados persistem entre sessões
- **Performance Otimizada** - Carregamento rápido e eficiente
- **SEO Friendly** - Meta tags e estrutura otimizada

## 📁 Estrutura do Projeto

```
site-melhorado/
├── index.html              # Página principal
├── assets/
│   ├── css/
│   │   ├── styles.css       # Estilos principais
│   │   └── themes.css       # Temas dark/light
│   ├── js/
│   │   ├── main.js          # JavaScript principal
│   │   ├── cart.js          # Sistema de carrinho
│   │   ├── filters.js       # Filtros e busca
│   │   └── utils.js         # Utilitários e sistemas
│   └── images/
│       └── pets/            # Imagens dos pets
└── data/
    └── pets.json            # Base de dados dos pets
```

## 🛠️ Como Usar

### Método 1: Servidor Local (Recomendado)
```bash
cd site-melhorado
python3 -m http.server 8080
# Acesse: http://localhost:8080
```

### Método 2: Arquivo Local
- Abra `index.html` diretamente no navegador
- Algumas funcionalidades podem ter limitações devido ao CORS

## 🎯 Funcionalidades Detalhadas

### Sistema de Carrinho
- Adicionar/remover pets
- Controle de quantidade
- Cálculo automático de totais e descontos
- Persistência entre sessões
- Processo de checkout simulado

### Sistema de Favoritos
- Marcar/desmarcar pets favoritos
- Visualização rápida dos favoritos
- Filtro por pets favoritos
- Persistência local

### Filtros e Busca
- Busca por texto livre
- Filtros por categoria (Dragões, Aquáticos, etc.)
- Filtros por raridade (Lendário, Raro, etc.)
- Filtros por faixa de preço
- Ordenação múltipla
- Limpeza rápida de filtros

### Temas
- Tema claro (padrão)
- Tema escuro
- Detecção automática da preferência do sistema
- Transições suaves entre temas
- Persistência da escolha

### Chat de Suporte
- Widget flutuante
- Respostas automáticas
- Interface amigável
- Histórico de mensagens

## 🎨 Paleta de Cores

### Tema Claro
- **Primária**: #6366f1 (Índigo)
- **Secundária**: #f59e0b (Âmbar)
- **Fundo**: #ffffff (Branco)
- **Texto**: #1e293b (Slate)

### Tema Escuro
- **Primária**: #6366f1 (Índigo)
- **Secundária**: #f59e0b (Âmbar)
- **Fundo**: #0f172a (Slate)
- **Texto**: #f8fafc (Branco)

## 📊 Pets Disponíveis

O site inclui 10 pets variados:

1. **Dragão Neon Antigo** - Lendário - R$ 150,00
2. **Dragão Morcego** - Lendário - R$ 300,00
3. **Dragão Arco-íris** - Lendário - R$ 120,00
4. **Dragão Sombrio** - Lendário - R$ 500,00 (Esgotado)
5. **Tartaruga** - Lendário - R$ 45,00
6. **Unicórnio** - Lendário - R$ 80,00
7. **Tartaruga Neon** - Lendário - R$ 180,00
8. **Gato de Fogo** - Raro - R$ 35,00
9. **Cão Voador** - Incomum - R$ 25,00
10. **Peixe Dourado** - Comum - R$ 15,00

## 🔧 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos modernos com Grid/Flexbox
- **JavaScript ES6+** - Funcionalidades interativas
- **Font Awesome** - Ícones
- **Google Fonts** - Tipografia (Poppins, Fredoka One)

## 📱 Responsividade

O site é totalmente responsivo com breakpoints:
- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: até 767px

## 🚀 Performance

- **Lazy Loading** - Imagens carregam sob demanda
- **Debounce** - Otimização de busca
- **Local Storage** - Cache de dados
- **Minificação** - Código otimizado
- **Preload** - Recursos críticos

## 🔒 Segurança

- **Sanitização** - Prevenção de XSS
- **Validação** - Dados de entrada
- **CORS** - Configuração adequada
- **CSP** - Content Security Policy ready

## 🎯 Melhorias Futuras

- Integração com API real de pagamentos
- Sistema de usuários e login
- Histórico de pedidos
- Avaliações e comentários
- Notificações push
- Modo offline (Service Worker)

## 📞 Suporte

Para dúvidas ou sugestões:
- **Discord**: AdoptMeShop#1234
- **Roblox**: @AdoptMePetsShop
- **Chat**: Widget no site

## 📄 Licença

Este projeto é uma demonstração educacional. Adopt Me é marca registrada da DreamCraft Entertainment.

---

**Desenvolvido com ❤️ para a comunidade Adopt Me!**

