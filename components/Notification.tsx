/**
 * Notification Component
 * Displays toast notifications for user feedback
 * Features:
 * - Auto-dismiss after 3 seconds
 * - Different types (success, error, info, warning)
 * - Smooth animations
 */

'use client';

import { useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { hideNotification } from '@/lib/redux/slices/uiSlice';

export default function Notification() {
  const dispatch = useAppDispatch();
  const { showNotification, notificationMessage, notificationType } = useAppSelector(
    (state) => state.ui
  );

  // Auto-dismiss after 3 seconds
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        dispatch(hideNotification());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showNotification, dispatch]);

  const handleClose = () => {
    dispatch(hideNotification());
  };

  return (
    <Snackbar
      open={showNotification}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{
        '& .MuiPaper-root': {
          minWidth: '300px',
        },
      }}
    >
      <Alert
        onClose={handleClose}
        severity={notificationType}
        variant="filled"
        className="animate-slide-up"
        sx={{
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          fontWeight: 500,
          fontSize: '0.9rem',
          '& .MuiAlert-icon': {
            fontSize: '24px',
          },
          '& .MuiAlert-action': {
            paddingTop: 0,
          },
        }}
      >
        {notificationMessage}
      </Alert>
    </Snackbar>
  );
}
