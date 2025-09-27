import axios from 'axios';

// Configuração base da API
const BASE_URL = 'https://www.tabnews.com.br/api/v1';

// Instância do axios configurada
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // Timeout de 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para tratamento de erros
apiClient.interceptors.response.use(
  (response) => {
    // Sucesso: retorna apenas os dados
    return response.data;
  },
  (error) => {
    // Tratamento de erros
    console.error('API Error:', error);
    
    if (error.response) {
      // Erro de resposta do servidor (4xx, 5xx)
      const { status, data } = error.response;
      throw new Error(`Erro ${status}: ${data?.message || 'Erro no servidor'}`);
    } else if (error.request) {
      // Erro de rede (sem resposta do servidor)
      throw new Error('Erro de conexão. Verifique sua internet.');
    } else {
      // Outros erros
      throw new Error('Erro inesperado na requisição.');
    }
  }
);

/**
 * Busca lista de conteúdos com filtros
 * @param {Object} options - Opções de filtro
 * @param {number} options.page - Página atual (padrão: 1)
 * @param {number} options.per_page - Itens por página (padrão: 10)
 * @param {string} options.strategy - Estratégia de ordenação: 'new', 'old', 'relevant' (padrão: 'new')
 * @returns {Promise<Array>} Lista de conteúdos
 */
export const getContents = async ({ page = 1, per_page = 10, strategy = 'new' } = {}) => {
  try {
    const params = {
      page,
      per_page,
      strategy,
    };

    const data = await apiClient.get('/contents', { params });
    return data;
  } catch (error) {
    console.error('Erro ao buscar conteúdos:', error);
    throw error;
  }
};

/**
 * Busca um conteúdo específico por usuário e slug
 * @param {string} user - Nome do usuário
 * @param {string} slug - Slug do conteúdo
 * @returns {Promise<Object>} Dados do conteúdo
 */
export const getContent = async (user, slug) => {
  try {
    if (!user || !slug) {
      throw new Error('Usuário e slug são obrigatórios');
    }

    const data = await apiClient.get(`/contents/${user}/${slug}`);
    return data;
  } catch (error) {
    console.error(`Erro ao buscar conteúdo ${user}/${slug}:`, error);
    throw error;
  }
};

/**
 * Função de utilidade para testar a conexão com a API
 * @returns {Promise<boolean>} True se a conexão estiver ok
 */
export const testConnection = async () => {
  try {
    await apiClient.get('/contents', { params: { page: 1, per_page: 1 } });
    return true;
  } catch (error) {
    console.error('Erro na conexão com a API:', error);
    return false;
  }
};

export default apiClient;