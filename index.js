const express = require('express');
const { WebSocketServer } = require('ws');

// Create an express server
const webserver = express()
    .use((req, res) =>
        res.sendFile('websocket-client.html', { root: __dirname })
    )
    .listen(3000, () => console.log(`HTTP server is listening on port 3000`));

// WebSocket server on port 8080
const sockserver = new WebSocketServer({ port: 413 });
console.log(`WebSocket server is listening on ws://localhost:413`);

let clientCount = 0; // Initialize a counter for connected clients

sockserver.on('connection', (ws, req) => {
    clientCount++; // Increment the count when a new client connects
    const ip = req.socket.remoteAddress || req.headers['x-forwarded-for'];
    console.log(`New client connected! IP: ${ip} - Total connected clients: ${clientCount}`);

    ws.send(`Client connected. Your IP address is: ${ip}.`);

    // Broadcast current client count
    sockserver.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send(`Current connected clients: ${clientCount}`);
        }
    });

    ws.on('close', () => {
        clientCount--; // Decrement the count when a client disconnects
        console.log(`Client has disconnected! IP: ${ip} - Total connected clients: ${clientCount}`);

        // Broadcast updated client count
        sockserver.clients.forEach(client => {
            if (client.readyState === client.OPEN) {
                client.send(`Current connected clients: ${clientCount}`);
            }
        });
    });

    ws.on('message', data => {
        console.log(`Message from client: ${data}`);

        // Broadcast the message to all connected clients
        sockserver.clients.forEach(client => {
            if (client.readyState === client.OPEN) {
                client.send(`Hello dear client, this is your message: ${data}`);
            }
        });
    });

    ws.onerror = function () {
        console.log('WebSocket error');
    };
});
