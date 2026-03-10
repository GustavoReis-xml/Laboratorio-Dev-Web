import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { toggleComplete, deleteHabit, editHabit, Habit } from '../store/habitsSlice';
import {
  List, ListItem, ListItemText, IconButton, Checkbox,
  Typography, TextField, Box, Chip, Paper, Tooltip, Fade
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const HabitItem: React.FC<{ habit: Habit }> = ({ habit }) => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(habit.name);
  const [editCategory, setEditCategory] = useState(habit.category);

  const handleSave = () => {
    if (editName.trim()) {
      dispatch(editHabit({ id: habit.id, name: editName.trim(), category: editCategory.trim() }));
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditName(habit.name);
    setEditCategory(habit.category);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Paper sx={{ mb: 2, p: 2, display: 'flex', gap: 2, alignItems: 'center', borderLeft: '4px solid #4f46e5' }}>
        <TextField size="small" label="Hábito" value={editName} onChange={e => setEditName(e.target.value)} fullWidth autoFocus />
        <TextField size="small" label="Categoria" value={editCategory} onChange={e => setEditCategory(e.target.value)} sx={{ width: '200px' }} />
        <Tooltip title="Salvar">
          <IconButton color="success" onClick={handleSave} sx={{ bgcolor: 'success.50' }}><CheckIcon /></IconButton>
        </Tooltip>
        <Tooltip title="Cancelar">
          <IconButton color="error" onClick={handleCancel} sx={{ bgcolor: 'error.50' }}><CloseIcon /></IconButton>
        </Tooltip>
      </Paper>
    );
  }

  return (
    <Fade in={true}>
      <Paper 
        sx={{ 
          mb: 2, 
          transition: 'all 0.2s ease-in-out',
          opacity: habit.completed ? 0.7 : 1,
          borderLeft: habit.completed ? '4px solid #10b981' : '4px solid transparent',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          }
        }}
      >
        <ListItem
          sx={{ py: 2 }}
          secondaryAction={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Editar">
                <IconButton edge="end" onClick={() => setIsEditing(true)}>
                  <EditOutlinedIcon color="action" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Excluir">
                <IconButton edge="end" onClick={() => dispatch(deleteHabit(habit.id))} sx={{ '&:hover': { color: 'error.main' } }}>
                  <DeleteOutlineIcon />
                </IconButton>
              </Tooltip>
            </Box>
          }
        >
          <Checkbox 
            edge="start" 
            checked={habit.completed} 
            onChange={() => dispatch(toggleComplete(habit.id))} 
            icon={<RadioButtonUncheckedIcon fontSize="large" />}
            checkedIcon={<CheckCircleIcon fontSize="large" />}
            color="secondary"
            sx={{ mr: 2 }}
          />
          <ListItemText
            primary={
              <Typography 
                variant="h6" 
                color={habit.completed ? 'text.secondary' : 'text.primary'}
                sx={{ 
                  textDecoration: habit.completed ? 'line-through' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {habit.name}
              </Typography>
            }
            secondary={
              habit.category ? (
                <Chip 
                  label={habit.category} 
                  size="small" 
                  sx={{ mt: 1, bgcolor: 'primary.50', color: 'primary.dark', fontWeight: 500 }} 
                />
              ) : null
            }
          />
        </ListItem>
      </Paper>
    </Fade>
  );
};

const HabitList: React.FC = () => {
  const { items, filterCategory } = useAppSelector((state) => state.habits);

  const filteredHabits = items.filter(habit => {
    if (!filterCategory) return true;
    return habit.category.toLowerCase().includes(filterCategory.toLowerCase());
  });

  if (items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8, p: 4, bgcolor: 'background.paper', borderRadius: 4, border: '1px dashed #cbd5e1' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Sua lista está vazia
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Adicione seu primeiro hábito acima para começar a acompanhar seu progresso.
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ width: '100%', p: 0 }}>
      {filteredHabits.map((habit) => (
        <HabitItem key={habit.id} habit={habit} />
      ))}
    </List>
  );
};

export default HabitList;