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

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

export default function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  // Set up sortable functionality
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
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
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTaskMutation.mutate(task.id);
    }
  };

  // Apply transform for drag animation
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.7 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className={`
          group transition-all duration-300 cursor-grab active:cursor-grabbing
          ${isSortableDragging || isDragging ? 'dragging' : 'card-shadow'}
        `}
        elevation={0}
        sx={{
          background: isSortableDragging || isDragging
            ? 'rgba(255, 255, 255, 0.25)'
            : 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '10px',
          overflow: 'visible',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
          },
        }}
      >
        <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
          {/* Drag handle and actions */}
          <Box className="flex items-start justify-between mb-1.5">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 -m-1 hover:bg-white/20 rounded transition-all"
            >
              <Tooltip title="Drag to move task" placement="left" arrow>
                <DragIndicatorIcon
                  sx={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    '&:hover': { color: 'rgba(255, 255, 255, 0.9)' },
                  }}
                />
              </Tooltip>
            </div>

            <Box className="flex gap-0.5">
              <Tooltip title="Edit task" arrow>
                <IconButton
                  size="small"
                  onClick={handleEdit}
                  className="opacity-0 sm:opacity-0 group-hover:opacity-100 transition-all duration-200"
                  sx={{
                    color: '#3b82f6',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    padding: { xs: '4px', sm: '5px' },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <EditIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete task" arrow>
                <IconButton
                  size="small"
                  onClick={handleDelete}
                  className="opacity-0 sm:opacity-0 group-hover:opacity-100 transition-all duration-200"
                  sx={{
                    color: '#ef4444',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    padding: { xs: '4px', sm: '5px' },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <DeleteIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Task title with tooltip showing full text on hover */}
          <Tooltip title={task.title} arrow placement="top">
            <Typography
              variant="h6"
              className="font-bold mb-1 line-clamp-2"
              sx={{
                fontSize: { xs: '0.85rem', sm: '0.95rem' },
                color: 'rgba(255, 255, 255, 0.95)',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                lineHeight: 1.3,
              }}
            >
              {task.title}
            </Typography>
          </Tooltip>

          {/* Task description with tooltip */}
          <Tooltip title={task.description} arrow placement="bottom">
            <Typography
              variant="body2"
              className="mb-2 line-clamp-2"
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                color: 'rgba(255, 255, 255, 0.75)',
                lineHeight: 1.4,
              }}
            >
              {task.description}
            </Typography>
          </Tooltip>

          {/* Task metadata */}
          {task.createdAt && (
            <Box
              className="flex items-center"
              sx={{
                mt: { xs: 1.5, sm: 2 },
                pt: { xs: 1.5, sm: 2 },
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Tooltip title={`Created ${new Date(task.createdAt).toLocaleString()}`} arrow>
                <Box
                  className="flex items-center gap-1"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                  }}
                >
                  <AccessTimeIcon sx={{ fontSize: { xs: 12, sm: 14 } }} />
                  <span>{formatDistanceToNow(task.createdAt)}</span>
                </Box>
              </Tooltip>
            </Box>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
