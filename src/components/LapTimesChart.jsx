import { Card, LineChart } from '@tremor/react';

import { useState, useEffect } from 'react';
import { API } from "../openf1_api/api_utility";


const groupBy = (input, key) => {
  return input.reduce((acc, currentValue) => {
    let groupKey = currentValue[key];
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(currentValue);
    return acc;
  }, {});
};

const formatLapData = (grouped_data, drivers) => {
  var res = [];
  for(var lap_number in grouped_data) {
    var next_entry = {"lap_number":lap_number};
    for(var j in grouped_data[lap_number]) {
      var driver_lap = grouped_data[lap_number][j];
      next_entry[drivers[driver_lap["driver_number"]]] = driver_lap["lap_duration"];
    }
    res.push(next_entry);
  }
  return res;
}

const uniqueDriverNumbers = (data) => {
  var lookup = {};
  var lst_uniqueDriverNumbers = [];

  for(let i = 0; i < data.length; i++) {
    var name = data[i]["driver_number"];
    if (!(name in lookup)) {
      lookup[name] = 1;
      lst_uniqueDriverNumbers.push(name);
    }
  }
  return lst_uniqueDriverNumbers;
}

export function LapTimesChart({selectedSession, drivers}) {
  const [laps, setLaps] = useState([]);
  useEffect(() => {
    //fetch(API('laps?session_key=latest&driver_number=44'))
    //fetch(API('laps?session_key=9472&driver_number=1')) // Sakhir Race
    console.log("reloading lap data")
    console.log(selectedSession)
    fetch(API('laps?session_key='+selectedSession))//&driver_number<5'))
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("loaded lap times")
        console.log(data);
        setLaps(data);
      });
  }, [selectedSession]);
  
  //className="mx-auto max-w-md"
  return (
    <Card>
      <p className="text-lg text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">Lap time in seconds for each lap completed </p>
      <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content leading-6">For each driver labeled by driver number</p>
    <LineChart
      className="h-80"
      data={formatLapData(groupBy(laps, 'lap_number'), drivers)}
      index="lap_number"
      categories={uniqueDriverNumbers(laps).map((driver_number) => drivers[driver_number])}
      yAxisWidth={60}
      onValueChange={(v) => console.log(v)}
      autoMinValue="True"
    />
    </Card>
  );
}

//  colors={['indigo', "red"]}
//      {/*  valueFormatter={dataFormatter} */}