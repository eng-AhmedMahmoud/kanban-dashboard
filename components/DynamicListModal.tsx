/**
 * Dynamic List Modal Component
 * React-based dynamic list with add/remove functionality
 * Features:
 * - Add items to a list
 * - Delete items with fade animation
 * - Form validation with error message
 */

'use client';

import { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface DynamicListModalProps {
  open: boolean;
  onClose: () => void;
  taskTitle: string;
}

interface ListItem {
  id: number;
  text: string;
  isDeleting: boolean;
}

export default function DynamicListModal({ open, onClose, taskTitle }: DynamicListModalProps) {
  const [inputValue, setInputValue] = useState('');
  const [showError, setShowError] = useState(false);
  const [items, setItems] = useState<ListItem[]>([]);
  const [nextId, setNextId] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle add item
  const handleAddItem = () => {
    if (!inputValue.trim()) {
      // Show error message
      setShowError(true);

      // Hide after 2 seconds
      setTimeout(() => {
        setShowError(false);
      }, 2000);
      return;
    }

    // Add new item
    const newItem: ListItem = {
      id: nextId,
      text: inputValue,
      isDeleting: false,
    };

    setItems([...items, newItem]);
    setNextId(nextId + 1);
    setInputValue('');

    // Focus input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // Handle delete item
  const handleDeleteItem = (id: number) => {
    // Mark as deleting for animation
    setItems(items.map(item =>
      item.id === id ? { ...item, isDeleting: true } : item
    ));

    // Remove after animation
    setTimeout(() => {
      setItems(items.filter(item => item.id !== id));
    }, 300);
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  // Reset state when modal closes
  const handleClose = () => {
    setInputValue('');
    setShowError(false);
    setItems([]);
    setNextId(1);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(40, 40, 40, 0.98)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(80, 80, 80, 0.6)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <span className="text-lg sm:text-xl font-bold">Dynamic List</span>
          <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>{taskTitle}</span>
        </Box>
        <Tooltip title="Close" arrow>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      <DialogContent sx={{ pt: 5, pb: 5, px: { xs: 2, sm: 3 } }}>
        {/* Input and Add Button */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 3
        }}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a new item"
            autoFocus
            style={{
              flex: 1,
              padding: '14px 16px',
              fontSize: '1rem',
              borderRadius: '8px',
              border: '1px solid rgba(80, 80, 80, 0.6)',
              background: 'rgba(30, 30, 30, 0.8)',
              color: '#ffffff',
              outline: 'none',
              transition: 'border-color 0.2s',
              width: '100%',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(80, 80, 80, 0.6)';
            }}
          />
          <button
            onClick={handleAddItem}
            style={{
              padding: '14px 32px',
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #5b7ec8 0%, #6b5a9c 100%)',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #4d6bb0 0%, #5d4c88 100%)';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #5b7ec8 0%, #6b5a9c 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
            }}
          >
            Add Item
          </button>
        </Box>

        {/* Error Message */}
        <Box
          sx={{
            display: showError ? 'block' : 'none',
            color: '#ef4444',
            fontSize: '0.95rem',
            mb: 3,
            p: '12px 16px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            fontWeight: 500,
            animation: showError ? 'fadeIn 0.2s' : 'none',
            '@keyframes fadeIn': {
              from: { opacity: 0 },
              to: { opacity: 1 },
            },
          }}
        >
          Please enter an item
        </Box>

        {/* Separator */}
        <Box
          sx={{
            height: '1px',
            background: 'rgba(80, 80, 80, 0.4)',
            mb: 3,
          }}
        />

        {/* List Container */}
        <Box>
          {items.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', sm: 'center' },
                gap: { xs: 2, sm: 3 },
                p: { xs: '12px', sm: '14px 16px' },
                mb: 2,
                background: 'rgba(30, 30, 30, 0.8)',
                border: '1px solid rgba(80, 80, 80, 0.6)',
                borderRadius: '10px',
                transition: 'all 0.3s',
                opacity: item.isDeleting ? 0 : 1,
                transform: item.isDeleting ? 'scale(0.95)' : 'scale(1)',
                '&:hover': {
                  background: 'rgba(40, 40, 40, 0.9)',
                  borderColor: 'rgba(100, 100, 100, 0.7)',
                },
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  fontSize: '1rem',
                  color: '#ffffff',
                  fontWeight: 500,
                  wordBreak: 'break-word',
                }}
              >
                {item.text}
              </Box>
              <button
                onClick={() => handleDeleteItem(item.id)}
                style={{
                  padding: '8px 20px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#ef4444',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.7)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Delete
              </button>
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
