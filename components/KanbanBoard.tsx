/**
 * Kanban Board Component
 * Main container for the drag-and-drop Kanban board with 4 columns
 * Features:
 * - Drag and drop functionality using @dnd-kit
 * - Real-time task updates with React Query
 * - Responsive grid layout
 * - Smooth animations
 */

'use client';

import { useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Container } from '@mui/material';
import { fetchTasks, moveTaskToColumn } from '@/lib/api/tasks';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setTasks, moveTask as moveTaskRedux } from '@/lib/redux/slices/tasksSlice';
import { showNotification } from '@/lib/redux/slices/uiSlice';
import { COLUMNS } from '@/lib/constants';
import { ColumnType, Task } from '@/types';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import SearchBar from './SearchBar';
import Header from './Header';
import LoadingSkeleton from './LoadingSkeleton';
import { useState } from 'react';

export default function KanbanBoard() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const searchQuery = useAppSelector((state) => state.tasks.searchQuery);

  // State for drag and drop
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Track if component has mounted (client-side only)
  const [isMounted, setIsMounted] = useState(false);

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement required to start dragging
      },
    })
  );

  // Fetch tasks using React Query
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  // Mutation for moving tasks between columns
  const moveTaskMutation = useMutation({
    mutationFn: ({ taskId, newColumn }: { taskId: number; newColumn: ColumnType }) =>
      moveTaskToColumn(taskId, newColumn),
    onMutate: async ({ taskId, newColumn }) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

      // Optimistically update to the new value
      if (previousTasks) {
        const updatedTasks = previousTasks.map((task) =>
          task.id === taskId ? { ...task, column: newColumn } : task
        );
        queryClient.setQueryData(['tasks'], updatedTasks);
        dispatch(moveTaskRedux({ taskId, newColumn }));
      }

      // Return a context object with the snapshotted value
      return { previousTasks };
    },
    onError: (_error, _variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
        dispatch(setTasks(context.previousTasks));
      }
      dispatch(
        showNotification({
          message: 'Failed to move task. Please try again.',
          type: 'error',
        })
      );
    },
    onSuccess: (_data, variables) => {
      // Update Redux with the successful change
      dispatch(moveTaskRedux({ taskId: variables.taskId, newColumn: variables.newColumn }));
      dispatch(
        showNotification({
          message: 'Task moved successfully!',
          type: 'success',
        })
      );
    },
    onSettled: async () => {
      // Always refetch after error or success to ensure we're in sync with the server
      // Use a small delay to allow the server to process the update
      await new Promise(resolve => setTimeout(resolve, 100));
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Set mounted state on client-side mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update Redux store when tasks are fetched
  useEffect(() => {
    if (tasks) {
      dispatch(setTasks(tasks));
    }
  }, [tasks, dispatch]);

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks?.find((t) => t.id === Number(event.active.id));
    setActiveTask(task || null);
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const taskId = Number(active.id);
    const task = tasks?.find((t) => t.id === taskId);

    if (!task) {
      setActiveTask(null);
      return;
    }

    // Determine the target column
    // over.id can be either a column ID (string) or a task ID (number)
    let newColumn: ColumnType;

    // Check if over.id is a column (string matching our column IDs)
    if (typeof over.id === 'string' && ['backlog', 'in_progress', 'review', 'done'].includes(over.id)) {
      newColumn = over.id as ColumnType;
    } else {
      // It's a task ID, find which column that task belongs to
      const targetTask = tasks?.find((t) => t.id === Number(over.id));
      if (!targetTask) {
        setActiveTask(null);
        return;
      }
      newColumn = targetTask.column;
    }

    // Clear active task after a short delay to show drop animation
    setTimeout(() => setActiveTask(null), 100);

    // Don't move if it's the same column
    if (task.column === newColumn) return;

    // Move the task with optimistic update
    moveTaskMutation.mutate({ taskId, newColumn });
  };

  // Filter tasks based on search query
  const filteredTasks = tasks?.filter((task) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query)
    );
  });

  // Show loading skeleton while fetching (only after mounted to prevent hydration issues)
  if (!isMounted || isLoading) {
    return <LoadingSkeleton />;
  }

  // Show error message if fetch failed
  if (error) {
    return (
      <Container maxWidth="xl" className="py-8">
        <Box className="text-center text-red-600">
          <p>Failed to load tasks. Please make sure the API server is running.</p>
          <p className="text-sm mt-2">Run: npm run server</p>
        </Box>
      </Container>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header with title and actions */}
      <Header />

      {/* Search bar */}
      <Container maxWidth="xl" sx={{ pt: { xs: 9, sm: 10 }, pb: { xs: 2, sm: 2.5 }, px: { xs: 2, sm: 3 } }}>
        <SearchBar />
      </Container>

      {/* Kanban Board with Drag and Drop */}
      <Container maxWidth="xl" sx={{ pb: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3 } }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* Grid of columns - Responsive layout */}
          <Box
            sx={{
              display: 'grid',
              gap: { xs: 2, sm: 2.5, md: 3 },
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
            }}
          >
            {COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={filteredTasks?.filter((task) => task.column === column.id) || []}
              />
            ))}
          </Box>

          {/* Drag overlay - shows the card being dragged */}
          <DragOverlay>
            {activeTask ? (
              <div className="opacity-90">
                <TaskCard task={activeTask} isDragging />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </Container>
    </div>
  );
}
