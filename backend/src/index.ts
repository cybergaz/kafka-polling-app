import express from 'express';
import { createPoll, pushVote, getResults, getLeaderboard, getPolls, getOptions } from './actions/route_actions';
import { createTables } from './actions/db_connection';
import { setupKafka } from './actions/kafka_setup';
import { consumeVotes } from './services/consumer';
import cors from 'cors';
import { Server } from "socket.io";

console.log("welcome to the poll app!")

const server = express();
server.use(cors());

// const http_server = http.createServer(server);

// const io = new Server(http_server, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"],
//     },
// });
//
// io.on("connection", (socket) => {
//     console.log("A client connected via WebSocket");
//
//     socket.on("disconnect", () => {
//         console.log("Client disconnected");
//     });
// });

// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"],
//     },
// });
const PORT = process.env.PORT || 3000;


// routes
server.use(express.json());

// server.use(express.static("public"));
// server.get("/", (req, res) => {
//     res.sendFile(path.resolve("src/public/index.html"));
// });

server.post('/polls', createPoll);
server.post('/polls/:poll_id/vote', pushVote);
server.get('/polls/:id', getResults);
server.get('/fetch/polls', getPolls)
server.get('/polls/:id/options', getOptions);
server.get('/leaderboard', getLeaderboard);

const initiateServer = async () => {
    try {
        await setupKafka(); // configuring Kafka topic and partitions
        await createTables(); // tables availability check on startup
        await consumeVotes(); // Start Kafka consumer
        server.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error starting the server:", error);
    }
};

initiateServer();

// setTimeout(() => {
//     io.emit("dashboard", { option_id: 1234 });
//     console.log("Data emitted to clients after 5 seconds");
// }, 5000);
//
//
//
// export { io, http_server }

// process.on('SIGINT', () => {
//   server.close(() => {
//     console.log('Server shut down.');
//     process.exit(0);
//   });
// });
