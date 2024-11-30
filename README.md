# Node WebSocket Live Chat

**node-websocket-live-chat** is a real-time messaging application built with Node.js and WebSocket technology. This project enables users to communicate instantly through a chat interface, where messages are exchanged between clients and operators in real time.

## Features

- **Real-Time Messaging**: Leverages WebSocket for low-latency communication, allowing users to send and receive messages instantly.
- **Multi-Role Support**: Supports different roles (clients and operators) to facilitate diverse interaction models.
- **Message Storage**: Utilizes SQLite to store chat messages, ensuring that conversations can be retrieved and reviewed.
- **Broadcast Capabilities**: Automatically broadcasts messages to all connected clients, keeping everyone in the loop.
- **Message Fetching**: Allows clients to request and receive the entire chat history from the server.

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/node-websocket-live-chat.git
   cd node-websocket-live-chat

### Installation

Follow these steps to set up your project:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/node-websocket-live-chat.git
   cd node-websocket-live-chat
2. **Install dependencies**:
    ```bash
    npm install

3. **Run the server:**:
    ```bash
    node index.js
    ```
4. **Connect to the WebSocket:** Use a WebSocket client (or build a front-end application) to connect to the server at ws://localhost:413.


                             +-----------------------+
                             |      WebSocket        |
                             |      Server (wss)     |
                             +----------+------------+
                                        |
                                        |
                    +-------------------+----------------------+
                    |                                      (Connections)
                    |
                    |
               +----+----------+                        +---------+-------+
               |  Operator     |                        |   Client        |
               | (Web Browser) |                        | (Web Browser)   |
               +---------------+                        +-----------------+
                    |                                           |
                    |                                           |
               (Send Messages / Fetch Messages)            (Send Messages / Fetch Messages)
                    |                                           |
                    +------------------------+-----------------+
                                             |
                                             |
                       +---------------------+---------------------+
                       |                                           |
                +------+-------+                            +------+-------+
                |   Database   |                            |   Message    |
                |   (SQLite)   |                            |   Storage    |
                +--------------+                            +--------------+


# Technologies Used
    Node.js: A JavaScript runtime for building fast and scalable applications.
    WebSocket: A protocol for full-duplex communication channels over a single TCP connection, ideal for real-time web applications.
    SQLite: A lightweight database engine for storing chat messages.
