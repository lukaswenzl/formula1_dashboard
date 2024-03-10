import { Card, LineChart, Divider, Grid, Tab, TabGroup, TabList  } from '@tremor/react';

import { useState, useEffect } from 'react';
import { API } from "../openf1_api/api_utility";

import { TopThreeCard } from "./TopThreeCard";


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

//want cumulative lap time to calculate gaps, need to be carefull with laping cars

const fastestFiverDrivers = (data) => {
  const best_times_for_each_driver = data.reduce((acc, lap) => {
    let driver = lap["driver_number"];
    if (!acc[driver]) {
      acc[driver] = lap["lap_duration"];
    }
    if(acc[driver] > lap["lap_duration"]) {
      acc[driver] = lap["lap_duration"];
    }
    return acc;
  }, {});
  let items = Object.keys(best_times_for_each_driver).map((key) => {
    return [key, best_times_for_each_driver[key]];
  });
  return items.sort((a,b) => a[1] - b[1]).slice(0,5).map( (a) => a[0])
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

export function LapTimesChart({selectedSession, drivers, stateData}) {
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
        setLaps(data);
      });
  }, [selectedSession, stateData]);

  let fastestLap = Math.min(...laps.map((lap) => lap.lap_duration).filter(a => a >0.));
  //laps.reduce((accumulator, currentValue) => Math.min(accumulator, currentValue.lap_duration),
  //1000);
  console.log("Fastest Lap")
  console.log(fastestLap)


  /*const [driverSubset, setDriverSubset] = useState(["all"]);
  const [driverSubsetArr, setDriverSubsetArr] = useState([]);
  //let driverSubsetArr = []
  useEffect(() => {
    console.log("running")
    if(driverSubset === "all") {
      setDriverSubsetArr(uniqueDriverNumbers(laps).map(String))
    }
    if(driverSubset === "top5") {
      setDriverSubsetArr(fastestFiverDrivers(laps))
    }
  }, [driverSubset, laps]); 
  console.log("Fastest 5 drivers")
  console.log(driverSubsetArr.map(String)) */
  //className="mx-auto max-w-md"
  return (
    <div>
    <Card>
      <p className="text-lg text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">Lap time in seconds for each lap completed </p>
      <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content leading-6">Data shown for each driver. This view primarely visualizes pit stops (single lap peaks) and safety car periods (multi lap peaks).</p>
      {/*<div className="mt-6 md:mt-0">
          <TabGroup>
            <TabList 
            variant="solid" 
            defaultValue={driverSubset}
            onValueChange={(value) => {setDriverSubset(value); console.log("hello")}}
          >
            <Tab value="all">All</Tab>
            <Tab value="top5">Fastest 5</Tab>
            </TabList>
          </TabGroup>
  </div>, .filter((a) => driverSubsetArr.includes(a) )*/}
    <LineChart
      className="h-80"
      data={formatLapData(groupBy(laps, 'lap_number'), drivers)}
      index="lap_number"
      categories={uniqueDriverNumbers(laps).map(String).map((driver_number) => drivers[driver_number])}
      yAxisWidth={60}
      onValueChange={(v) => console.log(v)}
      autoMinValue="False"
      maxValue={150}
    />
    </Card>
    <Card>
      <p className="text-lg text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">Lap time in seconds for each lap completed (Zoomed in) </p>
      <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content leading-6">Here we show the lap time data with a narrow y range. We here see two competing effects: lap times improve over time due to the reducing fuel level in the cars and over time the tire wear slows the car down. On tracks where tires wear is small we we see lap time improvements over time from the decreasing fuel. Hower on tracks with a lot of tire wear we instead see for each stint between pit stops an increase in lap time as the tire fades away and then a jump down after each pitstop when the tires are changed. Fastest lap attempts on high tire wear tracks can often be seen directly after the last pitstop. </p>
    <LineChart
      className="h-80"
      data={formatLapData(groupBy(laps, 'lap_number'), drivers, fastestLap, fastestLap*1.1)}
      index="lap_number"
      categories={uniqueDriverNumbers(laps).map((driver_number) => drivers[driver_number])}
      yAxisWidth={50}
      onValueChange={(v) => console.log(v)}
      maxValue={Math.round(fastestLap*1.1 *1000)/1000}
      minValue={fastestLap}
    />
    </Card>
    <Grid numItemsSm={2} numItemsMd={2} numItemsLg={3} className="mt-6 gap-6">
        <TopThreeCard laps={laps} drivers={drivers} key_metric= "lap_duration" unit="s" title= "Fastest Lap times" bigger= "False" />
        <TopThreeCard laps={laps} drivers={drivers} key_metric= "duration_sector_1" unit="s" title= "Fastest Sector 1 times" bigger= "False" />
        <TopThreeCard laps={laps} drivers={drivers} key_metric= "duration_sector_2" unit="s" title= "Fastest Sector 2 times" bigger= "False" />
        <TopThreeCard laps={laps} drivers={drivers} key_metric= "duration_sector_3" unit="s" title= "Fastest Sector 3 times" bigger= "False" />
        <TopThreeCard laps={laps} drivers={drivers} key_metric= "st_speed" unit=" km/h" title= "Fastest speed at the speedtrap" bigger= "True" />
      </Grid>
    </div>
  );
}

//  colors={['indigo', "red"]}
//      {/*  valueFormatter={dataFormatter} */}

/*<Card>
      <Divider>Head to head comparison of two drivers</Divider>
      <Grid numColsLg={2} className="mt-6 gap-6">
      <Card className="mx-auto max-w-md">Test</Card>
      <Card className="mx-auto max-w-md">Test2</Card>
      </Grid>
    </Card>*/