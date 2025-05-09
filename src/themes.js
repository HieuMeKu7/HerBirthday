import { createTheme } from '@mui/material/styles';

// Theme for Tran Hue Man (Personal)
export const hueManTheme = createTheme({
  palette: {
    primary: {
      main: '#64b5f6', // A friendly, lighter blue
    },
    secondary: {
      main: '#ffab91', // A soft, peachy coral
    },
    background: {
      default: '#f5f5f5', // A light grey background
      paper: '#ffffff',   // For elements like cards, chat bubbles
    },
    text: {
      primary: '#212121', // Dark grey for main text
      secondary: '#757575', // Lighter grey for secondary text
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Standard MUI font
    // We can customize h1, body1, etc., later if needed
  },
  components: {
    // Example: Customizing chat bubbles for Hue Man
    MuiPaper: { // Assuming chat bubbles are Paper components
      styleOverrides: {
        root: {
          // Styles for Hue Man's chat bubbles
          // This is a placeholder; actual components will determine this
        }
      }
    }
  }
});

// Theme for Tiem Cuon Len (Shop)
export const tiemCuonLenTheme = createTheme({
  palette: {
    primary: {
      main: '#00897b', // A professional teal
    },
    secondary: {
      main: '#f9a825', // A contrasting gold/yellow for accents
    },
    background: {
      default: '#ffffff', // A clean white background
      paper: '#f7f9fc',   // Slightly off-white for paper elements
    },
    text: {
      primary: '#263238', // A darker, more serious grey
      secondary: '#546e7a',
    },
  },
  typography: {
    fontFamily: '"Open Sans", "Arial", sans-serif', // A slightly more formal, clean font
    // We can customize later
  },
  components: {
    // Example: Customizing chat bubbles for Tiem Cuon Len
    MuiPaper: { // Assuming chat bubbles are Paper components
      styleOverrides: {
        root: {
          // Styles for Tiem Cuon Len's chat bubbles
          // This is a placeholder
        }
      }
    }
  }
}); 