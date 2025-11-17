import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Redireciona para login se não autenticado
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Renderiza o componente filho se autenticado
  return children;
}

export default PrivateRoute;
