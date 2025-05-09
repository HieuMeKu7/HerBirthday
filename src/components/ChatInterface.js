// src/components/ChatInterface.js
import React, { useState, useEffect, useRef } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MessageBubble from './MessageBubble'; // Import MessageBubble
import ChatInput from './ChatInput'; // Import ChatInput
import TypingIndicator from './TypingIndicator'; // Import TypingIndicator

const ChatInterface = ({ persona }) => {
  // Placeholder for messages (state for actual app)
  const [messages, setMessages] = useState([
    { id: 1, sender: 'persona', text: `Hello from ${persona === 'hueMan' ? 'Tran Hue Man' : 'Tiem Cuon Len'}! This is a slightly longer message to see how the bubble handles wrapping. Hopefully, it looks good!`, timestamp: '10:00 AM' },
    { id: 2, sender: 'user', text: 'Hi there! This is my reply.', timestamp: '10:01 AM' },
    { id: 3, sender: 'persona', text: 'How can I help you today?', timestamp: '10:02 AM' },
  ]);

  // Placeholder for current response options (state for actual app)
  const [currentResponseOptions, setCurrentResponseOptions] = useState([
    { text: 'Tell me a joke!', action: 'getJoke' },
    { text: 'What can you do?', action: 'getCapabilities' },
    { text: 'Nothing for now, thanks.', action: 'endConversation' }
  ]);

  const [isPersonaTyping, setIsPersonaTyping] = useState(false); // State for typing indicator

  // Placeholder handler for when a choice is selected
  const handleSelectChoice = (choice) => {
    console.log('Selected choice:', choice);
    const userMessage = { 
      id: Date.now(), 
      sender: 'user', 
      text: choice.text, 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    setCurrentResponseOptions([]);
    setIsPersonaTyping(true);

    setTimeout(() => {
      setIsPersonaTyping(false);
      const personaReply = {
        id: Date.now() + 1, 
        sender: 'persona',
        text: `Okay, you chose "${choice.text}". I'm thinking...`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prevMessages => [...prevMessages, personaReply]);
      
      setCurrentResponseOptions([
        { text: 'Another option?', action: 'anotherAction' },
        { text: 'Or maybe this one?', action: 'yetAnotherAction' },
      ]);

    }, 2000); 
  };

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isPersonaTyping]);

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        height: 'calc(100vh - 150px)', // Adjust as needed based on App.js layout
        display: 'flex', 
        flexDirection: 'column',
        padding: 2 
      }}
    >
      <Box sx={{ flexGrow: 1, overflowY: 'auto', marginBottom: 2, padding: 1 }}>
        {/* Render messages using MessageBubble */}
        {messages.map(msg => (
          <MessageBubble 
            key={msg.id} 
            message={msg} 
            isUserMessage={msg.sender === 'user'} 
          />
        ))}
        {isPersonaTyping && <TypingIndicator />} 
        <div ref={messagesEndRef} /> 
      </Box>
      <Box sx={{ borderTop: '1px solid #e0e0e0', paddingTop: 1, flexShrink: 0 }}>
        <ChatInput 
          responseOptions={currentResponseOptions}
          onSelectChoice={handleSelectChoice}
          disabled={isPersonaTyping} 
        />
      </Box>
    </Paper>
  );
};

export default ChatInterface; 