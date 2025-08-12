const PORT = process.env.PORT || 3000;

const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: PORT });

const lobbies = new Map();

wss.on("connection", (ws) => {
    console.log("Client connected");

    // ws.on("message", (msg) => {
    //     wss.clients.forEach((client) => {
    //         if (client !== ws && client.readyState === WebSocket.OPEN) {
    //             client.send(msg);
    //         }
    //     });
    // });

	ws.on("message", (msg, isBinary) => {
        if (!isBinary) {
			console.log(msg);
			return;
		}

		const buffer = msg;
		let offset = 0;

		const commandId = buffer.readInt32LE(offset);
		offset += 4;

		if (commandId == 0)
		{
			const maxPlayers = buffer.readInt32LE(offset);
			offset += 4;

			const strByteLen = buffer.readInt32LE(offset);
			offset += 4;

			const lobbyName = buffer.toString('utf8', offset, offset + strByteLen);
			offset += strByteLen;

			lobbies.set(ws, [maxPlayers, lobbyName])
			console.log("Client " + ws + " created lobby " + lobbyName + " created.");
		}
		
    });

    ws.on("close", () => {
        console.log("Client disconnected");

		if (lobbies.has(ws))
		{
			console.log("Clients " + ws + "'s lobby " + lobbies.get(ws)[1] + " has been deleted.");
			lobbies.delete(ws)
		}
    });
});