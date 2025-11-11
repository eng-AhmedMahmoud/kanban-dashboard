/**
 * Kanban Column Component
 * Represents a single column in the Kanban board (Backlog, In Progress, Review, Done)
 * Features:
 * - Drop zone for drag and drop
 * - Infinite scroll pagination
 * - Task count badge
 * - Colored header based on column type
 */

'use client';

import { useState, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box, Typography, Badge, Tooltip, IconButton, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Column, Task } from '@/types';
import { useAppDispatch } from '@/lib/redux/hooks';
import { openCreateTaskModal } from '@/lib/redux/slices/uiSlice';
import TaskCard from './TaskCard';
import { TASKS_PER_PAGE } from '@/lib/constants';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
}

export default function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  const dispatch = useAppDispatch();
  const [visibleTasks, setVisibleTasks] = useState(TASKS_PER_PAGE);

  // Set up droppable zone
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  // Reset visible tasks when tasks change
  useEffect(() => {
    setVisibleTasks(TASKS_PER_PAGE);
  }, [tasks.length]);

  // Handle infinite scroll - load more tasks
  const handleLoadMore = () => {
    setVisibleTasks((prev) => prev + TASKS_PER_PAGE);
  };

  // Calculate if there are more tasks to load
  const hasMore = visibleTasks < tasks.length;

  // Get column description for tooltip
  const getColumnDescription = () => {
    switch (column.id) {
      case 'backlog':
        return 'Tasks that are planned but not yet started';
      case 'in_progress':
        return 'Tasks currently being worked on';
      case 'review':
        return 'Tasks awaiting review or approval';
      case 'done':
        return 'Completed tasks';
      default:
        return '';
    }
  };

  return (
    <Paper
      ref={setNodeRef}
      className={`
        glass flex flex-col transition-all duration-300
        ${isOver ? 'ring-2 ring-blue-400 scale-[1.01] shadow-modern-lg' : 'shadow-modern'}
      `}
      elevation={0}
      sx={{
        height: { xs: 'auto', sm: '75vh' },
        minHeight: { xs: '400px', sm: '500px' },
        maxHeight: { xs: 'none', sm: '85vh' },
        background: isOver
          ? 'rgba(59, 130, 246, 0.15)'
          : 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      {/* Column Header */}
      <Box
        sx={{
          p: { xs: 1.5, sm: 2 },
          background: `linear-gradient(135deg, ${column.color}f0, ${column.color}d0)`,
          color: 'white',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <Box className="flex items-center justify-between mb-1.5 sm:mb-2">
          <Box className="flex items-center gap-1 sm:gap-2">
            <span className="text-xl sm:text-2xl drop-shadow-md">{column.icon}</span>
            <Typography
              variant="h6"
              className="font-bold"
              sx={{
                fontSize: { xs: '1rem', sm: '1.25rem' },
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              }}
            >
              {column.title}
            </Typography>
            <Tooltip title={getColumnDescription()} arrow placement="top">
              <IconButton
                size="small"
                sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Task count badge */}
          <Badge
            badgeContent={tasks.length}
            color="default"
            max={99}
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: column.color,
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
              },
            }}
          />
        </Box>

        {/* Add new task button */}
        <Tooltip title={`Add new task to ${column.title}`} arrow>
          <button
            onClick={() => dispatch(openCreateTaskModal())}
            className="w-full py-1.5 px-2 bg-white/20 hover:bg-white/40 rounded-lg
                     text-white font-semibold text-xs transition-all duration-300
                     flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md
                     hover:scale-[1.01] active:scale-[0.99]"
          >
            <AddIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
            <span className="hidden sm:inline">Add Task</span>
            <span className="inline sm:hidden">Add</span>
          </button>
        </Tooltip>
      </Box>

      {/* Task List */}
      <Box
        className="flex-1 overflow-y-auto"
        sx={{
          p: { xs: 1.5, sm: 2 },
          '& > div': {
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 1.5, sm: 2 },
          },
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '10px',
          },
        }}
      >
        <div>
          <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            {tasks.length === 0 ? (
              <Box
                className="text-center"
                sx={{
                  py: { xs: 4, sm: 6 },
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                <Typography variant="body2" className="font-medium" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  No tasks yet
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                  Drag tasks here or create a new one
                </Typography>
              </Box>
            ) : (
              <>
                {tasks.slice(0, visibleTasks).map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}

                {/* Load more button for infinite scroll */}
                {hasMore && (
                  <button
                    onClick={handleLoadMore}
                    className="w-full py-1.5 px-3 rounded-lg
                             text-xs sm:text-sm font-semibold transition-all duration-300
                             animate-fade-in glass-strong text-white
                             hover:scale-[1.01] active:scale-[0.99]
                             shadow-sm hover:shadow-md"
                  >
                    Load More ({tasks.length - visibleTasks} remaining)
                  </button>
                )}
              </>
            )}
          </SortableContext>
        </div>
      </Box>
    </Paper>
  );
}
