import { useState, useEffect } from 'react';

import { API } from "../openf1_api/api_utility";

const FetchQualiSessions = () => {
  const [sessions, setSessions] = useState([]);
  useEffect(() => {
    //fetch('https://api.openf1.org/v1/sessions?date_start%3E%3D2024-02-01&session_name=Qualifying')
    //fetch(API('sessions?date_start%3E%3D2024-02-01&session_name=Qualifying'))
    fetch(API('sessions?date_start%3E%3D2024-02-01'))
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
      <h2>All sessions since the beginning of 2024:</h2>
      {sessions.map((session) => (
        <p> {session.location} {session.session_name} {session.date_start}</p>
      ))}
    </div>
  );
};
export default FetchQualiSessions;