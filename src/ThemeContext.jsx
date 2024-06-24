import React, { createContext, useContext, useState, useEffect } from 'react';

const lightTheme = {
  palette: {
    background: '#ffffff',
    text: '#000000',
    primary: {
        main: '#6b93ff',
      },
      secondary: {
        main: '#a7a7a7',
      },
  },
  typography: {
    h2: {
      fontFamily: 'Lexend Deca, sans-serif',
      marginBottom: 10
    },
    h4: {
      fontFamily: 'Lexend Deca, sans-serif',
      marginBottom: 10
    },
    h6: {
      fontFamily: 'Lexend Deca, sans-serif',
      marginBottom: 10,
      textAlign: 'center'
    },
    h5: {
      fontFamily: 'Lexend Deca, sans-serif',
      marginBottom: 10,
      textAlign: 'center'
    },
    p: {
      fontFamily: 'Lexend Deca, sans-serif',
      fontSize: 17.5
    },
    body2: {
      fontFamily: 'Lexend Deca, sans-serif',
      fontSize: 17.5
    },
    body1: {
      fontFamily: 'Lexend Deca, sans-serif',
      fontSize: 17.5
    },
  }
};

const darkTheme = {
  palette: {
    background: '#000000',
    text: '#ffffff',
    primary: {
        main: '#6b93ff',
      },
      secondary: {
        main: '#a7a7a7',
      },
  },
  typography: {
    h2: {
      fontFamily: 'Lexend Deca, sans-serif',
      marginBottom: 10
    },
    h4: {
      fontFamily: 'Lexend Deca, sans-serif',
      marginBottom: 10
    },
    h6: {
      fontFamily: 'Lexend Deca, sans-serif',
      marginBottom: 10,
      textAlign: 'center'
    },
    h5: {
      fontFamily: 'Lexend Deca, sans-serif',
      marginBottom: 10,
      textAlign: 'center'
    },
    p: {
      fontFamily: 'Lexend Deca, sans-serif',
      fontSize: 17.5
    },
    body2: {
      fontFamily: 'Lexend Deca, sans-serif',
      fontSize: 17.5
    },
    body1: {
      fontFamily: 'Lexend Deca, sans-serif',
      fontSize: 17.5
    },
  }
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false); // Initial theme preference

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
