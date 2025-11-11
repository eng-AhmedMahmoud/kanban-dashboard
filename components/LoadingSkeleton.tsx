/**
 * Loading Skeleton Component
 * Displays skeleton loaders while data is being fetched
 * Provides visual feedback during loading states
 */

'use client';

import { Container, Box, Skeleton, Paper } from '@mui/material';
import { COLUMNS } from '@/lib/constants';

export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header skeleton */}
      <Box className="bg-blue-600 py-8">
        <Container maxWidth="xl">
          <Skeleton variant="text" width={300} height={40} className="bg-white/20" />
          <Skeleton variant="text" width={400} height={20} className="bg-white/20 mt-2" />
        </Container>
      </Box>

      {/* Search bar skeleton */}
      <Container maxWidth="xl" className="py-6">
        <Skeleton variant="rounded" height={56} className="bg-white" />
      </Container>

      {/* Columns skeleton */}
      <Container maxWidth="xl" className="pb-8">
        <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLUMNS.map((column) => (
            <Paper key={column.id} className="p-4" elevation={2}>
              {/* Column header */}
              <Box className="mb-4">
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="rectangular" width="100%" height={40} className="mt-2 rounded" />
              </Box>

              {/* Task cards */}
              {[1, 2, 3].map((index) => (
                <Box key={index} className="mb-3">
                  <Skeleton variant="rectangular" width="100%" height={150} className="rounded" />
                </Box>
              ))}
            </Paper>
          ))}
        </Box>
      </Container>
    </div>
  );
}
