const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    browser: String,
    device: String,
    page: String
});

module.exports = mongoose.model("Visit", visitSchema);