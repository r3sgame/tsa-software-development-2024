import { useState } from 'preact/hooks'
import './app.css'
import { Analysis, SignIn, Write } from './pages'
import { ThemeProvider, createTheme } from '@mui/material'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import React from 'react'
import { useAuthState } from "react-firebase-hooks/auth";
import { authentication } from './firebase';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6b93ff',
    },
    secondary: {
      main: '#a7a7a7',
    },
  },
  typography: {
    h2: {
      color: 'white',
      fontFamily: 'Lexend Deca, sans-serif',
      marginBottom: 10
    },
    h4: {
      color: 'white',
      fontFamily: 'Lexend Deca, sans-serif',
      marginBottom: 10
    },
    h6: {
      color: 'white',
      fontFamily: 'Lexend Deca, sans-serif',
      marginBottom: 10,
      textAlign: 'center'
    },
    h5: {
      color: 'white',
      fontFamily: 'Lexend Deca, sans-serif',
      marginBottom: 10,
      textAlign: 'center'
    },
    p: {
      color: 'white',
      fontFamily: 'Lexend Deca, sans-serif',
      fontSize: 17.5
    },
    body2: {
      color: 'white',
      fontFamily: 'Lexend Deca, sans-serif',
      fontSize: 17.5
    },
    body1: {
      fontFamily: 'Lexend Deca, sans-serif',
    },
  }
});

export function App() {
  const [user, loading, error] = useAuthState(authentication);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
      {user == null && <Routes>
      <Route path="/" exact element={<React.Fragment><SignIn/></React.Fragment>} />
      </Routes>}

      {user != null && <Routes>
      <Route path="/" exact element={<React.Fragment><Write/></React.Fragment>} />
      <Route path="/analysis" exact element={<React.Fragment><Analysis/></React.Fragment>} />
      </Routes>}
      </BrowserRouter>
      <div className="area">
<ul class="circles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
            </ul>
</div>
    </ThemeProvider>
  )
}
