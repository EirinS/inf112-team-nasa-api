let io;
let games = {}, sockets = [];

const emitToGame = function(id, msg, data) {
    if (games[id] != 2) return;
    for (let i = 0; i < sockets.length; i++) {
        if (sockets[i].gameId == id) {
            io.to(sockets[i].socket.id).emit(msg, data);
        }
    }
}

const sendDataToOpponent = function(gameId, data) {

    // Find other game-socket and emit data
    for (let i = 0; i < sockets.length; i++) {
        if (sockets[i].gameId == gameId && sockets[i].socket.id != socket.id) {
            io.to(sockets[i].socket.id).emit("data", data);
            break;
        }
    }
}

const init = function(server) {

    // Socket.io set-up
    io = require("socket.io").listen(server);
    console.log("Socket.IO listening for connections...")

    io.on("connection", (socket) => {
        console.log("Client connected...", socket.id);
        let gameId; // Gets set once we join game.

        socket.on("error", function (err) {
            if (err.description) throw err.description;
            else throw err; // Or whatever you want to do
        });

        socket.on("join", (id) => {
            if (gameId == undefined) gameId = id;
            sockets.push({socket: socket, gameId: gameId});
            if (games[gameId] == undefined) games[gameId] = 0;
            games[gameId]++;

            // Check if both players are connected; if so emit message
            emitToGame(gameId, "message", {type: "state", msg: "ready"});
            console.log("Joined game " + gameId, "Count: " + games[gameId]);
        });

        socket.on("data", (data) => {

            // Find other game-socket and emit msg
            sendDataToOpponent(gameId, data);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected.", socket.id);

            // Find socket from array
            for (let i = 0; i < sockets.length; i++) {
                if (sockets[i].gameId == gameId && sockets[i].socket.id == socket.id)  {

                    // Reduce game participant count
                    //let gameId = sockets[i].gameId;
                    games[gameId]--;
                    console.log("Disconnected", gameId, games[gameId]);
                    if (games[gameId] == 1) {

                        // Send message to other socket
                        let j = 1 - i;
                        let otherSocket = sockets[j].socket;
                        io.to(otherSocket.id).emit("message", {type: "opponent-dc"});
                    } else if (games[gameId] == 0) {

                        // Connect to db and remove game from database
                        // TODO: Remove game from list.
                        /*MongoClient.connect(mongoUrl, function(err, db) {
                            if (err) console.log("Unable to connect to the server", err);

                            // Remove game by its id
                            console.log("Attempting to remove " + gameId);
                            db.collection("games").remove({"_id": gameId});
                            db.close();
                        });
                        delete games[gameId];*/
                    }

                    // Remove from sockets
                    sockets.splice(i, 1);
                    break;
                }
            }
        });
    });
}

module.exports = init;