const express = require("express");
const router = express.Router();
const Game = require("../models/Game");
const helpers = require("./helpers");

// Middleware for checking body parameters
router.post("/", function(req, res, next) {
    if (req.body.name !== undefined &&
        req.body.type !== undefined &&
        req.body.opponentUid !== undefined &&
        req.body.opponentName !== undefined &&
        req.body.opponentColor !== undefined &&
        req.body.opponentRating !== undefined) {
        next();
    } else {
        helpers.sendRes(res, 400, "error", "Bad request");
    }
});

router.post("/", function(req, res) {
    const {
        name, type, opponentUid, opponentName, opponentColor, opponentRating
    } = req.body;

    const game = new Game({
        name: name,
        type: type,
        opponent: {
            uid: opponentUid,
            name: opponentName,
            color: opponentColor,
            rating: opponentRating
        }
    });
    game.save()
        .then(function(doc) {
            helpers.sendRes(res, 200, "ok");
        })
        .catch(function(error) {
            console.log(error);
            helpers.sendRes(res, 400, "error", "Could not save game");
        });
});

module.exports = router;