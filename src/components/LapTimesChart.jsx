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

const formatLapData = (grouped_data, drivers, minTime=0, maxTime=10000) => {
  var res = [];
  for(var lap_number in grouped_data) {
    var next_entry = {"lap_number":lap_number};
    for(var j in grouped_data[lap_number]) {
      let driver_lap = grouped_data[lap_number][j];
      let lap_time = driver_lap["lap_duration"]
      if( lap_time >= minTime && lap_time < maxTime) {
        next_entry[drivers[driver_lap["driver_number"]]] = lap_time ;
      }
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

  let fastestLap = Math.min(...laps.map((lap) => lap.lap_duration).filter(a => a >0.));
  //laps.reduce((accumulator, currentValue) => Math.min(accumulator, currentValue.lap_duration),
  //1000);
  console.log("Fastest Lap")
  console.log(fastestLap)
  
  //className="mx-auto max-w-md"
  return (
    <div>
    <Card>
      <p className="text-lg text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">Lap time in seconds for each lap completed </p>
      <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content leading-6">Data shown for each driver. This view primarely visualizes pit stops (single lap peaks) and safety car periods (multi lap peaks)</p>
    <LineChart
      className="h-80"
      data={formatLapData(groupBy(laps, 'lap_number'), drivers)}
      index="lap_number"
      categories={uniqueDriverNumbers(laps).map((driver_number) => drivers[driver_number])}
      yAxisWidth={60}
      onValueChange={(v) => console.log(v)}
      autoMinValue="False"
      maxValue={150}
    />
    </Card>
    <Card>
      <p className="text-lg text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">Lap time in seconds for each lap completed (Zoomed in) </p>
      <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content leading-6">Here we show the lap time data with a narrow y range. We can see the lap time improvement over time due to the reducing fuel level in the cars. </p>
    <LineChart
      className="h-80"
      data={formatLapData(groupBy(laps, 'lap_number'), drivers, fastestLap, fastestLap*1.1)}
      index="lap_number"
      categories={uniqueDriverNumbers(laps).map((driver_number) => drivers[driver_number])}
      yAxisWidth={120}
      onValueChange={(v) => console.log(v)}
      maxValue={fastestLap*1.1}
      minValue={fastestLap}
    />
    </Card>
    </div>
  );
}

//  colors={['indigo', "red"]}
//      {/*  valueFormatter={dataFormatter} */}