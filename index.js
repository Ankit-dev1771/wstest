import { WebSocketServer } from 'ws';

// Create WebSocket server on port 8080
const port = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: port });

wss.on('connection', (ws) => {
    console.log('Player connected');

    // When server gets a message from client
    ws.on('message', (message) => {
        console.log('Received:', message.toString());

        // Broadcast to all connected players
        wss.clients.forEach((client) => {
            if (client.readyState === ws.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on('close', () => {
        console.log('Player disconnected');
    });
});

console.log("WebSocket server running on ws://localhost:8080");
