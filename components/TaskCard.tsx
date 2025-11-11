/**
 * Task Card Component
 * Displays a single task card with drag and drop functionality
 * Features:
 * - Interactive tooltips showing full description
 * - Edit and delete actions
 * - Smooth drag animations
 * - Hover effects
 * - Creation date display
 */

'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, Typography, IconButton, Tooltip, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Task } from '@/types';
import { useAppDispatch } from '@/lib/redux/hooks';
import { openEditTaskModal } from '@/lib/redux/slices/uiSlice';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTask as deleteTaskApi } from '@/lib/api/tasks';
import { deleteTask as deleteTaskRedux } from '@/lib/redux/slices/tasksSlice';
import { showNotification } from '@/lib/redux/slices/uiSlice';
import { formatDistanceToNow } from '@/lib/utils';
import DeleteConfirmDialog from './DeleteConfirmDialog';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

export default function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Set up sortable functionality
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
    isOver,
  } = useSortable({
    id: task.id,
  });

  // Mutation for deleting tasks
  const deleteTaskMutation = useMutation({
    mutationFn: deleteTaskApi,
    onMutate: async (taskId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

      if (previousTasks) {
        const updatedTasks = previousTasks.filter((t) => t.id !== taskId);
        queryClient.setQueryData(['tasks'], updatedTasks);
        dispatch(deleteTaskRedux(taskId));
      }

      return { previousTasks };
    },
    onError: (_error, _taskId, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      dispatch(
        showNotification({
          message: 'Failed to delete task. Please try again.',
          type: 'error',
        })
      );
    },
    onSuccess: () => {
      dispatch(
        showNotification({
          message: 'Task deleted successfully!',
          type: 'success',
        })
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Handle edit task
  const handleEdit = () => {
    dispatch(openEditTaskModal(task));
  };

  // Handle delete task
  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    deleteTaskMutation.mutate(task.id);
    setDeleteDialogOpen(false);
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  // Apply transform for drag animation
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.7 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {/* Drop indicator - shown when dragging over */}
      {isOver && !isSortableDragging && (
        <Box
          sx={{
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
            marginBottom: '8px',
            borderRadius: '2px',
            boxShadow: '0 0 10px rgba(59, 130, 246, 0.6)',
            animation: 'pulse 1.5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 0.6 },
              '50%': { opacity: 1 },
            },
          }}
        />
      )}

      <Card
        className={`
          group transition-all duration-300 cursor-grab active:cursor-grabbing
          ${isSortableDragging || isDragging ? 'dragging' : 'card-shadow'}
        `}
        elevation={0}
        sx={{
          background: isSortableDragging || isDragging
            ? 'rgba(50, 50, 50, 0.9)'
            : 'rgba(40, 40, 40, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(80, 80, 80, 0.6)',
          borderRadius: '10px',
          overflow: 'visible',
          '&:hover': {
            background: 'rgba(50, 50, 50, 0.85)',
            border: '1px solid rgba(100, 100, 100, 0.7)',
          },
        }}
      >
        <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
          {/* Header with drag icon and title */}
          <Box className="flex items-start gap-1.5 mb-2">
            <DragIndicatorIcon
              sx={{
                color: 'rgba(160, 160, 160, 0.7)',
                fontSize: { xs: 18, sm: 20 },
                flexShrink: 0,
                mt: 0.3,
              }}
            />
            <Typography
              variant="h6"
              className="font-bold line-clamp-2"
              sx={{
                fontSize: { xs: '0.85rem', sm: '0.95rem' },
                color: '#ffffff',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                lineHeight: 1.3,
                flex: 1,
              }}
            >
              {task.title}
            </Typography>
          </Box>

          {/* Task description - no tooltip */}
          <Typography
            variant="body2"
            className="mb-2 line-clamp-2"
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.8rem' },
              color: 'rgba(200, 200, 200, 0.9)',
              lineHeight: 1.4,
            }}
          >
            {task.description}
          </Typography>

          {/* Task metadata */}
          {task.createdAt && (
            <Box
              className="flex items-center justify-between"
              sx={{
                mt: { xs: 1.5, sm: 2 },
                pt: { xs: 1.5, sm: 2 },
                borderTop: '1px solid rgba(80, 80, 80, 0.4)',
              }}
            >
              <Tooltip title={`Created ${new Date(task.createdAt).toLocaleString()}`} arrow>
                <Box
                  className="flex items-center gap-1"
                  sx={{
                    color: 'rgba(160, 160, 160, 0.9)',
                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                  }}
                >
                  <AccessTimeIcon sx={{ fontSize: { xs: 12, sm: 14 } }} />
                  <span>{formatDistanceToNow(task.createdAt)}</span>
                </Box>
              </Tooltip>

              {/* Edit and Delete buttons */}
              <Box className="flex gap-1.5">
                <Tooltip title="Edit task" arrow placement="top">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit();
                    }}
                    className="opacity-0 sm:opacity-0 group-hover:opacity-100 transition-all duration-200"
                    sx={{
                      color: '#ffffff',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      padding: { xs: '4px', sm: '5px' },
                      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                      border: '1px solid rgba(59, 130, 246, 0.5)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                        transform: 'scale(1.08) translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.5)',
                      },
                    }}
                  >
                    <EditIcon sx={{ fontSize: { xs: 14, sm: 15 } }} />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete task" arrow placement="top">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                    className="opacity-0 sm:opacity-0 group-hover:opacity-100 transition-all duration-200"
                    sx={{
                      color: '#ffffff',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      padding: { xs: '4px', sm: '5px' },
                      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                      border: '1px solid rgba(239, 68, 68, 0.5)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                        transform: 'scale(1.08) translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.5)',
                      },
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: { xs: 14, sm: 15 } }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        task={task}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isDeleting={deleteTaskMutation.isPending}
      />
    </div>
  );
}
