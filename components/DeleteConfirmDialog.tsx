/**
 * Delete Confirmation Dialog Component
 * Shows a beautiful confirmation dialog before deleting a task
 */

'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { Task } from '@/types';

interface DeleteConfirmDialogProps {
  open: boolean;
  task: Task | null;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export default function DeleteConfirmDialog({
  open,
  task,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(40, 40, 40, 0.98)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(239, 68, 68, 0.3), 0 0 0 1px rgba(239, 68, 68, 0.1)',
        },
      }}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(4px)',
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(80, 80, 80, 0.3)',
        }}
      >
        <Box className="flex items-center gap-2">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            <WarningAmberRoundedIcon
              sx={{
                color: '#ef4444',
                fontSize: 24,
              }}
            />
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: '#ffffff',
              fontWeight: 600,
              fontSize: { xs: '1rem', sm: '1.1rem' },
              pl: 1.5,
            }}
          >
            Delete Task
          </Typography>
        </Box>
        <IconButton
          onClick={onCancel}
          size="small"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            mb: 2,
            fontSize: { xs: '0.9rem', sm: '0.95rem' },
          }}
        >
          Are you sure you want to delete this task? This action cannot be undone.
        </Typography>

        {task && (
          <Box
            sx={{
              p: 2,
              borderRadius: '10px',
              background: 'rgba(20, 20, 20, 0.6)',
              border: '1px solid rgba(60, 60, 60, 0.5)',
            }}
          >
            <Typography
              sx={{
                color: '#ffffff',
                fontWeight: 600,
                mb: 0.5,
                fontSize: { xs: '0.85rem', sm: '0.9rem' },
              }}
            >
              {task.title}
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                lineHeight: 1.4,
              }}
            >
              {task.description.length > 100
                ? `${task.description.substring(0, 100)}...`
                : task.description}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 2.5,
          background: 'rgba(20, 20, 20, 0.4)',
          borderTop: '1px solid rgba(80, 80, 80, 0.3)',
          gap: 1.5,
        }}
      >
        <Button
          onClick={onCancel}
          disabled={isDeleting}
          variant="outlined"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            borderColor: 'rgba(80, 80, 80, 0.6)',
            px: 2.5,
            fontWeight: 600,
            '&:hover': {
              borderColor: 'rgba(120, 120, 120, 0.8)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={onConfirm}
          disabled={isDeleting}
          variant="contained"
          startIcon={<DeleteIcon />}
          sx={{
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            px: 2.5,
            fontWeight: 600,
            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              boxShadow: '0 6px 20px rgba(239, 68, 68, 0.5)',
              transform: 'translateY(-1px)',
            },
            '&:disabled': {
              background: 'rgba(100, 100, 100, 0.3)',
              color: 'rgba(255, 255, 255, 0.4)',
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {isDeleting ? 'Deleting...' : 'Delete Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
