import WebSocket, {WebSocketServer} from "ws";

const wss = new WebSocketServer({ port: process.env.PORT || 8080});

wss.on('connection', (ws) => {
    console.log("Player connected!");

    ws.on('message', (message) => {
        if (message === 'ping') {
            ws.send('pong');
        };

    })

    ws.on('close', () => {
        console.log("player disconnected!");
    })


})