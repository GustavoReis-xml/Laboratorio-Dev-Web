// src/App.tsx
import { BrowserRouter, Routes, Route, Link as RouterLink } from 'react-router-dom';
import { Container, AppBar, Toolbar, Button, Typography, Box, CssBaseline, ThemeProvider } from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import theme from './theme'; // Importa o tema customizado
import { BooksProvider } from './context/BooksContext';
import Home from './pages/Home';
import Course from './pages/Course';

function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', p: 3, mt: 'auto', borderTop: '1px solid #e0e0e0' }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Fatec DSM - Laboratório de React Context
        </Typography>
      </Container>
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normaliza o CSS e aplica o fundo do tema */}
      <BrowserRouter>
        {/* Box flex para garantir que o footer fique no final da página */}
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          
          <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0', bgcolor: 'background.paper' }}>
            <Container maxWidth="lg">
              <Toolbar disableGutters>
                <LibraryBooksIcon sx={{ color: 'primary.main', mr: 2, fontSize: '2rem' }} />
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 700, letterSpacing: '-1px' }}
                >
                  BIBLIO<Box component="span" sx={{color: 'secondary.main'}}>DSM</Box>
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    component={RouterLink} 
                    to="/" 
                    startIcon={<LibraryBooksIcon />}
                    color="primary"
                  >
                    Início
                  </Button>
                  <Button 
                    component={RouterLink} 
                    to="/cursos" 
                    startIcon={<FilterAltIcon />}
                    variant="contained" 
                    color="secondary"
                    sx={{borderRadius: '20px'}} // Botão ovalado para destaque
                  >
                    Filtrar
                    </Button>
                </Box>
              </Toolbar>
            </Container>
          </AppBar>

          <Container maxWidth="lg" component="main" sx={{ mt: 4, mb: 4 }}>
            <BooksProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cursos" element={<Course />} />
              </Routes>
            </BooksProvider>
          </Container>

          <Footer />
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}