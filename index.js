// server.js
const WebSocket = require('ws');
const db = require('./database');

const wss = new WebSocket.Server({ port: 413 });

console.log('WebSocket server running on ws://localhost:413');

try {
    wss.on('connection', (ws) => {
        try {
            ws.on('message', (message) => {
                const data = JSON.parse(message);

                if (data.type === 'clientMessage' || data.type === 'operatorMessage') {
                    const role = data.type === 'clientMessage' ? 'client' : 'operator';
                    const msg = data.text;

                    // Store the message in the database
                    db.run(`INSERT INTO messages (role, message) VALUES (?, ?)`, [role, msg], function (err) {
                        if (err) {
                            console.error(err.message);
                        }
                    });

                    // Broadcast the message back to all clients
                    wss.clients.forEach((client) => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({
                                [`${role}Message`]: msg,
                            }));
                        }
                    });
                }

                if (data.type === 'register') {
                    wss.clients.forEach((client) => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({
                                message: `${data.role} has joined the chat.`,
                            }));
                        }
                    });
                }
            });
        } catch (error) {
            console.error('An unexpected error occurred:1111 -- - -', error);

        }

        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });
} catch (error) {
    console.error('An unexpected error occurred:222 --- ', error);
}

// Fetch all messages on request
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.type === 'fetchMessages') {
            db.all(`SELECT * FROM messages ORDER BY timestamp ASC`, [], (err, rows) => {
                if (err) {
                    console.error(err);
                    return;
                }

                ws.send(JSON.stringify({ type: 'allMessages', messages: rows }));
            });
        }
    });
});
