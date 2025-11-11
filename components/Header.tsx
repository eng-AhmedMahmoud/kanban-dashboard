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
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar className="py-3 sm:py-4">
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
            placement="left"
          >
            <Button
              variant="contained"
              color="inherit"
              startIcon={<AddCircleOutlineIcon className="hidden sm:block" />}
              onClick={() => dispatch(openCreateTaskModal())}
              sx={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                color: '#3b82f6',
                fontWeight: 600,
                padding: { xs: '6px 12px', sm: '8px 20px' },
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
