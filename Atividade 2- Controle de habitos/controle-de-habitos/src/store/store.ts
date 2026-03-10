import { configureStore } from '@reduxjs/toolkit';
import habitsReducer from './habitsSlice';

export const store = configureStore({
  reducer: {
    habits: habitsReducer,
  },
});

// Tipos declarados direitinho
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// O subscribe continua aqui, mas salvando apenas a lista de itens
store.subscribe(() => {
  try {
    const state = store.getState();
    // Salva apenas o array de hábitos, não a store inteira
    localStorage.setItem('habits_data', JSON.stringify(state.habits.items));
  } catch (e) {
    console.warn("Não foi possível salvar no localStorage", e);
  }
});