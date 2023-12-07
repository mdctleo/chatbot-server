import { ServerOptions, WebSocket, WebSocketServer } from "ws";
import { CustomWebSocket } from "./CustomWebSocket";
import { generateMessageFormat } from "./MessageFomatter";
import { SourcesEnum, sendLog } from "logger";
import { getLLMResponse } from "./LMService";
import Peer from "simple-peer";
const wrtc = require("wrtc");

/**
 * Wrapper around the WebSocketServer from ws, handles lifcycle methods here to decrease complexity at index
 */
export class CustomWebSocketServer extends WebSocketServer {
  private pingInterval: NodeJS.Timeout;
  private pingIntervalTime: number;
  private peer: Peer.Instance | null = null;


  constructor(serverOptions: ServerOptions) {
    super(serverOptions);

    this.on("connection", this.onConnection);
    this.on("close", this.onClose);

    /**
     * Periodically check for broken connections, and close them if needed
     */
    this.pingIntervalTime = 10000;
    this.pingInterval = setInterval(() => {
      this.checkConnectionStatus();
    }, this.pingIntervalTime);
  }

  private onConnection = (socket: WebSocket, request: any): void => {
    const customWebSocket = socket as CustomWebSocket;
    customWebSocket.isAlive = true;


    customWebSocket.on("error", console.error);

    customWebSocket.on("message", async (req) => {
      let timeStamp = new Date().getTime();

    //   console.log("Received message:", req.toString());

      const body = JSON.parse(req.toString());
      console.log(body)

      if (body.type) {
        if (!this.peer) {
          this.peer = new Peer({ initiator: false, wrtc: wrtc });

          this.peer.on('close', () => console.log('peer connection closed'));
  
          this.peer.on('error', err => console.log('peer error:', err));

          this.peer.on("signal", (data) => {
            console.log("Server got to on signal")
            customWebSocket.send(JSON.stringify({ type: "signal", data }));
          });

          this.peer.on("connect", () => {
            console.log("Peer connection established");
          });

          this.peer.on("data", async (data) => {
            console.log("Server Received data:", data.toString());
            const { message } = JSON.parse(data.toString());
            console.log("Message:", message);

            let llmResp = "This is a test response from the WebRTC protocol";
            if (body.useLLM === true) {
              llmResp = await getLLMResponse(message.content);
            }

            const response = JSON.stringify(
              generateMessageFormat(
                llmResp,
                body.sessionId,
                body.exchangeId,
                body.improvement
              )
            );

            this.peer?.send(response)
          });
        }

        this.peer.signal(body);
      } else {
        // sendLog(body, timeStamp, SourcesEnum.CLIENT_SENT_TO_SERVER);

        timeStamp = new Date().getTime();
        // sendLog(body, timeStamp, SourcesEnum.SERVER_SENT_TO_LLM);

        let llmResp = "This is a test response from the WebSocket protocol";
        if (body.useLLM === true) {
          llmResp = await getLLMResponse(body.message.content);
        }

        timeStamp = new Date().getTime();
        // sendLog(body, timeStamp, SourcesEnum.SERVER_RECEIVED_FROM_LLM);

        const response = JSON.stringify(
          generateMessageFormat(
            llmResp,
            body.sessionId,
            body.exchangeId,
            body.improvement
          )
        );

        timeStamp = new Date().getTime();
        // sendLog(body, timeStamp, SourcesEnum.SERVER_SENT_TO_CLIENT);
        customWebSocket.send(response);
      }
    });

    customWebSocket.on("pong", () => {
      customWebSocket.isAlive = true;
    });
  };

  private checkConnectionStatus = (): void => {
    this.clients.forEach((ws) => {
      const customWebSocket = ws as CustomWebSocket;

      if (!customWebSocket.isAlive) return ws.terminate();

      customWebSocket.isAlive = false;
      customWebSocket.ping(null, undefined);
    });
  };

  public onClose = (): void => {
    clearInterval(this.pingInterval);
  };
}
