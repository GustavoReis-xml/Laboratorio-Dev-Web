import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

// Tipagem sugerida na atividade
export interface Habit {
  id: string;
  name: string;
  category: string;
  completed: boolean;
}

// O estado vai guardar a lista de hábitos e o filtro atual
interface HabitsState {
  items: Habit[];
  filterCategory: string;
}

// Função que tenta buscar os hábitos salvos no localStorage antes de iniciar o app
const loadHabitsFromStorage = (): Habit[] => {
  try {
    const saved = localStorage.getItem('habits_data');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.warn("Erro ao carregar hábitos do localStorage", e);
    return [];
  }
};

const initialState: HabitsState = {
  items: loadHabitsFromStorage(), 
  filterCategory: '', 
};

const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    addHabit: (state, action: PayloadAction<{ name: string; category?: string }>) => {
      state.items.push({
        id: uuidv4(),
        name: action.payload.name,
        category: action.payload.category || '',
        completed: false,
      });
    },
    
    editHabit: (state, action: PayloadAction<{ id: string; name: string; category: string }>) => {
      const index = state.items.findIndex(h => h.id === action.payload.id);
      if (index !== -1) {
        state.items[index].name = action.payload.name;
        state.items[index].category = action.payload.category;
      }
    },
    
    deleteHabit: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(h => h.id !== action.payload);
    },
    
    toggleComplete: (state, action: PayloadAction<string>) => {
      const habit = state.items.find(h => h.id === action.payload);
      if (habit) {
        habit.completed = !habit.completed;
      }
    },
    
    clearCompleted: (state) => {
      state.items = state.items.filter(h => !h.completed);
    },
    
    setFilter: (state, action: PayloadAction<string>) => {
      state.filterCategory = action.payload;
    }
  }
});

export const { 
  addHabit, 
  editHabit, 
  deleteHabit, 
  toggleComplete, 
  clearCompleted, 
  setFilter 
} = habitsSlice.actions;

export default habitsSlice.reducer;