import { useState, useEffect } from 'react';
import { API } from "../openf1_api/api_utility";

const FetchQualiSessions = () => {
  const [sessions, setSessions] = useState([]);
  useEffect(() => {
    //fetch('https://api.openf1.org/v1/sessions?date_start%3E%3D2024-02-01&session_name=Qualifying')
    //fetch(API('sessions?date_start%3E%3D2024-02-01&session_name=Qualifying'))
    //fetch(API('sessions?date_start%3E%3D2024-02-01'))
    fetch(API('sessions?session_key=latest'))
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setSessions(data);
      });
  }, []);
  return (
    <div>
      <h2>Latest Formula 1 Session:</h2>
      {sessions.map((session) => (
        <p>{session.session_name} in {session.location} started at {session.date_start}</p>
      ))}
    </div>
  );
};
export default FetchQualiSessions;