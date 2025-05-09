import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper'; // For a background element
import CssBaseline from '@mui/material/CssBaseline'; // Helps with consistent baseline styling
import { hueManTheme, tiemCuonLenTheme } from './themes';

// Placeholder for your chat interface
const ChatInterfacePlaceholder = ({ persona }) => {
  return (
    <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
      <Typography variant="h6">Chat Interface Placeholder</Typography>
      <Typography>Current Persona: {persona === 'hueMan' ? 'Tran Hue Man' : 'Tiem Cuon Len'}</Typography>
      <Button variant="contained" color="primary" sx={{ marginTop: 1 }}>
        Sample Button
      </Button>
    </Paper>
  );
};

function App() {
  const [activePersona, setActivePersona] = useState('hueMan'); // 'hueMan' or 'tiemCuonLen'

  const togglePersona = () => {
    setActivePersona(prevPersona => prevPersona === 'hueMan' ? 'tiemCuonLen' : 'hueMan');
  };

  const currentTheme = activePersona === 'hueMan' ? hueManTheme : tiemCuonLenTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline /> {/* Apply baseline styling based on the theme */}
      <div style={{ padding: '20px' }}>
        <Typography variant="h4" gutterBottom>
          HerBirthday Chat
        </Typography>
        <Button variant="outlined" onClick={togglePersona} sx={{ marginBottom: 2 }}>
          Switch to {activePersona === 'hueMan' ? 'Tiem Cuon Len' : 'Tran Hue Man'}'s Theme
        </Button>

        <ChatInterfacePlaceholder persona={activePersona} />

        {/* You would replace ChatInterfacePlaceholder with your actual chat components */}
      </div>
    </ThemeProvider>
  );
}

export default App; 