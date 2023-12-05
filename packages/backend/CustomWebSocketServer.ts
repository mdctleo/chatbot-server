import { ServerOptions, WebSocket, WebSocketServer } from "ws";
import { CustomWebSocket } from "./CustomWebSocket";
import { generateMessageFormat } from "./MessageFomatter";
import { SourcesEnum, sendLog } from "logger";
import { getLLMResponse } from "./LMService";

/**
 * Wrapper around the WebSocketServer from ws, handles lifcycle methods here to decrease complexity at index
 */
export class CustomWebSocketServer extends WebSocketServer {
    private pingInterval: NodeJS.Timeout;
    private pingIntervalTime: number;

    constructor(serverOptions: ServerOptions) {
        super(serverOptions)

        this.on('connection', this.onConnection);
        this.on('close', this.onClose);

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

        customWebSocket.on('error', console.error);
  
        customWebSocket.on('message', async (req) => {
            let timeStamp = new Date().getTime();

            const body = JSON.parse(req.toString());

            sendLog(body, timeStamp, SourcesEnum.CLIENT_SENT_TO_SERVER);

            timeStamp = new Date().getTime();
            sendLog(body, timeStamp, SourcesEnum.SERVER_SENT_TO_LLM);
            
            let llmResp = "This is a test response from the WebSocket protocol"
            if (body.useLLM === true) {
                llmResp = await getLLMResponse(body.message.content);
            }

            timeStamp = new Date().getTime();
            sendLog(body, timeStamp, SourcesEnum.SERVER_RECEIVED_FROM_LLM);

            const response = JSON.stringify(generateMessageFormat(llmResp, body.sessionId, body.exchangeId, body.improvement))
            
            timeStamp = new Date().getTime();
            sendLog(body, timeStamp, SourcesEnum.SERVER_SENT_TO_CLIENT);
            customWebSocket.send(response);
        });

        customWebSocket.on('pong', () => { 
            customWebSocket.isAlive = true;
        });  
    } 

    private checkConnectionStatus = (): void => {
        this.clients.forEach((ws) => {
            const customWebSocket = ws as CustomWebSocket;

            if (!customWebSocket.isAlive) return ws.terminate();

            customWebSocket.isAlive = false;
            customWebSocket.ping(null, undefined);
        });
    }

    public onClose = (): void => {
        clearInterval(this.pingInterval);
    }
}
     
