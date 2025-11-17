import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Box 
          sx={{ 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
            '&:hover': {
              opacity: 0.8
            }
          }}
          onClick={handleHomeClick}
        >
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 600,
              letterSpacing: '0.5px'
            }}
          >
            TabNews In Levels
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {isAuthenticated() ? (
            <>
              <Typography 
                variant="body2" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mr: 2,
                  color: 'rgba(255, 255, 255, 0.9)'
                }}
              >
                Olá, <strong style={{ marginLeft: '4px' }}>{user?.username}</strong>
              </Typography>
              <Button 
                color="inherit" 
                startIcon={<AddIcon />}
                onClick={() => navigate('/create')}
              >
                Publicar
              </Button>
              <Button 
                color="inherit" 
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
              >
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                startIcon={<LoginIcon />}
                onClick={() => navigate('/login')}
              >
                Entrar
              </Button>
              <Button 
                color="inherit" 
                startIcon={<PersonAddIcon />}
                onClick={() => navigate('/register')}
              >
                Cadastrar
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;