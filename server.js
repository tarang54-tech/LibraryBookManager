const express = require("express");
const mongoose = require("mongoose");
const Book = require("./models/Book");
require("dotenv").config();

const app = express();

app.use(express.static("public"));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });

app.get("/api/books", async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        console.log("Error fetching books:", error);

        res.status(500).json({
            message: "Error fetching books"
        });
    }
});

app.post("/api/books", async (req, res) => {
    try {
        const book = new Book({
            title: req.body.title,
            author: req.body.author,
            category: req.body.category,
            isbn: req.body.isbn
        });

        await book.save();

        res.status(201).json(book);

    } catch (error) {
        console.log("Error adding book:", error);

        res.status(500).json({
            message: "Error adding book"
        });
    }
});

app.put("/api/books/:id/status", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        if (book.status === "Available") {
            book.status = "Borrowed";
        } else {
            book.status = "Available";
        }

        await book.save();

        res.json(book);

    } catch (error) {
        console.log("Error changing book status:", error);

        res.status(500).json({
            message: "Error changing book status"
        });
    }
});

app.put("/api/books/:id", async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                author: req.body.author,
                category: req.body.category,
                isbn: req.body.isbn
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedBook) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.json(updatedBook);

    } catch (error) {
        console.log("Error updating book:", error);

        res.status(500).json({
            message: "Error updating book"
        });
    }
});

app.delete("/api/books/:id", async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);

        if (!deletedBook) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.json({
            message: "Book deleted successfully"
        });

    } catch (error) {
        console.log("Error deleting book:", error);

        res.status(500).json({
            message: "Error deleting book"
        });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Library Book Manager running on port 3000");
});