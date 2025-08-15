import WebSocket, {WebSocketServer} from "ws";

import {v4 as uuidv4} from 'uuid'; 

const wss = new WebSocketServer({ port: process.env.PORT || 8080});


var playerCount = 0;

var PlayerData = {
    // format playerId : {
    //  player data}
}

wss.on('connection', (ws) => {
    console.log("Player connected!");

    playerCount++;

    const playerId = uuidv4();
    console.log("Player ID: " + playerId);
    PlayerData[playerId] = {
        ws,
        name: "New Player", // Empty until get name message
        pos: {x: 0, y: 0}, // Initial poaition
        health: 200, // Initial health
        current_animation: "idle",
    }

    ws.send(playerId) // For first coonection, sends player id
    add_player_count(PlayerData); // Notify all players about new player
    messageFromServer({
        type: 'MESSAGE_SERVER',
        message: {
            'type': 'JOIN',
            'id': playerId,
            'name': PlayerData[playerId].name,
        }
    })

    ws.on('message', (message) => {
        const data = JSON.parse(message.toString());

        if (data.type === 'UPDATE') {
            const player_id = data.player_id;
            PlayerData[player_id].name = data.name;
            PlayerData[player_id].pos = data.pos;
            PlayerData[player_id].health = data.health;
            PlayerData[player_id].current_animation = data.current_animation;

            broadcast({
                type: 'UPDATE',
                player_id: player_id,
                name: data.name,
                pos: data.pos,
                health: data.health,
                current_animation: data.current_animation
            });
        }

        if (data.type === 'CHAT_GLOBAL'){
            messageFromPlayerToGlobal(data);
        }

        if (data.type === 'STATUS_PULL'){
            const message = {
                type: 'STATUS_UPDATE',
                status: 'ONLINE',
                player_count: playerCount
            }
            broadcast(message);
        }
    })

    ws.on('close', () => {
        console.log("player disconnected!");
        playerCount--;
        delete PlayerData[playerId]; // Remove player data on disconnect
        remove_player_count(playerId); // Notify all players about player disconnection
    })


})

function broadcast(data) {
    for (const id in PlayerData) {
        const player = PlayerData[id];
        if (player && player.ws && player.ws.readyState == WebSocket.OPEN){
            player.ws.send(JSON.stringify(data));
        }
    }
}

function add_player_count(PlayerData) {
    const data = {
        type: 'ADD_PLAYER',
        player_ids : Object.keys(PlayerData), // List of all player IDs
    }
    for (const id in PlayerData) {
        const player = PlayerData[id];
        if (player && player.ws && player.ws.readyState == WebSocket.OPEN){
            player.ws.send(JSON.stringify(data));
        }
    }
}
function remove_player_count(PlayerID) {
    const data = {  
        type: 'REMOVE_PLAYER',
        player_id : PlayerID, // List of all player IDs
    }
    for (const id in PlayerData) {
        const player = PlayerData[id];
        if (player && player.ws && player.ws.readyState == WebSocket.OPEN){
            player.ws.send(JSON.stringify(data));
        }
    }
}

function messageFromServer(data) {
    for (const id in PlayerData) {
        const player = PlayerData[id];
        if (player && player.ws && player.ws.readyState == WebSocket.OPEN){
            player.ws.send(JSON.stringify(data));
        }

    }
}

function messageFromPlayerToGlobal(data){
    const message = {
        type: 'GLOBAL_CHAT',
        name: data.name,
        message: data.message,
        id: data.id,
    }
    broadcast(message);
}