const express = require("express");
const router = express.Router();
const Game = require("../models/Game");

router.get("/", function(req, res) {
    Game.find({}, function (err, games) {
        if (err) {
            res.send(err);
        } else {
            res.send(games);
        }
    });
});

module.exports = router;