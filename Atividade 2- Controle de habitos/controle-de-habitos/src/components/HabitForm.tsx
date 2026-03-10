import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, InputAdornment } from '@mui/material';
import AddTaskIcon from '@mui/icons-material/AddTask';
import FlagIcon from '@mui/icons-material/Flag';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import { useAppDispatch } from '../store/hooks';
import { addHabit } from '../store/habitsSlice';

const HabitForm: React.FC = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === '') return;
    dispatch(addHabit({ name: name.trim(), category: category.trim() }));
    setName('');
    setCategory('');
  };

  return (
    <Paper sx={{ p: { xs: 3, md: 4 }, mb: 4 }}>
      <Typography variant="h6" gutterBottom color="primary.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AddTaskIcon /> Novo Hábito
      </Typography>
      
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ 
          display: 'flex', 
          gap: 2, 
          mt: 3,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'flex-start' }
        }}
      >
        <TextField
          label="O que você quer fazer? *"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FlagIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        
        <TextField
          label="Categoria (Opcional)"
          variant="outlined"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ minWidth: { sm: '220px' } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocalActivityIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          size="large"
          disabled={!name.trim()}
          sx={{ height: '56px', minWidth: '140px', boxShadow: 2 }}
        >
          Adicionar
        </Button>
      </Box>
    </Paper>
  );
};

export default HabitForm;