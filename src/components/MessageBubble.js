// src/components/MessageBubble.js
import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grow from '@mui/material/Grow';
import Avatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material/styles';

const MessageBubble = ({ message, isUserMessage }) => {
  const theme = useTheme();
  const alignment = isUserMessage ? 'flex-end' : 'flex-start';
  
  // Avatar details
  const avatarInitial = isUserMessage ? 'U' : message.sender === 'persona' ? 'P' : 'S'; // 'S' for Shop if we differentiate later
  const avatarColor = isUserMessage 
    ? theme.palette.secondary.main // User avatar color (can be customized)
    : theme.palette.primary.main;  // Persona avatar color

  // Bubble styles
  const bubbleBackgroundColor = isUserMessage ? 'primary.main' : 'background.paper';
  const bubbleTextColor = isUserMessage ? 'primary.contrastText' : 'text.primary';
  const borderRadius = isUserMessage 
    ? '20px 5px 20px 20px'  // Tail on the right
    : '5px 20px 20px 20px'; // Tail on the left

  const UserAvatar = (
    <Avatar sx={{ 
      bgcolor: avatarColor, 
      width: 32, 
      height: 32, 
      marginLeft: 1, // Space between bubble and avatar
      fontSize: '0.9rem'
    }}>
      {avatarInitial}
    </Avatar>
  );

  const PersonaAvatar = (
    <Avatar sx={{ 
      bgcolor: avatarColor, 
      width: 32, 
      height: 32, 
      marginRight: 1, // Space between avatar and bubble
      fontSize: '0.9rem'
    }}>
      {avatarInitial}
    </Avatar>
  );

  return (
    <Box sx={{ display: 'flex', justifyContent: alignment, marginBottom: 1, alignItems: 'flex-end' }}>
      {!isUserMessage && PersonaAvatar} {/* Persona avatar on the left */}
      <Grow in={true} timeout={500}>
        <Paper 
          elevation={1} 
          sx={{ 
            padding: '10px 15px', 
            display: 'inline-block', 
            maxWidth: 'calc(70% - 40px)', // Adjust maxWidth to account for avatar
            backgroundColor: bubbleBackgroundColor,
            color: bubbleTextColor,
            borderRadius: borderRadius,
            wordBreak: 'break-word',
          }}
        >
          <Typography variant="body1">{message.text}</Typography>
          <Typography 
            variant="caption" 
            sx={{
              fontSize: '0.65rem', 
              display: 'block', 
              textAlign: 'right', 
              marginTop: '5px',
              color: isUserMessage ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary' 
            }}
          >
            {message.timestamp}
          </Typography>
        </Paper>
      </Grow>
      {isUserMessage && UserAvatar} {/* User avatar on the right */}
    </Box>
  );
};

export default MessageBubble; 