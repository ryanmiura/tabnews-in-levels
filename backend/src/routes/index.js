const express = require('express');
const authRoutes = require('./auth');
const contentsRoutes = require('./contents');

/**
 * Registra todas as rotas da aplicação
 * 
 * @param {express.Application} app - Instância do Express
 */
function registerRoutes(app) {
  // Rota de saúde/status da API
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'TabNews In Levels Backend'
    });
  });

  // Rota raiz da API
  app.get('/api', (req, res) => {
    res.json({
      message: 'TabNews In Levels API',
      version: '1.0.0',
      endpoints: {
        auth: {
          register: 'POST /api/auth/register',
          login: 'POST /api/auth/login',
          logout: 'POST /api/auth/logout',
          me: 'GET /api/auth/me'
        },
        contents: {
          list: 'GET /api/contents',
          getBySlug: 'GET /api/contents/:username/:slug',
          getByUser: 'GET /api/contents/:username',
          create: 'POST /api/contents'
        }
      },
      documentation: 'https://github.com/ryanmiura/tabnews-in-levels'
    });
  });

  // Registra rotas de autenticação
  app.use('/api/auth', authRoutes);

  // Registra rotas de conteúdos
  app.use('/api/contents', contentsRoutes);

  // Rota 404 - deve ser a última
  app.use((req, res) => {
    res.status(404).json({
      error: 'Rota não encontrada',
      path: req.path,
      method: req.method
    });
  });
}

module.exports = registerRoutes;
