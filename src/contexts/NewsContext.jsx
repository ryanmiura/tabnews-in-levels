import { createContext, useContext, useReducer, useEffect } from 'react';
import { getContents, getContent } from '../components/services/apiClient.js';

// Estado inicial
const initialState = {
  // Lista de notícias
  list: [],
  // Filtros de busca
  page: 1,
  per_page: 10,
  strategy: 'new',
  // Estados de loading
  loading: false,
  listLoading: false,
  articleLoading: false,
  // Estados de erro
  error: null,
  listError: null,
  articleError: null,
  // Artigo individual
  article: null,
  // Metadados
  totalItems: 0,
  hasMore: true,
};

// Tipos de ações
export const NEWS_ACTIONS = {
  // Filtros
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGE: 'SET_PAGE',
  SET_PER_PAGE: 'SET_PER_PAGE',
  SET_STRATEGY: 'SET_STRATEGY',
  
  // Lista de notícias
  FETCH_LIST_START: 'FETCH_LIST_START',
  FETCH_LIST_SUCCESS: 'FETCH_LIST_SUCCESS',
  FETCH_LIST_FAIL: 'FETCH_LIST_FAIL',
  
  // Artigo individual
  FETCH_ARTICLE_START: 'FETCH_ARTICLE_START',
  FETCH_ARTICLE_SUCCESS: 'FETCH_ARTICLE_SUCCESS',
  FETCH_ARTICLE_FAIL: 'FETCH_ARTICLE_FAIL',
  
  // Limpeza
  CLEAR_ARTICLE: 'CLEAR_ARTICLE',
  CLEAR_ERRORS: 'CLEAR_ERRORS',
};

// Reducer
const newsReducer = (state, action) => {
  switch (action.type) {
    case NEWS_ACTIONS.SET_FILTERS:
      return {
        ...state,
        ...action.payload,
        page: 1, // Reset para primeira página quando filtros mudarem
      };
      
    case NEWS_ACTIONS.SET_PAGE:
      return {
        ...state,
        page: action.payload,
      };
      
    case NEWS_ACTIONS.SET_PER_PAGE:
      return {
        ...state,
        per_page: action.payload,
        page: 1, // Reset para primeira página
      };
      
    case NEWS_ACTIONS.SET_STRATEGY:
      return {
        ...state,
        strategy: action.payload,
        page: 1, // Reset para primeira página
      };

    // Lista de notícias
    case NEWS_ACTIONS.FETCH_LIST_START:
      return {
        ...state,
        listLoading: true,
        listError: null,
        loading: true,
      };
      
    case NEWS_ACTIONS.FETCH_LIST_SUCCESS:
      return {
        ...state,
        list: action.payload,
        listLoading: false,
        loading: false,
        listError: null,
        hasMore: action.payload.length === state.per_page,
      };
      
    case NEWS_ACTIONS.FETCH_LIST_FAIL:
      return {
        ...state,
        listLoading: false,
        loading: false,
        listError: action.payload,
        list: [],
      };

    // Artigo individual
    case NEWS_ACTIONS.FETCH_ARTICLE_START:
      return {
        ...state,
        articleLoading: true,
        articleError: null,
        article: null,
      };
      
    case NEWS_ACTIONS.FETCH_ARTICLE_SUCCESS:
      return {
        ...state,
        article: action.payload,
        articleLoading: false,
        articleError: null,
      };
      
    case NEWS_ACTIONS.FETCH_ARTICLE_FAIL:
      return {
        ...state,
        articleLoading: false,
        articleError: action.payload,
        article: null,
      };

    // Limpeza
    case NEWS_ACTIONS.CLEAR_ARTICLE:
      return {
        ...state,
        article: null,
        articleError: null,
      };
      
    case NEWS_ACTIONS.CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        listError: null,
        articleError: null,
      };

    default:
      console.warn(`Ação não reconhecida: ${action.type}`);
      return state;
  }
};

// Context
const NewsContext = createContext();

// Provider
export const NewsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(newsReducer, initialState);

  // Action creators
  const actions = {
    // Filtros
    setFilters: (filters) => {
      dispatch({ type: NEWS_ACTIONS.SET_FILTERS, payload: filters });
    },
    
    setPage: (page) => {
      dispatch({ type: NEWS_ACTIONS.SET_PAGE, payload: page });
    },
    
    setPerPage: (perPage) => {
      dispatch({ type: NEWS_ACTIONS.SET_PER_PAGE, payload: perPage });
    },
    
    setStrategy: (strategy) => {
      dispatch({ type: NEWS_ACTIONS.SET_STRATEGY, payload: strategy });
    },

    // Buscar lista de notícias
    fetchList: async (customFilters = {}) => {
      dispatch({ type: NEWS_ACTIONS.FETCH_LIST_START });
      
      try {
        const filters = {
          page: state.page,
          per_page: state.per_page,
          strategy: state.strategy,
          ...customFilters,
        };
        
        console.log('Buscando lista com filtros:', filters);
        const data = await getContents(filters);
        console.log('Lista carregada:', data.length, 'itens');
        
        dispatch({ type: NEWS_ACTIONS.FETCH_LIST_SUCCESS, payload: data });
        return data;
      } catch (error) {
        console.error('Erro ao buscar lista:', error);
        dispatch({ type: NEWS_ACTIONS.FETCH_LIST_FAIL, payload: error.message });
        throw error;
      }
    },

    // Buscar artigo individual
    fetchArticle: async (user, slug) => {
      dispatch({ type: NEWS_ACTIONS.FETCH_ARTICLE_START });
      
      try {
        console.log(`Buscando artigo: ${user}/${slug}`);
        const data = await getContent(user, slug);
        console.log('Artigo carregado:', data.title);
        
        dispatch({ type: NEWS_ACTIONS.FETCH_ARTICLE_SUCCESS, payload: data });
        return data;
      } catch (error) {
        console.error('Erro ao buscar artigo:', error);
        dispatch({ type: NEWS_ACTIONS.FETCH_ARTICLE_FAIL, payload: error.message });
        throw error;
      }
    },

    // Limpeza
    clearArticle: () => {
      dispatch({ type: NEWS_ACTIONS.CLEAR_ARTICLE });
    },
    
    clearErrors: () => {
      dispatch({ type: NEWS_ACTIONS.CLEAR_ERRORS });
    },
  };

  // Fetch inicial quando o provider for montado
  useEffect(() => {
    console.log('🚀 NewsProvider montado - iniciando fetch inicial');
    actions.fetchList().catch(console.error);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Refetch quando filtros mudarem
  useEffect(() => {
    if (state.page > 1 || state.per_page !== 10 || state.strategy !== 'new') {
      console.log('🔄 Filtros alterados - refetchando lista');
      actions.fetchList().catch(console.error);
    }
  }, [state.page, state.per_page, state.strategy]); // eslint-disable-line react-hooks/exhaustive-deps

  const value = {
    state,
    actions,
    // Atalhos para estados comuns
    list: state.list,
    article: state.article,
    loading: state.loading,
    listLoading: state.listLoading,
    articleLoading: state.articleLoading,
    error: state.error || state.listError || state.articleError,
    // Filtros atuais
    currentFilters: {
      page: state.page,
      per_page: state.per_page,
      strategy: state.strategy,
    },
  };

  return (
    <NewsContext.Provider value={value}>
      {children}
    </NewsContext.Provider>
  );
};

// Hook personalizado
export const useNews = () => {
  const context = useContext(NewsContext);
  
  if (!context) {
    throw new Error('useNews deve ser usado dentro de um NewsProvider');
  }
  
  return context;
};

export default NewsContext;