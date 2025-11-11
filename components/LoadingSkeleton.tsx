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
    <Box
      sx={{
        minHeight: '100vh',
        background: '#0a0a0a',
      }}
    >
      {/* Header skeleton */}
      <Box
        sx={{
          py: 8,
          background: 'rgba(20, 20, 20, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(80, 80, 80, 0.3)',
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
          <Skeleton
            variant="text"
            width={300}
            height={40}
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
          />
          <Skeleton
            variant="text"
            width={400}
            height={20}
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', mt: 1 }}
          />
        </Container>
      </Box>

      {/* Search bar skeleton */}
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 2.5 }, px: { xs: 2, sm: 3 } }}>
        <Skeleton
          variant="rounded"
          height={56}
          sx={{
            bgcolor: 'rgba(30, 30, 30, 0.7)',
            borderRadius: '10px',
          }}
        />
      </Container>

      {/* Columns skeleton */}
      <Container maxWidth="xl" sx={{ pb: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3 } }}>
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
            <Paper
              key={column.id}
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                background: 'rgba(30, 30, 30, 0.7)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(60, 60, 60, 0.6)',
                borderRadius: '12px',
              }}
            >
              {/* Column header */}
              <Box sx={{ mb: 3 }}>
                <Skeleton
                  variant="text"
                  width="60%"
                  height={32}
                  sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
                />
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={40}
                  sx={{
                    mt: 1.5,
                    borderRadius: '8px',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  }}
                />
              </Box>

              {/* Task cards */}
              {[1, 2, 3].map((index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={150}
                    sx={{
                      borderRadius: '10px',
                      bgcolor: 'rgba(40, 40, 40, 0.8)',
                    }}
                  />
                </Box>
              ))}
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
