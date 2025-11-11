/**
 * Type definitions for the Kanban Dashboard
 * These types ensure type safety throughout the application
 */

// Column types for the Kanban board
export type ColumnType = 'backlog' | 'in_progress' | 'review' | 'done';

// Task interface representing a single task in the Kanban board
export interface Task {
  id: number;
  title: string;
  description: string;
  column: ColumnType;
  createdAt?: string;
  updatedAt?: string;
}

// API response for tasks list
export interface TasksResponse {
  tasks: Task[];
  total: number;
}

// Form data for creating/updating tasks
export interface TaskFormData {
  title: string;
  description: string;
  column: ColumnType;
}

// Column configuration
export interface Column {
  id: ColumnType;
  title: string;
  color: string;
  icon: string;
}
