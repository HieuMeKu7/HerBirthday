// src/components/ChatInput.js
import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack'; // For arranging buttons

const ChatInput = ({ responseOptions, onSelectChoice, disabled }) => {
  if (disabled && (!responseOptions || responseOptions.length === 0)) {
    return (
      <Box sx={{ padding: 2, textAlign: 'center', color: 'text.secondary' }}>
        Waiting for response...
      </Box>
    );
  }
  
  if (!responseOptions || responseOptions.length === 0) {
    return (
      <Box sx={{ padding: 2, textAlign: 'center', color: 'text.secondary' }}>
        Waiting for next part of conversation...
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '10px' }}>
      <Stack direction="column" spacing={1} alignItems="stretch">
        {responseOptions.map((option, index) => (
          <Button
            key={index}
            variant="outlined"
            color="primary"
            onClick={() => onSelectChoice(option)}
            disabled={disabled}
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              padding: '10px 15px',
            }}
          >
            {option.text}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

// Default props for when no options are available yet
ChatInput.defaultProps = {
  responseOptions: [],
  onSelectChoice: () => console.log('Choice selected (default)'),
  disabled: false,
};

export default ChatInput; 