const dotenv = require('dotenv');
const connectDatabase = require('./config/database');
const User = require('./models/User');
const Content = require('./models/Content');

// Carrega variáveis de ambiente
dotenv.config();

/**
 * Script de seed para popular o banco de dados com dados de teste
 * 
 * Uso: npm run seed
 */

const seedUsers = [
  {
    username: 'user1',
    email: 'user1@example.com',
    password: 'senha123'
  },
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123'
  },
  {
    username: 'developer',
    email: 'dev@example.com',
    password: 'dev123'
  }
];

const seedContents = [
  {
    title: 'Bem-vindo ao TabNews',
    body: `# Bem-vindo ao TabNews!

Este é um exemplo de conteúdo criado automaticamente pelo script de seed.

## O que é o TabNews In Levels?

TabNews é uma plataforma de compartilhamento de conteúdo técnico, onde desenvolvedores podem:

- Publicar artigos e tutoriais
- Compartilhar conhecimento
- Interagir com a comunidade

## Recursos

- Sistema de autenticação JWT
- Cache Redis para performance
- API RESTful completa
- Markdown support

**Aproveite a plataforma!**`,
    status: 'published',
    source_url: 'https://www.tabnews.com.br'
  },
  {
    title: 'Como começar com Node.js',
    body: `# Guia Rápido de Node.js

Node.js é uma plataforma JavaScript para desenvolvimento backend.

## Instalação

\`\`\`bash
# Instalar Node.js
nvm install --lts

# Verificar instalação
node --version
npm --version
\`\`\`

## Primeiro Projeto

\`\`\`javascript
// server.js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
\`\`\`

## Próximos Passos

- Aprender sobre Express.js
- Estudar MongoDB
- Implementar autenticação
- Criar APIs RESTful`,
    status: 'published'
  },
  {
    title: 'Redis: Cache de Alta Performance',
    body: `# Redis para Cache

Redis é um banco de dados em memória usado para cache e filas.

## Por que usar Redis?

- **Performance**: Operações em memória são extremamente rápidas
- **Simplicidade**: API simples e intuitiva
- **Versatilidade**: Cache, pub/sub, filas, etc.

## Exemplo de Uso

\`\`\`javascript
const redis = require('redis');
const client = redis.createClient();

// Set cache
await client.set('key', 'value', {
  EX: 300 // Expira em 5 minutos
});

// Get cache
const value = await client.get('key');
\`\`\`

## Estratégias de Cache

1. **Cache Aside**: Aplicação gerencia o cache
2. **Write Through**: Cache é atualizado junto com DB
3. **Write Behind**: Cache é atualizado de forma assíncrona

## TTL (Time To Live)

Sempre defina TTL para evitar dados obsoletos!`,
    status: 'published'
  },
  {
    title: 'MongoDB: Banco NoSQL para Aplicações Modernas',
    body: `# MongoDB Basics

MongoDB é um banco de dados NoSQL orientado a documentos.

## Vantagens

- Schema flexível
- Alta performance
- Escalabilidade horizontal
- Queries poderosas

## Modelagem de Dados

\`\`\`javascript
// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });
\`\`\`

## Índices

Índices melhoram drasticamente a performance de queries:

\`\`\`javascript
// Criar índice único
schema.index({ username: 1 }, { unique: true });

// Índice composto
schema.index({ status: 1, created_at: -1 });
\`\`\`

## Aggregation Pipeline

Pipeline de agregação para queries complexas e analytics.`,
    status: 'published'
  },
  {
    title: 'Segurança em APIs REST',
    body: `# Práticas de Segurança para APIs

## 1. Autenticação JWT

\`\`\`javascript
const token = jwt.sign(
  { id: user._id, username: user.username },
  JWT_SECRET,
  { expiresIn: '7d' }
);
\`\`\`

## 2. Rate Limiting

Proteja contra força bruta:

\`\`\`javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo de requisições
});
\`\`\`

## 3. Sanitização de Inputs

Sempre sanitize inputs do usuário para prevenir:
- XSS (Cross-Site Scripting)
- SQL Injection
- NoSQL Injection

## 4. Helmet

Use Helmet para headers de segurança HTTP.

## 5. CORS

Configure CORS corretamente para permitir apenas origens confiáveis.`,
    status: 'published'
  }
];

async function seed() {
  try {
    console.log('========================================');
    console.log('Iniciando seed do banco de dados...');
    console.log('========================================\n');

    // Conecta ao MongoDB
    console.log('[1/5] Conectando ao MongoDB...');
    await connectDatabase();
    console.log('      MongoDB conectado com sucesso\n');

    // Limpa dados existentes
    console.log('[2/5] Limpando dados existentes...');
    await User.deleteMany({});
    await Content.deleteMany({});
    console.log('      Dados limpos com sucesso\n');

    // Cria usuários
    console.log('[3/5] Criando usuários de teste...');
    const createdUsers = [];
    for (const userData of seedUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`      ✓ Usuário criado: ${user.username} (${user.email})`);
    }
    console.log('');

    // Cria conteúdos
    console.log('[4/5] Criando conteúdos de exemplo...');
    for (let i = 0; i < seedContents.length; i++) {
      const contentData = seedContents[i];
      // Distribui conteúdos entre os usuários
      const owner = createdUsers[i % createdUsers.length];
      
      const content = new Content({
        ...contentData,
        owner_id: owner._id,
        owner_username: owner.username
      });
      
      await content.save();
      console.log(`      ✓ Conteúdo criado: "${content.title}" (por ${owner.username})`);
    }
    console.log('');

    // Estatísticas finais
    console.log('[5/5] Seed concluído com sucesso!');
    console.log('');
    console.log('========================================');
    console.log('ESTATÍSTICAS');
    console.log('========================================');
    console.log(`Usuários criados: ${createdUsers.length}`);
    console.log(`Conteúdos criados: ${seedContents.length}`);
    console.log('');
    console.log('========================================');
    console.log('CREDENCIAIS DE TESTE');
    console.log('========================================');
    seedUsers.forEach(user => {
      console.log(`Username: ${user.username.padEnd(15)} | Email: ${user.email.padEnd(25)} | Senha: ${user.password}`);
    });
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('\nErro ao executar seed:', error);
    process.exit(1);
  }
}

// Executa o seed
seed();
