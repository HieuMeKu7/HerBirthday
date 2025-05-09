import React, { useState, useEffect, useCallback } from 'react';
import { Box, Container, TextField, Typography, Paper, Button, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { hueManTheme, tiemCuonLenTheme } from './themes';
import dialogueScript from './dialogue.json';
import ChatMessage from './components/ChatMessage';

function App() {
  const [activePersona, setActivePersona] = useState('hueMan');
  const [hueManNickname, setHueManNickname] = useState('Tran Hue Man');
  const [tiemCuonLenNickname, setTiemCuonLenNickname] = useState('Tiem Cuon Len');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [currentScriptIndex, setCurrentScriptIndex] = useState(0);
  const [isPersonaTyping, setIsPersonaTyping] = useState(false);
  const [waitingForUserInput, setWaitingForUserInput] = useState(false);
  const [seenMarkerMessageId, setSeenMarkerMessageId] = useState(null);

  const currentTheme = activePersona === 'hueMan' ? hueManTheme : tiemCuonLenTheme;
  const currentNickname = activePersona === 'hueMan' ? hueManNickname : tiemCuonLenNickname;
  const otherNickname = activePersona === 'hueMan' ? tiemCuonLenNickname : hueManNickname;

  const addMessageToChat = useCallback((message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    if (message.sender === 'persona') {
      setSeenMarkerMessageId(null);
    }
  }, []);

  const processNextScriptMessage = useCallback(() => {
    if (currentScriptIndex < dialogueScript.length) {
      const scriptEntry = dialogueScript[currentScriptIndex];

      if (scriptEntry.type === 'action') {
        setIsPersonaTyping(false);
        if (scriptEntry.action_type === 'change_nickname') {
          setTimeout(() => {
            if (scriptEntry.target_persona_key === 'hueMan') {
              setHueManNickname(scriptEntry.new_nickname);
            } else if (scriptEntry.target_persona_key === 'tiemCuonLen') {
              setTiemCuonLenNickname(scriptEntry.new_nickname);
            }
            const nextIndex = currentScriptIndex + 1;
            setCurrentScriptIndex(nextIndex);
          }, scriptEntry.delay || 0);
        } else {
          setCurrentScriptIndex(prevIndex => prevIndex + 1);
        }
        return;
      }

      const scriptPersonaName = scriptEntry.persona;
      const activePersonaName = activePersona === 'hueMan' ? 'Tran Hue Man' : 'Tiem Cuon Len';

      if (scriptPersonaName === activePersonaName) {
        setIsPersonaTyping(true);
        setWaitingForUserInput(false);

        setTimeout(() => {
          const personaMessage = {
            id: scriptEntry.id || Date.now().toString(),
            text: scriptEntry.text,
            sender: 'persona',
            persona: scriptEntry.persona,
            timestamp: new Date(),
          };
          addMessageToChat(personaMessage);
          setIsPersonaTyping(false);
          setCurrentScriptIndex(prevIndex => prevIndex + 1);

          if (scriptEntry.expectsUserInputAfter) {
            setWaitingForUserInput(true);
          } 
        }, scriptEntry.delay || 500);
      }
    }
  }, [currentScriptIndex, addMessageToChat, activePersona]);

  useEffect(() => {
    if (!waitingForUserInput && currentScriptIndex < dialogueScript.length) {
      const scriptEntry = dialogueScript[currentScriptIndex];
      
      if (scriptEntry.type === 'action') {
        processNextScriptMessage();
      } else if (scriptEntry.persona === (activePersona === 'hueMan' ? hueManNickname : tiemCuonLenNickname)) {
        const activeBasePersonaName = activePersona === 'hueMan' ? 'Tran Hue Man' : 'Tiem Cuon Len';
        if (scriptEntry.persona === activeBasePersonaName) {
          processNextScriptMessage();
        }
      }
    }
  }, [currentScriptIndex, waitingForUserInput, processNextScriptMessage, activePersona, hueManNickname, tiemCuonLenNickname]);
  
  useEffect(() => {
    const activeBasePersonaName = activePersona === 'hueMan' ? 'Tran Hue Man' : 'Tiem Cuon Len';
    const firstEntryIndexForPersona = dialogueScript.findIndex(
        script => (script.persona === activeBasePersonaName) || 
                  (script.type === 'action' && script.target_persona_key === activePersona) ||
                  (script.type === 'action' && !script.target_persona_key)
    );
    if (firstEntryIndexForPersona !== -1) {
        setCurrentScriptIndex(firstEntryIndexForPersona);
    } else {
        setCurrentScriptIndex(0);
    }
    setWaitingForUserInput(false);
  }, [activePersona]);

  const togglePersona = () => {
    setActivePersona(prevPersona => prevPersona === 'hueMan' ? 'tiemCuonLen' : 'hueMan');
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    const newMessage = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      persona: 'Duong Trung Hieu',
      timestamp: new Date(),
    };
    addMessageToChat(newMessage);
    setInputValue('');

    let lastPersonaMsgId = null;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === 'persona') {
        lastPersonaMsgId = messages[i].id;
        break;
      }
    }
    if (lastPersonaMsgId) {
      setSeenMarkerMessageId(lastPersonaMsgId);
    }

    if (waitingForUserInput) {
      setWaitingForUserInput(false);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ pt: 2, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Box sx={{ mb: 2, flexShrink: 0 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Chat with {currentNickname}
          </Typography>
          <Button variant="outlined" onClick={togglePersona} sx={{ mb: 1 }}>
            Switch to {otherNickname}'s View
          </Button>
        </Box>
        <Paper elevation={3} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column-reverse' 
            }}
          >
            {messages.length === 0 && !isPersonaTyping ? (
              <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
                No messages yet. Start a conversation!
              </Typography>
            ) : (
              messages.map((msg) => (
                <ChatMessage 
                  key={msg.id} 
                  msg={msg} 
                  currentTheme={currentTheme} 
                  shouldShowSeenIndicator={msg.sender === 'persona' && msg.id === seenMarkerMessageId}
                />
              ))
            )}
            {isPersonaTyping && (
              <Typography sx={{ textAlign: 'left', color: 'text.secondary', fontStyle: 'italic', p:1, mb:1 }}>
                {currentNickname} is typing...
              </Typography>
            )}
          </Box>
          <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={waitingForUserInput ? "Reply to continue..." : "Type a message..."}
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              sx={{ mr: 1 }}
              disabled={isPersonaTyping || (dialogueScript[currentScriptIndex] && !dialogueScript[currentScriptIndex].expectsUserInputAfter && currentScriptIndex < dialogueScript.length && !waitingForUserInput)}
            />
            <Button variant="contained" onClick={handleSendMessage} disabled={!inputValue.trim() || isPersonaTyping || (dialogueScript[currentScriptIndex] && !dialogueScript[currentScriptIndex].expectsUserInputAfter && currentScriptIndex < dialogueScript.length && !waitingForUserInput)}>
              Send
            </Button>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App; 