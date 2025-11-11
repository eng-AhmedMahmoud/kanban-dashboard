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
  const { isTaskModalOpen, taskBeingEdited, defaultColumn } = useAppSelector((state) => state.ui);

  // Form state
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    column: 'backlog',
  });

  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  // Get the current column info for styling
  // Use special purple theme if opened from header button
  const isHeaderModal = defaultColumn === 'header';
  const currentColumn = isHeaderModal
    ? { id: 'header', title: 'New Task', color: '#667eea', icon: '➕' }
    : COLUMNS.find((col) => col.id === formData.column) || COLUMNS[0];

  // Initialize form data when editing or creating
  useEffect(() => {
    if (taskBeingEdited) {
      setFormData({
        title: taskBeingEdited.title,
        description: taskBeingEdited.description,
        column: taskBeingEdited.column,
      });
    } else {
      // If opened from header button, default to backlog
      const columnValue = defaultColumn === 'header' ? 'backlog' : (defaultColumn as ColumnType) || 'backlog';
      setFormData({
        title: '',
        description: '',
        column: columnValue,
      });
    }
    setErrors({});
  }, [taskBeingEdited, defaultColumn, isTaskModalOpen]);

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
        sx: {
          background: 'rgba(40, 40, 40, 0.98)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(80, 80, 80, 0.6)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        },
      }}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(4px)',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${currentColumn.color}e0 0%, ${currentColumn.color}c0 100%)`,
          color: 'white',
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: `0 4px 20px ${currentColumn.color}40`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <span style={{ fontSize: '1.5rem' }}>{currentColumn.icon}</span>
          <span className="text-lg sm:text-xl font-bold">
            {taskBeingEdited ? 'Edit Task' : 'Create New Task'}
          </span>
        </Box>
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

      <DialogContent sx={{ pt: 5, px: 3, pb: 4 }}>
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
              sx={{
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: currentColumn.color },
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  '& fieldset': { borderColor: 'rgba(80, 80, 80, 0.6)' },
                  '&:hover fieldset': { borderColor: 'rgba(120, 120, 120, 0.8)' },
                  '&.Mui-focused fieldset': { borderColor: currentColumn.color },
                },
                '& .MuiFormHelperText-root': { color: 'rgba(255, 255, 255, 0.6)' },
                '& input::placeholder': { color: 'rgba(160, 160, 160, 0.7)', opacity: 1 },
              }}
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
              sx={{
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: currentColumn.color },
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  '& fieldset': { borderColor: 'rgba(80, 80, 80, 0.6)' },
                  '&:hover fieldset': { borderColor: 'rgba(120, 120, 120, 0.8)' },
                  '&.Mui-focused fieldset': { borderColor: currentColumn.color },
                },
                '& .MuiFormHelperText-root': { color: 'rgba(255, 255, 255, 0.6)' },
                '& textarea::placeholder': { color: 'rgba(160, 160, 160, 0.7)', opacity: 1 },
              }}
            />
          </Tooltip>

          {/* Column selection */}
          <Tooltip
            title="Select which column this task should appear in"
            arrow
            placement="top"
          >
            <FormControl
              fullWidth
              sx={{
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: currentColumn.color },
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  '& fieldset': { borderColor: 'rgba(80, 80, 80, 0.6)' },
                  '&:hover fieldset': { borderColor: 'rgba(120, 120, 120, 0.8)' },
                  '&.Mui-focused fieldset': { borderColor: currentColumn.color },
                },
                '& .MuiSelect-icon': { color: 'rgba(255, 255, 255, 0.7)' },
              }}
            >
              <InputLabel>Column</InputLabel>
              <Select
                value={formData.column}
                label="Column"
                onChange={(e) => handleChange('column', e.target.value as ColumnType)}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: 'rgba(30, 30, 30, 0.98)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(80, 80, 80, 0.6)',
                      '& .MuiMenuItem-root': {
                        color: '#ffffff',
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                        '&.Mui-selected': {
                          bgcolor: `${currentColumn.color}30`,
                          '&:hover': { bgcolor: `${currentColumn.color}40` },
                        },
                      },
                    },
                  },
                }}
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
          background: 'rgba(20, 20, 20, 0.5)',
          borderTop: '1px solid rgba(80, 80, 80, 0.3)',
          gap: 1.5,
        }}
      >
        <Tooltip title="Cancel and close" arrow>
          <Button
            onClick={handleClose}
            disabled={isLoading}
            startIcon={<CancelIcon />}
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
              background: `linear-gradient(135deg, ${currentColumn.color}e0 0%, ${currentColumn.color}c0 100%)`,
              color: 'white',
              px: 3,
              fontWeight: 600,
              boxShadow: `0 4px 15px ${currentColumn.color}40`,
              '&:hover': {
                background: `linear-gradient(135deg, ${currentColumn.color}d0 0%, ${currentColumn.color}b0 100%)`,
                boxShadow: `0 6px 20px ${currentColumn.color}50`,
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
