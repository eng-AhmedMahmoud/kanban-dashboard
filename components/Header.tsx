/**
 * Header Component
 * Application header with title, description, and action buttons
 */

'use client';

import { AppBar, Toolbar, Typography, Container, Button, Box, Tooltip } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useAppDispatch } from '@/lib/redux/hooks';
import { openCreateTaskModal } from '@/lib/redux/slices/uiSlice';

export default function Header() {
  const dispatch = useAppDispatch();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      className="glass-strong"
      sx={{
        background: 'rgba(20, 20, 20, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(80, 80, 80, 0.3)',
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        <Toolbar className="py-2 sm:py-3" sx={{ minHeight: { xs: '56px', sm: '64px' } }}>
          <Box className="flex items-center gap-2 sm:gap-3 flex-1">
            <Tooltip title="Kanban Dashboard" arrow>
              <DashboardIcon
                className="text-3xl sm:text-4xl"
                sx={{
                  color: 'white',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }}
              />
            </Tooltip>
            <Box className="hidden sm:block">
              <Typography
                variant="h4"
                component="h1"
                className="font-bold"
                sx={{
                  color: 'white',
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  fontSize: { xs: '1.5rem', sm: '2rem' }
                }}
              >
                Kanban Dashboard
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  textShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              >
                Organize your tasks with drag-and-drop simplicity
              </Typography>
            </Box>
            <Box className="block sm:hidden">
              <Typography
                variant="h6"
                component="h1"
                className="font-bold"
                sx={{
                  color: 'white',
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                }}
              >
                Kanban
              </Typography>
            </Box>
          </Box>

          <Tooltip
            title="Create a new task in any column"
            arrow
            placement="bottom"
          >
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon sx={{ fontSize: { xs: 20, sm: 22 } }} />}
              onClick={() => dispatch(openCreateTaskModal('header'))}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backdropFilter: 'blur(10px)',
                color: '#ffffff',
                fontWeight: 700,
                padding: { xs: '8px 16px', sm: '10px 24px' },
                fontSize: { xs: '0.85rem', sm: '0.95rem' },
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #6a4190 100%)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                },
              }}
            >
              <span className="hidden sm:inline">New Task</span>
              <span className="inline sm:hidden">New</span>
            </Button>
          </Tooltip>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
