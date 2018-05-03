const express = require("express");
const router = express.Router();
const Game = require("../models/Game");
const helpers = require("./helpers");

// Middleware for checking body parameters
router.post("/", function(req, res, next) {
    if (req.body.name !== undefined &&
        req.body.type !== undefined &&
        req.body.playerName !== undefined &&
        req.body.playerColor !== undefined &&
        req.body.playerRating !== undefined) {
        next();
    } else {
        helpers.sendRes(res, 400, "error", "Bad request");
    }
});

router.post("/", function(req, res) {
    const {
        name, type, playerName, playerColor, playerRating
    } = req.body;

    const game = new Game({
        name: name,
        type: type,
        player: {
            name: playerName,
            color: playerColor,
            rating: playerRating
        }
    });

    Game.findOne({name: name})
        .then(function (result) {
            if (result != null) {
                helpers.sendRes(res, 400, "error", "Game with same name already exists.");
                return;
            }

            // Game does not exist, continue.
            game.save()
                .then(function(doc) {
                    res.status(200).send({
                        status: "ok",
                        data: doc,
                        error: null
                    });
                })
                .catch(function(error) {
                    console.log(error);
                    helpers.sendRes(res, 400, "error", "Could not save game");
                });
        })
        .catch(function(error) {
            console.log(error);
            helpers.sendRes(res, 400, "error", "Error in database, check logs");
        });
});

module.exports = router;