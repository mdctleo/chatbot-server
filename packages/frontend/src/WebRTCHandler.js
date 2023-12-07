import Peer from "simple-peer";
import { messageAdded } from "./MessageThread/MessageThreadSlice";
import { store } from "./index";
import { sendLog, SourcesEnum } from "logger";
import { setIsResponding } from "./UserInput/UserInputSlice";

let peer = null;
let ws = null;

export const initializeWebrtcSocket = () => {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    ws = new WebSocket("ws://localhost:8000");

    ws.onopen = () => {
      console.log("WebSocket connection established");
      peer = new Peer({ initiator: true });

      peer.on("signal", (data) => {
        console.log("got inside signalling")
        // Send signaling data to the client through WebSocket
        ws.send(JSON.stringify(data));
      });
  
      peer.on("connect", () => {
        console.log("Peer connection established");  
        ws.close();
      });

      peer.on("data", (data) => {
        const timeStamp = new Date().getTime();

        const formattedMessage = JSON.parse(data.toString());
        
        sendLog(formattedMessage, timeStamp, SourcesEnum.CLIENT_RECEIVED_FROM_SERVER)

        store.dispatch(messageAdded(formattedMessage));
        store.dispatch(setIsResponding(false));
      });
  
      peer.on('close', () => console.log('peer connection closed'));
  
      peer.on('error', err => console.log('peer error:', err));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      peer.signal(data.data);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
  }

  return peer;
};

export const sendWebrtcMessage = (message) => {
  const messageLeaveClientTimestamp = new Date().getTime()
  peer.send(JSON.stringify(message))
  sendLog(message, messageLeaveClientTimestamp, SourcesEnum.CLIENT_SENT_TO_SERVER)
}

export const freeWebrtcResource = () => {
    if (peer) {
        peer.destroy();
    }
}
