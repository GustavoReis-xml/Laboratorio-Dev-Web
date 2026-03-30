// src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#263238', // Blue Grey escuro (Profissional/Corporativo)
      light: '#4f5b62',
      dark: '#000a12',
      contrastText: '#fff',
    },
    secondary: {
      main: '#1976d2', // Um azul mais vivo para destaques
    },
    background: {
      default: '#f4f6f8', // Cinza muito claro para o fundo da página (destaca os cards brancos)
      paper: '#ffffff',
    },
    text: {
      primary: '#263238',
      secondary: '#607d8b',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      color: '#263238',
      letterSpacing: '-0.5px',
    },
    h5: {
      fontWeight: 600,
      color: '#263238',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.1rem',
    },
    subtitle2: {
      fontWeight: 600,
      color: '#607d8b',
    },
  },
  shape: {
    borderRadius: 8, // Bordas mais arredondadas e modernas
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Remove o caixa alta obrigatório dos botões
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)', // Sombra bem sutil
          border: '1px solid #e0e0e0',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)', // Efeito flutuante ao passar o mouse
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          },
        },
      },
    },
  },
});

export default theme;