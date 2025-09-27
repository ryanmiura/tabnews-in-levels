import { Container, Typography, Box, Alert, CircularProgress, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
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
  }, [user, slug]); // Adicionado actions na dependência

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
              minHeight: 200,
              '& h1': { fontSize: '2rem', fontWeight: 600, mb: 2, mt: 3 },
              '& h2': { fontSize: '1.5rem', fontWeight: 600, mb: 1.5, mt: 2.5 },
              '& h3': { fontSize: '1.25rem', fontWeight: 600, mb: 1, mt: 2 },
              '& p': { mb: 1.5, lineHeight: 1.6 },
              '& ul, & ol': { mb: 1.5, pl: 3 },
              '& li': { mb: 0.5 },
              '& blockquote': { 
                borderLeft: '4px solid',
                borderColor: 'primary.main',
                pl: 2,
                py: 1,
                bgcolor: 'grey.50',
                fontStyle: 'italic'
              },
              '& code': { 
                bgcolor: 'grey.100',
                p: 0.5,
                borderRadius: 0.5,
                fontFamily: 'monospace',
                fontSize: '0.875rem'
              },
              '& pre': { 
                bgcolor: 'grey.900',
                color: 'white',
                p: 2,
                borderRadius: 1,
                overflow: 'auto',
                mb: 2,
                '& code': {
                  bgcolor: 'transparent',
                  p: 0,
                  color: 'inherit'
                }
              },
              '& a': {
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              },
              '& hr': {
                my: 2,
                borderColor: 'divider'
              }
            }}>
              {article.body ? (
                <ReactMarkdown>
                  {article.body}
                </ReactMarkdown>
              ) : (
                <Typography color="text.secondary" fontStyle="italic">
                  Conteúdo não disponível
                </Typography>
              )}
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