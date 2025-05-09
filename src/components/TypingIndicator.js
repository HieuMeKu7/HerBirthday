// src/components/TypingIndicator.js
import React from 'react';
import Box from '@mui/material/Box';
import { keyframes } from '@mui/system'; // MUI's utility for CSS keyframes

// Define the bounce animation for the dots
const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.0);
    opacity: 1;
  }
`;

const TypingIndicator = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'flex-start', // Align to the start like a persona message
        padding: '10px 15px', // Match MessageBubble padding
        marginBottom: 1,
      }}
    >
      <Box
        sx={{
          width: 10,
          height: 10,
          backgroundColor: 'text.secondary', // Use a theme-aware color
          borderRadius: '50%',
          animation: `${bounce} 1.4s infinite ease-in-out both`,
          margin: '0 3px',
        }}
      />
      <Box
        sx={{
          width: 10,
          height: 10,
          backgroundColor: 'text.secondary',
          borderRadius: '50%',
          animation: `${bounce} 1.4s infinite ease-in-out both`,
          animationDelay: '0.16s', // Stagger animation
          margin: '0 3px',
        }}
      />
      <Box
        sx={{
          width: 10,
          height: 10,
          backgroundColor: 'text.secondary',
          borderRadius: '50%',
          animation: `${bounce} 1.4s infinite ease-in-out both`,
          animationDelay: '0.32s', // Stagger animation
          margin: '0 3px',
        }}
      />
    </Box>
  );
};

export default TypingIndicator; 