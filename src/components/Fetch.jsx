import { useState, useEffect } from 'react';
import { API } from "../openf1_api/api_utility";


export function FetchSessions () {
  const [sessions, setSessions] = useState([]);
  useEffect(() => {
    //fetch('https://api.openf1.org/v1/sessions?date_start%3E%3D2024-02-01&session_name=Qualifying')
    //fetch(API('sessions?date_start%3E%3D2024-02-01&session_name=Qualifying'))
    //fetch(API('sessions?session_key=latest'))
    fetch(API('sessions?date_start%3E%3D2024-02-01&session_name=Race'))
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setSessions(data);
      });
  }, []);
  return sessions
};

export function FetchDrivers(currentSession){
  const [drivers, setDrivers] = useState([]);
  useEffect(() => {
    fetch(API('drivers?session_key='+currentSession))
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setDrivers(Object.fromEntries(data.map((driver) => [driver.driver_number, driver.name_acronym])));
      });
  }, [currentSession]);
  return drivers
};


        /*<div>
      <h2>Latest Formula 1 Session:</h2>
      {sessions.map((session) => (
        <p>{session.session_name} in {session.location} started at {session.date_start}</p>
      ))}
      </div>*/

      /*(
    
        <div>
        <p>{sessions.map((session) => (
          <SelectItem value={session.session_key}>{session.location} {session.session_name} {session.date_start}</SelectItem> ))}
        </p>
        </div>
      );*/