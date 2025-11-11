/**
 * Search Bar Component
 * Search tasks by title or description with debouncing
 * Features:
 * - Debounced search input (300ms)
 * - Search icon and clear button
 * - Tooltip explaining search functionality
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { TextField, InputAdornment, IconButton, Tooltip, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setSearchQuery } from '@/lib/redux/slices/tasksSlice';
import { debounce } from '@/lib/utils';
import { SEARCH_DEBOUNCE_DELAY } from '@/lib/constants';

export default function SearchBar() {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.tasks.searchQuery);
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Debounced search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query) => {
      dispatch(setSearchQuery(query as string));
    }, SEARCH_DEBOUNCE_DELAY),
    [dispatch]
  );

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalQuery(value);
    debouncedSearch(value);
  };

  // Handle clear
  const handleClear = () => {
    setLocalQuery('');
    dispatch(setSearchQuery(''));
  };

  // Sync with Redux store
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  return (
    <Paper
      elevation={0}
      className="glass overflow-hidden"
      sx={{
        background: 'rgba(30, 30, 30, 0.7)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(60, 60, 60, 0.6)',
        borderRadius: '10px',
      }}
    >
      <Tooltip
        title="Search tasks by title or description. Results update as you type."
        arrow
        placement="top"
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search tasks..."
          value={localQuery}
          onChange={handleChange}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'rgba(160, 160, 160, 0.9)' }} />
              </InputAdornment>
            ),
            endAdornment: localQuery && (
              <InputAdornment position="end">
                <Tooltip title="Clear search" arrow>
                  <IconButton
                    onClick={handleClear}
                    edge="end"
                    size="small"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.9)',
                      },
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#ffffff',
              fontSize: { xs: '0.85rem', sm: '0.95rem' },
              padding: { xs: '4px 8px', sm: '6px 10px' },
              '& fieldset': {
                border: 'none',
              },
              '& input': {
                padding: { xs: '6px 0', sm: '8px 0' },
              },
              '& input::placeholder': {
                color: 'rgba(160, 160, 160, 0.7)',
                opacity: 1,
              },
            },
          }}
        />
      </Tooltip>
    </Paper>
  );
}
