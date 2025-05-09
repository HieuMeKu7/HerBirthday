import React, { useState, useEffect, useCallback } from 'react';
import { Box, Container, TextField, Typography, Paper, Button, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { hueManTheme, tiemCuonLenTheme } from './themes';
import dialogueScript from './dialogue.json';
import ChatMessage from './components/ChatMessage';

function App() {
  const [currentScene, setCurrentScene] = useState(1);
  const [activePersona, setActivePersona] = useState('hueMan');
  const [currentPersonaNickname, setCurrentPersonaNickname] = useState('Tran Hue Man');
  const [currentPersonaAvatar, setCurrentPersonaAvatar] = useState('/images/HueMan.jpg');
  const [userAvatarUrl, setUserAvatarUrl] = useState('/images/Hieu.jpg');
  const [messages, setMessages] = useState([]);
  const [currentScriptIndex, setCurrentScriptIndex] = useState(0);
  const [isPersonaTyping, setIsPersonaTyping] = useState(false);
  const [waitingForUserInput, setWaitingForUserInput] = useState(false);
  const [seenMarkerMessageId, setSeenMarkerMessageId] = useState(null);

  // Scene ranges based on script_3.txt
  const sceneRanges = {
    1: { start: 0, end: 2 },     // First chat about D3
    2: { start: 3, end: 5 },     // Chat about death note
    3: { start: 6, end: 10 },    // Chat about borrowing money
    4: { start: 11, end: 15 },   // Chat about movie
    5: { start: 16, end: 25 },   // Chat with shop
    6: { start: 26, end: 30 },   // Chat about likes
    7: { start: 31, end: 35 },   // Chat about money repayment
    8: { start: 36, end: 40 },   // Chat about coming down
    9: { start: 41, end: 45 },   // Chat about debt
    10: { start: 46, end: 50 },  // Chat about birthday
    11: { start: 51, end: 55 },  // Chat about mouth twitch
    12: { start: 56, end: 65 },  // Chat about Thao's photos
    13: { start: 66, end: 70 },  // Chat about food price
    14: { start: 71, end: 75 },  // Chat about walking steps
    15: { start: 76, end: 80 },  // Hey chat
    16: { start: 81, end: 85 },  // Chat about running
    17: { start: 86, end: dialogueScript.length - 1 } // Birthday wishes
  };

  const currentTheme = activePersona === 'hueMan' ? hueManTheme : tiemCuonLenTheme;
  const currentTargetNickname = currentPersonaNickname;

  const addMessageToChat = useCallback((message) => {
    setMessages((prevMessages) => {
      // Check if message with same ID already exists
      if (prevMessages.some(m => m.id === message.id)) {
        return prevMessages;
      }
      return [...prevMessages, message];
    });
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
      newMessage = { ...newMessage, sender: 'persona', persona: 'Tran Hue Man', nickname: currentPersonaNickname, avatarUrl: currentPersonaAvatar };
      if(!scriptEntry.image_url && !scriptEntry.video_url && scriptEntry.text) setIsPersonaTyping(true);
    } else if (scriptEntry.speaker === "TiemCuonLen") {
      newMessage = { ...newMessage, sender: 'persona', persona: 'Tiem Cuon Len', nickname: currentPersonaNickname, avatarUrl: currentPersonaAvatar };
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
    const detectSceneFromMessage = (messageId) => {
      if (!messageId) return null;
      const match = messageId.match(/^s(\d+)_/);
      return match ? parseInt(match[1]) : null;
    };

    const currentMessageId = dialogueScript[currentScriptIndex]?.id;
    const detectedScene = detectSceneFromMessage(currentMessageId);
    
    if (detectedScene && detectedScene !== currentScene) {
      setCurrentScene(detectedScene);
      setMessages([]);
      setWaitingForUserInput(false);
      setIsPersonaTyping(false);
      
      // Update persona based on scene
      const newPersona = dialogueScript[currentScriptIndex].speaker === "TiemCuonLen" ? "tiemCuonLen" : "hueMan";
      setActivePersona(newPersona);
      setCurrentPersonaNickname(newPersona === "hueMan" ? "Tran Hue Man" : "Tiem Cuon Len");
      setCurrentPersonaAvatar(newPersona === "hueMan" ? "/images/HueMan.jpg" : "/images/shop.jpg");
    }
  }, [currentScriptIndex, currentScene]);

  const handleContinueScript = () => {
    if (waitingForUserInput) {
      setWaitingForUserInput(false);
    } else if (currentScriptIndex < dialogueScript.length) {
        processNextScriptMessage(); 
    }
  };

  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ pt: 2, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Box sx={{ mb: 2, flexShrink: 0 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Đang chat với {currentPersonaNickname}
          </Typography>
        </Box>
        <Paper elevation={3} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              scrollBehavior: 'smooth'
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
            <div ref={messagesEndRef} />
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