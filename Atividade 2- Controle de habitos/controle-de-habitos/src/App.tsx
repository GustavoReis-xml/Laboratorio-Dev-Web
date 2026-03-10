import { Container, Typography, CssBaseline, Box, AppBar, Toolbar, ThemeProvider, LinearProgress } from '@mui/material';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import HabitForm from './components/HabitForm';
import HabitControls from './components/HabitControls';
import HabitList from './components/HabitList';
import { theme } from './theme';
import { useAppSelector } from './store/hooks';

function App() {
  const habits = useAppSelector(state => state.habits.items);
  
  // Calcula o progresso do dia
  const completedCount = habits.filter(h => h.completed).length;
  const totalCount = habits.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'primary.dark', mb: 4 }}>
        <Toolbar>
          <TrackChangesIcon sx={{ mr: 2, fontSize: 32 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            HabitFlow (Gustavo Silva Dos Reis)
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Fatec - Lab. Web
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ pb: 8 }}>
        {/* Header e Barra de Progresso */}
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2 }}>
            <Box>
              <Typography variant="h4" color="text.primary" gutterBottom>
                Seu Dia
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {completedCount} de {totalCount} hábitos concluídos hoje
              </Typography>
            </Box>
            <Typography variant="h4" color="primary.main">
              {progress}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 12, 
              borderRadius: 6,
              bgcolor: 'background.paper',
              '& .MuiLinearProgress-bar': { borderRadius: 6 }
            }} 
          />
        </Box>
        
        <HabitForm />
        <HabitControls />
        <HabitList />
        
      </Container>
    </ThemeProvider>
  );
}

export default App;