import WebSocket, { WebSocketServer } from 'ws';

// Start WebSocket server on port 8080
const wss = new WebSocketServer({ server: httpServer  }, () => {
    console.log("WebSocket server running on ws://localhost:8080");
});

wss.on('connection', (ws) => {
    console.log("Player connected");

    ws.on('message', (message) => {
        const msg = message.toString();

        if (msg === "ping") {
            // Respond immediately to measure round-trip time
            ws.send("pong");
        }
    });

    ws.on('close', () => {
        console.log("Player disconnected");
    });
});
