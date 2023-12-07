import Peer from "simple-peer";
import { messageAdded } from "./MessageThread/MessageThreadSlice";
import { store } from "./index";
import { sendLog, SourcesEnum } from "logger";
import { setIsResponding } from "./UserInput/UserInputSlice";

let peer = null;
let ws = null;

export const initializeWebRTCSocket = () => {
  if (!ws || ws.readyState !== WebSocket.OPEN || !peer) {
    ws = new WebSocket(process.env.REACT_APP_WEBRTCSOCKET);

    ws.onopen = () => {
      console.log("WebRTCSocket connection established");
      peer = new Peer({ initiator: true });

      peer.on("signal", (data) => {
        // Send signaling data to the client through WebSocket
        ws.send(JSON.stringify(data));
      });
  
      peer.on("connect", () => {
        console.log("Peer connection established");  
        ws.close();
      });

      peer.on("data", (data) => {
        const formattedMessage = JSON.parse(data.toString());
        store.dispatch(messageAdded(formattedMessage));
        store.dispatch(setIsResponding(false));
      });
  
      peer.on('close', () =>  {
        peer = null; 
        console.log('Client peer connection closed') 
      });
  
      peer.on('error', err => {
        peer = null; 
        console.log('Client peer error:', err)
      });
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      peer.signal(data.data);
    };

    ws.onclose = () => {
      ws = null;
      console.log("WebRTCSocket connection closed");
    };
  }
};

export const sendWebRTCMessage = (message) => {
  const messageLeaveClientTimestamp = new Date().getTime()
  peer.send(JSON.stringify(message))
  sendLog(message, messageLeaveClientTimestamp, SourcesEnum.CLIENT_SENT_TO_SERVER)
}

export const freeWebRTCResource = () => {
    if (peer) {
        peer.destroy();
        peer = null;
        ws = null;
    }
}
