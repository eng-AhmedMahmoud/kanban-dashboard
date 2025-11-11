/**
 * Root Layout Component
 * Provides the HTML structure and global providers for the application
 */

import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Kanban Dashboard | Task Management',
  description: 'Interactive Kanban-style task management dashboard built with Next.js, Redux, and Material UI',
  keywords: ['kanban', 'task management', 'dashboard', 'nextjs', 'redux'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
