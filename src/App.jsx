
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
  const [hueManAvatarUrl, setHueManAvatarUrl] = useState('/images/HueMan.jpg');
  const [tiemCuonLenAvatarUrl, setTiemCuonLenAvatarUrl] = useState('/images/shop.jpg');
  const [userAvatarUrl, setUserAvatarUrl] = useState('/images/Hieu.jpg');
  const [messages, setMessages] = useState([]);
  const [currentScriptIndex, setCurrentScriptIndex] = useState(0);
  const [isPersonaTyping, setIsPersonaTyping] = useState(false);
  const [waitingForUserInput, setWaitingForUserInput] = useState(false);
  const [seenMarkerMessageId, setSeenMarkerMessageId] = useState(null);

  const currentTheme = activePersona === 'hueMan' ? hueManTheme : tiemCuonLenTheme;
  const currentTargetNickname = activePersona === 'hueMan' ? hueManNickname : tiemCuonLenNickname;
  const otherTargetNickname = activePersona === 'hueMan' ? tiemCuonLenNickname : hueManNickname;

  const addMessageToChat = useCallback((message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    if (message.sender === 'persona') { 
      setSeenMarkerMessageId(null);
    }
  }, []);

  const processNextScriptMessage = useCallback(() => {
    if (currentScriptIndex >= dialogueScript.length) {
      setIsPersonaTyping(false);
      return;
    }
    const scriptEntry = dialogueScript[currentScriptIndex];

    let isRelevant = false;
    const currentSpeaker = scriptEntry.speaker;
    const currentPartOfScript = scriptEntry.part_of_persona_script;

    if (currentSpeaker === "Hieu" || currentSpeaker === "System") {
      if (activePersona === 'hueMan' && (currentPartOfScript === "ManMain" || currentPartOfScript === "ManUnlocked20")) {
        isRelevant = true;
      } else if (activePersona === 'tiemCuonLen' && currentPartOfScript === "TiemCuonLenMain") {
        isRelevant = true;
      } else if (!currentPartOfScript) {
        isRelevant = true; 
      }
    } else if (currentSpeaker === "Man" && activePersona === "hueMan") {
      if (currentPartOfScript === "ManMain") {
        isRelevant = true;
      }
    } else if (currentSpeaker === "TiemCuonLen" && activePersona === "tiemCuonLen") {
      if (currentPartOfScript === "TiemCuonLenMain") {
        isRelevant = true;
      }
    }

    if (!isRelevant) {
      setCurrentScriptIndex(prevIndex => prevIndex + 1); 
      return;
    }

    if (scriptEntry.action_type) {
      setIsPersonaTyping(false);
      let actionProcessed = false;

      if (scriptEntry.action_type === 'change_nickname' && scriptEntry.action_payload) {
        actionProcessed = true;
        setTimeout(() => {
          const { target_persona_key, new_nickname } = scriptEntry.action_payload;
          if (target_persona_key === 'hueMan') setHueManNickname(new_nickname);
          else if (target_persona_key === 'tiemCuonLen') setTiemCuonLenNickname(new_nickname);
          
          if (scriptEntry.speaker === "System" && scriptEntry.text) {
            addMessageToChat({
              id: scriptEntry.id || Date.now().toString() + "_action_text",
              text: scriptEntry.text,
              sender: 'system',
              persona: 'System', 
              nickname: 'System',
              timestamp: new Date(),
              image_url: scriptEntry.image_url || null,
              video_url: scriptEntry.video_url || null,
            });
          }
          setCurrentScriptIndex(prevIndex => prevIndex + 1);
          if (scriptEntry.expectsUserInputAfter) setWaitingForUserInput(true);
        }, scriptEntry.delay_after || 0);
      } else if (scriptEntry.action_type === 'change_avatar' && scriptEntry.action_payload) {
        actionProcessed = true;
        setTimeout(() => {
          const { target_persona_key, new_avatar_url } = scriptEntry.action_payload;
          if (target_persona_key === 'hueMan') setHueManAvatarUrl(new_avatar_url);
          else if (target_persona_key === 'tiemCuonLen') setTiemCuonLenAvatarUrl(new_avatar_url);

          if (scriptEntry.speaker === "System" && scriptEntry.text) {
             addMessageToChat({
              id: scriptEntry.id || Date.now().toString() + "_action_text",
              text: scriptEntry.text,
              sender: 'system',
              persona: 'System',
              nickname: 'System',
              timestamp: new Date(),
              image_url: scriptEntry.image_url || new_avatar_url, 
              video_url: scriptEntry.video_url || null,
            });
          }
          setCurrentScriptIndex(prevIndex => prevIndex + 1);
          if (scriptEntry.expectsUserInputAfter) setWaitingForUserInput(true);
        }, scriptEntry.delay_after || 0);
      }
      if(actionProcessed) return;
    }
    
    const delay = scriptEntry.delay_after || (scriptEntry.speaker === "Hieu" ? 100 : 800);
    let newMessage = {
      id: scriptEntry.id || Date.now().toString(),
      text: scriptEntry.text || "",
      timestamp: new Date(),
      image_url: scriptEntry.image_url || null,
      video_url: scriptEntry.video_url || null,
      sender: 'system',
      persona: 'System',
      nickname: 'System',
      avatarUrl: null,
    };

    if (scriptEntry.speaker === "Hieu") {
      newMessage = { ...newMessage, sender: 'user', persona: 'Duong Trung Hieu', nickname: 'Duong Trung Hieu', avatarUrl: userAvatarUrl };
    } else if (scriptEntry.speaker === "Man") {
      newMessage = { ...newMessage, sender: 'persona', persona: 'Tran Hue Man', nickname: hueManNickname, avatarUrl: hueManAvatarUrl };
      if(!scriptEntry.image_url && !scriptEntry.video_url && scriptEntry.text) setIsPersonaTyping(true);
    } else if (scriptEntry.speaker === "TiemCuonLen") {
      newMessage = { ...newMessage, sender: 'persona', persona: 'Tiem Cuon Len', nickname: tiemCuonLenNickname, avatarUrl: tiemCuonLenAvatarUrl };
      if(!scriptEntry.image_url && !scriptEntry.video_url && scriptEntry.text) setIsPersonaTyping(true);
    }

    const hasContent = newMessage.text || newMessage.image_url || newMessage.video_url;

    setTimeout(() => {
      if(hasContent) addMessageToChat(newMessage);
      
      if (scriptEntry.speaker === "Man" || scriptEntry.speaker === "TiemCuonLen") {
        if(!scriptEntry.image_url && !scriptEntry.video_url && scriptEntry.text) setIsPersonaTyping(false);
      }
      
      setCurrentScriptIndex(prevIndex => prevIndex + 1);
      
      if (scriptEntry.expectsUserInputAfter) {
        setWaitingForUserInput(true);
      }
    }, delay);

  }, [currentScriptIndex, addMessageToChat, activePersona, hueManNickname, tiemCuonLenNickname, hueManAvatarUrl, tiemCuonLenAvatarUrl, userAvatarUrl]);

  useEffect(() => {
    if (!waitingForUserInput && currentScriptIndex < dialogueScript.length) {
      const timeoutId = setTimeout(() => {
          processNextScriptMessage();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [currentScriptIndex, waitingForUserInput, processNextScriptMessage]);
  
  useEffect(() => {
    let startIndex = 0;
    const targetSpeaker = activePersona === 'hueMan' ? "Man" : "TiemCuonLen";
    const targetScriptPart = activePersona === 'hueMan' ? "ManMain" : "TiemCuonLenMain";
    startIndex = dialogueScript.findIndex(entry => 
      (entry.speaker === targetSpeaker && entry.part_of_persona_script === targetScriptPart) || 
      (entry.speaker === "Hieu" || entry.speaker === "System")
    );

    if (startIndex === -1) {
        let firstRelevantGlobal = -1;
        let firstRelevantPersona = -1;
        for(let i=0; i < dialogueScript.length; i++){
            const entry = dialogueScript[i];
            if(entry.speaker === "Hieu" || entry.speaker === "System"){
                if(firstRelevantGlobal === -1) firstRelevantGlobal = i;
            }
            if(entry.speaker === targetSpeaker && entry.part_of_persona_script === targetScriptPart){
                if(firstRelevantPersona === -1) firstRelevantPersona = i;
                break;
            }
        }
        if (firstRelevantPersona !== -1) startIndex = firstRelevantPersona;
        else if (firstRelevantGlobal !== -1) startIndex = firstRelevantGlobal;
        else startIndex = 0;
    }

    setCurrentScriptIndex(startIndex);
    setMessages([]); 
    setWaitingForUserInput(false);
    setIsPersonaTyping(false); 
  }, [activePersona]);

  const togglePersona = () => {
    setActivePersona(prevPersona => prevPersona === 'hueMan' ? 'tiemCuonLen' : 'hueMan');
  };

  const handleContinueScript = () => {
    if (waitingForUserInput) {
      setWaitingForUserInput(false);
    } else if (currentScriptIndex < dialogueScript.length) {
        processNextScriptMessage(); 
    }
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ pt: 2, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Box sx={{ mb: 2, flexShrink: 0 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Chat with {currentTargetNickname}
          </Typography>
          <Button variant="outlined" onClick={togglePersona} sx={{ mb: 1 }}>
            Switch to {otherTargetNickname}
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
                No messages yet. Click Next/Continue to start.
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
                {currentTargetNickname} is typing...
              </Typography>
            )}
          </Box>
          <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Click button to continue script..." 
              sx={{ mr: 1 }}
              disabled={true} 
            />
            <Button variant="contained" onClick={handleContinueScript} 
                    disabled={currentScriptIndex >= dialogueScript.length && !waitingForUserInput}>
              {currentScriptIndex >= dialogueScript.length ? "End" : (waitingForUserInput ? "Continue" : "Next")}
            </Button>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;
