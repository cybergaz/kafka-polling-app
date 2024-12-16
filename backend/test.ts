import { WebSocket, WebSocketServer } from "ws";


const wss = new WebSocket("ws://localhost:8080");

wss.on('open', () => {
    wss.send('something');
});
