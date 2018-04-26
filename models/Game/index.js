const Schema = require("mongoose").Schema;
const db = require("../../db");

// Model for game
const Game = db.model("Game", new Schema({
    name: {type: String, required: true},
    type: {type: String, required: true},
    opponent: {
        uid: {type: String, required: true},
        name: {type: String, required: true},
        color: {type: String, requried: true},
        rating: {type: Number, required: true}
    }
}), "games");

module.exports = Game;