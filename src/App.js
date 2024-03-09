import logo from './logo.svg';
import './App.css';

//import { API } from "./openf1_api/api_utility";
import FetchQualiSessions from "./components/Fetch"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
        {/* This is a comment */}
        {/*<p>
          Edit <code>src/App.js</code> and save to reload. 
        </p> 
  <p>test4 {test_string} {}</p> */}
        <FetchQualiSessions/>
        
        {/*<a
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
