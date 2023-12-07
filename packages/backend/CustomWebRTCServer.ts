import { ServerOptions, WebSocket, WebSocketServer } from "ws";
import { CustomWebSocket } from "./CustomWebSocket";
import { generateMessageFormat } from "./MessageFomatter";
import { SourcesEnum, sendLog } from "logger";
import { getLLMResponse } from "./LMService";
import Peer from "simple-peer";
const wrtc = require("wrtc");

/**
 * Wrapper around the WebSocketServer from ws,
 * Less lifecycle compared to CustomWebSocketServer
 * Because in WebRTC protocol, the WebSocket connection is only used for establishing the connection
 * After that, the connection is handled by the Peer instance
 */
export class CustomWebRTCServer extends WebSocketServer {
  private peer: Peer.Instance | null = null;

  constructor(serverOptions: ServerOptions) {
    super(serverOptions);

    this.on("connection", this.onConnection);
  }

  private onConnection = (socket: WebSocket, request: any): void => {
    const customWebSocket = socket as CustomWebSocket;
    customWebSocket.isAlive = true;

    customWebSocket.on("error", console.error);

    customWebSocket.on("message", async (req) => {
      let timeStamp = new Date().getTime();

      const formattedMessage = JSON.parse(req.toString());

      if (!this.peer) {
        this.peer = new Peer({ initiator: false, wrtc: wrtc });

        this.peer.on("close", () => { 
          console.log("peer connection closed")
          this.peer = null 
        });

        this.peer.on("error", (err) => { 
          console.log("peer error:", err)
          this.peer = null 
        });

        this.peer.on("signal", (data) => {
          customWebSocket.send(JSON.stringify({ type: "signal", data }));
        });

        this.peer.on("connect", () => {
          console.log("Peer connection established");
        });

        this.peer.on("data", async (data) => {
          let timeStamp = new Date().getTime();

          const formattedMessage = JSON.parse(data.toString());

          sendLog(formattedMessage, timeStamp, SourcesEnum.CLIENT_RECEIVED_FROM_SERVER);

          timeStamp = new Date().getTime();
          sendLog(formattedMessage, timeStamp, SourcesEnum.SERVER_SENT_TO_LLM);

          let llmResp = "This is a test response from the WebRTC protocol";
          if (formattedMessage.useLLM === true) {
            llmResp = await getLLMResponse(formattedMessage.content);
          }

          timeStamp = new Date().getTime();
          sendLog(formattedMessage, timeStamp, SourcesEnum.SERVER_RECEIVED_FROM_LLM)

          const response = JSON.stringify(
            generateMessageFormat(
              llmResp,
              formattedMessage.sessionId,
              formattedMessage.exchangeId,
              formattedMessage.improvement
            )
          );

          timeStamp = new Date().getTime();
          sendLog(formattedMessage, timeStamp, SourcesEnum.SERVER_SENT_TO_CLIENT);

          this.peer?.send(response);
        });

        this.peer.signal(formattedMessage);
      }
    });
  };
}
