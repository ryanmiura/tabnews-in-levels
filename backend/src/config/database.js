const mongoose = require('mongoose');

/**
 * Conecta ao MongoDB com configurações otimizadas de pool
 * @returns {Promise<void>}
 */
const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI não está definido nas variáveis de ambiente');
  }

  // Configurações de conexão com pool otimizado
  const options = {
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    retryWrites: true,
    retryReads: true,
    heartbeatFrequencyMS: 10000,
  };

  // Event listeners para monitoramento
  mongoose.connection.on('connected', () => {
    console.log('MongoDB: Conexão estabelecida com sucesso');
    console.log(`MongoDB: Database - ${mongoose.connection.db.databaseName}`);
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB: Erro de conexão:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB: Desconectado');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB: Reconectado com sucesso');
  });

  // Detecta quando a aplicação está sendo encerrada
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB: Conexão fechada devido ao encerramento da aplicação');
    process.exit(0);
  });

  // Retry logic: tenta conectar algumas vezes antes de falhar
  const maxAttempts = 10;
  const baseDelayMs = 2000; // 2s

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`MongoDB: Tentativa de conexão ${attempt}/${maxAttempts}...`);
      await mongoose.connect(mongoUri, options);

      // Log de informações de conexão
      console.log('MongoDB: Configuração do pool:');
      console.log(`  - Max connections: ${options.maxPoolSize}`);
      console.log(`  - Min connections: ${options.minPoolSize}`);
      console.log(`  - Server selection timeout: ${options.serverSelectionTimeoutMS}ms`);
      return;
    } catch (error) {
      console.error(`MongoDB: Falha na tentativa ${attempt}:`, error.message);
      if (attempt < maxAttempts) {
        const delay = baseDelayMs * attempt; // backoff linear
        console.log(`MongoDB: Re-tentando em ${delay}ms...`);
        // wait before next attempt
        // eslint-disable-next-line no-await-in-loop
        await sleep(delay);
      } else {
        console.error('MongoDB: Erro fatal ao conectar após várias tentativas:', error.message);
        // Keep process alive to allow container orchestration to restart it
        // but exit with non-zero so systemd/docker can mark failure if desired
        process.exit(1);
      }
    }
  }
};

/**
 * Obtém estatísticas de conexão do pool
 * @returns {Object} Estatísticas do pool
 */
const getConnectionStats = () => {
  const state = mongoose.connection.readyState;
  const stateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return {
    state: stateMap[state] || 'unknown',
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    name: mongoose.connection.name,
  };
};

/**
 * Verifica se o banco está conectado
 * @returns {boolean}
 */
const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Fecha a conexão com o banco de dados
 * @returns {Promise<void>}
 */
const disconnectDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB: Desconectado manualmente');
  } catch (error) {
    console.error('MongoDB: Erro ao desconectar:', error.message);
    throw error;
  }
};

module.exports = connectDatabase;
module.exports.getConnectionStats = getConnectionStats;
module.exports.isConnected = isConnected;
module.exports.disconnectDatabase = disconnectDatabase;
