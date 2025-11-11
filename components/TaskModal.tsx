/**
 * Task Modal Component
 * Modal dialog for creating and editing tasks
 * Features:
 * - Form validation
 * - Column selection with visual indicators
 * - Create and update operations
 * - Smooth animations
 * - Interactive tooltips
 */

'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Tooltip,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeTaskModal } from '@/lib/redux/slices/uiSlice';
import { showNotification } from '@/lib/redux/slices/uiSlice';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask, updateTask } from '@/lib/api/tasks';
import { COLUMNS } from '@/lib/constants';
import { TaskFormData, ColumnType } from '@/types';

export default function TaskModal() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { isTaskModalOpen, taskBeingEdited } = useAppSelector((state) => state.ui);

  // Form state
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    column: 'backlog',
  });

  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  // Initialize form data when editing
  useEffect(() => {
    if (taskBeingEdited) {
      setFormData({
        title: taskBeingEdited.title,
        description: taskBeingEdited.description,
        column: taskBeingEdited.column,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        column: 'backlog',
      });
    }
    setErrors({});
  }, [taskBeingEdited, isTaskModalOpen]);

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      dispatch(
        showNotification({
          message: 'Task created successfully!',
          type: 'success',
        })
      );
      handleClose();
    },
    onError: () => {
      dispatch(
        showNotification({
          message: 'Failed to create task. Please try again.',
          type: 'error',
        })
      );
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      dispatch(
        showNotification({
          message: 'Task updated successfully!',
          type: 'success',
        })
      );
      handleClose();
    },
    onError: () => {
      dispatch(
        showNotification({
          message: 'Failed to update task. Please try again.',
          type: 'error',
        })
      );
    },
  });

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: { title?: string; description?: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) return;

    if (taskBeingEdited) {
      // Update existing task
      updateTaskMutation.mutate({
        ...taskBeingEdited,
        ...formData,
      });
    } else {
      // Create new task
      createTaskMutation.mutate(formData);
    }
  };

  // Handle modal close
  const handleClose = () => {
    dispatch(closeTaskModal());
  };

  // Handle input change
  const handleChange = (field: keyof TaskFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const isLoading = createTaskMutation.isPending || updateTaskMutation.isPending;

  return (
    <Dialog
      open={isTaskModalOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      className="animate-fade-in"
    >
      <DialogTitle className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <span className="text-xl font-semibold">
          {taskBeingEdited ? 'Edit Task' : 'Create New Task'}
        </span>
        <Tooltip title="Close" arrow>
          <IconButton onClick={handleClose} size="small" className="text-white">
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      <DialogContent className="mt-4">
        <Box className="space-y-4">
          {/* Title field */}
          <Tooltip
            title="Enter a clear, descriptive title for your task"
            arrow
            placement="top"
          >
            <TextField
              fullWidth
              label="Task Title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              placeholder="e.g., Design homepage layout"
              autoFocus
              required
            />
          </Tooltip>

          {/* Description field */}
          <Tooltip
            title="Provide detailed information about what needs to be done"
            arrow
            placement="top"
          >
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              placeholder="e.g., Create a responsive homepage with hero section and call-to-action"
              multiline
              rows={4}
              required
            />
          </Tooltip>

          {/* Column selection */}
          <Tooltip
            title="Select which column this task should appear in"
            arrow
            placement="top"
          >
            <FormControl fullWidth>
              <InputLabel>Column</InputLabel>
              <Select
                value={formData.column}
                label="Column"
                onChange={(e) => handleChange('column', e.target.value as ColumnType)}
              >
                {COLUMNS.map((column) => (
                  <MenuItem key={column.id} value={column.id}>
                    <Box className="flex items-center gap-2">
                      <span>{column.icon}</span>
                      <span>{column.title}</span>
                      <Box
                        className="w-3 h-3 rounded-full ml-auto"
                        sx={{ backgroundColor: column.color }}
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Tooltip>
        </Box>
      </DialogContent>

      <DialogActions className="p-4 bg-gray-50">
        <Tooltip title="Cancel and close" arrow>
          <Button
            onClick={handleClose}
            disabled={isLoading}
            startIcon={<CancelIcon />}
            className="text-gray-600"
          >
            Cancel
          </Button>
        </Tooltip>

        <Tooltip
          title={
            taskBeingEdited
              ? 'Save changes to this task'
              : 'Create this task and add it to the board'
          }
          arrow
        >
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isLoading}
            startIcon={<SaveIcon />}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Saving...' : taskBeingEdited ? 'Save Changes' : 'Create Task'}
          </Button>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
}
