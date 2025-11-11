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
        flex flex-col h-full min-h-[600px] transition-all duration-200
        ${isOver ? 'ring-2 ring-blue-400 bg-blue-50' : 'bg-white'}
      `}
      elevation={isOver ? 8 : 2}
    >
      {/* Column Header */}
      <Box
        className="p-4 rounded-t-lg"
        sx={{
          background: `linear-gradient(135deg, ${column.color}ee, ${column.color}cc)`,
          color: 'white',
        }}
      >
        <Box className="flex items-center justify-between mb-2">
          <Box className="flex items-center gap-2">
            <span className="text-2xl">{column.icon}</span>
            <Typography variant="h6" className="font-semibold">
              {column.title}
            </Typography>
            <Tooltip title={getColumnDescription()} arrow placement="top">
              <IconButton size="small" className="text-white hover:bg-white/20">
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
                backgroundColor: 'white',
                color: column.color,
                fontWeight: 'bold',
              },
            }}
          />
        </Box>

        {/* Add new task button */}
        <Tooltip title={`Add new task to ${column.title}`} arrow>
          <button
            onClick={() => dispatch(openCreateTaskModal())}
            className="w-full py-2 px-3 bg-white/20 hover:bg-white/30 rounded-md
                     text-white font-medium text-sm transition-all duration-200
                     flex items-center justify-center gap-2"
          >
            <AddIcon fontSize="small" />
            Add Task
          </button>
        </Tooltip>
      </Box>

      {/* Task List */}
      <Box className="flex-1 p-4 overflow-y-auto space-y-3">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <Box className="text-center py-8 text-gray-400">
              <Typography variant="body2">No tasks yet</Typography>
              <Typography variant="caption">Drag tasks here or create a new one</Typography>
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
                  className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md
                           text-gray-700 font-medium text-sm transition-all duration-200
                           animate-fade-in"
                >
                  Load More ({tasks.length - visibleTasks} remaining)
                </button>
              )}
            </>
          )}
        </SortableContext>
      </Box>
    </Paper>
  );
}
