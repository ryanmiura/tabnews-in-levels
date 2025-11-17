const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

/**
 * Configuração do Helmet para headers de segurança
 * Protege contra várias vulnerabilidades web comuns
 */
const helmetConfig = helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  // Força HTTPS em produção (desabilitado em dev)
  hsts: {
    maxAge: 31536000, // 1 ano
    includeSubDomains: true,
    preload: true,
  },
  // Previne clickjacking
  frameguard: {
    action: 'deny',
  },
  // Protege contra MIME sniffing
  noSniff: true,
  // Desabilita X-Powered-By header (não expor Express)
  hidePoweredBy: true,
});

/**
 * Configuração do CORS
 * Permite requisições do frontend
 */
const corsConfig = cors({
  origin: (origin, callback) => {
    // Lista de origens permitidas
    const allowedOrigins = [
      'http://localhost:5173', // Vite dev server
      'http://localhost:3000', // Caso frontend rode em outra porta
      process.env.FRONTEND_URL, // URL do frontend em produção
    ].filter(Boolean); // Remove undefined

    // Permite requisições sem origin (ex: Postman, curl)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origem não permitida pelo CORS'));
    }
  },
  credentials: true, // Permite envio de cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600, // Cache preflight por 10 minutos
});

/**
 * Configuração de compressão gzip/brotli
 * Otimiza o tamanho das respostas HTTP
 */
const compressionConfig = compression({
  // Comprime apenas respostas maiores que 1KB
  threshold: 1024,
  // Nível de compressão (0-9, padrão: 6)
  level: 6,
  // Filtro para decidir o que comprimir
  filter: (req, res) => {
    // Não comprimir se o cliente não aceitar
    if (req.headers['x-no-compression']) {
      return false;
    }
    // Usa o filtro padrão do compression
    return compression.filter(req, res);
  },
});

/**
 * Rate Limiter para rotas de autenticação
 * Previne ataques de força bruta
 */
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 tentativas
  message: {
    error: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
  },
  standardHeaders: true, // Retorna info no header `RateLimit-*`
  legacyHeaders: false, // Desabilita headers `X-RateLimit-*`
  // Identifica usuário pelo IP
  keyGenerator: (req) => {
    return req.ip;
  },
  // Handler quando limite é excedido
  handler: (req, res) => {
    console.warn(`Rate limit excedido para IP: ${req.ip}`);
    res.status(429).json({
      error: 'Muitas tentativas. Tente novamente mais tarde.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
    });
  },
  // Pula rate limit em caso de sucesso (opcional)
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});

/**
 * Rate Limiter geral para API
 * Previne abuso e sobrecarga do servidor
 */
const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 requisições por janela
  message: {
    error: 'Muitas requisições. Tente novamente em alguns minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Usa token JWT se disponível, senão usa IP
    return req.user?.id || req.ip;
  },
  handler: (req, res) => {
    console.warn(`Rate limit geral excedido: ${req.user?.id || req.ip}`);
    res.status(429).json({
      error: 'Limite de requisições excedido.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
    });
  },
});

/**
 * Middleware para sanitizar inputs
 * Remove caracteres potencialmente perigosos
 */
const sanitizeInput = (req, res, next) => {
  // Função auxiliar para sanitizar strings
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      // Remove tags HTML básicas para prevenir XSS
      return obj.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
                .trim();
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    if (obj && typeof obj === 'object') {
      const sanitized = {};
      for (const key in obj) {
        sanitized[key] = sanitize(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };

  // Sanitiza body, query e params
  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.query) {
    req.query = sanitize(req.query);
  }
  if (req.params) {
    req.params = sanitize(req.params);
  }

  next();
};

/**
 * Middleware de log de requisições
 * Registra informações básicas de cada requisição
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Captura o fim da resposta
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    };

    // Log colorido baseado no status
    if (res.statusCode >= 500) {
      console.error('SERVER ERROR:', logData);
    } else if (res.statusCode >= 400) {
      console.warn('CLIENT ERROR:', logData);
    } else {
      console.log('REQUEST:', logData);
    }
  });

  next();
};

/**
 * Exporta configuração completa de segurança
 * Para aplicar no app.js em ordem
 */
const securityMiddlewares = [
  helmetConfig,
  corsConfig,
  compressionConfig,
  sanitizeInput,
  requestLogger,
];

module.exports = {
  helmetConfig,
  corsConfig,
  compressionConfig,
  authRateLimiter,
  generalRateLimiter,
  sanitizeInput,
  requestLogger,
  securityMiddlewares,
};
