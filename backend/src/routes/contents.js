const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Content = require('../models/Content');
const { authenticateToken } = require('./auth');
const { getCache, setCache, deleteCachePattern } = require('../config/redis');

const router = express.Router();

// Cache TTL: 5 minutos
const CACHE_TTL = 300;


router.get(
  '/',
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page deve ser um número inteiro positivo')
      .toInt(),
    query('per_page')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Per_page deve ser entre 1 e 100')
      .toInt(),
    query('strategy')
      .optional()
      .isIn(['new', 'old', 'relevant'])
      .withMessage('Strategy deve ser: new, old ou relevant')
  ],
  async (req, res) => {
    try {
      // Validação dos parâmetros
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Parâmetros inválidos',
          details: errors.array()
        });
      }

      const page = req.query.page || 1;
      const per_page = req.query.per_page || 30;
      const strategy = req.query.strategy || 'new';

      // Chave de cache baseada nos parâmetros
      const cacheKey = `contents:list:${strategy}:${page}:${per_page}`;

      // Tenta buscar do cache
      const cachedData = await getCache(cacheKey);
      if (cachedData) {
        console.log(`Cache HIT: ${cacheKey}`);
        return res.json(cachedData);
      }

      console.log(`Cache MISS: ${cacheKey}`);

      // Busca do banco de dados
      const options = {
        page,
        per_page,
        strategy
      };

      const contents = await Content.findWithFilters(options);
      const total = await Content.countWithFilters({ status: 'published' });

      const response = {
        data: contents,
        pagination: {
          page,
          per_page,
          total,
          total_pages: Math.ceil(total / per_page),
          strategy
        }
      };

      // Salva no cache
      await setCache(cacheKey, response, CACHE_TTL);

      res.json(response);
    } catch (error) {
      console.error('Erro ao listar conteúdos:', error);
      res.status(500).json({
        error: 'Erro ao buscar conteúdos'
      });
    }
  }
);


router.get('/:username/:slug', async (req, res) => {
  try {
    const { username, slug } = req.params;

    // Sanitização básica
    const sanitizedUsername = username.toLowerCase().trim();
    const sanitizedSlug = slug.toLowerCase().trim();

    // Chave de cache
    const cacheKey = `content:${sanitizedUsername}:${sanitizedSlug}`;

    // Tenta buscar do cache
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      console.log(`Cache HIT: ${cacheKey}`);
      return res.json(cachedData);
    }

    console.log(`Cache MISS: ${cacheKey}`);

    // Busca do banco de dados
    const content = await Content.findOne({
      owner_username: sanitizedUsername,
      slug: sanitizedSlug,
      status: 'published'
    }).populate('owner_id', 'username email createdAt');

    if (!content) {
      return res.status(404).json({
        error: 'Conteúdo não encontrado'
      });
    }

    // Salva no cache
    await setCache(cacheKey, content, CACHE_TTL);

    res.json(content);
  } catch (error) {
    console.error('Erro ao buscar conteúdo:', error);
    res.status(500).json({
      error: 'Erro ao buscar conteúdo'
    });
  }
});


router.post(
  '/',
  authenticateToken,
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Título é obrigatório')
      .isLength({ min: 3, max: 255 })
      .withMessage('Título deve ter entre 3 e 255 caracteres')
      // Sanitização: remove tags HTML/script
      .customSanitizer(value => {
        return value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .replace(/<[^>]+>/g, '');
      }),
    body('body')
      .trim()
      .notEmpty()
      .withMessage('Corpo do conteúdo é obrigatório')
      .isLength({ min: 10 })
      .withMessage('Corpo deve ter no mínimo 10 caracteres')
      // Sanitização: remove apenas scripts, mantém markdown
      .customSanitizer(value => {
        return value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      }),
    body('source_url')
      .optional()
      .trim()
      .isURL()
      .withMessage('Source URL deve ser uma URL válida'),
    body('status')
      .optional()
      .isIn(['published', 'draft'])
      .withMessage('Status deve ser: published ou draft')
  ],
  async (req, res) => {
    try {
      // Validação dos dados
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: errors.array()
        });
      }

      const { title, body, source_url, status = 'published' } = req.body;
      const user = req.user;

      // Cria o conteúdo
      const content = new Content({
        owner_id: user._id,
        owner_username: user.username,
        title,
        body,
        source_url,
        status
      });

      await content.save();

      // Invalida cache de listagens
      // Remove todos os caches de listagem para garantir que o novo conteúdo apareça
      await deleteCachePattern('contents:list:*');
      console.log('Cache de listagens invalidado após criação de conteúdo');

      res.status(201).json({
        message: 'Conteúdo criado com sucesso',
        content
      });
    } catch (error) {
      console.error('Erro ao criar conteúdo:', error);

      // Erro de slug duplicado (unlikely devido ao timestamp, mas possível)
      if (error.code === 11000) {
        return res.status(409).json({
          error: 'Já existe um conteúdo com este título. Tente um título diferente.'
        });
      }

      res.status(500).json({
        error: 'Erro ao criar conteúdo'
      });
    }
  }
);


router.get(
  '/:username',
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page deve ser um número inteiro positivo')
      .toInt(),
    query('per_page')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Per_page deve ser entre 1 e 100')
      .toInt()
  ],
  async (req, res) => {
    try {
      // Validação dos parâmetros
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Parâmetros inválidos',
          details: errors.array()
        });
      }

      const { username } = req.params;
      const page = req.query.page || 1;
      const per_page = req.query.per_page || 30;

      const sanitizedUsername = username.toLowerCase().trim();

      // Chave de cache
      const cacheKey = `contents:user:${sanitizedUsername}:${page}:${per_page}`;

      // Tenta buscar do cache
      const cachedData = await getCache(cacheKey);
      if (cachedData) {
        console.log(`Cache HIT: ${cacheKey}`);
        return res.json(cachedData);
      }

      console.log(`Cache MISS: ${cacheKey}`);

      // Busca do banco de dados
      const skip = (page - 1) * per_page;
      const contents = await Content.find({
        owner_username: sanitizedUsername,
        status: 'published'
      })
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(per_page)
        .select('-__v');

      const total = await Content.countDocuments({
        owner_username: sanitizedUsername,
        status: 'published'
      });

      const response = {
        data: contents,
        pagination: {
          page,
          per_page,
          total,
          total_pages: Math.ceil(total / per_page)
        }
      };

      // Salva no cache
      await setCache(cacheKey, response, CACHE_TTL);

      res.json(response);
    } catch (error) {
      console.error('Erro ao listar conteúdos do usuário:', error);
      res.status(500).json({
        error: 'Erro ao buscar conteúdos'
      });
    }
  }
);

module.exports = router;
