import { 
  Container, 
  Typography, 
  Box, 
  Grid,
  Switch,
  FormControlLabel,
  Chip,
} from '@mui/material';
import { useNews } from '../../contexts/NewsContext.jsx';
import { useMockContext } from '../../contexts/MockContext.jsx';
import NewsCard from '../ui/NewsCard.jsx';
import FiltersBar from '../ui/FiltersBar.jsx';
import PaginationMui from '../ui/PaginationMui.jsx';
import Loading from '../ui/Loading.jsx';
import ErrorAlert from '../ui/ErrorAlert.jsx';

const Home = () => {
  const { 
    list, 
    loading, 
    listLoading,
    error, 
    actions, 
    currentFilters,
    state 
  } = useNews();
  
  const { useMocks, toggleMocks } = useMockContext();

  const handleFiltersChange = (newFilters) => {
    actions.setFilters(newFilters);
    // Chamar fetch após definir filtros
    setTimeout(() => {
      actions.fetchList();
    }, 0);
  };

  const handleRefresh = () => {
    actions.clearErrors();
    actions.fetchList();
  };

  const handlePageChange = (newPage) => {
    actions.setPage(newPage);
    // Chamar fetch após mudar página
    setTimeout(() => {
      actions.fetchList();
    }, 0);
  };

  const handleRetry = () => {
    actions.clearErrors();
    actions.fetchList();
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Debug info (remover em produção) */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ 
          mb: 2, 
          p: 2, 
          bgcolor: useMocks ? 'warning.light' : 'info.light', 
          borderRadius: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              icon={<span>{useMocks ? '🎭' : '🌐'}</span>}
              label={useMocks ? 'MOCK MODE' : 'API REAL'} 
              color={useMocks ? 'warning' : 'primary'}
              size="small"
            />
            <Typography variant="caption">
              {list.length} itens • Página {currentFilters.page} • {currentFilters.strategy} • Loading: {loading ? 'Sim' : 'Não'}
            </Typography>
          </Box>
          
          <FormControlLabel
            control={
              <Switch
                checked={useMocks}
                onChange={toggleMocks}
                size="small"
                color="warning"
              />
            }
            label={
              <Typography variant="caption">
                Mocks {useMocks ? 'ON' : 'OFF'}
              </Typography>
            }
          />
        </Box>
      )}

      {/* Cabeçalho */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Notícias do TabNews
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Descubra as últimas discussões e artigos da comunidade de tecnologia.
        </Typography>
      </Box>

      {/* Filtros */}
      <FiltersBar
        currentFilters={currentFilters}
        onFiltersChange={handleFiltersChange}
        onRefresh={handleRefresh}
        loading={loading}
      />

      {/* Erro */}
      {error && (
        <ErrorAlert
          error={error}
          title="Erro ao carregar notícias"
          onRetry={handleRetry}
          onClose={actions.clearErrors}
          showDetails={true}
        />
      )}

      {/* Loading */}
      {listLoading && (
        <Loading 
          type="news-list" 
          count={currentFilters.per_page} 
        />
      )}

      {/* Lista de notícias */}
      {!listLoading && list.length > 0 && (
        <Box>
          <Grid container spacing={3}>
            {list.map((article) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={article.id || `${article.owner_username}-${article.slug}`}>
                <NewsCard article={article} />
              </Grid>
            ))}
          </Grid>

          {/* Paginação */}
          <PaginationMui
            currentPage={currentFilters.page}
            totalItems={list.length}
            itemsPerPage={currentFilters.per_page}
            onPageChange={handlePageChange}
            loading={loading}
            hasMore={state.hasMore}
          />
        </Box>
      )}

      {/* Estado vazio */}
      {!listLoading && list.length === 0 && !error && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" gutterBottom color="text.secondary">
            Nenhuma notícia encontrada
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tente ajustar os filtros ou atualize a página.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Home;