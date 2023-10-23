import { ServerOptions, WebSocket, WebSocketServer } from "ws";
import { CustomWebSocket } from "./CustomWebSocket";

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
  
        customWebSocket.on('message', (message) => {
            console.log(`Received message => ${message}`);
        });

        customWebSocket.on('pong', () => { 
            customWebSocket.isAlive = true;
        });
  
        customWebSocket.send('Hello client');
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
     
