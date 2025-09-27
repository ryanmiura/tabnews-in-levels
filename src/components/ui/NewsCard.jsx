import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Person as PersonIcon,
  ThumbUp as ThumbUpIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NewsCard = ({ article }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (article.owner_username && article.slug) {
      navigate(`/contents/${article.owner_username}/${article.slug}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não disponível';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Data inválida';
    }
  };

  const truncateTitle = (title, maxLength = 80) => {
    if (!title) return 'Título não disponível';
    return title.length > maxLength 
      ? `${title.substring(0, maxLength)}...` 
      : title;
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
      }}
    >
      <CardActionArea 
        onClick={handleClick}
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Título */}
          <Typography 
            variant="h6" 
            component="h2" 
            gutterBottom
            sx={{
              fontWeight: 600,
              lineHeight: 1.3,
              minHeight: '3.2em', // Garante altura consistente
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {truncateTitle(article.title)}
          </Typography>

          {/* Metadados */}
          <Box sx={{ mt: 'auto' }}>
            {/* Autor */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                <PersonIcon sx={{ fontSize: 16 }} />
              </Avatar>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                {article.owner_username || 'Autor desconhecido'}
              </Typography>
            </Box>

            {/* Data e TabCoins */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {formatDate(article.published_at)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip
                  icon={<ThumbUpIcon sx={{ fontSize: 14 }} />}
                  label={`${article.tabcoins || 0} tabcoins`}
                  size="small"
                  color={article.tabcoins > 10 ? 'primary' : 'default'}
                  variant={article.tabcoins > 10 ? 'filled' : 'outlined'}
                />
              </Box>
            </Box>

            {/* Estatísticas adicionais */}
            {(article.children_deep_count > 0) && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {article.children_deep_count} {article.children_deep_count === 1 ? 'comentário' : 'comentários'}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default NewsCard;