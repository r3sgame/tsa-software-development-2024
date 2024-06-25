import { useState } from 'preact/hooks';
import './app.css';
import { Analysis, SignIn, StressCause, Write } from './pages';
import { Button, CssBaseline, ThemeProvider, Typography, createTheme } from '@mui/material';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import React from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { authentication } from './firebase';
import school from "./assets/school.png";
import work from "./assets/work.png";
import excitement from "./assets/excitement.png";
import health from "./assets/health.png";
import relationships from "./assets/relationships.png";
import money from "./assets/money.png";

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#333333',
    },
    background: {
      default: '#d9d9d9',
    }
  },
  typography: {
    h2: {
      color: '#333333',
      fontFamily: 'Lexend Deca, sans-serif',
      marginBottom: 10,
    },
    h4: {
      color: '#333333',
      fontFamily: 'Lexend Deca, sans-serif',
      marginBottom: 10,
    },
    h6: {
      color: '#333333',
      fontFamily: 'Lexend Deca, sans-serif',
      marginBottom: 10,
      textAlign: 'center',
    },
    h5: {
      color: '#333333',
      fontFamily: 'Lexend Deca, sans-serif',
      marginBottom: 10,
      textAlign: 'center',
    },
    p: {
      color: '#333333',
      fontFamily: 'Lexend Deca, sans-serif',
      fontSize: 17.5,
    },
    body2: {
      color: '#333333',
      fontFamily: 'Lexend Deca, sans-serif',
      fontSize: 17.5,
    },
    body1: {
      fontFamily: 'Lexend Deca, sans-serif',
      fontSize: 17.5,
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6b93ff',
    },
    secondary: {
      main: '#a7a7a7',
    },
    background: {
      default: '#242424',
    }
  },
  typography: {
    h2: {
      color: 'white',
      fontFamily: 'Lexend Deca, sans-serif',
      marginBottom: 10,
    },
    h4: {
      color: 'white',
      fontFamily: 'Lexend Deca, sans-serif',
      marginBottom: 10,
    },
    h6: {
      color: 'white',
      fontFamily: 'Lexend Deca, sans-serif',
      marginBottom: 10,
      textAlign: 'center',
    },
    h5: {
      color: 'white',
      fontFamily: 'Lexend Deca, sans-serif',
      marginBottom: 10,
      textAlign: 'center',
    },
    p: {
      color: 'white',
      fontFamily: 'Lexend Deca, sans-serif',
      fontSize: 17.5,
    },
    body2: {
      color: 'white',
      fontFamily: 'Lexend Deca, sans-serif',
      fontSize: 17.5,
    },
    body1: {
      fontFamily: 'Lexend Deca, sans-serif',
      fontSize: 17.5,
    },
  },
});

export function App() {
  const [theme, setTheme] = useState(darkTheme); // Initial theme is light

  const toggleTheme = () => {
    setTheme(theme === lightTheme ? darkTheme : lightTheme);
  };

  const [user, loading, error] = useAuthState(authentication);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <BrowserRouter>
      {user == null && <Routes>
          <Route path="/" exact element={<React.Fragment><SignIn/></React.Fragment>} />
        </Routes>}

        {user != null && <Routes>
          <Route path="/" exact element={<React.Fragment><Write/></React.Fragment>} />
          <Route path="/analysis" exact element={<React.Fragment><Analysis/></React.Fragment>} />
          <Route path="/school" exact element={<React.Fragment><StressCause name="School" description="The pressure to succeed academically, combined with juggling multiple classes, deadlines, and exams, can be a significant source of stress for students. This can manifest in physical symptoms like difficulty sleeping, headaches, or stomachaches. Feeling overwhelmed, difficulty concentrating, and neglecting self-care are also common signs. To combat this, develop a study schedule that breaks down work into manageable chunks. Prioritize tasks based on importance and deadlines, and don't be afraid to ask for help from teachers, tutors, or classmates. Additionally, taking breaks throughout the day to clear your head, maintaining a healthy sleep schedule, and engaging in physical activity can all improve focus, memory, and overall well-being." image={school}/></React.Fragment>} />
          <Route path="/work" exact element={<React.Fragment><StressCause name="Work" description="Work can be a source of stress due to demanding schedules, tight deadlines, a competitive environment, or a lack of control over your workload. This can lead to feelings of burnout, anxiety, irritability, and difficulty disconnecting from work outside of office hours. To manage work stress, practice good time management skills by creating to-do lists and prioritizing tasks. Set clear boundaries between work and personal life, and learn to say no to taking on more than you can handle. Delegating tasks to colleagues when possible can also alleviate pressure. If the source of stress is a negative work environment, consider having open conversations with your manager or exploring opportunities in a more supportive workplace." image={work}/></React.Fragment>} />
          <Route path="/relationships" exact element={<React.Fragment><StressCause name="Relationships" description="Disagreements, communication problems, and lack of support within our personal relationships can be a major stressor. This can manifest as anxiety, loneliness, feeling emotionally drained, or difficulty trusting others. To navigate relationship stress, practice open and honest communication with your partner, family, or friends. Actively listen to their concerns and express your own needs. Focus on quality time spent together, engaging in activities you both enjoy. If communication struggles persist, consider seeking professional help through couples or family therapy." image={relationships}/></React.Fragment>} />
          <Route path="/excitement" exact element={<React.Fragment><StressCause name="Excitement" description="While positive by nature, even exciting events like planning a trip, a job promotion, or a new relationship can be stressful. This is because excitement often comes with a pressure to make things perfect or a fear of things going wrong. Feelings of being overwhelmed with details, difficulty relaxing, and neglecting responsibilities are signs that the excitement is turning stressful. To manage this type of stress, break down large tasks into smaller, more manageable steps. Delegate tasks when possible and avoid trying to do everything yourself. Schedule dedicated relaxation time away from planning to avoid burnout and maintain perspective." image={excitement}/></React.Fragment>} />
          <Route path="/money" exact element={<React.Fragment><StressCause name="Money" description="Financial concerns, whether about paying bills, managing debt, or saving for the future, are a significant stressor for many people. This can lead to anxiety, feeling overwhelmed, hopeless, and difficulty making ends meet. To manage financial stress, create a realistic budget and track your spending to identify areas where you can cut back. Explore ways to increase your income through extra work or side hustles. Consider seeking financial counseling for help creating a budget, managing debt, or developing a long-term financial plan. Remember, financial health is a journey, and progress takes time." image={money}/></React.Fragment>} />
          <Route path="/health" exact element={<React.Fragment><StressCause name="Health" description="Chronic illnesses, injuries, and even maintaining healthy habits like eating well and exercising can be a source of stress. This can manifest in physical symptoms like fatigue, headaches, or muscle tension. Feeling exhausted, irritable, and neglecting self-care are also signs.  To manage health-related stress, prioritize a good night's sleep by establishing a regular sleep schedule. Focus on eating a balanced diet that fuels your body. Make time for regular exercise, even if it's just a short walk or some gentle yoga poses. Relaxation techniques like meditation, deep breathing, or spending time in nature can also significantly reduce stress and improve overall health. Remember, taking care of yourself is not selfish, it's essential for managing stress and living a fulfilling life." image={health}/></React.Fragment>} />
        </Routes>}
      </BrowserRouter>
      <Button sx={{marginTop: 2}} onClick={toggleTheme}><Typography color="inherit" variant="p">Toggle Theme</Typography></Button>  {/* Button to toggle theme */}
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
