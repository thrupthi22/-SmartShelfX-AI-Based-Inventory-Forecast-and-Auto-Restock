import React from 'react';

// Create a context with a default empty function
export const ThemeContext = React.createContext({
  toggleTheme: () => {},
});