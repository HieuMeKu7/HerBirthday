import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Avatar } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const ChatMessage = ({ msg, currentTheme, shouldShowSeenIndicator }) => {
  const [displayText, setDisplayText] = useState('');
  const [crossedText, setCrossedText] = useState('');
  const [finalTextPart, setFinalTextPart] = useState('');

  const isUser = msg.sender === 'user';
  const isTranHueMan = msg.persona === 'Tran Hue Man';
  const hasSpecialText = typeof msg.text === 'object' && msg.text !== null;

  useEffect(() => {
    if (isTranHueMan && hasSpecialText) {
      setDisplayText(msg.text.preview || '');
      setCrossedText('');
      setFinalTextPart('');

      const timer1 = setTimeout(() => {
        setCrossedText(msg.text.crossedOut || '');
      }, 700); // Delay before showing crossed-out text

      const timer2 = setTimeout(() => {
        setFinalTextPart(msg.text.final || '');
      }, 1700); // Delay before showing final text (after crossed-out has appeared)

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setDisplayText(msg.text);
      setCrossedText('');
      setFinalTextPart('');
    }
  }, [msg, isTranHueMan, hasSpecialText]);

  // Determine background and text colors based on sender/persona
  let bgColor, textColor;
  if (isUser) {
    bgColor = currentTheme.palette.primary.main;
    textColor = currentTheme.palette.primary.contrastText;
  } else if (msg.persona === 'Tran Hue Man') {
    bgColor = currentTheme.palette.secondary.light;
    textColor = currentTheme.palette.secondary.contrastText;
  } else if (msg.persona === 'Tiem Cuon Len') {
    bgColor = currentTheme.palette.info.light; // Assuming info.light is defined in theme
    textColor = currentTheme.palette.info.contrastText;
  } else {
    bgColor = currentTheme.palette.grey[200]; // Fallback
    textColor = currentTheme.palette.text.primary;
  }
  
  // Custom border radius for chat bubble effect
  const borderRadiusStyle = isUser ? '20px 20px 5px 20px' : '20px 20px 20px 5px';

  const formattedTime = msg.timestamp ? 
    new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
    '';

  // Get initials for Avatar from persona nickname if no avatarUrl is present
  const avatarInitials = !isUser && msg.nickname && !msg.avatarUrl ? msg.nickname.charAt(0).toUpperCase() : '';

  return (
    <Box 
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 1,
      }}
    >
      {!isUser && (
        <Avatar 
          src={msg.avatarUrl || undefined} // Use avatarUrl if present, otherwise MUI handles initials if children are provided
          sx={{ 
            mr: 1, 
            bgcolor: !msg.avatarUrl ? (msg.persona === 'Tran Hue Man' ? currentTheme.palette.secondary.main : currentTheme.palette.info.main) : undefined,
            color: !msg.avatarUrl ? (msg.persona === 'Tran Hue Man' ? currentTheme.palette.secondary.contrastText : currentTheme.palette.info.contrastText) : undefined,
            width: 36, 
            height: 36,
            alignSelf: 'flex-end'
          }}
        >
          {/* Render initials only if src is not provided and initials are available */}
          {!msg.avatarUrl && avatarInitials ? avatarInitials : null}
        </Avatar>
      )}
      <Paper 
        elevation={1} 
        sx={{
          p: 1.5,
          maxWidth: '70%',
          wordBreak: 'break-word',
          bgcolor: bgColor,
          color: textColor,
          borderRadius: borderRadiusStyle,
          display: 'inline-block',
          opacity: msg.id === 'temp-typing' ? 0.7 : 1
        }}
      >
        {isTranHueMan && hasSpecialText ? (
          <Typography variant="body1" component="span">
            {displayText}{' '}
            {crossedText && (
              <Typography variant="body1" component="span" sx={{ textDecoration: 'line-through', opacity: 0.7 }}>
                {crossedText}
              </Typography>
            )}
            {finalTextPart && (
               <Typography variant="body1" component="span">
                  {' '}{finalTextPart}
               </Typography>
            )}
          </Typography>
        ) : (
          <Typography variant="body1">{displayText}</Typography>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 0.5 }}>
          {formattedTime && (
            <Typography 
              variant="caption" 
              sx={{
                fontSize: '0.65rem',
                opacity: 0.7,
                mr: shouldShowSeenIndicator ? 0.5 : 0
              }}
            >
              {formattedTime}
            </Typography>
          )}
          {shouldShowSeenIndicator && (
            <CheckCircleOutlineIcon sx={{ fontSize: '0.8rem', opacity: 0.7 }} />
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatMessage; 