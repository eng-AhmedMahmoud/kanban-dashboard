/**
 * Tasks slice for Redux state management
 * Manages the state of all tasks in the Kanban board
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, ColumnType } from '@/types';

// Define the shape of the tasks state
interface TasksState {
  items: Task[];
  searchQuery: string;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: TasksState = {
  items: [],
  searchQuery: '',
  loading: false,
  error: null,
};

// Create the tasks slice
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Set all tasks
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Add a new task
    addTask: (state, action: PayloadAction<Task>) => {
      state.items.push(action.payload);
    },

    // Update an existing task
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.items.findIndex((task) => task.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },

    // Delete a task
    deleteTask: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((task) => task.id !== action.payload);
    },

    // Move a task to a different column (for drag and drop)
    moveTask: (
      state,
      action: PayloadAction<{ taskId: number; newColumn: ColumnType }>
    ) => {
      const task = state.items.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.column = action.payload.newColumn;
      }
    },

    // Set search query
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

// Export actions
export const {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  moveTask,
  setSearchQuery,
  setLoading,
  setError,
} = tasksSlice.actions;

// Export reducer
export default tasksSlice.reducer;
