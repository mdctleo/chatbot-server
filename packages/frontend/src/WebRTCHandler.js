import Peer from "simple-peer";

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
        // Now you can send data to the client through the peer
        peer.send("Hello, Server!");
  
      //   ws.close();
      });
  
      peer.on('close', () => console.log('peer connection closed'));
  
      peer.on('error', err => console.log('peer error:', err));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("websocket on message")
      console.log(data)
      peer.signal(data);
      //   const formattedMessage = JSON.parse(event.data)
      //   store.dispatch(messageAdded(formattedMessage))
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // peer.on("data", (data) => {
    //   console.log("Received data from Server:");
    // });
  }

  return peer;
};

export const freeWebrtcResource = () => {
    if (peer) {
        peer.destroy();
    }
}
