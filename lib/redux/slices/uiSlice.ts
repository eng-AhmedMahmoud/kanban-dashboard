/**
 * UI slice for Redux state management
 * Manages UI-related state such as modals, dialogs, and notifications
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '@/types';

// Define the shape of the UI state
interface UIState {
  isTaskModalOpen: boolean;
  taskBeingEdited: Task | null;
  showNotification: boolean;
  notificationMessage: string;
  notificationType: 'success' | 'error' | 'info' | 'warning';
}

// Initial state
const initialState: UIState = {
  isTaskModalOpen: false,
  taskBeingEdited: null,
  showNotification: false,
  notificationMessage: '',
  notificationType: 'info',
};

// Create the UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Open task modal for creating a new task
    openCreateTaskModal: (state) => {
      state.isTaskModalOpen = true;
      state.taskBeingEdited = null;
    },

    // Open task modal for editing an existing task
    openEditTaskModal: (state, action: PayloadAction<Task>) => {
      state.isTaskModalOpen = true;
      state.taskBeingEdited = action.payload;
    },

    // Close task modal
    closeTaskModal: (state) => {
      state.isTaskModalOpen = false;
      state.taskBeingEdited = null;
    },

    // Show a notification
    showNotification: (
      state,
      action: PayloadAction<{
        message: string;
        type: 'success' | 'error' | 'info' | 'warning';
      }>
    ) => {
      state.showNotification = true;
      state.notificationMessage = action.payload.message;
      state.notificationType = action.payload.type;
    },

    // Hide notification
    hideNotification: (state) => {
      state.showNotification = false;
    },
  },
});

// Export actions
export const {
  openCreateTaskModal,
  openEditTaskModal,
  closeTaskModal,
  showNotification,
  hideNotification,
} = uiSlice.actions;

// Export reducer
export default uiSlice.reducer;
