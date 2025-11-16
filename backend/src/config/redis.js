import { createClient } from 'redis';

// Cliente Redis global
let redisClient = null;

/**
 * Conecta ao Redis com configuração otimizada
 * @returns {Promise<RedisClient>} Cliente Redis conectado
 */
const connectRedis = async () => {
  try {
    // URL do Redis a partir das variáveis de ambiente
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

    // Criar cliente Redis
    redisClient = createClient({
      url: redisUrl,
      socket: {
        // Configurações de socket para melhor performance
        reconnectStrategy: (retries) => {
          // Estratégia de reconexão exponencial
          if (retries > 10) {
            console.error('Redis: Máximo de tentativas de reconexão atingido');
            return new Error('Máximo de tentativas de reconexão excedido');
          }
          const delay = Math.min(retries * 50, 2000); // Máximo 2 segundos
          console.log(`Redis: Tentando reconectar em ${delay}ms (tentativa ${retries})`);
          return delay;
        },
        connectTimeout: 10000, // 10 segundos
        keepAlive: 5000, // 5 segundos
      },
      // Configurações de pool de conexões
      isolationPoolOptions: {
        min: 2,
        max: 10,
      },
    });

    // Event listeners para monitoramento
    redisClient.on('connect', () => {
      console.log('Redis: Conectando...');
    });

    redisClient.on('ready', () => {
      console.log('Redis: Conectado e pronto para uso');
    });

    redisClient.on('error', (err) => {
      console.error('Redis Error:', err.message);
    });

    redisClient.on('reconnecting', () => {
      console.log('Redis: Reconectando...');
    });

    redisClient.on('end', () => {
      console.log('Redis: Conexão encerrada');
    });

    // Conectar ao Redis
    await redisClient.connect();

    return redisClient;
  } catch (error) {
    console.error('Erro ao conectar ao Redis:', error.message);
    throw error;
  }
};

/**
 * Obtém o cliente Redis (conecta se necessário)
 * @returns {Promise<RedisClient>} Cliente Redis
 */
const getRedisClient = async () => {
  if (!redisClient || !redisClient.isOpen) {
    await connectRedis();
  }
  return redisClient;
};

/**
 * Armazena valor no cache com TTL opcional
 * @param {string} key - Chave do cache
 * @param {any} value - Valor a ser armazenado (será convertido para JSON)
 * @param {number} ttl - Time to live em segundos (padrão: 300 = 5 minutos)
 * @returns {Promise<string>} Resultado da operação
 */
export const setCache = async (key, value, ttl = 300) => {
  try {
    const client = await getRedisClient();
    const serializedValue = JSON.stringify(value);
    
    if (ttl > 0) {
      return await client.setEx(key, ttl, serializedValue);
    } else {
      return await client.set(key, serializedValue);
    }
  } catch (error) {
    console.error(`Erro ao salvar cache [${key}]:`, error.message);
    throw error;
  }
};

/**
 * Recupera valor do cache
 * @param {string} key - Chave do cache
 * @returns {Promise<any|null>} Valor deserializado ou null se não existir
 */
export const getCache = async (key) => {
  try {
    const client = await getRedisClient();
    const value = await client.get(key);
    
    if (!value) {
      return null;
    }
    
    return JSON.parse(value);
  } catch (error) {
    console.error(`Erro ao recuperar cache [${key}]:`, error.message);
    return null; // Retorna null em caso de erro para não quebrar a aplicação
  }
};

/**
 * Remove valor do cache
 * @param {string} key - Chave do cache
 * @returns {Promise<number>} Número de chaves removidas
 */
export const deleteCache = async (key) => {
  try {
    const client = await getRedisClient();
    return await client.del(key);
  } catch (error) {
    console.error(`Erro ao deletar cache [${key}]:`, error.message);
    throw error;
  }
};

/**
 * Remove múltiplas chaves do cache usando pattern
 * @param {string} pattern - Pattern para buscar chaves (ex: "contents:*")
 * @returns {Promise<number>} Número de chaves removidas
 */
export const deleteCachePattern = async (pattern) => {
  try {
    const client = await getRedisClient();
    const keys = await client.keys(pattern);
    
    if (keys.length === 0) {
      return 0;
    }
    
    return await client.del(keys);
  } catch (error) {
    console.error(`Erro ao deletar cache com pattern [${pattern}]:`, error.message);
    throw error;
  }
};

/**
 * Verifica se uma chave existe no cache
 * @param {string} key - Chave do cache
 * @returns {Promise<boolean>} True se existe, false caso contrário
 */
export const existsCache = async (key) => {
  try {
    const client = await getRedisClient();
    const exists = await client.exists(key);
    return exists === 1;
  } catch (error) {
    console.error(`Erro ao verificar existência de cache [${key}]:`, error.message);
    return false;
  }
};

/**
 * Define TTL para uma chave existente
 * @param {string} key - Chave do cache
 * @param {number} ttl - Time to live em segundos
 * @returns {Promise<boolean>} True se TTL foi definido com sucesso
 */
export const setTTL = async (key, ttl) => {
  try {
    const client = await getRedisClient();
    const result = await client.expire(key, ttl);
    return result === 1;
  } catch (error) {
    console.error(`Erro ao definir TTL para [${key}]:`, error.message);
    throw error;
  }
};

/**
 * Adiciona token à blacklist (para logout)
 * @param {string} token - Token JWT a ser bloqueado
 * @param {number} ttl - Tempo até expiração do token em segundos
 * @returns {Promise<string>} Resultado da operação
 */
export const blacklistToken = async (token, ttl) => {
  try {
    const key = `blacklist:${token}`;
    return await setCache(key, { blacklisted: true }, ttl);
  } catch (error) {
    console.error('Erro ao adicionar token à blacklist:', error.message);
    throw error;
  }
};

/**
 * Verifica se token está na blacklist
 * @param {string} token - Token JWT a verificar
 * @returns {Promise<boolean>} True se está na blacklist
 */
export const isTokenBlacklisted = async (token) => {
  try {
    const key = `blacklist:${token}`;
    return await existsCache(key);
  } catch (error) {
    console.error('Erro ao verificar blacklist:', error.message);
    return false;
  }
};

/**
 * Desconecta do Redis (útil para graceful shutdown)
 */
export const disconnectRedis = async () => {
  try {
    if (redisClient && redisClient.isOpen) {
      await redisClient.quit();
      console.log('Redis: Desconectado com sucesso');
    }
  } catch (error) {
    console.error('Erro ao desconectar do Redis:', error.message);
  }
};

// Exporta a função de conexão
export default connectRedis;
