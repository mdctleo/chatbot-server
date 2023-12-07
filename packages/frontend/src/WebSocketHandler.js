import { messageAdded } from "./MessageThread/MessageThreadSlice";
import { store } from "./index";
import { sendLog, SourcesEnum } from "logger";
import { setIsResponding } from "./UserInput/UserInputSlice";

let ws = null

export const sendWebSocketMessage = (message) => {
  const messageLeaveClientTimestamp = new Date().getTime()
  ws.send(JSON.stringify(message))
  sendLog(message, messageLeaveClientTimestamp, SourcesEnum.CLIENT_SENT_TO_SERVER)
}

export const initializeWebSocket = () => {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    ws = new WebSocket(process.env.REACT_APP_WEBSOCKET);

    ws.onopen = () => {
      console.log('WebSocket connection established')
    };
    
    ws.onmessage = (event) => {
      const formattedMessage = JSON.parse(event.data)
      console.log(formattedMessage)
      store.dispatch(messageAdded(formattedMessage))
      store.dispatch(setIsResponding(false))
    };
    
    ws.onclose = () => {
      console.log('WebSocket connection closed')
    };
  }

  return ws;
}

export const closeWebSocket = () => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.close()
  }
}

