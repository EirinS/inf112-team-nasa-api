const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const config = require("../config");

mongoose.connect(config.mongoUrl)
    .then(function () {
        console.log("MongoDB connected.");
    })
    .catch(function (error) {
        console.log("MongoDB error: " + error);
    });

process.on('SIGINT', function () {
    mongoose.disconnect(function () {
        console.log("MongoDB disconnected.");
        process.exit(0);
    });
});

module.exports = mongoose;