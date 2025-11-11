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
    <AppBar position="static" elevation={0} className="bg-gradient-to-r from-blue-600 to-blue-800">
      <Container maxWidth="xl">
        <Toolbar className="py-4">
          <Box className="flex items-center gap-3 flex-1">
            <Tooltip title="Kanban Dashboard" arrow>
              <DashboardIcon className="text-4xl" />
            </Tooltip>
            <Box>
              <Typography variant="h4" component="h1" className="font-bold">
                Kanban Dashboard
              </Typography>
              <Typography variant="body2" className="opacity-90">
                Organize your tasks with drag-and-drop simplicity
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
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => dispatch(openCreateTaskModal())}
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
            >
              New Task
            </Button>
          </Tooltip>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
