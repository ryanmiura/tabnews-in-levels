import { Container, Typography, Box, Button } from '@mui/material';
import { useState } from 'react';
import { getContents } from '../services/apiClient.js';

const Home = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testApiClient = async () => {
    setLoading(true);
    try {
      const contents = await getContents({ page: 1, per_page: 3, strategy: 'new' });
      setTestResult(`✅ API funcionando! Carregados ${contents.length} itens.`);
      console.log('Dados da API:', contents);
    } catch (error) {
      setTestResult(`❌ Erro na API: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Notícias do TabNews
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Lista de notícias será implementada aqui.
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <Button 
            variant="contained" 
            onClick={testApiClient}
            disabled={loading}
          >
            {loading ? 'Testando...' : 'Testar API Client'}
          </Button>
          {testResult && (
            <Typography sx={{ mt: 2 }} color={testResult.includes('✅') ? 'success.main' : 'error.main'}>
              {testResult}
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Home;