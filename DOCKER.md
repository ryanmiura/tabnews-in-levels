# TabNews In Levels - Docker Setup

Este projeto usa Docker Compose para orquestrar os serviços de frontend, backend e banco de dados.

## 🐳 Serviços

- **Frontend (React + Vite)**: Porta 5173 → http://localhost:5173
- **Backend (Express)**: Porta 3000 → http://localhost:3000
- **MongoDB**: Porta 27017 → mongodb://localhost:27017

## 🚀 Como usar

### 1. Configurar variáveis de ambiente

**Backend:**
```bash
cd backend
cp .env.example .env
# Edite .env se necessário
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
# Edite .env se necessário
```

### 2. Iniciar todos os serviços

```bash
docker-compose up
```

Ou em modo detached (background):
```bash
docker-compose up -d
```

### 3. Parar os serviços

```bash
docker-compose down
```

Para remover também os volumes (dados do banco):
```bash
docker-compose down -v
```

## 📦 Comandos úteis

### Ver logs
```bash
docker-compose logs -f          # Todos os serviços
docker-compose logs -f backend  # Apenas backend
docker-compose logs -f frontend # Apenas frontend
docker-compose logs -f mongodb  # Apenas MongoDB
```

### Reconstruir as imagens
```bash
docker-compose build
docker-compose up --build
```

### Executar comandos dentro dos containers
```bash
docker-compose exec backend sh     # Acessar shell do backend
docker-compose exec mongodb mongosh # Acessar MongoDB shell
```

### Instalar nova dependência no backend
```bash
docker-compose exec backend npm install <package-name>
```

## 🗄️ MongoDB

### Credenciais padrão:
- **Usuário**: admin
- **Senha**: admin123
- **Database**: tabnews

### Conectar ao MongoDB externamente:
```bash
mongosh "mongodb://admin:admin123@localhost:27017/tabnews?authSource=admin"
```

## 🔧 Estrutura dos volumes

Os volumes persistentes garantem que os dados não sejam perdidos:
- `mongodb_data`: Dados do MongoDB
- `mongodb_config`: Configurações do MongoDB
- `backend_node_modules`: node_modules do backend (evita reinstalar)

## 🌐 Rede

Todos os serviços estão na mesma rede Docker (`tabnews-network`), permitindo comunicação entre eles usando os nomes dos serviços como hostname.

## 📝 Notas importantes

1. **Hot Reload**: O backend tem volume mapeado para `/app/src`, então mudanças no código recarregam automaticamente (graças ao nodemon)
2. **Frontend em produção**: O Dockerfile do frontend usa multi-stage build com Nginx para servir arquivos estáticos otimizados
3. **Desenvolvimento local**: Você pode continuar desenvolvendo localmente sem Docker, basta ajustar as variáveis de ambiente
