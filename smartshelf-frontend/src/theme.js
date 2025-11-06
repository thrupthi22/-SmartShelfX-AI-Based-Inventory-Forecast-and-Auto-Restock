import { createTheme } from '@mui/material/styles';

// 1. This is your existing theme, just renamed to "lightTheme"
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4f46e5', // Indigo
    },
    secondary: {
      main: '#ec4899', // Pink
    },
    background: {
      default: '#f4f7f6', // Soft light gray
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', boxShadow: 'none', fontWeight: 600 },
        containedPrimary: {
          '&:hover': { boxShadow: '0 4px 12px 0 rgba(79,70,229,0.3)' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { borderRadius: 12 } },
      defaultProps: { elevation: 1 },
    },
    MuiDrawer: {
      styleOverrides: { paper: { borderRight: '0px' } }
    }
  },
});

// 2. This is the NEW dark theme
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1', // A slightly lighter indigo for dark mode
    },
    secondary: {
      main: '#ec4899', // Pink still works well
    },
    background: {
      default: '#111827', // Very dark blue/gray
      paper: '#1f2937',   // Lighter dark blue/gray for cards
    },
    text: {
      primary: '#f9fafb',
      secondary: '#9ca3af',
    },
  },
  // We re-use the same typography and shapes
  typography: lightTheme.typography,
  shape: lightTheme.shape,

  // We add dark-mode specific component styles
  components: {
    MuiButton: lightTheme.components.MuiButton,
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none', // Disable gradient background for dark paper
        }
      },
      defaultProps: { elevation: 2 }, // A bit more shadow in dark mode
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '0px',
          backgroundColor: '#1f2937', // Match paper color
        }
      }
    }
  },
});