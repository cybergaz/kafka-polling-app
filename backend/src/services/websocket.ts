import { WebSocketServer, WebSocket } from "ws";
import postgres from "postgres";
// import http from "http";
// import { io, http_server } from "../index";

// const server = http.createServer(http_server);
const socket_server = new WebSocketServer({ port: Number(process.env.socket_PORT) || 8080 }); // WebSocket server on port 8080
const clients = new Map(); // Map to track clients and their subscriptions

// Handle WebSocket connections
socket_server.on("connection", (socket: WebSocket) => {

    console.log("New client CONNECTED  ✔️");

    socket.on("message", (message: string) => {
        try {
            // Parse the incoming message
            const parsedMessage = JSON.parse(message);

            // Validate that "action" exists
            if (!parsedMessage.action) {
                console.error("Invalid message: 'action' is required.  ✖️");
                return;
            }

            const { action, pollId } = parsedMessage;

            if (action === "subscribe") {
                if (pollId === undefined) {
                    console.error("Missing 'pollId' for subscribe action.");
                    return;
                }

                clients.set(socket, pollId);
                console.log(`client SUBSCRIBED TO POLL ID: ${pollId}  ✔️`);

            } else if (action === "leaderboard") {
                console.log("client SUBSCRIBED TO LEADERBOARD updates  ✔️");
                clients.set(socket, "leaderboard");

            } else {
                console.error(`Unknown action: ${action}  ✖️`);
            }
        } catch (err) {
            console.error("Error ✖️ parsing WebSocket message:", err);
        }

    });

    socket.on("close", () => {
        console.log("Client disconnected");
        clients.delete(socket);
    });
});

export const broadcastUpdate = (pollId: number, results: postgres.RowList<postgres.Row[]>) => {
    clients.forEach((subscribedPollId, client) => {
        if (subscribedPollId !== "leaderboard") {
            console.log(`Client subscribed to poll ID: ${subscribedPollId}, Poll ID to broadcast: ${pollId}`);
            const message = { type: "pollUpdate", pollId, results };
            if (subscribedPollId == pollId) {
                if (client.readyState === client.OPEN) {
                    console.log(`SENDING updated poll_id: ${pollId} and all its options TO SUBSCRIBED CLIENTS...`);
                    client.send(JSON.stringify(message));
                    console.log("SENT  ✔️")
                } else {
                    console.warn("Client is not in OPEN state; skipping broadcast.  ✖️");
                }
            }
        }

    });
};

export const broadcastLeaderboard = (leaderboard: postgres.RowList<postgres.Row[]>) => {
    clients.forEach((value, client) => {
        if (value === "leaderboard") {
            if (client.readyState === client.OPEN) {
                console.log("SENDING leaderboard TO SUBSCRIBED CLIENTS...");
                client.send(JSON.stringify({ type: "leaderboard", leaderboard }));
                console.log("SENT  ✔️")
            }
        }
    });
};

console.log("WebSocket server running on ws://localhost:8080");
