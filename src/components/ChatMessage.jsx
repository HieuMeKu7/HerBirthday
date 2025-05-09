
import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Avatar, Link } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const ChatMessage = ({ msg, currentTheme, shouldShowSeenIndicator }) => {
  const [displayText, setDisplayText] = useState('');
  const [crossedText, setCrossedText] = useState('');
  const [finalTextPart, setFinalTextPart] = useState('');

  const isUser = msg.sender === 'user';
  const isSystem = msg.sender === 'system';
  const isTranHueMan = msg.persona === 'Tran Hue Man' && !isSystem;
  const hasSpecialText = isTranHueMan && typeof msg.text === 'object' && msg.text !== null;

  useEffect(() => {
    if (hasSpecialText) {
      setDisplayText(msg.text.preview || '');
      setCrossedText('');
      setFinalTextPart('');
      const timer1 = setTimeout(() => setCrossedText(msg.text.crossedOut || ''), 700);
      const timer2 = setTimeout(() => setFinalTextPart(msg.text.final || ''), 1700);
      return () => { clearTimeout(timer1); clearTimeout(timer2); };
    } else {
      setDisplayText(msg.text || '');
      setCrossedText('');
      setFinalTextPart('');
    }
  }, [msg, hasSpecialText]);

  let bgColor, textColor, textAlign, elevation = 1, paperMaxWidth = '70%';
  let showAvatar = !isSystem;

  if (isUser) {
    bgColor = currentTheme.palette.primary.main;
    textColor = currentTheme.palette.primary.contrastText;
    textAlign = 'right';
  } else if (isSystem) {
    bgColor = 'transparent';
    textColor = currentTheme.palette.text.secondary;
    textAlign = 'center';
    elevation = 0;
    paperMaxWidth = '100%';
  } else if (msg.persona === 'Tran Hue Man') {
    bgColor = currentTheme.palette.secondary.light;
    textColor = currentTheme.palette.secondary.contrastText;
    textAlign = 'left';
  } else if (msg.persona === 'Tiem Cuon Len') {
    bgColor = currentTheme.palette.info.light;
    textColor = currentTheme.palette.info.contrastText;
    textAlign = 'left';
  } else {
    bgColor = currentTheme.palette.grey[200];
    textColor = currentTheme.palette.text.primary;
    textAlign = 'left';
  }
  
  const borderRadiusStyle = isUser ? '20px 20px 5px 20px' : '20px 20px 20px 5px';
  const formattedTime = msg.timestamp ? 
    new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
    '';
  const avatarInitials = !isUser && showAvatar && msg.nickname && !msg.avatarUrl ? msg.nickname.charAt(0).toUpperCase() : '';

  const renderTextContent = () => {
    if (hasSpecialText) {
      return (
        <Typography variant="body1" component="span" sx={{ color: textColor }}>
          <span dangerouslySetInnerHTML={{ __html: displayText }} />{' '}
          {crossedText && (
            <Typography variant="body1" component="span" sx={{ textDecoration: 'line-through', opacity: 0.7 }}>
              <span dangerouslySetInnerHTML={{ __html: crossedText }} />
            </Typography>
          )}
          {finalTextPart && (
             <Typography variant="body1" component="span">
                {' '}<span dangerouslySetInnerHTML={{ __html: finalTextPart }} />
             </Typography>
          )}
        </Typography>
      );
    }
    if (displayText || (isSystem && !msg.image_url && !msg.video_url)) {
        return <Typography variant="body1" dangerouslySetInnerHTML={{ __html: displayText || '' }} sx={{ color: textColor, fontStyle: isSystem ? 'italic' : 'normal' }} />;
    }
    return null;
  };

  const renderImageContent = () => {
    if (msg.image_url) {
      return (
        <Box sx={{ mt: displayText ? 1 : 0, mb: 0.5 }}>
          <img 
            src={msg.image_url} 
            alt="Chat image" 
            style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '10px', display: 'block' }}
          />
        </Box>
      );
    }
    return null;
  };

  const renderVideoContent = () => {
    if (msg.video_url) {
      let embedUrl = '';
      try {
        const url = new URL(msg.video_url);
        if (url.hostname === 'www.youtube.com' || url.hostname === 'youtube.com') {
          if (url.pathname === '/watch') {
            const videoId = url.searchParams.get('v');
            if (videoId) {
              embedUrl = `https://www.youtube.com/embed/${videoId}`;
            }
          } else if (url.pathname.startsWith('/embed/')) {
            embedUrl = msg.video_url;
          }
        }
      } catch (e) {
        console.error("Error parsing video URL:", e);
      }

      if (embedUrl) {
        return (
          <Box sx={{ 
            mt: (displayText || msg.image_url) ? 1 : 0, 
            position: 'relative',
            paddingBottom: '56.25%',
            height: 0,
            overflow: 'hidden',
            maxWidth: '100%',
            background: '#000',
            borderRadius: '8px'
          }}>
            <iframe 
              src={embedUrl}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={msg.text || 'Chat Video'}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            />
          </Box>
        );
      } else {
        return (
          <Box sx={{ mt: (displayText || msg.image_url) ? 1 : 0, textAlign: isSystem ? 'center' : 'inherit' }}>
            <Link href={msg.video_url} target="_blank" rel="noopener noreferrer">
              Watch Video: {msg.video_url}
            </Link>
          </Box>
        );
      }
    }
    return null;
  };

  return (
    <Box 
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : (isSystem ? 'center' : 'flex-start'),
        mb: 1,
        width: '100%'
      }}
    >
      {showAvatar && !isUser && (
        <Avatar 
          src={msg.avatarUrl || undefined} 
          sx={{ 
            mr: 1, 
            bgcolor: !msg.avatarUrl ? (msg.persona === 'Tran Hue Man' ? currentTheme.palette.secondary.main : currentTheme.palette.info.main) : undefined,
            color: !msg.avatarUrl ? (msg.persona === 'Tran Hue Man' ? currentTheme.palette.secondary.contrastText : currentTheme.palette.info.contrastText) : undefined,
            width: 36, 
            height: 36,
            alignSelf: 'flex-end'
          }}
        >
          {!msg.avatarUrl && avatarInitials ? avatarInitials : null}
        </Avatar>
      )}
      <Paper 
        elevation={elevation} 
        sx={{
          p: isSystem ? 0.5 : 1.5,
          maxWidth: paperMaxWidth,
          wordBreak: 'break-word',
          bgcolor: bgColor,
          borderRadius: isSystem ? '8px' : borderRadiusStyle,
          display: 'inline-block',
          opacity: msg.id === 'temp-typing' ? 0.7 : 1,
          textAlign: isSystem ? 'center' : 'inherit',
        }}
      >
        {renderTextContent()}
        {renderImageContent()}
        {renderVideoContent()}
        
        {(!isSystem || displayText || msg.image_url || msg.video_url) && (formattedTime || shouldShowSeenIndicator) && (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: isUser ? 'flex-end' : (isSystem ? 'center' : 'flex-start'), 
                alignItems: 'center', 
                mt: 0.5 
            }}>
            {formattedTime && (
                <Typography 
                variant="caption" 
                sx={{
                    fontSize: '0.65rem',
                    opacity: 0.7,
                    color: textColor,
                    mr: shouldShowSeenIndicator ? 0.5 : 0
                }}
                >
                {formattedTime}
                </Typography>
            )}
            {shouldShowSeenIndicator && (
                <CheckCircleOutlineIcon sx={{ fontSize: '0.8rem', opacity: 0.7, color: textColor }} />
            )}
            </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ChatMessage;
