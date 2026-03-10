import React from 'react';
import { Box, TextField, Button, InputAdornment } from '@mui/material';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setFilter, clearCompleted } from '../store/habitsSlice';

const HabitControls: React.FC = () => {
  const dispatch = useAppDispatch();
  const filterCategory = useAppSelector(state => state.habits.filterCategory);
  const items = useAppSelector(state => state.habits.items);
  
  const hasCompleted = items.some(h => h.completed);

  return (
    <Box 
      sx={{ 
        mb: 3, 
        display: 'flex', 
        gap: 2, 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap' 
      }}
    >
      <TextField
        placeholder="Filtrar por categoria..."
        variant="outlined"
        size="small"
        value={filterCategory}
        onChange={(e) => dispatch(setFilter(e.target.value))}
        sx={{ 
          minWidth: { xs: '100%', sm: '300px' },
          bgcolor: 'background.paper',
          borderRadius: 2,
          '& .MuiOutlinedInput-root': { borderRadius: 2 }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FilterListIcon color="action" />
            </InputAdornment>
          ),
        }}
      />
      
      <Button
        variant="outlined"
        color="error"
        startIcon={<DeleteSweepIcon />}
        onClick={() => dispatch(clearCompleted())}
        disabled={!hasCompleted}
        sx={{ 
          width: { xs: '100%', sm: 'auto' },
          bgcolor: 'background.paper',
          '&:hover': { bgcolor: 'error.50' }
        }}
      >
        Limpar Concluídos
      </Button>
    </Box>
  );
};

export default HabitControls;