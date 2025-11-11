/**
 * API functions for tasks
 * Provides functions for CRUD operations on tasks using React Query
 */

import { Task, TaskFormData } from '@/types';
import axiosInstance from './axios';

// Fetch all tasks
export const fetchTasks = async (): Promise<Task[]> => {
  const response = await axiosInstance.get<Task[]>('/tasks');
  return response.data;
};

// Fetch a single task by ID
export const fetchTaskById = async (id: number): Promise<Task> => {
  const response = await axiosInstance.get<Task>(`/tasks/${id}`);
  return response.data;
};

// Create a new task
export const createTask = async (taskData: TaskFormData): Promise<Task> => {
  const newTask = {
    ...taskData,
    createdAt: new Date().toISOString(),
  };
  const response = await axiosInstance.post<Task>('/tasks', newTask);
  return response.data;
};

// Update an existing task
export const updateTask = async (task: Task): Promise<Task> => {
  const updatedTask = {
    ...task,
    updatedAt: new Date().toISOString(),
  };
  const response = await axiosInstance.put<Task>(`/tasks/${task.id}`, updatedTask);
  return response.data;
};

// Delete a task
export const deleteTask = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/tasks/${id}`);
};

// Move task to a different column (optimized - single API call)
export const moveTaskToColumn = async (
  taskId: number,
  newColumn: string
): Promise<Task> => {
  const response = await axiosInstance.patch<Task>(`/tasks/${taskId}`, {
    column: newColumn,
    updatedAt: new Date().toISOString(),
  });
  return response.data;
};
