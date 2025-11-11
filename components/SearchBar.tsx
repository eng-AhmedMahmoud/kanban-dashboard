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
    <Paper elevation={2} className="overflow-hidden">
      <Tooltip
        title="Search tasks by title or description. Results update as you type."
        arrow
        placement="top"
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search tasks by title or description..."
          value={localQuery}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className="text-gray-400" />
              </InputAdornment>
            ),
            endAdornment: localQuery && (
              <InputAdornment position="end">
                <Tooltip title="Clear search" arrow>
                  <IconButton onClick={handleClear} edge="end" size="small">
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                border: 'none',
              },
            },
          }}
        />
      </Tooltip>
    </Paper>
  );
}
