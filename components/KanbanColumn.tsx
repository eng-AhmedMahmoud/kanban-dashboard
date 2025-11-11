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
import { Box, Typography, Tooltip, IconButton, Paper } from '@mui/material';
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
        glass flex flex-col transition-all duration-200
        ${isOver ? 'scale-[1.02] shadow-modern-lg' : 'shadow-modern'}
      `}
      elevation={0}
      sx={{
        height: { xs: 'auto', sm: '75vh' },
        minHeight: { xs: '400px', sm: '500px' },
        maxHeight: { xs: 'none', sm: '85vh' },
        background: isOver
          ? 'rgba(59, 130, 246, 0.2)'
          : 'rgba(30, 30, 30, 0.7)',
        backdropFilter: 'blur(12px)',
        border: isOver
          ? '2px solid rgba(59, 130, 246, 0.8)'
          : '1px solid rgba(60, 60, 60, 0.6)',
        borderRadius: '12px',
        overflow: 'hidden',
        transform: isOver ? 'translateY(-2px)' : 'none',
        boxShadow: isOver
          ? '0 0 30px rgba(59, 130, 246, 0.4), 0 20px 40px rgba(0, 0, 0, 0.3)'
          : '0 10px 40px rgba(0, 0, 0, 0.2)',
      }}
    >
      {/* Column Header */}
      <Box
        sx={{
          p: { xs: 1.5, sm: 2 },
          background: `linear-gradient(135deg, ${column.color}e0, ${column.color}c0)`,
          color: 'white',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
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

          {/* Task count with text label - white text, no background */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5,
              color: 'white',
              fontWeight: 700,
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              whiteSpace: 'nowrap',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Box component="span" sx={{ fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>
              {tasks.length > 99 ? '99+' : tasks.length}
            </Box>
            <Box component="span" sx={{ opacity: 0.95 }}>
              {tasks.length === 1 ? 'task' : 'tasks'}
            </Box>
          </Box>
        </Box>

        {/* Enhanced Add new task button */}
        <Tooltip title={`Add new task to ${column.title}`} arrow placement="bottom">
          <Box
            component="button"
            onClick={() => dispatch(openCreateTaskModal(column.id))}
            sx={{
              width: '100%',
              py: { xs: 1.2, sm: 1.5 },
              px: 2,
              borderRadius: '10px',
              color: 'white',
              fontWeight: 600,
              fontSize: { xs: '0.75rem', sm: '0.85rem' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.2))',
              boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.3))',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                transform: 'translateY(-1px) scale(1.01)',
                '& .add-icon': {
                  transform: 'rotate(90deg) scale(1.1)',
                },
              },
              '&:active': {
                transform: 'scale(0.98)',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            <AddIcon
              className="add-icon"
              sx={{
                fontSize: { xs: 18, sm: 20 },
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              Add Task
            </Box>
            <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
              Add
            </Box>
          </Box>
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
                  position: 'relative',
                }}
              >
                {isOver && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
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
                <Typography variant="body2" className="font-medium" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  {isOver ? 'Drop here' : 'No tasks yet'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                  {isOver ? 'Release to add task' : 'Drag tasks here or create a new one'}
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
