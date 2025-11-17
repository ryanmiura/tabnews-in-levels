import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Hook customizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verifica se há token e carrega dados do usuário
  useEffect(() => {
    const loadUser = async () => {
      const savedToken = localStorage.getItem('token');
      
      if (savedToken) {
        try {
          // Busca dados do usuário logado
          const response = await axios.get(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${savedToken}`
            }
          });
          
          setUser(response.data.user);
          setToken(savedToken);
        } catch (err) {
          console.error('Erro ao carregar usuário:', err);
          // Token inválido, remove
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      
      setLoading(false);
    };

    loadUser();
  }, []);

  /**
   * Registra um novo usuário
   */
  const register = async (username, email, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password
      });

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao criar conta';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Faz login do usuário
   */
  const login = async (username, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password
      });

      const { token: newToken, user: userData } = response.data;

      // Salva token no localStorage
      localStorage.setItem('token', newToken);
      
      setToken(newToken);
      setUser(userData);

      return userData;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao fazer login';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Faz logout do usuário
   */
  const logout = async () => {
    try {
      // Tenta fazer logout no backend (adicionar token à blacklist)
      if (token) {
        await axios.post(
          `${API_URL}/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      }
    } catch (err) {
      console.error('Erro ao fazer logout no servidor:', err);
      // Continua com logout local mesmo se falhar no servidor
    } finally {
      // Limpa estado local
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setError(null);
    }
  };

  /**
   * Verifica se o usuário está autenticado
   */
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  /**
   * Atualiza dados do usuário
   */
  const refreshUser = async () => {
    if (!token) return null;

    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUser(response.data.user);
      return response.data.user;
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
      // Se falhar, faz logout
      await logout();
      return null;
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
