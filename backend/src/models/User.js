const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Nome de usuário é obrigatório'],
      unique: true,
      trim: true,
      minlength: [3, 'Nome de usuário deve ter no mínimo 3 caracteres'],
      maxlength: [30, 'Nome de usuário deve ter no máximo 30 caracteres'],
      lowercase: true,
      match: [/^[a-z0-9_-]+$/, 'Nome de usuário deve conter apenas letras minúsculas, números, - e _'],
    },
    email: {
      type: String,
      required: [true, 'Email é obrigatório'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Email inválido'],
    },
    password: {
      type: String,
      required: [true, 'Senha é obrigatória'],
      minlength: [6, 'Senha deve ter no mínimo 6 caracteres'],
      select: false, // Não retorna a senha por padrão em queries
    },
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
    collection: 'users',
  }
);

// Índices para otimizar buscas
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ createdAt: -1 }); // Para ordenar por data


 //Middleware pre-save: Hash da senha antes de salvar
 //Executa antes de create() e save()

userSchema.pre('save', async function (next) {
  // Só faz hash se a senha foi modificada
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Gera salt com 10 rounds (padrão recomendado)
    const salt = await bcrypt.genSalt(10);
    // Faz hash da senha
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Método de instância: Compara senha fornecida com hash armazenado
 * @param {string} candidatePassword - Senha em texto plano para verificar
 * @returns {Promise<boolean>} True se a senha corresponder
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // this.password pode estar undefined se select: false
    // Por isso, precisamos buscar explicitamente
    if (!this.password) {
      throw new Error('Senha não disponível para comparação');
    }
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Erro ao comparar senhas');
  }
};


//Método de instância: Retorna objeto JSON sem informações sensíveis
//Sobrescreve o método toJSON padrão

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

/**
 * Método estático: Busca usuário por username ou email
 * @param {string} identifier - Username ou email
 * @returns {Promise<User|null>} Usuário encontrado ou null
 */
userSchema.statics.findByIdentifier = async function (identifier) {
  return await this.findOne({
    $or: [
      { username: identifier.toLowerCase() },
      { email: identifier.toLowerCase() },
    ],
  }).select('+password'); // Inclui password para login
};

/**
 * Método estático: Verifica se username ou email já existe
 * @param {string} username - Nome de usuário
 * @param {string} email - Email
 * @returns {Promise<Object>} Objeto com flags de existência
 */
userSchema.statics.checkExists = async function (username, email) {
  const [usernameExists, emailExists] = await Promise.all([
    this.exists({ username: username.toLowerCase() }),
    this.exists({ email: email.toLowerCase() }),
  ]);

  return {
    usernameExists: !!usernameExists,
    emailExists: !!emailExists,
    exists: !!(usernameExists || emailExists),
  };
};

//Virtual: Retorna ID como string
userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Garante que virtuals sejam incluídos em JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
