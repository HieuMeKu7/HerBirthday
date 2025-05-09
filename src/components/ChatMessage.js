import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box } from '@mui/material';
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

  return (
    <Paper 
      elevation={1} 
      sx={{
        p: 1.5,
        mb: 1,
        maxWidth: '70%',
        wordBreak: 'break-word',
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        bgcolor: bgColor,
        color: textColor,
        borderRadius: borderRadiusStyle,
        display: 'inline-block', // Ensures Paper shrinks to content
        opacity: msg.id === 'temp-typing' ? 0.7 : 1 // For potential future 'is typing' message objects
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
      {/* Optional: Display timestamp or sender name for persona messages */}
      {/* {msg.sender === 'persona' && <Typography variant="caption" sx={{display: 'block', textAlign: isUser ? 'right' : 'left'}}>{msg.persona}</Typography>} */}
    </Paper>
  );
};

export default ChatMessage; 