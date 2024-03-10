//import logo from './logo.svg';
import './App.css';

import { useState } from 'react';
//import { API } from "./openf1_api/api_utility";


import { Card, Select, SelectItem, Divider, Button} from '@tremor/react';
import { FetchSessions, FetchSpecificSession, FetchDrivers } from "./components/Fetch";

//import {LineChartHero} from "./components/FirstChart"
//import {ExampleCard} from "./components/SecondChart"

import {LapTimesChart} from "./components/LapTimesChart";
//import {ScatterChartUsageExample} from "./components/ThirdChart"

function App() {
  //const sessions_quali = fetch(API("sessions?date_start%3E%3D2024-02-01&session_name=Qualifying"))
  //const sessions_quali = fetch("https://api.openf1.org/v1/sessions?date_start%3E%3D2024-02-01&session_name=Qualifying");
  //.then(response => response.json())
  //.then(jsonContent => console.log(jsonContent));
  console.log("Loading Dashboard")
  //console.log(sessions_quali)
  //https://api.openf1.org/v1/sessions?date_start%3E%3D2024-02-01&session_name=Qualifying

  const sessions = FetchSessions()//.reverse()
  //let selectedSession = 9472//"latest"
  const [selectedSession, setSelectedSession] = useState('latest');
  let drivers = FetchDrivers(selectedSession)
  const [stateData, setStateData] = useState(1) // used to refresh data from server

  let selectedSession_info = FetchSpecificSession(selectedSession) 
  return (
    <div className="App">
      <header className="App-header">
        <Card className="mx-auto max-w-md">
        <p className="text-lg text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">Formula 1 dashboard</p>
      <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content leading-6">created by Lukas Wenzl</p>
      <Divider>Race selection</Divider>
      <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content leading-6">Select which Race to show information for (default is the latest session)</p>
          <Select defaultValue="9472" onValueChange={(value) => {
            setSelectedSession(value)
            console.log(selectedSession)
          }}>
            {/*<SelectItem value="1">Latest Session</SelectItem>*/}
            {sessions.map((session) => (
            <SelectItem value={session.session_key}>{session.location} {session.session_name} - {session.date_start.slice(0,10)}</SelectItem> ))}
          </Select>
          <div className="flex justify-center">
            <Button onClick={() => setStateData(stateData+1)}>Refresh data</Button>
          </div>
        </Card>
        <Divider>
        {selectedSession_info.map( (session) => ( <h2>Analyzing Data from the {session.session_name} in {session.location} that started at {session.date_start}</h2>) ) }
        </Divider>
        <LapTimesChart selectedSession={selectedSession} drivers={drivers} stateData={stateData} />

      </header>
    </div>
  );
}

export default App;
