import {
  Box,
  Paper,
  TextField,
  MenuItem,
  Button,
  Typography,
  Grid,
  Alert,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useState } from 'react';

const FiltersBar = ({ 
  currentFilters = {},
  onFiltersChange,
  onRefresh,
  loading = false 
}) => {
  const [localFilters, setLocalFilters] = useState({
    per_page: currentFilters.per_page || 10,
    strategy: currentFilters.strategy || 'new',
  });
  
  const [error, setError] = useState('');

  const strategies = [
    { value: 'new', label: 'Mais Recentes' },
    { value: 'old', label: 'Mais Antigos' },
    { value: 'relevant', label: 'Mais Relevantes' },
  ];

  const handleInputChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value,
    }));
    setError(''); // Limpa erro quando usuário faz alterações
  };

  const validateFilters = () => {
    const { per_page } = localFilters;
    
    // Validação do per_page
    if (!per_page || per_page < 1) {
      setError('Número de itens por página deve ser maior que 0');
      return false;
    }
    
    if (per_page > 100) {
      setError('Número máximo de itens por página é 100');
      return false;
    }

    return true;
  };

  const handleApplyFilters = () => {
    if (validateFilters()) {
      onFiltersChange(localFilters);
      setError('');
    }
  };

  const handleRefresh = () => {
    setError('');
    onRefresh();
  };

  const hasChanges = () => {
    return (
      localFilters.per_page !== currentFilters.per_page ||
      localFilters.strategy !== currentFilters.strategy
    );
  };

  return (
    <Paper 
      elevation={2}
      sx={{ 
        p: 3, 
        mb: 3,
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <FilterIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" component="h2">
          Filtros de Busca
        </Typography>
      </Box>

      <Grid container spacing={3} alignItems="center">
        {/* Estratégia */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            select
            fullWidth
            label="Ordenar por"
            value={localFilters.strategy}
            onChange={(e) => handleInputChange('strategy', e.target.value)}
            disabled={loading}
            size="small"
          >
            {strategies.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Itens por página */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            type="number"
            label="Itens por página"
            value={localFilters.per_page}
            onChange={(e) => handleInputChange('per_page', parseInt(e.target.value) || '')}
            disabled={loading}
            size="small"
            inputProps={{ 
              min: 1, 
              max: 100,
              step: 1,
            }}
            helperText="Entre 1 e 100 itens"
          />
        </Grid>

        {/* Botões */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={handleApplyFilters}
              disabled={loading || !hasChanges()}
              startIcon={<FilterIcon />}
              size="small"
            >
              Aplicar
            </Button>
            
            <Button
              variant="outlined"
              onClick={handleRefresh}
              disabled={loading}
              startIcon={<RefreshIcon />}
              size="small"
            >
              Atualizar
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Mensagem de erro */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Informações atuais */}
      <Box sx={{ mt: 2, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Filtros ativos: {currentFilters.per_page} itens por página • {strategies.find(s => s.value === currentFilters.strategy)?.label}
        </Typography>
      </Box>
    </Paper>
  );
};

export default FiltersBar;