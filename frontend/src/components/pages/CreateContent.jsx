import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function CreateContent() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    source_url: '',
    status: 'published'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Redireciona se não estiver autenticado
  if (!isAuthenticated()) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Limpa erro ao digitar
  };

  const validateForm = () => {
    if (formData.title.length < 3 || formData.title.length > 255) {
      setError('Título deve ter entre 3 e 255 caracteres');
      return false;
    }

    if (formData.body.length < 10) {
      setError('Corpo deve ter no mínimo 10 caracteres');
      return false;
    }

    if (formData.source_url && !/^https?:\/\/.+/.test(formData.source_url)) {
      setError('URL da fonte deve ser uma URL válida (http:// ou https://)');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validação básica
    if (!formData.title || !formData.body) {
      setError('Título e corpo são obrigatórios');
      return;
    }

    // Validações específicas
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${API_URL}/contents`,
        {
          title: formData.title,
          body: formData.body,
          source_url: formData.source_url || undefined,
          status: formData.status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess(true);
      
      // Redireciona para a página do conteúdo criado após 2 segundos
      const { owner_username, slug } = response.data.content;
      setTimeout(() => {
        navigate(`/contents/${owner_username}/${slug}`);
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao criar conteúdo';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Criar Novo Conteúdo
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Publique seu artigo para a comunidade TabNews
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Conteúdo criado com sucesso! Redirecionando...
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Título"
            name="title"
            autoFocus
            value={formData.title}
            onChange={handleChange}
            disabled={loading || success}
            helperText="3-255 caracteres"
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            multiline
            rows={15}
            id="body"
            label="Conteúdo (Markdown)"
            name="body"
            value={formData.body}
            onChange={handleChange}
            disabled={loading || success}
            helperText="Mínimo 10 caracteres. Suporta Markdown."
            placeholder="# Título

Seu conteúdo em Markdown aqui...

## Seção

- Item 1
- Item 2

**Negrito** e *itálico*"
          />

          <TextField
            margin="normal"
            fullWidth
            id="source_url"
            label="URL da Fonte (opcional)"
            name="source_url"
            type="url"
            value={formData.source_url}
            onChange={handleChange}
            disabled={loading || success}
            helperText="URL de referência (se aplicável)"
          />

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || success}
              sx={{ flex: 1 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Publicar'}
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              disabled={loading || success}
              sx={{ flex: 1 }}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default CreateContent;
