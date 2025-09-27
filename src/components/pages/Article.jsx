import { Container, Typography, Box, Alert, CircularProgress, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useNews } from '../../contexts/NewsContext.jsx';

const Article = () => {
  const { user, slug } = useParams();
  const navigate = useNavigate();
  const { article, articleLoading, error, actions } = useNews();

  useEffect(() => {
    if (user && slug) {
      // Limpar artigo anterior e buscar novo
      actions.clearArticle();
      actions.fetchArticle(user, slug);
    }
  }, [user, slug, actions]);

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box>
        {/* Botão voltar */}
        <Button 
          variant="outlined" 
          onClick={handleGoBack}
          sx={{ mb: 3 }}
        >
          ← Voltar para lista
        </Button>

        {/* Loading */}
        {articleLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Erro */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Artigo */}
        {article && !articleLoading && (
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {article.title}
            </Typography>
            
            <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Autor:</strong> {article.owner_username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Publicado em:</strong> {new Date(article.published_at).toLocaleDateString('pt-BR')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>TabCoins:</strong> {article.tabcoins}
              </Typography>
            </Box>

            <Box sx={{ 
              p: 3, 
              bgcolor: 'background.paper', 
              borderRadius: 1, 
              border: '1px solid', 
              borderColor: 'divider',
              minHeight: 200 
            }}>
              <Typography variant="body1" component="div">
                {article.body ? (
                  // Por enquanto, exibe o markdown como texto simples
                  // No próximo tópico implementaremos o renderizador de markdown
                  <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                    {article.body}
                  </pre>
                ) : (
                  <Typography color="text.secondary" fontStyle="italic">
                    Conteúdo não disponível
                  </Typography>
                )}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Estado vazio */}
        {!article && !articleLoading && !error && (
          <Alert severity="info">
            Carregando artigo: {user}/{slug}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default Article;