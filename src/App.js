import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import { hueManTheme, tiemCuonLenTheme } from './themes';
import ChatInterface from './components/ChatInterface';

function App() {
  const [activePersona, setActivePersona] = useState('hueMan'); // 'hueMan' or 'tiemCuonLen'

  const togglePersona = () => {
    setActivePersona(prevPersona => prevPersona === 'hueMan' ? 'tiemCuonLen' : 'hueMan');
  };

  const currentTheme = activePersona === 'hueMan' ? hueManTheme : tiemCuonLenTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <div style={{ padding: '20px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4" gutterBottom sx={{ flexShrink: 0 }}>
          HerBirthday Chat
        </Typography>
        <Button variant="outlined" onClick={togglePersona} sx={{ marginBottom: 2, flexShrink: 0 }}>
          Switch to {activePersona === 'hueMan' ? 'Tiem Cuon Len' : 'Tran Hue Man'}'s Theme
        </Button>

        <ChatInterface persona={activePersona} />

      </div>
    </ThemeProvider>
  );
}

export default App; 