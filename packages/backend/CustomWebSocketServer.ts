import { ServerOptions, WebSocket, WebSocketServer } from "ws";
import { CustomWebSocket } from "./CustomWebSocket";
import { generateFakePlaceHolderMessages } from "./MessageFomatter";
import { SourcesEnum, sendLog } from "logger";

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
  
        customWebSocket.on('message', (req) => {
            let timeStamp = new Date().getTime();

            const body = JSON.parse(req.toString());

            sendLog(body, timeStamp, SourcesEnum.CLIENT_SENT_TO_SERVER);
            

            customWebSocket.send(JSON.stringify(generateFakePlaceHolderMessages("This is a response from the LLM", body.sessionId, body.exchangeId, body.improvement)));

            timeStamp = new Date().getTime();
            sendLog(body, timeStamp, SourcesEnum.SERVER_SENT_TO_CLIENT);
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
     
