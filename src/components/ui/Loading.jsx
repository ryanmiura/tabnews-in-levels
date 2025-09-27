import {
  Box,
  CircularProgress,
  Typography,
  Skeleton,
  Grid,
  Card,
  CardContent,
} from '@mui/material';

// Loading spinner simples
export const LoadingSpinner = ({ 
  message = 'Carregando...',
  size = 40,
  sx = {} 
}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4,
      ...sx,
    }}
  >
    <CircularProgress size={size} sx={{ mb: 2 }} />
    <Typography variant="body2" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

// Skeleton para lista de notícias
export const NewsListSkeleton = ({ count = 6 }) => (
  <Grid container spacing={3}>
    {Array.from({ length: count }).map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Card>
          <CardContent>
            {/* Título */}
            <Skeleton 
              variant="text" 
              sx={{ fontSize: '1.2rem', mb: 1 }} 
            />
            <Skeleton 
              variant="text" 
              sx={{ fontSize: '1.2rem', mb: 2, width: '80%' }} 
            />
            
            {/* Autor */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
              <Skeleton variant="text" sx={{ width: '40%' }} />
            </Box>
            
            {/* Data e TabCoins */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Skeleton variant="text" sx={{ width: '30%' }} />
              <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 12 }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

// Skeleton para artigo individual
export const ArticleSkeleton = () => (
  <Box>
    {/* Botão voltar */}
    <Skeleton variant="rectangular" width={120} height={36} sx={{ mb: 3, borderRadius: 1 }} />
    
    {/* Título */}
    <Skeleton 
      variant="text" 
      sx={{ fontSize: '2rem', mb: 1 }} 
    />
    <Skeleton 
      variant="text" 
      sx={{ fontSize: '2rem', mb: 3, width: '70%' }} 
    />
    
    {/* Metadados */}
    <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
      <Skeleton variant="text" sx={{ mb: 1, width: '40%' }} />
      <Skeleton variant="text" sx={{ mb: 1, width: '50%' }} />
      <Skeleton variant="text" sx={{ width: '30%' }} />
    </Box>
    
    {/* Conteúdo */}
    <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
      <Skeleton variant="text" sx={{ mb: 1 }} />
      <Skeleton variant="text" sx={{ mb: 1 }} />
      <Skeleton variant="text" sx={{ mb: 1, width: '80%' }} />
      <Skeleton variant="text" sx={{ mb: 2 }} />
      
      <Skeleton variant="text" sx={{ mb: 1 }} />
      <Skeleton variant="text" sx={{ mb: 1, width: '90%' }} />
      <Skeleton variant="text" sx={{ mb: 2, width: '70%' }} />
      
      <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
      
      <Skeleton variant="text" sx={{ mb: 1 }} />
      <Skeleton variant="text" sx={{ mb: 1, width: '85%' }} />
      <Skeleton variant="text" sx={{ width: '60%' }} />
    </Box>
  </Box>
);

// Loading genérico com diferentes variantes
const Loading = ({ 
  type = 'spinner',
  message = 'Carregando...',
  count = 6,
  ...props 
}) => {
  switch (type) {
    case 'news-list':
      return <NewsListSkeleton count={count} {...props} />;
    case 'article':
      return <ArticleSkeleton {...props} />;
    case 'spinner':
    default:
      return <LoadingSpinner message={message} {...props} />;
  }
};

export default Loading;