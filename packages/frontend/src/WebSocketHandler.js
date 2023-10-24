import { messageAdded } from "./MessageThread/MessageThreadSlice";
import { store } from "./index";

const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET)

ws.onopen = () => {
  console.log('WebSocket connection established')
};

ws.onmessage = (event) => {
  console.log(`Received message: ${event.data}`)
  const formattedMessage = JSON.parse(event.data)
  store.dispatch(messageAdded(formattedMessage))
};

ws.onclose = () => {
  console.log('WebSocket connection closed')
};


export default ws
