/**
 * Constants used throughout the application
 * Centralized configuration for colors, columns, and other constant values
 */

import { Column } from '@/types';

// Column configurations with colors and icons
export const COLUMNS: Column[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    color: '#94a3b8', // Slate gray
    icon: '📋',
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    color: '#3b82f6', // Blue
    icon: '🚀',
  },
  {
    id: 'review',
    title: 'Review',
    color: '#f59e0b', // Amber
    icon: '👀',
  },
  {
    id: 'done',
    title: 'Done',
    color: '#10b981', // Green
    icon: '✅',
  },
];

// Pagination settings
export const TASKS_PER_PAGE = 10;

// Debounce delay for search (in milliseconds)
export const SEARCH_DEBOUNCE_DELAY = 300;

// Animation durations (in milliseconds)
export const ANIMATION_DURATION = {
  SHORT: 200,
  MEDIUM: 300,
  LONG: 500,
};

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'kanban_theme',
  USER_PREFERENCES: 'kanban_user_prefs',
};

// API endpoints
export const API_ENDPOINTS = {
  TASKS: '/tasks',
};
