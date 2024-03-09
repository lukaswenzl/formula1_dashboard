import logo from './logo.svg';
import './App.css';

import FetchQualiSessions from "./components/Fetch"

//import {LineChartHero} from "./components/FirstChart"
//import {ExampleCard} from "./components/SecondChart"

import {LapTimesChart} from "./components/LapTimesChart"
//import {ScatterChartUsageExample} from "./components/ThirdChart"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/*<img src={logo} className="App-logo" alt="logo" />
        
         This is a comment */}
        {/*<p>
          Edit <code>src/App.js</code> and save to reload. 
        </p> 
  <p>test4 {test_string} {}</p> */}
        <FetchQualiSessions/>
        <LapTimesChart/>
        {/*<LineChartHero/>
        <ScatterChartUsageExample/>
        <ExampleCard/>
        <a>Hello</a>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
</a>*/}
      </header>
    </div>
  );
}

export default App;
