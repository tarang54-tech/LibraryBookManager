const mongoose = require("mongoose");
const Book = require("./models/Book");
require("dotenv").config();

const books = [
    {
        title: "Atomic Habits",
        author: "James Clear",
        category: "Self Help",
        isbn: "9780735211292",
        available: true
    },
    {
        title: "The Alchemist",
        author: "Paulo Coelho",
        category: "Fiction",
        isbn: "9780061122415",
        available: true
    },
    {
        title: "1984",
        author: "George Orwell",
        category: "Fiction",
        isbn: "9780451524935",
        available: true
    },
    {
        title: "The Psychology of Money",
        author: "Morgan Housel",
        category: "Finance",
        isbn: "9780857197689",
        available: true
    },
    {
        title: "Rich Dad Poor Dad",
        author: "Robert Kiyosaki",
        category: "Finance",
        isbn: "9781612680194",
        available: true
    },
    {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        category: "Fantasy",
        isbn: "9780547928227",
        available: true
    },
    {
        title: "Harry Potter and the Philosopher's Stone",
        author: "J.K. Rowling",
        category: "Fantasy",
        isbn: "9780747532699",
        available: true
    },
    {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        category: "Classic",
        isbn: "9780061120084",
        available: true
    },
    {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        category: "Classic",
        isbn: "9780743273565",
        available: true
    },
    {
        title: "Ikigai",
        author: "Hector Garcia",
        category: "Self Help",
        isbn: "9780143130727",
        available: true
    },
    {
        title: "Think and Grow Rich",
        author: "Napoleon Hill",
        category: "Self Help",
        isbn: "9781585424337",
        available: true
    },
    {
        title: "The Intelligent Investor",
        author: "Benjamin Graham",
        category: "Finance",
        isbn: "9780060555665",
        available: true
    },
    {
        title: "Deep Work",
        author: "Cal Newport",
        category: "Self Help",
        isbn: "9781455586691",
        available: true
    },
    {
        title: "The Power of Habit",
        author: "Charles Duhigg",
        category: "Self Help",
        isbn: "9780812981605",
        available: true
    },
    {
        title: "The Subtle Art of Not Giving a F*ck",
        author: "Mark Manson",
        category: "Self Help",
        isbn: "9780062457714",
        available: true
    },
    {
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        category: "Classic",
        isbn: "9780316769488",
        available: true
    },
    {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        category: "Classic",
        isbn: "9780141439518",
        available: true
    },
    {
        title: "The Kite Runner",
        author: "Khaled Hosseini",
        category: "Fiction",
        isbn: "9781594631931",
        available: true
    },
    {
        title: "The Book Thief",
        author: "Markus Zusak",
        category: "Fiction",
        isbn: "9780375842207",
        available: true
    },
    {
        title: "A Brief History of Time",
        author: "Stephen Hawking",
        category: "Science",
        isbn: "9780553380163",
        available: true
    },
    {
        title: "Sapiens",
        author: "Yuval Noah Harari",
        category: "History",
        isbn: "9780062316097",
        available: true
    },
    {
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        category: "Fantasy",
        isbn: "9780618640157",
        available: true
    },
    {
        title: "The Da Vinci Code",
        author: "Dan Brown",
        category: "Mystery",
        isbn: "9780307474278",
        available: true
    },
    {
        title: "The Silent Patient",
        author: "Alex Michaelides",
        category: "Thriller",
        isbn: "9781250301697",
        available: true
    },
    {
        title: "Can't Hurt Me",
        author: "David Goggins",
        category: "Biography",
        isbn: "9781544512280",
        available: true
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to MongoDB");

        await Book.insertMany(books);

        console.log("25 books added successfully!");

        await mongoose.connection.close();
    } catch (error) {
        console.log("Error adding books:", error);
        await mongoose.connection.close();
    }
}

seedDatabase();