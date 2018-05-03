const Game = require("../models/Game");

let io;
let games = {}, sockets = [];

const emitToGame = function (id, msg, data) {
    if (games[id] !== 2) return;
    for (let i = 0; i < sockets.length; i++) {
        if (sockets[i].gameId === id) {
            io.to(sockets[i].socket.id).emit(msg, data);
        }
    }
};

const sendDataToOpponent = function (gameId, data, socket) {

    // Find other game-socket and emit data
    for (let i = 0; i < sockets.length; i++) {
        if (sockets[i].gameId === gameId && sockets[i].socket.id !== socket.id) {
            io.to(sockets[i].socket.id).emit("data", data);
            break;
        }
    }
};

const init = function (server) {

    // Socket.io set-up
    io = require("socket.io").listen(server);
    console.log("Socket.IO listening for connections...");

    io.on("connection", (socket) => {
        console.log("Client connected...", socket.id);

        let gameId, playerName; // Gets set once we join game.

        socket.on("error", function (err) {
            if (err.description) throw err.description;
            else throw err; // Or whatever you want to do
        });

        socket.on("join", function (id, name) {
            if (gameId === undefined) gameId = id;
            if (playerName === undefined) playerName = name;
            sockets.push({socket: socket, gameId: gameId, playerName: playerName});
            if (games[gameId] === undefined) games[gameId] = 0;
            games[gameId]++;

            // Check if both players are connected; if so emit message
            emitToGame(gameId, "state", {
                msg: "ready", data: sockets.map(function (value) {
                    return value.playerName
                })
            });
            console.log("Joined game " + gameId, "Count: " + games[gameId]);
        });

        socket.on("data", (data) => {

            // Find other game-socket and emit msg
            sendDataToOpponent(gameId, data, socket);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected.", socket.id);

            // Find socket from array
            for (let i = 0; i < sockets.length; i++) {
                if (sockets[i].gameId === gameId && sockets[i].socket.id === socket.id) {

                    // Reduce game participant count
                    //let gameId = sockets[i].gameId;
                    games[gameId]--;
                    console.log("Disconnected", gameId, games[gameId]);
                    if (games[gameId] === 1) {

                        // Send message to other socket
                        let j = 1 - i;
                        let otherSocket = sockets[j].socket;
                        io.to(otherSocket.id).emit("state", {msg: "opponent-dc"});
                    } else if (games[gameId] === 0) {

                        // Remove game from database
                        Game.remove({_id: gameId})
                            .then(function () {
                                delete games[gameId];
                            })
                            .catch(console.log);
                    }

                    // Remove from sockets
                    sockets.splice(i, 1);
                    break;
                }
            }
        });
    });
};

module.exports = init;