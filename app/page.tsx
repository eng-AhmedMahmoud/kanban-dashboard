/**
 * Home Page - Main Kanban Dashboard
 * This is the main entry point of the application
 */

import KanbanBoard from '@/components/KanbanBoard';
import TaskModal from '@/components/TaskModal';
import Notification from '@/components/Notification';

export default function Home() {
  return (
    <>
      <KanbanBoard />
      <TaskModal />
      <Notification />
    </>
  );
}
