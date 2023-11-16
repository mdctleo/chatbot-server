import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
import React from 'react';
import { MessageThreadView } from './MessageThread/MessageThreadView';
import { UserInputView } from './UserInput/UserInputView';



function App() {
  useEffect(() => {
    // fetch(process.env.REACT_APP_API_URL)
    //   .then(res => res.json())
    //   .then(
    //     (result) => {
    //      console.log(result)
    //     },
    //     (error) => {
    //       console.log(error)
    //     }
    //   )
      
    // const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET);

    // ws.onopen = () => {
    //   console.log('WebSocket connection established');
    //   ws.send('Hello, server!');
    // };

    // ws.onmessage = (event) => {
    //   console.log(`Received message: ${event.data}`);
    // };

    // ws.onclose = () => {
    //   console.log('WebSocket connection closed');
    // };

    const setVh = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };

    window.addEventListener('resize', setVh);
    setVh(); // Initial set

    return () => {
      window.removeEventListener('resize', setVh);
    };
      
  }, [])

  return (
    <div className="grid-container">
      <MessageThreadView />
      <UserInputView />
    </div>
  );
}

export default App;
