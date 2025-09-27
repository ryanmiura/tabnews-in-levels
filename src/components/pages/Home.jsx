import { Container, Typography, Box, Button, Alert, CircularProgress } from '@mui/material';
import { useNews } from '../../contexts/NewsContext.jsx';

const Home = () => {
  const { list, loading, error, actions, currentFilters } = useNews();

  const handleRefresh = () => {
    actions.clearErrors();
    actions.fetchList();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Notícias do TabNews
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Conectado ao NewsContext com useReducer
        </Typography>
        
        {/* Informações do estado atual */}
        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" gutterBottom>
            Estado atual:
          </Typography>
          <Typography variant="body2">
            • Página: {currentFilters.page} | Por página: {currentFilters.per_page} | Estratégia: {currentFilters.strategy}
          </Typography>
          <Typography variant="body2">
            • Total de itens carregados: {list.length}
          </Typography>
          <Typography variant="body2">
            • Loading: {loading ? 'Sim' : 'Não'}
          </Typography>
        </Box>
        
        {/* Controles */}
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            onClick={handleRefresh}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : null}
          >
            {loading ? 'Carregando...' : 'Atualizar Lista'}
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={() => actions.setStrategy('relevant')}
            disabled={loading}
          >
            Relevantes
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={() => actions.setStrategy('new')}
            disabled={loading}
          >
            Mais Recentes
          </Button>
        </Box>
        
        {/* Erro */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }} onClose={() => actions.clearErrors()}>
            {error}
          </Alert>
        )}
        
        {/* Lista de notícias (preview simples) */}
        {list.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Últimas {list.length} notícias:
            </Typography>
            {list.slice(0, 5).map((item, index) => (
              <Box key={item.id || index} sx={{ p: 2, mb: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Por: {item.owner_username} • {item.tabcoins} tabcoins • {new Date(item.published_at).toLocaleDateString()}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
        
        {!loading && list.length === 0 && !error && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Nenhuma notícia encontrada.
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default Home;