const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Available"
    },
    borrowerName: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model("Book", bookSchema);