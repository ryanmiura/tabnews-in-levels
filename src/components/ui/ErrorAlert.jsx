import {
  Alert,
  AlertTitle,
  Button,
  Box,
  Typography,
  Collapse,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { useState } from 'react';

const ErrorAlert = ({
  error,
  title,
  severity = 'error',
  onRetry,
  onClose,
  showDetails = false,
  sx = {},
}) => {
  const [showFullError, setShowFullError] = useState(false);

  if (!error) return null;

  // Determina o título baseado no tipo de erro
  const getTitle = () => {
    if (title) return title;
    
    switch (severity) {
      case 'error':
        return 'Erro';
      case 'warning':
        return 'Atenção';
      case 'info':
        return 'Informação';
      default:
        return 'Aviso';
    }
  };

  // Extrai a mensagem do erro
  const getErrorMessage = () => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    return 'Ocorreu um erro inesperado';
  };

  // Determina se deve mostrar detalhes técnicos
  const hasDetails = showDetails && error && typeof error === 'object' && (error.stack || error.code);

  return (
    <Alert
      severity={severity}
      onClose={onClose}
      sx={{
        mb: 2,
        '& .MuiAlert-message': {
          width: '100%',
        },
        ...sx,
      }}
    >
      <AlertTitle>
        {getTitle()}
      </AlertTitle>
      
      <Typography variant="body2" sx={{ mb: hasDetails || onRetry ? 1 : 0 }}>
        {getErrorMessage()}
      </Typography>

      {/* Ações */}
      {(onRetry || hasDetails) && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          {/* Botão de retry */}
          {onRetry && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
              sx={{ mt: 0.5 }}
            >
              Tentar novamente
            </Button>
          )}

          {/* Botão para mostrar detalhes */}
          {hasDetails && (
            <Button
              size="small"
              variant="text"
              startIcon={showFullError ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              onClick={() => setShowFullError(!showFullError)}
              sx={{ mt: 0.5 }}
            >
              {showFullError ? 'Ocultar' : 'Ver'} detalhes
            </Button>
          )}
        </Box>
      )}

      {/* Detalhes técnicos */}
      {hasDetails && (
        <Collapse in={showFullError}>
          <Box sx={{ mt: 2, p: 1, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 1 }}>
            <Typography variant="caption" component="div" sx={{ fontFamily: 'monospace' }}>
              <strong>Código:</strong> {error.code || 'N/A'}
              <br />
              <strong>Stack:</strong>
              <pre style={{ margin: '4px 0', whiteSpace: 'pre-wrap', fontSize: '0.7rem' }}>
                {error.stack || 'Stack trace não disponível'}
              </pre>
            </Typography>
          </Box>
        </Collapse>
      )}
    </Alert>
  );
};

// Componentes especializados para diferentes tipos de erro

export const NetworkErrorAlert = ({ error, onRetry, onClose }) => (
  <ErrorAlert
    error={error}
    title="Erro de Conexão"
    severity="error"
    onRetry={onRetry}
    onClose={onClose}
  />
);

export const NotFoundAlert = ({ message = "Conteúdo não encontrado", onClose }) => (
  <ErrorAlert
    error={message}
    title="Não Encontrado"
    severity="warning"
    onClose={onClose}
  />
);

export const ValidationErrorAlert = ({ error, onClose }) => (
  <ErrorAlert
    error={error}
    title="Dados Inválidos"
    severity="warning"
    onClose={onClose}
  />
);

export const InfoAlert = ({ message, onClose }) => (
  <ErrorAlert
    error={message}
    title="Informação"
    severity="info"
    onClose={onClose}
  />
);

export default ErrorAlert;