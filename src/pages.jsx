import { Box, Button, Card, CircularProgress, Link, List, Paper, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'preact/hooks'
import { authentication, db, provider } from './firebase';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import { signInWithPopup, signOut } from 'firebase/auth';
import { ArrowBack, Create, ExitToApp, FileDownload, Psychology, Publish, ToggleOn } from '@mui/icons-material';
import moment from 'moment/moment';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { client } from "@gradio/client";
import { Line } from "react-chartjs-2";
import wordmark from "./assets/wordmark.png"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    ArcElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import Calendar from 'react-calendar';
import { render } from 'preact';
import { usePDF } from 'react-to-pdf';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip
);

export function SignIn() {

    const navigate = useNavigate();
    const signin = async () => {
        await signInWithPopup(authentication, provider)
    }

  return (
    <>
      <Paper variant="outlined" sx={{marginTop: 2, p: 2.5, flexDirection: 'row', overflow: 'auto'}}>
      <img src={wordmark} alt='wordmark' style={{width: '75%'}}/>
      <br/>
        <Typography variant="p" sx={{textAlign: 'left'}}>Sign in to start journaling!</Typography>
        <br/>
        <Button variant='outlined' onClick={signin} sx={{marginTop: 3}}><GoogleIcon sx={{marginRight: 1.5}}/><Typography color="inherit" variant="p">Sign in with Google</Typography></Button>
      </Paper>
    </>
  )
}

export function Write() {
    const [textFieldValue, setTextFieldValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [written, setWritten] = useState(false);
    
    const q = query(collection(db, "users"), where("email", "==", authentication.currentUser.email));
    const navigate = useNavigate();

    const signout = async () => {
        await signOut(authentication)
      }

    const checkWritten = async () => {
        const userData = (await getDocs(q)).docs[0]
        const today = new Date();

        if(userData != null) {
            if(userData.data().dates[userData.data().dates.length - 1] == today.toLocaleDateString())
            setWritten(true)
        }
    }

    const submit = async () => {
        setLoading(true)

        const userData = (await getDocs(q)).docs[0]
        const today = new Date();

        const model = await client("r3sgame/tiya1012-stress_mentalbert");
        const result = await model.predict("/predict", [		
				textFieldValue, // string  in 'Input' Textbox component
	    ]);

        let stressLevel;

        stressLevel = result.data[0].confidences.find(element => element.label === 'LABEL_1').confidence

        if (userData != null) {

        // Parse dates using Moment.js
        const date1 = moment(userData.data().dates[0], "MM/DD/YYYY"); // Adjust format if needed
        const date2 = moment(today, "YYYY-MM-DD");

        // Calculate difference in days
        const days_between = date2.diff(date1, 'days');


        await setDoc(doc(db, "users", authentication.currentUser.email), {
            content: [...userData.data().content, textFieldValue],
            dates: [...userData.data().dates, today.toLocaleDateString()],
            days: [...userData.data().days, days_between + 1],
            stress: [...userData.data().stress, stressLevel],
            email: authentication.currentUser.email
          })
        } else {
            await setDoc(doc(db, "users", authentication.currentUser.email), {
                content: [textFieldValue],
                dates: [today.toLocaleDateString()],
                days: [1],
                stress: [0.45],
                email: authentication.currentUser.email
              })
        }
        navigate("/analysis")
      }

      useEffect(() => {
        checkWritten();
      }, []);

  return (
    <>
      <Paper variant="outlined" sx={{marginTop: 2, p: 2.5, flexDirection: 'row', overflow: 'auto'}}>
        {!loading && <><Typography variant="p"> Journal Today</Typography>
        <br/>
        {written && <Typography variant="p" sx={{color: 'grey'}}>It seems you've already written a log for today... come back tomorrow or check your stress analysis!</Typography>}
        {!written && <><Typography variant="p" sx={{color: 'grey'}}>How's your day been? Summarize it in 200 characters (or less).</Typography>
        <br/>
        <TextField sx={{marginTop: 2, width: '100%'}}
          onChange={(e) => {setTextFieldValue(e.target.value)}} 
          value={textFieldValue}
          maxLength={200}
          id="outlined-multiline-static"
          multiline
          rows={4}
        /></>}
        <br/>
        <Button href="/analysis" sx={{marginTop: 3}}><Psychology sx={{marginRight: 1.5}}/><Typography color="inherit" variant="p">Analysis</Typography></Button>
        {!written && <Button disabled={!Boolean(textFieldValue.trim())} variant='outlined' onClick={submit} sx={{marginTop: 3, marginLeft: 2}}><Publish sx={{marginRight: 1.5}}/><Typography color="inherit" variant="p">Submit</Typography></Button>}
        <Button onClick={signout} sx={{marginTop: 3, marginLeft: 2}}><ExitToApp sx={{marginRight: 1.5}}/><Typography color="inherit" variant="p">Sign out</Typography></Button></>}

        {loading && <><CircularProgress/><br/><Typography variant="p" sx={{color: 'grey'}}>Sit back and relax... we're analyzing!</Typography></>}
      </Paper>
    </>
  )
}

export function Analysis() {

    const [stress, setStress] = useState([])
    const [logs, setLogs] = useState([])
    const [days, setDays] = useState([])
    const [dates, setDates] = useState([])
    const [selectedDate, setSelectedDate] = useState([])
    const [predictedTopic, setPredictedTopic] = useState("LOADING...")

    const [isGraph, setIsGraph] = useState(true);

    const topicElements = ["school", "work", "relationships", "excitement", "money", "health"]

    const { toPDF, targetRef } = usePDF({
      filename: "my-report.pdf", // Specify desired filename
  });

    const MyDocument = ({ dates, stress }) => (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>Stress Data Report</Text>
          <View style={styles.table}>
            <Text style={styles.tableHeader}>Dates</Text>
            <Text style={styles.tableHeader}>Stress Level</Text>
          </View>
          {dates.map((date, index) => (
            <View key={index} style={styles.table}>
              <Text style={styles.tableData}>{date.toString()}</Text>
              <Text style={styles.tableData}>{stress[index]}</Text>
            </View>
          ))}
        </Page>
      </Document>
    );

    const navigate = useNavigate();

    const q = query(collection(db, "users"), where("email", "==", authentication.currentUser.email));

    const getUserData = async () => {
        const userData = (await getDocs(q)).docs[0]

        if(userData != null) {
            setStress(userData.data().stress)
            setDays(userData.data().days)
            setDates(userData.data().dates)
            setSelectedDate(userData.data().dates[userData.data().dates.length - 1])
        }
    }

    const signout = async () => {
        navigate("/")
        await signOut(authentication)
      }

    useEffect(() => {
        getUserData();
        findMostRelevantWord()
      }, []);

    const handleDateChange = (date) => {
        setSelectedDate(date.toLocaleDateString('en-US', {
          month: 'numeric',
          day: 'numeric',
          year: 'numeric',
        }));
      };

      const findStressLevel = (date) => {
        for(var i = 0; i < dates.length; i++) {
          if(dates[i] == date) {
            return stress[i]
          }
        }
        return "None"
      };

      const findLog = (date) => {
        for(var i = 0; i < dates.length; i++) {
          if(dates[i] == date) {
            return logs[i]
          }
        }
        return "None"
      };

      const findMostRelevantWord = async () => {
        try {
          const userData = (await getDocs(q)).docs[0];
          setLogs(userData.data().content);
          const model = await client("r3sgame/sentence-similarity-code");
          const result = await model.predict("/predict", [
            userData.data().content[userData.data().content.length - 1],
            "I am stressed because of school\nI am stressed because of work\nI am stressed because of relationships\nI am stressed because of money\nI am stressed because of my health", // string in 'Input' Textbox component
          ]);
          console.log(result);
          setPredictedTopic(topicElements[result.data[0].indexOf(Math.max(...result.data[0]))]);
        } catch (error) {
          console.error("Error predicting topic:", error);
          // You can also set a default predicted topic here if needed
          // setPredictedTopic("default_topic");
        }
      };
      
      

  return (
    <>
      <Paper variant="outlined" sx={{marginTop: 2, p: 2.5, flexDirection: 'row', overflow: 'auto'}}>
          <Typography variant="p" sx={{textAlign: 'left'}}>
        Stress/Health Analysis</Typography>
        <br/>
        {stress[stress.length - 1] <= 0.33 && <Typography variant="p" sx={{color: 'grey', marginTop: 2}}>You haven't been very stressed recently. Great job!</Typography>}
        {stress[stress.length - 1] > 0.33 && stress[stress.length - 1] <= 0.66 && <Typography variant="p" sx={{color: 'grey', marginTop: 2}}>You've been a bit stressed recently. We think it's because of <a href={`/${predictedTopic}`}>{predictedTopic}</a>.</Typography>}
        {stress[stress.length - 1] > 0.66 && <Typography variant="p" sx={{color: 'grey', marginTop: 2}}>You've been very stressed recently. We think it's because of <a href={`/${predictedTopic}`}>{predictedTopic}</a>.</Typography>}
        <br/>
        <Button sx={{marginTop: 1, marginBottom: 1}} onClick={() => {setIsGraph(!isGraph)}}><ToggleOn sx={{marginRight: 1.5}}/><Typography color="inherit" variant="p">Toggle View Mode</Typography></Button>
        <br/>
        {isGraph && stress.length > 0 && <><div ref={targetRef} style={{maxHeight: '40vh', marginBottom: '10px'}}>
        <Line
            data={{
            labels: days.map((element) => "Day " + element).slice(-50),
            datasets: [
                                                {
                                                    label: "",
                                                    fill: false,
                                                    backgroundColor: "rgba(255,255,255,1)",
                                                    borderColor: "rgba(107, 147, 255, 1)",
                                                    borderCapStyle: "butt",
                                                    borderDash: [],
                                                    borderDashOffset: 0.0,
                                                    borderJoinStyle: "miter",
                                                    pointBorderColor: "rgba(229,198,70,1)",
                                                    pointBackgroundColor: "#fff",
                                                    pointBorderWidth: 1,
                                                    pointHoverRadius: 5,
                                                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                                                    pointHoverBorderColor: "rgba(225,225,225,1)",
                                                    pointHoverBorderWidth: 2,
                                                    pointRadius: 2,
                                                    pointHitRadius: 10,
                                                    data: stress.slice(-50),
                                                },
                                            ],
                                        }}
                                        options={{
                                            plugins: { legend: { display: false } },
                                            scales: {
                                                x: { ticks: { display: false } },
                                                y: { ticks: { color: "white" } },
                                            },
                                        }}
                                    /></div>
    <Typography variant="p" sx={{color: 'grey', marginTop: 2}}>Each point represents your stress percentage for the day. Try to get it as low as you can!</Typography></>}

    {stress.length == 0 && <Typography variant="p" sx={{color: 'grey', marginTop: 2}}>It seems you haven't written any logs for analysis... try creating one!</Typography>}

    {!isGraph && stress.length > 0 && <>
     <Box width='50vw'>                             
    <Calendar onChange={handleDateChange}/>
    </Box>
    <br/>
    
    {findStressLevel(selectedDate) != "None" && <Typography variant="p" sx={{color: 'grey', marginTop: 2}}>Stress level on {selectedDate}:{" "} {(findStressLevel(selectedDate)*100).toFixed(2) || 'None'}%</Typography>}
    {findStressLevel(selectedDate) == "None" && <Typography variant="p" sx={{color: 'grey', marginTop: 2}}>Stress level on {selectedDate}:{" "} None</Typography>}
    <br/>
    {findStressLevel(selectedDate) != "None" && <Typography variant="p" sx={{color: 'grey', marginTop: 2}}>Entry: {findLog(selectedDate).substring(0, 75)}</Typography>}
    </>}
    <br/>
    <Button href="/" sx={{marginTop: 3}}><Create sx={{marginRight: 1.5}}/><Typography color="inherit" variant="p">Journal</Typography></Button>
    <Button onClick={toPDF} sx={{marginTop: 3, marginLeft: 2}}><FileDownload sx={{marginRight: 1.5}}/><Typography color="inherit" variant="p">Export</Typography></Button>
    <Button onClick={signout} sx={{marginTop: 3, marginLeft: 2}}><ExitToApp sx={{marginRight: 1.5}}/><Typography color="inherit" variant="p">Sign out</Typography></Button>
      </Paper>
    </>
  )
}

export function StressCause(props) {
  const { name, description, image } = props;

  return (
    <Paper variant="outlined" sx={{marginTop: 2, p: 2.5, flexDirection: 'row', overflow: 'auto'}}>
      <Typography variant="p" sx={{textAlign: 'left'}}>{name}</Typography><br/>
      <img src={image} alt={name} style={{height: '35vh', filter: 'brightness(80%)'}}/><br/>
      <Typography variant="body1" textAlign='left' sx={{color: 'grey'}}>{description}</Typography><br/>
      <Button sx={{marginTop: 1, marginBottom: 1}} href='/analysis'><ArrowBack sx={{marginRight: 1.5}}/><Typography color="inherit" variant="p">Back to Analysis</Typography></Button>
    </Paper>
  );
}
