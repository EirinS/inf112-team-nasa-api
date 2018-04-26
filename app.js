const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

// Routes
const routeList = require("./routes/list");
const routeCreate = require("./routes/create");
const routeJoin = require("./routes/join");

const app = express();
const http = require("http");
const port = process.env.PORT || 8080;
const server = http.Server(app).listen(port);
console.log("Server started.");

// Init socket.io
const socketInit = require("./socket");
socketInit(server);

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Apply routes
app.use("/list", routeList);
app.use("/create", routeCreate);
app.use("/join", routeJoin);

app.use(function(req, res) {
    res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8"
    });
    res.end("INF112 - Team NASA");
});