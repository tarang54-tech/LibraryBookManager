const showFormBtn = document.getElementById("showFormBtn");
const addForm = document.getElementById("addForm");
const addBookBtn = document.getElementById("addBookBtn");
const bookList = document.getElementById("bookList");
const bookCount = document.getElementById("bookCount");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("search");

let allBooks = [];

showFormBtn.addEventListener("click", () => {
    if (addForm.style.display === "block") {
        addForm.style.display = "none";
    } else {
        addForm.style.display = "block";
    }
});

async function loadBooks() {
    try {
        const response = await fetch("/api/books");
        allBooks = await response.json();

        displayBooks(allBooks);
    } catch (error) {
        console.log("Error loading books:", error);
    }
}

function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value ?? "";
    return div.innerHTML;
}

function callNumber(book) {
    const categoryPart = (book.category || "GEN")
        .replace(/[^a-zA-Z]/g, "")
        .slice(0, 3)
        .toUpperCase()
        .padEnd(3, "X");

    const isbnDigits = (book.isbn || "").replace(/[^0-9]/g, "");
    const isbnPart = isbnDigits.slice(-3).padStart(3, "0");

    return `${categoryPart}-${isbnPart}`;
}

function displayBooks(books) {
    bookList.innerHTML = "";

    bookCount.textContent = books.length === 1 ? "1 title" : `${books.length} titles`;

    if (books.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty-state";
        empty.textContent = "The drawer's empty — no cards match that search.";
        bookList.appendChild(empty);
        return;
    }

    books.forEach((book, index) => {
        const card = document.createElement("div");

        card.className = "card-index";
        card.style.setProperty("--i", index);

        const statusClass =
            book.status === "Available" ? "available" : "borrowed";

        const buttonText =
            book.status === "Available" ? "Borrow" : "Return";

        card.innerHTML = `
            <div class="card-punches"><span></span><span></span></div>

            <span class="call-number">${escapeHtml(callNumber(book))}</span>

            <div class="stamp ${statusClass}">${escapeHtml(book.status)}</div>

            <h3 class="book-title">${escapeHtml(book.title)}</h3>
            <p class="book-author">by ${escapeHtml(book.author)}</p>

            <hr class="card-divider">

            <p class="book-meta"><span class="label">Category</span>${escapeHtml(book.category)}</p>
            <p class="book-isbn"><span class="label">ISBN</span>${escapeHtml(book.isbn)}</p>

            <div class="card-actions">
                <button class="btn btn-primary" onclick="changeStatus('${book._id}')">
                    ${buttonText}
                </button>

                <button class="btn btn-outline" onclick="editBook('${book._id}')">
                    Edit
                </button>

                <button class="btn btn-text-danger" onclick="deleteBook('${book._id}')">
                    Delete
                </button>
            </div>
        `;

        bookList.appendChild(card);
    });
}

searchBtn.addEventListener("click", () => {
    const searchText = searchInput.value.toLowerCase().trim();

    const filteredBooks = allBooks.filter(book => {
        return (
            book.title.toLowerCase().includes(searchText) ||
            book.author.toLowerCase().includes(searchText)
        );
    });

    displayBooks(filteredBooks);
});

searchInput.addEventListener("input", () => {
    if (searchInput.value.trim() === "") {
        displayBooks(allBooks);
    }
});

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});

async function changeStatus(id) {
    const response = await fetch(`/api/books/${id}/status`, {
        method: "PUT"
    });

    if (response.ok) {
        await loadBooks();
    } else {
        alert("Could not change book status");
    }
}

async function editBook(id) {
    const book = allBooks.find(book => book._id === id);

    if (!book) {
        return;
    }

    const newTitle = prompt("Enter book title:", book.title);

    if (newTitle === null) {
        return;
    }

    const newAuthor = prompt("Enter author:", book.author);

    if (newAuthor === null) {
        return;
    }

    const newCategory = prompt("Enter category:", book.category);

    if (newCategory === null) {
        return;
    }

    const newIsbn = prompt("Enter ISBN:", book.isbn);

    if (newIsbn === null) {
        return;
    }

    if (
        !newTitle.trim() ||
        !newAuthor.trim() ||
        !newCategory.trim() ||
        !newIsbn.trim()
    ) {
        alert("Fields cannot be empty");
        return;
    }

    const response = await fetch(`/api/books/${id}`, {
        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            title: newTitle,
            author: newAuthor,
            category: newCategory,
            isbn: newIsbn
        })
    });

    if (response.ok) {
        await loadBooks();
        alert("Book updated successfully");
    } else {
        alert("Could not update book");
    }
}

async function deleteBook(id) {
    const confirmDelete = confirm(
        "Are you sure you want to delete this book?"
    );

    if (!confirmDelete) {
        return;
    }

    const response = await fetch(`/api/books/${id}`, {
        method: "DELETE"
    });

    if (response.ok) {
        await loadBooks();
    } else {
        alert("Could not delete book");
    }
}

addBookBtn.addEventListener("click", async () => {
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const category = document.getElementById("category").value;
    const isbn = document.getElementById("isbn").value;

    if (!title || !author || !category || !isbn) {
        alert("Please fill all fields");
        return;
    }

    const response = await fetch("/api/books", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            title: title,
            author: author,
            category: category,
            isbn: isbn
        })
    });

    if (response.ok) {
        document.getElementById("title").value = "";
        document.getElementById("author").value = "";
        document.getElementById("category").value = "";
        document.getElementById("isbn").value = "";

        addForm.style.display = "none";

        await loadBooks();
    } else {
        alert("Book could not be added");
    }
});

async function logVisit() {
    try {
        await fetch("/api/visit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                browser: navigator.userAgent,
                device: /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
                page: window.location.pathname
            })
        });
    } catch (error) {
        console.log("Visit logging failed");
    }
}
loadBooks();
logVisit();
