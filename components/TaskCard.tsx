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
import { Card, CardContent, Typography, IconButton, Tooltip, Chip, Box } from '@mui/material';
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
    opacity: isSortableDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className={`
          group hover:shadow-lg transition-all duration-200 cursor-grab active:cursor-grabbing
          ${isSortableDragging || isDragging ? 'rotate-2 shadow-2xl' : ''}
          ${isDragging ? 'opacity-90' : ''}
        `}
        elevation={isSortableDragging || isDragging ? 8 : 2}
      >
        <CardContent className="p-4">
          {/* Drag handle and actions */}
          <Box className="flex items-start justify-between mb-2">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 -m-1 hover:bg-gray-100 rounded"
            >
              <Tooltip title="Drag to move task" placement="left" arrow>
                <DragIndicatorIcon className="text-gray-400 group-hover:text-gray-600" />
              </Tooltip>
            </div>

            <Box className="flex gap-1">
              <Tooltip title="Edit task" arrow>
                <IconButton
                  size="small"
                  onClick={handleEdit}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <EditIcon fontSize="small" className="text-blue-500" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete task" arrow>
                <IconButton
                  size="small"
                  onClick={handleDelete}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <DeleteIcon fontSize="small" className="text-red-500" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Task title with tooltip showing full text on hover */}
          <Tooltip title={task.title} arrow placement="top">
            <Typography
              variant="h6"
              className="font-semibold text-gray-800 mb-2 line-clamp-2"
              sx={{ fontSize: '1rem' }}
            >
              {task.title}
            </Typography>
          </Tooltip>

          {/* Task description with tooltip */}
          <Tooltip title={task.description} arrow placement="bottom">
            <Typography
              variant="body2"
              className="text-gray-600 mb-3 line-clamp-3"
              sx={{ fontSize: '0.875rem' }}
            >
              {task.description}
            </Typography>
          </Tooltip>

          {/* Task metadata */}
          <Box className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <Tooltip title="Task ID" arrow>
              <Chip
                label={`#${task.id}`}
                size="small"
                className="bg-gray-100 text-gray-700 font-mono"
                sx={{ fontSize: '0.75rem', height: '24px' }}
              />
            </Tooltip>

            {task.createdAt && (
              <Tooltip title={`Created ${new Date(task.createdAt).toLocaleString()}`} arrow>
                <Box className="flex items-center gap-1 text-gray-500 text-xs">
                  <AccessTimeIcon sx={{ fontSize: 14 }} />
                  <span>{formatDistanceToNow(task.createdAt)}</span>
                </Box>
              </Tooltip>
            )}
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}
