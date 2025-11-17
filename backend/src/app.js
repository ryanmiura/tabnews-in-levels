const express = require('express');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');
const { connectRedis } = require('./config/redis');
const {
  helmetConfig,
  corsConfig,
  compressionConfig,
  authRateLimiter,
  generalRateLimiter,
  sanitizeInput,
  requestLogger
} = require('./config/security');
const registerRoutes = require('./routes/index');

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================================
// MIDDLEWARES DE SEGURANÇA
// ============================================================

// Helmet - Proteção de headers HTTP
app.use(helmetConfig);

// CORS - Controle de acesso
app.use(corsConfig);

// Compressão Gzip
app.use(compressionConfig);

// Rate Limiting - Proteção contra força bruta
app.use('/api/auth/login', authRateLimiter);
app.use('/api/auth/register', authRateLimiter);
app.use('/api', generalRateLimiter);

// Logger de requisições (métricas de performance)
app.use(requestLogger);

// ============================================================
// MIDDLEWARES PADRÃO
// ============================================================

// Parse JSON
app.use(express.json({ limit: '1mb' }));

// Parse URL-encoded
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Sanitização de inputs (remove tags perigosas)
app.use(sanitizeInput);

// ============================================================
// INICIALIZAÇÃO DO SERVIDOR
// ============================================================

async function startServer() {
  try {
    console.log('Inicializando TabNews In Levels Backend...');

    // Conecta ao MongoDB
    console.log('[1/3] Conectando ao MongoDB...');
    await connectDatabase();
    console.log('MongoDB conectado com sucesso');

    // Conecta ao Redis
    console.log('[2/3] Conectando ao Redis...');
    await connectRedis();
    console.log('Redis conectado com sucesso');

    // Registra as rotas
    console.log('[3/3] Registrando rotas...');
    registerRoutes(app);
    console.log('Rotas registradas com sucesso');

    // ============================================================
    // ERROR HANDLER GLOBAL
    // ============================================================
    
    // Middleware de erro global (deve ser o último)
    app.use((err, req, res, next) => {
      console.error('Erro não tratado:', err);

      // Erro de validação do express-validator
      if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
          error: 'JSON inválido',
          details: err.message
        });
      }

      // Erro de payload muito grande
      if (err.type === 'entity.too.large') {
        return res.status(413).json({
          error: 'Payload muito grande',
          details: 'Máximo permitido: 1MB'
        });
      }

      // Erro genérico
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({
        error: NODE_ENV === 'production' 
          ? 'Erro interno do servidor' 
          : err.message,
        ...(NODE_ENV === 'development' && { stack: err.stack })
      });
    });

    // Inicia o servidor HTTP
    app.listen(PORT, () => {
      console.log('========================================');
      console.log(`Servidor rodando em http://localhost:${PORT}`);
      console.log(`Ambiente: ${NODE_ENV}`);
      console.log(`API disponível em http://localhost:${PORT}/api`);
      console.log('========================================');
    });

  } catch (error) {
    console.error('Erro ao inicializar servidor:', error);
    process.exit(1);
  }
}

// ============================================================
// GRACEFUL SHUTDOWN
// ============================================================

process.on('SIGINT', async () => {
  console.log('\nRecebido SIGINT. Encerrando graciosamente...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nRecebido SIGTERM. Encerrando graciosamente...');
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection em:', promise, 'razão:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Inicia o servidor
startServer();