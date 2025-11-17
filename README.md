# TabNews In Levels 

Tabnews In Levels utiliza a API do TabNews para traduzir as postagens em ingles com LLM em diferentes niveis de dificuldade, com o intuito de treinar o ingles. Com backend próprio, desenvolvido com React, Node.js, MongoDB, Redis e Docker. Este projeto implementa autenticação JWT, cache inteligente, e todas as funcionalidades essenciais da plataforma TabNews.

## Funcionalidades

### Frontend
- **Interface responsiva** com Material-UI
- **Autenticação completa** (registro, login, logout)
- **Criação de conteúdos** com editor markdown
- **Sistema de filtros** (estratégias: new, old, relevant)
- **Paginação** sem necessidade de contagem total
- **Renderização de markdown** para artigos
- **Proteção de rotas** com PrivateRoute
- **Estados de loading** com skeletons
- **Tema customizado** seguindo boas práticas de UX/UI

### Backend
- **API RESTful** compatível com TabNews
- **Autenticação JWT** com blacklist de tokens
- **Cache Redis** com TTL de 5 minutos
- **MongoDB** com índices otimizados
- **Rate limiting** e compressão gzip
- **Validação** com express-validator
- **Segurança** com helmet e CORS
- **Geração automática de slugs** a partir dos títulos

## 🛠 Tecnologias Utilizadas

### Frontend
- **React 19** - Biblioteca UI
- **Vite** - Build tool
- **React Router DOM** - Roteamento
- **Material-UI (MUI)** - Componentes
- **Axios** - Cliente HTTP
- **Context API** - Gerenciamento de estado

### Backend
- **Node.js + Express 5** - Servidor
- **MongoDB + Mongoose** - Database
- **Redis** - Cache e blacklist
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **express-validator** - Validação
- **helmet** - Segurança
- **compression** - Compressão gzip

### DevOps
- **Docker + Docker Compose** - Containerização
- **MongoDB** - Database em container
- **Redis** - Cache em container

## 📁 Arquitetura do Projeto

```
tabnews-in-levels/
├── backend/
│   ├── src/
│   │   ├── models/          # Schemas Mongoose
│   │   │   ├── User.js      # Modelo de usuário
│   │   │   └── Content.js   # Modelo de conteúdo
│   │   ├── routes/          # Rotas da API
│   │   │   ├── auth.js      # Autenticação
│   │   │   ├── contents.js  # Conteúdos
│   │   │   └── index.js     # Agregador
│   │   ├── config/          # Configurações
│   │   │   ├── database.js  # MongoDB
│   │   │   ├── redis.js     # Redis
│   │   │   └── security.js  # Middlewares
│   │   ├── seed.js          # Seed de usuários
│   │   └── app.js           # App principal
│   ├── Dockerfile
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── pages/           # Páginas
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── Article.jsx
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   └── CreateContent.jsx
│   │   │   ├── routing/         # Proteção de rotas
│   │   │   │   └── PrivateRoute.jsx
│   │   │   ├── ui/              # Componentes UI
│   │   │   ├── services/        # API Client
│   │   │   └── styles/          # Tema
│   │   ├── contexts/        # Contextos
│   │   │   ├── AuthContext.jsx
│   │   │   ├── NewsContext.jsx
│   │   │   └── MockContext.jsx
│   │   └── App.jsx
│   ├── Dockerfile
│   ├── package.json
│   └── .env
├── docker-compose.yml
└── README.md
```

## ⚙️ Instalação e Execução

### Pré-requisitos
- **Docker** e **Docker Compose**
- **Node.js 18+** (para desenvolvimento local sem Docker)

### 🐳 Execução com Docker (Recomendado)

1. **Clone o repositório**
```bash
git clone https://github.com/ryanmiura/tabnews-in-levels.git
cd tabnews-in-levels
```

2. **Configure as variáveis de ambiente**

**Backend** (`backend/.env`):
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/tabnews?authSource=admin
REDIS_URL=redis://:redis123@redis:6379
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:80
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=15
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:3000/api
```

3. **Inicie os containers**
```bash
docker-compose up -d
```

4. **Execute o seed de usuários (opcional)**
```bash
docker exec tabnews-backend node src/seed.js
```

Usuários criados:
- **user1** / senha123
- **admin** / admin123

5. **Acesse a aplicação**
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:3000/api](http://localhost:3000/api)
- Health Check: [http://localhost:3000/health](http://localhost:3000/health)

### 💻 Execução Local (Sem Docker)

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Nota:** Você precisará ter MongoDB e Redis rodando localmente e ajustar as URLs no `.env`.

### 🛑 Parar os containers
```bash
docker-compose down
```

### 📦 Scripts Disponíveis

**Backend:**
```bash
npm run dev      # Servidor de desenvolvimento
npm start        # Servidor de produção
```

**Frontend:**
```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Prévia do build
npm run lint     # Verificação de código
```

## 📖 Como Usar

### Navegação
- **Página Inicial (`/`)**: Lista todas as notícias
- **Login (`/login`)**: Autenticação de usuários
- **Registro (`/register`)**: Criar nova conta
- **Criar Conteúdo (`/create`)**: Publicar novo artigo (requer autenticação)
- **Artigo (`/contents/:user/:slug`)**: Visualização completa

### Fluxo Completo
1. **Registrar** uma nova conta em `/register`
2. **Fazer login** em `/login`
3. **Criar conteúdo** clicando em "Publicar" no header
4. **Visualizar** seus conteúdos na página inicial

### Sistema de Filtros
- **Estratégia**: 
  - `new` - Mais recentes primeiro
  - `old` - Mais antigos primeiro
  - `relevant` - Ordenado por tabcoins
- **Paginação**: 30 itens por página

## 🔌 API Endpoints

### Autenticação
```
POST   /api/auth/register      # Criar conta
POST   /api/auth/login         # Login
POST   /api/auth/logout        # Logout (invalida token)
GET    /api/auth/me            # Dados do usuário logado
```

### Conteúdos
```
GET    /api/contents                    # Listar conteúdos
GET    /api/contents/:username/:slug    # Buscar conteúdo específico
POST   /api/contents                    # Criar conteúdo (autenticado)
```

### Parâmetros de Query
```
?page=1              # Número da página
?per_page=30         # Itens por página (1-100)
?strategy=relevant   # Estratégia de ordenação
```

### Exemplo de Requisição
```bash
# Listar conteúdos
curl http://localhost:3000/api/contents?page=1&per_page=30&strategy=relevant

# Criar conteúdo (com autenticação)
curl -X POST http://localhost:3000/api/contents \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Meu Primeiro Post",
    "body": "# Olá Mundo\n\nEste é meu primeiro post!",
    "source_url": "https://exemplo.com"
  }'
```

## 🏗 Decisões Arquiteturais

### Backend
- **CommonJS**: Compatibilidade com Node.js e Docker
- **Middleware em camadas**: Segurança → Rate Limit → Rotas → Error Handler
- **Cache inteligente**: Redis com invalidação automática
- **Slug automático**: Gerado a partir do título com garantia de unicidade
- **JWT Blacklist**: Tokens invalidados armazenados no Redis
- **Pool de conexões**: MongoDB com min:2, max:10 conexões

### Frontend
- **Context API**: Gerenciamento de estado sem bibliotecas externas
- **PrivateRoute**: HOC para proteção de rotas autenticadas
- **Interceptores Axios**: Injeção automática de JWT
- **Lazy Loading**: Estados de loading granulares
- **Fallback gracioso**: Mock service quando API falha

### Segurança
- ✅ **Bcrypt** com 10 rounds para hash de senhas
- ✅ **JWT** com expiração configurável
- ✅ **Helmet** para headers de segurança
- ✅ **CORS** com whitelist de origens
- ✅ **Rate Limiting** de 100 req/15min
- ✅ **Sanitização** de inputs com express-validator
- ✅ **Validação** em frontend e backend

### Performance
- ✅ **Redis Cache** com TTL de 5 minutos
- ✅ **Índices MongoDB** em campos críticos
- ✅ **Compressão Gzip** em todas as respostas
- ✅ **Pool de conexões** otimizado
- ✅ **Paginação** eficiente com skip/limit

## 🧪 Testes Manuais

### Fluxo de Autenticação
```bash
# 1. Registrar
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"teste","email":"teste@email.com","password":"senha123"}'

# 2. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"teste","password":"senha123"}'

# 3. Usar token retornado para criar conteúdo
```

### Validação de Cache
```bash
# Primeira requisição (MISS)
time curl http://localhost:3000/api/contents?page=1&per_page=30

# Segunda requisição (HIT - mais rápida)
time curl http://localhost:3000/api/contents?page=1&per_page=30
```

## 👤 Autor

**Ryan Miura**
- GitHub: [@ryanmiura](https://github.com/ryanmiura)
- Projeto: [tabnews-in-levels](https://github.com/ryanmiura/tabnews-in-levels)

