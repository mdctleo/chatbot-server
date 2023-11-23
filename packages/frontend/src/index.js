import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import messageThreadSlice from './MessageThread/MessageThreadSlice'
import userInputSlice from './UserInput/UserInputSlice'
import { initializeIcons, registerIcons } from '@fluentui/react'
import { DEFAULT_COMPONENT_ICONS } from '@azure/communication-react'
import { fluentButton, fluentSelect, fluentOption, provideFluentDesignSystem } from '@fluentui/web-components';



export const store = configureStore({
  reducer: {
    messageThread: messageThreadSlice,
    userInput: userInputSlice  
  }
})

initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });
provideFluentDesignSystem().register(
  fluentButton(),
  fluentSelect(),
  fluentOption());


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
