import { Container, Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

const Article = () => {
  const { user, slug } = useParams();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Artigo: {slug}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Autor: {user}
        </Typography>
        <Typography variant="body1">
          Conteúdo do artigo será implementado aqui.
        </Typography>
      </Box>
    </Container>
  );
};

export default Article;