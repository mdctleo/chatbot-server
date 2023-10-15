import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL)
      .then(res => res.json())
      .then(
        (result) => {
         console.log(result)
        },
        (error) => {
          console.log(error)
        }
      )
      
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET);

    ws.onopen = () => {
      console.log('WebSocket connection established');
      ws.send('Hello, server!');
    };

    ws.onmessage = (event) => {
      console.log(`Received message: ${event.data}`);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
      
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
