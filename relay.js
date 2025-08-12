const PORT = process.env.PORT || 3000;

const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: PORT });

const lobbies = new Set();

wss.on("connection", (ws) => {
    console.log("Client connected");

    // ws.on("message", (msg) => {
    //     wss.clients.forEach((client) => {
    //         if (client !== ws && client.readyState === WebSocket.OPEN) {
    //             client.send(msg);
    //         }
    //     });
    // });

	ws.on("message", (msg) => {
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(msg);
            }
        });
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});