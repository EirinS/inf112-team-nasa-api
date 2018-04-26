const express = require("express");
const router = express.Router();
const Game = require("../models/Game");
const helpers = require("./helpers");

// Middleware for checking query paramters
router.post("/", function(req, res, next) {
    if (req.body.id !== undefined &&
        req.body.uid !== undefined &&
        req.body.name !== undefined) {
        next();
    } else {
        helpers.sendRes(res, 400, "error", "Bad request");
    }
});

router.post("/", function(req, res) {
    const {
        id, uid, name
    } = req.body;

    // Attempt to find game by id.
    Game.findOne({_id: id})
        .then(function(found) {
            if (found === null) {
                helpers.sendRes(res, 400, "error", "Could not find game");
                return;
            }

            // Game found! Join it by sending info to socket, TODO.
            // e.g. Socket.emit(join game, {id: id, uid: uid, name: name})
            
            // Also, remove game from games list.
            Game.remove({_id: id})
                .then(function() {
                    helpers.sendRes(res, 200, "ok");
                })
                .catch(function(error) {
                    console.log(error);
                    helpers.sendRes(res, 400, "error", "Error joining game, check logs.");
                })
        })
        .catch(function(error) {
            console.log(error);
            helpers.sendRes(res, 400, "error", "Could not find game");
        });
});

module.exports = router;