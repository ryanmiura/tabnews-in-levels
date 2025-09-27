import { Container, Typography, Box } from '@mui/material';

const Home = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Notícias do TabNews
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Lista de notícias será implementada aqui.
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;