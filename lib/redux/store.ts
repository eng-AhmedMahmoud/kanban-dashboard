/**
 * Redux store configuration using Redux Toolkit
 * Provides global state management for the Kanban dashboard
 */

import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './slices/tasksSlice';
import uiReducer from './slices/uiSlice';

// Configure the Redux store with all reducers
export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    ui: uiReducer,
  },
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
});

// Infer RootState and AppDispatch types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
