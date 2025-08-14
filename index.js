import WebSocket, {WebSocketServer} from "ws";

const wss = new WebSocketServer({ port: process.env.PORT || 8080});

wss.on('connection', (ws) => {
    console.log("Player connected!");

    ws.on('message', (message) => {
        if (message.toString() === 'ping') {
            ws.send('pong');
            console.log("Ping received, sent pong.");
        }
        else{
            console.log("Received message:", message.toString());
        };

    })

    ws.on('close', () => {
        console.log("player disconnected!");
    })


})