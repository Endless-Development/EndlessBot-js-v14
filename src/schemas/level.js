const { model, Schema } = require("mongoose");

var levelSchema = new Schema({
    Guild: String,
    User: String,
    XP: Number,
    Level: Number,
})

module.exports = model("level", levelSchema);
