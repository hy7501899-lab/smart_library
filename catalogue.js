
const books = [
    {
        title: "Clean Code",
        author: "Robert C. Martin",
        category: "Programming",
        icon: "💻",
        color: "#eee5ff",
        description: "Learn how to write clean and maintainable code."
    },
    {
        title: "Introduction to Algorithms",
        author: "Thomas H. Cormen",
        category: "Programming",
        icon: "🧠",
        color: "#e0edff",
        description: "Explore algorithms and problem-solving techniques."
    },
    {
        title: "Artificial Intelligence",
        author: "Stuart Russell",
        category: "AI",
        icon: "🤖",
        color: "#dff7f0",
        description: "Discover the foundations of intelligent systems."
    },
    {
        title: "Deep Learning",
        author: "Ian Goodfellow",
        category: "AI",
        icon: "🧬",
        color: "#ffe8ee",
        description: "Understand neural networks and deep learning."
    },
    {
        title: "The Design of Everyday Things",
        author: "Don Norman",
        category: "Design",
        icon: "🎨",
        color: "#fff0d9",
        description: "Explore the principles of thoughtful design."
    },
    {
        title: "The Lean Startup",
        author: "Eric Ries",
        category: "Business",
        icon: "📈",
        color: "#e9e8ff",
        description: "Learn how to build and test business ideas."
    }
];

const booksGrid = document.getElementById("booksGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const resultsCount = document.getElementById("resultsCount");

function displayBooks() {
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;

    const filteredBooks = books.filter(book => {
        const matchesSearch =
            book.title.toLowerCase().includes(searchText) ||
            book.author.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            book.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    resultsCount.textContent =
        `${filteredBooks.length} books found`;

    if (filteredBooks.length === 0) {
        booksGrid.innerHTML =
            '<p class="empty-message">No books found. Try another search.</p>';
        return;
    }

    booksGrid.innerHTML = filteredBooks.map((book, index) => `
        <article class="book-card">
            <div class="book-cover" style="background:${book.color}">
                <span>${book.icon}</span>
                <small>${book.category}</small>
            </div>

            <div class="book-info">
                <h3>${book.title}</h3>
                <p class="book-author">By ${book.author}</p>
                <p class="book-description">${book.description}</p>

                <button class="book-btn" data-book-index="${index}">
                    View Details →
                </button>
            </div>
        </article>
    `).join("");

    booksGrid.querySelectorAll(".book-btn").forEach(button => {
        button.addEventListener("click", () => {
            const book = filteredBooks[Number(button.dataset.bookIndex)];

            alert(
                `${book.title}\n\nAuthor: ${book.author}\n` +
                `Category: ${book.category}\n\n${book.description}`
            );
        });
    });
}

searchInput.addEventListener("input", displayBooks);
categoryFilter.addEventListener("change", displayBooks);

displayBooks();
