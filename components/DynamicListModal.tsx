/**
 * Dynamic List Modal Component
 * jQuery-based dynamic list with add/remove functionality
 * Features:
 * - Add items to a list
 * - Delete items with fade animation
 * - Form validation with error message
 */

'use client';

import { useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import $ from 'jquery';

interface DynamicListModalProps {
  open: boolean;
  onClose: () => void;
  taskTitle: string;
}

export default function DynamicListModal({ open, onClose, taskTitle }: DynamicListModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !modalRef.current) return;

    const $modal = $(modalRef.current);
    const $input = $modal.find('.dynamic-list-input');
    const $addButton = $modal.find('.add-item-btn');
    const $errorMessage = $modal.find('.error-message');
    const $listContainer = $modal.find('.list-container');

    // Clear existing handlers
    $addButton.off('click');
    $input.off('keypress');

    // Add item handler
    const addItem = () => {
      const inputValue = $input.val() as string;

      if (!inputValue.trim()) {
        // Show error message
        $errorMessage.fadeIn(200);

        // Fade out after 2 seconds
        setTimeout(() => {
          $errorMessage.fadeOut(200);
        }, 2000);
        return;
      }

      // Create new list item
      const $listItem = $(`
        <div class="list-item" style="display: none;">
          <span class="item-text">${inputValue}</span>
          <button class="delete-btn">Delete</button>
        </div>
      `);

      // Add delete handler
      $listItem.find('.delete-btn').on('click', function() {
        $(this).closest('.list-item').fadeOut(300, function() {
          $(this).remove();
        });
      });

      // Append and fade in
      $listContainer.append($listItem);
      $listItem.fadeIn(300);

      // Clear input
      $input.val('');
      $input.focus();
    };

    // Click handler
    $addButton.on('click', addItem);

    // Enter key handler
    $input.on('keypress', (e) => {
      if (e.which === 13) {
        addItem();
      }
    });

    // Focus input when modal opens
    setTimeout(() => {
      $input.focus();
    }, 100);

    // Cleanup
    return () => {
      $addButton.off('click');
      $input.off('keypress');
      $listContainer.find('.delete-btn').off('click');
    };
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
            onClick={onClose}
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

      <DialogContent sx={{ pt: 4, px: 3, pb: 4 }} ref={modalRef}>
        {/* Input and Add Button */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <input
            type="text"
            className="dynamic-list-input"
            placeholder="Enter a new item"
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
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(80, 80, 80, 0.6)';
            }}
          />
          <button
            className="add-item-btn"
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
        <div
          className="error-message"
          style={{
            display: 'none',
            color: '#ef4444',
            fontSize: '0.95rem',
            marginBottom: '20px',
            padding: '12px 16px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            fontWeight: 500,
          }}
        >
          Please enter an item
        </div>

        {/* Separator */}
        <Box
          sx={{
            height: '1px',
            background: 'rgba(80, 80, 80, 0.4)',
            mb: 3,
          }}
        />

        {/* List Container */}
        <div className="list-container">
          <style jsx>{`
            .list-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 16px 20px;
              margin-bottom: 12px;
              background: rgba(30, 30, 30, 0.8);
              border: 1px solid rgba(80, 80, 80, 0.6);
              border-radius: 10px;
              transition: all 0.3s;
            }

            .list-item:hover {
              background: rgba(40, 40, 40, 0.9);
              border-color: rgba(100, 100, 100, 0.7);
            }

            .item-text {
              flex: 1;
              font-size: 1rem;
              color: #ffffff;
              font-weight: 500;
            }

            .delete-btn {
              padding: 8px 20px;
              font-size: 0.9rem;
              font-weight: 600;
              border-radius: 6px;
              border: 1px solid rgba(239, 68, 68, 0.5);
              background: rgba(239, 68, 68, 0.15);
              color: #ef4444;
              cursor: pointer;
              transition: all 0.2s;
            }

            .delete-btn:hover {
              background: rgba(239, 68, 68, 0.25);
              border-color: rgba(239, 68, 68, 0.7);
              transform: scale(1.05);
            }
          `}</style>
        </div>
      </DialogContent>
    </Dialog>
  );
}
