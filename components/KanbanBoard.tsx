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
      // Optimistic update - update UI immediately before server responds
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

      // Update the task in the cache
      if (previousTasks) {
        const updatedTasks = previousTasks.map((task) =>
          task.id === taskId ? { ...task, column: newColumn } : task
        );
        queryClient.setQueryData(['tasks'], updatedTasks);
        dispatch(moveTaskRedux({ taskId, newColumn }));
      }

      return { previousTasks };
    },
    onError: (_error, _variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      dispatch(
        showNotification({
          message: 'Failed to move task. Please try again.',
          type: 'error',
        })
      );
    },
    onSuccess: () => {
      dispatch(
        showNotification({
          message: 'Task moved successfully!',
          type: 'success',
        })
      );
    },
    onSettled: () => {
      // Refetch to ensure sync with server
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

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
    setActiveTask(null);

    if (!over) return;

    const taskId = Number(active.id);
    const newColumn = over.id as ColumnType;

    const task = tasks?.find((t) => t.id === taskId);
    if (!task || task.column === newColumn) return;

    // Move the task
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

  // Show loading skeleton while fetching
  if (isLoading) {
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
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 2.5 }, px: { xs: 2, sm: 3 } }}>
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
