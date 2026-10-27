// ========================================
// SMART LIBRARY - DASHBOARD JAVASCRIPT
// ========================================

"use strict";

// Local storage keys
const STORAGE_KEYS = {
    account: "smartLibraryAccount",
    books: "myBooks",
    favorites: "favorites",
    payments: "myPayments"
};

// ========================================
// 1. STORAGE FUNCTIONS
// ========================================

function getData(key, defaultValue = []) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error("Error reading data:", error);
        return defaultValue;
    }
}

function saveData(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error("Error saving data:", error);
        alert("Could not save your data. Please try again.");
        return false;
    }
}

// Ensure data is always an array
function getArray(key) {
    const data = getData(key, []);
    return Array.isArray(data) ? data : [];
}

// Safely display text inside HTML
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

// Support book objects and simple book titles
function getBookTitle(book) {
    if (typeof book === "string") {
        return book;
    }

    return book?.title || book?.name || "Untitled Book";
}

function getBookAuthor(book) {
    if (typeof book === "string") {
        return "Saved book";
    }

    return book?.author || "Unknown Author";
}

function getBookCover(book) {
    if (typeof book === "string") {
        return "";
    }

    return book?.cover || book?.image || book?.thumbnail || "";
}

function getBookId(book) {
    if (typeof book === "string") {
        return book.trim().toLowerCase();
    }

    return String(
        book?.id ??
        book?.bookId ??
        getBookTitle(book).trim().toLowerCase()
    );
}

// ========================================
// 2. ACCOUNT INFORMATION
// ========================================

const accountForm = document.getElementById("accountForm");
const accountMessage = document.getElementById("accountMessage");

function loadAccount() {
    // Read dashboard account data first.
    // If unavailable, try the existing "user" key.
    const account = getData(
        STORAGE_KEYS.account,
        getData("user", {})
    );

    document.getElementById("userName").value =
        account.name || account.fullName || "";

    document.getElementById("userEmail").value =
        account.email || "";

    document.getElementById("userPhone").value =
        account.phone || account.phoneNumber || "";
}

if (accountForm) {
    accountForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("userName").value.trim();
        const email = document.getElementById("userEmail").value.trim();
        const phone = document.getElementById("userPhone").value.trim();

        if (!name || !email) {
            accountMessage.textContent =
                "Please enter your name and email.";

            return;
        }

        const account = {
            name: name,
            email: email,
            phone: phone
        };

        const saved = saveData(STORAGE_KEYS.account, account);

        if (saved && accountMessage) {
            accountMessage.textContent =
                "Account information saved successfully!";
        }
    });
}

// ========================================
// 3. MY BOOKS
// ========================================

function renderMyBooks() {
    const books = getArray(STORAGE_KEYS.books);
    const booksList = document.getElementById("myBooksList");
    const booksCount = document.getElementById("booksCount");

    if (!booksList || !booksCount) {
        return;
    }

    booksCount.textContent = books.length;

    if (books.length === 0) {
     booksList.innerHTML = `<p>You haven't added any books yet.</p>`;

        return;
    }

    booksList.innerHTML = books.map((book, index) => {
        const title = escapeHTML(getBookTitle(book));
        const author = escapeHTML(getBookAuthor(book));
        const cover = getBookCover(book);

        const coverHTML = cover
    ? `<img src="${escapeHTML(cover)}" alt="${title}">`
    : "📖";
        return ;
    }).join("");
}

// ========================================
// 4. FAVORITE LIST
// ========================================

function renderFavorites() {
    const favorites = getArray(STORAGE_KEYS.favorites);
    const favoritesList = document.getElementById("favoritesList");
    const favoritesCount = document.getElementById("favoritesCount");

    if (!favoritesList || !favoritesCount) {
        return;
    }

    favoritesCount.textContent = favorites.length;

    if (favorites.length === 0) {
    favoritesList.innerHTML = `
        <p class="empty-message">
            💜 You haven't added any favorite books yet.
        </p>
    `;

    return;
}

    favoritesList.innerHTML = favorites.map((book, index) => {
        const title = escapeHTML(getBookTitle(book));
        const author = escapeHTML(getBookAuthor(book));
        const cover = getBookCover(book);

        const coverHTML = cover
    ? `<img src="${escapeHTML(cover)}" alt="${title}" class="book-cover">`
    : "💜";
        return ;
    }).join("");
}

// ========================================
// 5. PAYMENT HISTORY
// ========================================

function renderPayments() {
    const payments = getArray(STORAGE_KEYS.payments);

    const paymentsList = document.getElementById("paymentsList");
    const paymentsCount = document.getElementById("paymentsCount");
    const completedCount = document.getElementById("completedCount");
    const totalPayments = document.getElementById("totalPayments");

    if (!paymentsList) {
        return;
    }

    // Count all payment records
    if (paymentsCount) {
        paymentsCount.textContent = payments.length;
    }

    // Count completed payments
    const completedPayments = payments.filter(payment =>
        String(payment.status || "").toLowerCase() === "completed"
    );

    if (completedCount) {
        completedCount.textContent = completedPayments.length;
    }

    // Calculate total completed payments only
    const total = completedPayments.reduce((sum, payment) => {
        return sum + (Number(payment.amount) || 0);
    }, 0);

    if (totalPayments) {
        totalPayments.textContent =
            total.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }) + " EGP";
    }

    if (payments.length === 0) {
    paymentsList.innerHTML = `
        <p class="empty-message">
            💳 You haven't made any payments yet.
        </p>
    `;

    return;
}

    paymentsList.innerHTML = payments.map(payment => {
        const title = escapeHTML(
            payment.title || payment.description || "Library purchase"
        );

        const date = escapeHTML(
            payment.date || "Date not available"
        );

        const amount = (Number(payment.amount) || 0).toLocaleString(
            "en-US",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

        const rawStatus = String(payment.status || "pending").toLowerCase();

        const status = ["completed", "pending", "failed"].includes(rawStatus)
            ? rawStatus
            : "pending";

        return ;
    }).join("");
}

// ========================================
// 6. BUTTON ACTIONS
// ========================================

document.addEventListener("click", function (event) {
    const button = event.target.closest("[data-action]");

    if (!button) {
        return;
    }

    const action = button.dataset.action;
    const index = Number(button.dataset.index);

    if (!Number.isInteger(index) || index < 0) {
        return;
    }

    // Remove a book from My Books
    if (action === "delete-book") {
        const books = getArray(STORAGE_KEYS.books);

        if (index >= books.length) {
            return;
        }

        books.splice(index, 1);

        if (saveData(STORAGE_KEYS.books, books)) {
            renderMyBooks();
        }
    }

    // Add a book to Favorites
    if (action === "add-favorite") {
        const books = getArray(STORAGE_KEYS.books);
        const favorites = getArray(STORAGE_KEYS.favorites);
        const book = books[index];

        if (!book) {
            return;
        }

        const alreadyFavorite = favorites.some(favorite =>
            getBookId(favorite) === getBookId(book)
        );

        if (alreadyFavorite) {
            alert("This book is already in your favorites.");
            return;
        }

        favorites.push(book);

        if (saveData(STORAGE_KEYS.favorites, favorites)) {
            renderFavorites();
            alert("Book added to your favorites!");
        }
    }

    // Remove a book from Favorites
    if (action === "delete-favorite") {
        const favorites = getArray(STORAGE_KEYS.favorites);

        if (index >= favorites.length) {
            return;
        }

        favorites.splice(index, 1);

        if (saveData(STORAGE_KEYS.favorites, favorites)) {
            renderFavorites();
        }
    }
});

// ========================================
// 7. INITIALIZE DASHBOARD
// ========================================

document.addEventListener("DOMContentLoaded", function () {
    loadAccount();
    renderMyBooks();
    renderFavorites();
    renderPayments();

    console.log("Smart Library Dashboard is ready.");
});