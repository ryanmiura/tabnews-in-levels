const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { blacklistToken, isTokenBlacklisted } = require('../config/redis');

const router = express.Router();

// Configuração JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';


//Middleware de autenticação JWT
//Verifica o token no header Authorization e adiciona req.user
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Token de autenticação não fornecido'
      });
    }

    // Verifica se o token está na blacklist (logout)
    const isBlacklisted = await isTokenBlacklisted(token);
    if (isBlacklisted) {
      return res.status(401).json({
        error: 'Token inválido ou expirado'
      });
    }

    // Verifica e decodifica o token
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({
          error: 'Token inválido'
        });
      }

      // Busca o usuário no banco
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(404).json({
          error: 'Usuário não encontrado'
        });
      }

      req.user = user;
      req.token = token;
      next();
    });
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(500).json({
      error: 'Erro ao verificar autenticação'
    });
  }
};

router.post(
  '/register',
  [
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username deve ter entre 3 e 30 caracteres')
      .matches(/^[a-z0-9_-]+$/)
      .withMessage('Username deve conter apenas letras minúsculas, números, hífens e underscores'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('Email inválido')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Senha deve ter no mínimo 6 caracteres')
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

      const { username, email, password } = req.body;

      // Verifica se username ou email já existem
      const existingUser = await User.checkExists(username, email);
      if (existingUser.usernameExists) {
        return res.status(409).json({
          error: 'Username já está em uso'
        });
      }
      if (existingUser.emailExists) {
        return res.status(409).json({
          error: 'Email já está cadastrado'
        });
      }

      // Cria o usuário (password será hasheado pelo middleware pre-save)
      const user = new User({
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password
      });

      await user.save();

      // Retorna usuário sem a senha
      const userResponse = user.toJSON();
      delete userResponse.password;

      res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: userResponse
      });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      res.status(500).json({
        error: 'Erro ao criar usuário'
      });
    }
  }
);

router.post(
  '/login',
  [
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username ou email é obrigatório'),
    body('password')
      .notEmpty()
      .withMessage('Senha é obrigatória')
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

      const { username, password } = req.body;

      // Busca usuário por username ou email
      const user = await User.findByIdentifier(username).select('+password');
      if (!user) {
        return res.status(401).json({
          error: 'Credenciais inválidas'
        });
      }

      // Verifica a senha
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          error: 'Credenciais inválidas'
        });
      }

      // Gera o token JWT
      const token = jwt.sign(
        {
          id: user._id,
          username: user.username
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Retorna token e dados do usuário
      const userResponse = user.toJSON();
      delete userResponse.password;

      res.json({
        message: 'Login realizado com sucesso',
        token,
        user: userResponse
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({
        error: 'Erro ao autenticar usuário'
      });
    }
  }
);

router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const token = req.token;

    // Adiciona token à blacklist no Redis
    // O token expirará automaticamente após o tempo de expiração do JWT
    await blacklistToken(token);

    res.json({
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    res.status(500).json({
      error: 'Erro ao realizar logout'
    });
  }
});
 

router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: req.user
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      error: 'Erro ao buscar informações do usuário'
    });
  }
});

// Exporta o router e o middleware
module.exports = router;
module.exports.authenticateToken = authenticateToken;
