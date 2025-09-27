# TabNews Reader 📰

Um leitor de notícias moderno e responsivo para a API do TabNews, desenvolvido com React, Material-UI e Vite. Este projeto permite navegar, filtrar e ler os conteúdos mais recentes da plataforma TabNews de forma intuitiva e elegante.

## ✨ Funcionalidades

- 📱 **Interface responsiva** com Material-UI
- 🔍 **Sistema de filtros avançado** (estratégias: new, old, relevant)
- 📄 **Paginação inteligente** sem necessidade de contagem total
- 📝 **Renderização de markdown** para artigos completos
- 🔄 **Sistema de fallback** com mocks quando API indisponível
- 🌐 **Roteamento dinâmico** para navegação entre páginas
- ⚡ **Estados de loading** com skeletons elegantes
- 🚨 **Tratamento de erros** com mensagens amigáveis e retry
- 🎨 **Tema customizado** seguindo boas práticas de UX/UI

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 19** - Biblioteca para interfaces de usuário
- **Vite** - Build tool moderna e rápida
- **React Router DOM** - Roteamento SPA
- **Material-UI (MUI)** - Sistema de design e componentes

### Gerenciamento de Estado
- **useReducer + Context API** - Gerenciamento global de estado
- **Custom hooks** - Abstração da lógica de negócio

### Requisições HTTP
- **Axios** - Cliente HTTP com interceptors
- **Sistema de Mock** - Fallback para desenvolvimento

### Renderização de Conteúdo
- **React Markdown** - Renderização segura de markdown
- **CSS customizado** - Estilização dos elementos markdown

## 🏗️ Arquitetura do Projeto

```
src/
├── components/
│   ├── pages/           # Páginas principais
│   │   ├── Home.jsx     # Lista de notícias
│   │   └── Article.jsx  # Visualização de artigo
│   ├── ui/              # Componentes de interface
│   │   ├── NewsCard.jsx     # Card de notícia
│   │   ├── FiltersBar.jsx   # Barra de filtros
│   │   ├── PaginationMui.jsx # Controles de paginação
│   │   ├── Loading.jsx      # Estados de loading
│   │   └── ErrorAlert.jsx   # Alertas de erro
│   ├── services/        # Serviços e integrações
│   │   ├── apiClient.js     # Cliente HTTP
│   │   └── mockService.js   # Dados mock
│   └── styles/          # Estilos e tema
│       └── theme.js     # Tema MUI customizado
├── contexts/            # Contextos React
│   ├── NewsContext.jsx  # Estado global de notícias
│   └── MockContext.jsx  # Controle de mocks
└── App.jsx             # Componente raiz
```

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passos para execução local

1. **Clone o repositório**
```bash
git clone https://github.com/ryanmiura/tabnews-in-levels.git
cd tabnews-in-levels
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute em modo de desenvolvimento**
```bash
npm run dev
```

4. **Acesse a aplicação**
Abra [http://localhost:5173](http://localhost:5173) no seu navegador.

### Scripts disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Prévia do build de produção
npm run lint     # Verificação de código com ESLint
```

## 📖 Como Usar

### Navegação Principal
- **Página Inicial (`/`)**: Lista todas as notícias com filtros e paginação
- **Artigo (`/contents/:user/:slug`)**: Visualização completa do artigo

### Sistema de Filtros/Parametros
- **Estratégia**: `new` (mais recentes), `old` (mais antigos), `relevant` (relevantes)
- **Por página**: Número de itens por página (1-100)
- **Validação**: Campos obrigatórios com mensagens de erro claras

### Funcionalidades Especiais
- **Modo Mock**: Toggle para usar dados mock (desenvolvimento)
- **Retry automático**: Em caso de falhas na API
- **Loading inteligente**: Skeletons específicos para cada contexto

## 🔌 Integração com API

### TabNews API
O projeto consome a API oficial do TabNews:
- **Base URL**: `https://www.tabnews.com.br/api/v1`
- **Endpoints utilizados**:
  - `GET /contents` - Lista de conteúdos
  - `GET /contents/:user/:slug` - Conteúdo específico

### Sistema de Fallback
Em caso de problemas com a API (CORS, rate limiting), o sistema automaticamente:
1. Tenta a requisição real
2. Em falha, utiliza dados mock baseados em dados reais
3. Exibe banner informativo sobre o modo ativo

## � Deploy e Produção

### GitHub Pages (Configurado e Recomendado)

Este projeto está **totalmente configurado** para deploy automatizado no GitHub Pages:

#### **🔧 Configurações implementadas:**
- ✅ **HashRouter**: Compatibilidade total com GitHub Pages
- ✅ **Base path**: Configurado para `/tabnews-in-levels/`
- ✅ **GitHub Actions**: Workflow automatizado de CI/CD
- ✅ **Build otimizado**: Vite com assets organizados

#### **📋 Passos para ativar o deploy:**

1. **Ativar GitHub Pages no repositório:**
   ```
   GitHub → Settings → Pages → Source: "GitHub Actions"
   ```

2. **Push para main (deploy automático):**
   ```bash
   git add .
   git commit -m "feat: configure GitHub Pages deployment"
   git push origin main
   ```

3. **Acompanhar o deploy:**
   - Acesse a aba "Actions" no GitHub
   - O deploy será executado automaticamente
   - URL final: `https://ryanmiura.github.io/tabnews-in-levels/`

#### **🚀 Deploy manual (opcional):**
```bash
npm run deploy  # Usa gh-pages diretamente
```

#### **� Testar build local:**
```bash
npm run build    # Gera build de produção
npm run preview  # Testa build local em http://localhost:4173/tabnews-in-levels/
```

### **⚠️ Observações importantes:**
- **URLs com hash**: GitHub Pages usa HashRouter, então URLs ficam `#/` 
- **CORS**: API TabNews pode ter limitações, fallback automático para mocks
- **Performance**: Bundle grande (~654KB), otimização futura com code-splitting
- **Cache**: GitHub Pages tem cache agressivo, pode demorar alguns minutos para atualizações

### Outras Plataformas

#### Vercel (Alternativa)
Para usar Vercel, seria necessário voltar ao `BrowserRouter`:
```bash
# Instalar Vercel CLI (restaurar BrowserRouter antes)
npm i -g vercel
vercel
```

#### Netlify (Alternativa)
```bash
# Build + upload manual
npm run build
# Upload da pasta dist/ + configurar redirects
```

## 🎯 Decisões Arquiteturais

**Ryan Miura**
- GitHub: [@ryanmiura](https://github.com/ryanmiura)
- Projeto: [tabnews-in-levels](https://github.com/ryanmiura/tabnews-in-levels)

## 📄 Licença

Este projeto foi desenvolvido como material educacional e está disponível sob a licença MIT.

---
