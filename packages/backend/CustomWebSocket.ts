/**
 * A wrapper around the WebSocket from ws that handles broken connections
 */
import WebSocket from 'ws';

export interface CustomWebSocket extends WebSocket {
    isAlive: boolean;
}