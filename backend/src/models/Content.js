const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema(
  {
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'ID do proprietário é obrigatório'],
      index: true,
    },
    owner_username: {
      type: String,
      required: [true, 'Nome do proprietário é obrigatório'],
      lowercase: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Título é obrigatório'],
      trim: true,
      minlength: [1, 'Título deve ter no mínimo 1 caractere'],
      maxlength: [200, 'Título deve ter no máximo 200 caracteres'],
    },
    body: {
      type: String,
      required: [true, 'Corpo do conteúdo é obrigatório'],
      trim: true,
      minlength: [1, 'Corpo deve ter no mínimo 1 caractere'],
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published',
      index: true,
    },
    source_url: {
      type: String,
      trim: true,
      default: null,
      validate: {
        validator: function (v) {
          if (!v) return true; // Permite null/undefined
          // Valida URL simples
          return /^https?:\/\/.+/.test(v);
        },
        message: 'URL de origem inválida',
      },
    },
    tabcoins: {
      type: Number,
      default: 0,
      index: true,
    },
    tabcoins_credit: {
      type: Number,
      default: 0,
    },
    tabcoins_debit: {
      type: Number,
      default: 0,
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content',
      default: null,
    },
    children_deep_count: {
      type: Number,
      default: 0,
    },
    published_at: {
      type: Date,
      default: null,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    collection: 'contents',
  }
);

// Índices compostos para otimizar queries comuns
contentSchema.index({ status: 1, created_at: -1 }); // Lista por status e data
contentSchema.index({ owner_id: 1, created_at: -1 }); // Conteúdos por usuário
contentSchema.index({ tabcoins: -1, created_at: -1 }); // Ordenação por relevância
contentSchema.index({ slug: 1, owner_username: 1 }, { unique: true }); // Slug único por usuário

//Middleware pre-save: Gera slug a partir do título
contentSchema.pre('save', async function (next) {
  // Só gera slug se for novo documento ou se título foi modificado
  if (this.isNew || this.isModified('title')) {
    // Gera slug base a partir do título
    let baseSlug = this.title
      .toLowerCase()
      .normalize('NFD') // Remove acentos
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/--+/g, '-') // Remove hífens duplicados
      .replace(/^-+|-+$/g, ''); // Remove hífens do início/fim

    // Limita tamanho do slug
    baseSlug = baseSlug.substring(0, 100);

    // Verifica unicidade e adiciona sufixo se necessário
    let slug = baseSlug;
    let counter = 1;

    while (await mongoose.model('Content').exists({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }

  // Define published_at na primeira publicação
  if (this.isNew && this.status === 'published' && !this.published_at) {
    this.published_at = new Date();
  }

  // Atualiza published_at se status mudar para published
  if (this.isModified('status') && this.status === 'published' && !this.published_at) {
    this.published_at = new Date();
  }

  next();
});

//Método de instância: Retorna objeto JSON limpo
contentSchema.methods.toJSON = function () {
  const content = this.toObject();
  delete content.__v;
  
  // Adiciona campo 'id' para compatibilidade com TabNews
  content.id = content._id;
  
  // Remove campos internos do Mongoose
  delete content._id;
  
  return content;
};

/**
 * Método estático: Busca conteúdos com paginação e filtros
 * @param {Object} options - Opções de busca
 * @returns {Promise<Array>} Lista de conteúdos
 */
contentSchema.statics.findWithFilters = async function (options = {}) {
  const {
    page = 1,
    per_page = 10,
    strategy = 'new',
    status = 'published',
    owner_id = null,
  } = options;

  // Monta query base
  const query = { status };
  if (owner_id) {
    query.owner_id = owner_id;
  }

  // Define ordenação baseada na estratégia
  let sort = {};
  switch (strategy) {
    case 'old':
      sort = { created_at: 1 }; // Mais antigos primeiro
      break;
    case 'relevant':
      sort = { tabcoins: -1, created_at: -1 }; // Por tabcoins e depois data
      break;
    case 'new':
    default:
      sort = { created_at: -1 }; // Mais recentes primeiro (padrão)
      break;
  }

  // Executa query com paginação
  const skip = (page - 1) * per_page;

  const contents = await this.find(query)
    .sort(sort)
    .skip(skip)
    .limit(per_page)
    .select('-__v') // Remove __v
    .lean({ virtuals: true }); // Usa lean mas mantém virtuals

  // Transforma _id em id e ajusta owner_id para ser apenas string
  return contents.map(content => ({
    id: content._id.toString(),
    owner_id: content.owner_id?._id?.toString() || content.owner_id,
    parent_id: content.parent_id?.toString() || null,
    slug: content.slug,
    title: content.title,
    status: content.status,
    source_url: content.source_url,
    created_at: content.created_at,
    updated_at: content.updated_at,
    published_at: content.published_at,
    deleted_at: content.deleted_at,
    tabcoins: content.tabcoins,
    tabcoins_credit: content.tabcoins_credit,
    tabcoins_debit: content.tabcoins_debit,
    owner_username: content.owner_username,
    children_deep_count: content.children_deep_count,
    body: content.body,
  }));
};

/**
 * Método estático: Busca conteúdo por slug
 * @param {string} slug - Slug do conteúdo
 * @returns {Promise<Content|null>} Conteúdo encontrado ou null
 */
contentSchema.statics.findBySlug = async function (slug) {
  return await this.findOne({ slug })
    .populate('owner_id', 'username email')
    .lean();
};

/**
 * Método estático: Incrementa tabcoins
 * @param {string} contentId - ID do conteúdo
 * @param {number} amount - Quantidade a incrementar
 * @returns {Promise<Content>} Conteúdo atualizado
 */
contentSchema.statics.incrementTabcoins = async function (contentId, amount = 1) {
  const updateFields = {
    $inc: { tabcoins: amount },
  };

  if (amount > 0) {
    updateFields.$inc.tabcoins_credit = amount;
  } else {
    updateFields.$inc.tabcoins_debit = amount;
  }

  return await this.findByIdAndUpdate(contentId, updateFields, { new: true });
};

/**
 * Método estático: Conta total de conteúdos por filtros
 * @param {Object} filters - Filtros de busca
 * @returns {Promise<number>} Total de documentos
 */
contentSchema.statics.countWithFilters = async function (filters = {}) {
  const { status = 'published', owner_id = null } = filters;

  const query = { status };
  if (owner_id) {
    query.owner_id = owner_id;
  }

  return await this.countDocuments(query);
};

//Virtual: Retorna ID como string
contentSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

//Virtual: Indica se é um post raiz (não é comentário)
contentSchema.virtual('is_root').get(function () {
  return this.parent_id === null;
});

// Garante que virtuals sejam incluídos em JSON
contentSchema.set('toJSON', { virtuals: true });
contentSchema.set('toObject', { virtuals: true });

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
