const express = require('express');
const { WebSocketServer } = require('ws');

// Create an express server
const webserver = express()
    .use((req, res) =>
        res.sendFile('websocket-client.html', { root: __dirname })
    )
    .listen(3000, () => console.log(`HTTP server is listening on port 3000`));

const sockserver = new WebSocketServer({ port: 413 });
console.log(`WebSocket server is listening on ws://localhost:413`);

let clients = [];
let operator = null; // Variable to hold the operator connection

sockserver.on('connection', (ws, req) => {
    ws.on('message', data => {
        const message = JSON.parse(data);

        if (message.type === 'register') {
            if (message.role === 'operator') {
                operator = ws;
                console.log('Operator connected');
                ws.send(JSON.stringify({ message: 'You are now registered as the operator.' }));

            } else if (message.role === 'client') {
                clients.push(ws);
                console.log('Client connected');

                ws.send(JSON.stringify({ message: 'You are now registered as a client.' }));

                // Notify operator about the new client
                if (operator) {
                    operator.send(JSON.stringify({ message: 'A new client has connected.' }));
                }
            }
        } else if (message.type === 'clientMessage' && operator) {
            // If a client sends a message, forward it to the operator
            operator.send(JSON.stringify({ clientMessage: message.text }));
        } else if (message.type === 'operatorMessage' && operator) {
            // If the operator sends a message, forward it to all clients
            clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(JSON.stringify({ operatorMessage: message.text }));
                }
            });
        }
    });

    ws.on('close', () => {
        console.log('A client or operator has disconnected');

        // Remove client from the clients array
        clients = clients.filter(client => client !== ws);
    });

    ws.onerror = function () {
        console.log('WebSocket error');
    };
});
