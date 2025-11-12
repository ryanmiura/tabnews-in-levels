import {
  Box,
  Pagination,
  Typography,
  Paper,
} from '@mui/material';

const PaginationMui = ({ 
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  loading = false,
  hasMore = true,
}) => {
  // Calcula o número total de páginas
  // Como a API não retorna o total de itens, usamos uma estratégia baseada em hasMore
  const calculateTotalPages = () => {
    if (hasMore) {
      // Se há mais itens, sempre mostra pelo menos a próxima página
      return currentPage + 1;
    } else {
      // Se não há mais itens, a página atual é a última
      return currentPage;
    }
  };

  const totalPages = calculateTotalPages();

  const handlePageChange = (event, page) => {
    if (page !== currentPage && !loading) {
      onPageChange(page);
    }
  };

  // Calcula informações para exibição
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems || (currentPage * itemsPerPage));

  return (
    <Paper 
      elevation={1}
      sx={{ 
        p: 2, 
        mt: 3,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
      }}
    >
      {/* Informações sobre os itens */}
      <Box>
        <Typography variant="body2" color="text.secondary">
          {totalItems > 0 ? (
            <>
              Mostrando {startItem} - {endItem} de {totalItems > endItem ? `${totalItems}+` : totalItems} itens
            </>
          ) : (
            `Página ${currentPage}`
          )}
          {hasMore && (
            <Typography component="span" variant="body2" color="primary.main" sx={{ ml: 1 }}>
              (há mais itens)
            </Typography>
          )}
        </Typography>
      </Box>

      {/* Controles de paginação */}
      {totalPages > 1 && (
        <Box>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            disabled={loading}
            color="primary"
            showFirstButton
            showLastButton
            size="small"
            sx={{
              '& .MuiPaginationItem-root': {
                fontSize: '0.875rem',
              },
            }}
          />
        </Box>
      )}

      {/* Estado de loading */}
      {loading && (
        <Typography variant="body2" color="primary.main">
          Carregando...
        </Typography>
      )}
    </Paper>
  );
};

export default PaginationMui;