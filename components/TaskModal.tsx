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
      PaperProps={{
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        },
      }}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span className="text-lg sm:text-xl font-bold">
          {taskBeingEdited ? 'Edit Task' : 'Create New Task'}
        </span>
        <Tooltip title="Close" arrow>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      <DialogContent sx={{ mt: 3, px: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
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

      <DialogActions
        sx={{
          p: 2.5,
          background: 'rgba(0, 0, 0, 0.02)',
          borderTop: '1px solid rgba(0, 0, 0, 0.08)',
          gap: 1.5,
        }}
      >
        <Tooltip title="Cancel and close" arrow>
          <Button
            onClick={handleClose}
            disabled={isLoading}
            startIcon={<CancelIcon />}
            sx={{
              color: 'rgba(0, 0, 0, 0.7)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
              },
            }}
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
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              px: 3,
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a4190 100%)',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                transform: 'translateY(-1px)',
              },
              '&:disabled': {
                background: 'rgba(0, 0, 0, 0.12)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {isLoading ? 'Saving...' : taskBeingEdited ? 'Save Changes' : 'Create Task'}
          </Button>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
}
