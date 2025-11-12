import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
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
              flexGrow: 1,
              fontWeight: 600,
              letterSpacing: '0.5px'
            }}
          >
            TabNews In Levels
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;