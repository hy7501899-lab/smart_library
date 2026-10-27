
/* Smart Library - OpenAI AI Library Assistant */

// Demo catalog used by the chatbot.
// Replace these sample books with your real library catalog when ready.
const libraryBooks = [
    {
        title: "Clean Code",
        author: "Robert C. Martin",
        category: "Programming",
        description: "Learn to write clean, readable, maintainable code."
    },
    {
        title: "Introduction to Algorithms",
        author: "Thomas H. Cormen",
        category: "Programming",
        description: "Learn algorithms and problem-solving techniques."
    },
    {
        title: "Artificial Intelligence",
        author: "Stuart Russell",
        category: "AI",
        description: "Explore intelligent systems and AI fundamentals."
    },
    {
        title: "Deep Learning",
        author: "Ian Goodfellow",
        category: "AI",
        description: "Learn about neural networks and deep learning."
    },
    {
        title: "The Design of Everyday Things",
        author: "Don Norman",
        category: "Design",
        description: "Understand the principles of user-centered design."
    },
    {
        title: "The Lean Startup",
        author: "Eric Ries",
        category: "Business",
        description: "Discover ideas for building and testing businesses."
    }
];

(function initLibraryAssistant() {
    // Prevent creating the widget more than once.
    if (document.getElementById("libraryChatWidget")) return;

    // Load the existing chatbot stylesheet.
    const styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = "css/chatbot.css";
    document.head.appendChild(styleLink);

    // Create the chatbot interface.
    const widget = document.createElement("section");
    widget.id = "libraryChatWidget";
    widget.className = "library-chat-widget";

    widget.innerHTML = `
        <button class="chat-launcher" id="chatLauncher"
                type="button"
                aria-label="Open AI Library Assistant"
                aria-expanded="false">
            <span class="chat-launcher-icon">✦</span>
            <span class="chat-notification"></span>
        </button>

        <section class="chat-window" id="chatWindow"
                 aria-label="AI Library Assistant" hidden>
            <header class="chat-header">
                <div class="chat-avatar">✦</div>

                <div class="chat-header-text">
                    <h2>AI Library Assistant</h2>
                    <p>
                        <span class="online-dot"></span>
                        AI Assistant
                    </p>
                </div>

                <button class="chat-close" id="chatClose"
                        type="button"
                        aria-label="Close chat">×</button>
            </header>

            <div class="chat-messages" id="chatMessages"
                 aria-live="polite"
                 aria-label="Conversation"></div>

            <div class="chat-suggestions" id="chatSuggestions">
                <button type="button"
                        data-prompt="Recommend AI books">
                    🤖 AI Books
                </button>

                <button type="button"
                        data-prompt="Recommend Programming books">
                    💻 Programming
                </button>

                <button type="button"
                        data-prompt="I am a beginner. Help me choose a book">
                    🌱 Beginner
                </button>
            </div>

            <form class="chat-input-area" id="chatForm">
                <input id="chatInput"
                       type="text"
                       placeholder="Ask me about books..."
                       aria-label="Your message"
                       autocomplete="off"
                       maxlength="1000"
                       required>

                <button type="submit"
                        id="chatSendButton"
                        aria-label="Send message">➤</button>
            </form>

            <p class="chat-disclaimer">
                AI-powered book assistant
            </p>
        </section>
    `;

    document.body.appendChild(widget);

    // Get interface elements.
    const launcher = document.getElementById("chatLauncher");
    const chatWindow = document.getElementById("chatWindow");
    const closeButton = document.getElementById("chatClose");
    const messages = document.getElementById("chatMessages");
    const form = document.getElementById("chatForm");
    const input = document.getElementById("chatInput");
    const sendButton = document.getElementById("chatSendButton");
    const suggestions = document.getElementById("chatSuggestions");

    let isSending = false;

    // Display a message safely as plain text.
    function addMessage(text, sender = "bot") {
        const bubble = document.createElement("div");
        bubble.className = `chat-message ${sender}`;
        bubble.textContent = text;

        messages.appendChild(bubble);
        messages.scrollTop = messages.scrollHeight;

        return bubble;
    }

    // Display book recommendation cards.
    function addRecommendations(books) {
        if (!Array.isArray(books) || books.length === 0) {
            addMessage("No matching books were found in the catalog.");
            return;
        }

        addMessage("Here are some books you might like 📚");

        books.forEach(book => {
            const card = document.createElement("article");
            card.className = "chat-book-card";

            const title = document.createElement("h3");
            title.textContent = book.title || "Untitled book";

            const author = document.createElement("p");
            author.textContent = `By ${book.author || "Unknown author"}`;

            const category = document.createElement("span");
            category.className = "chat-book-category";
            category.textContent = book.category || "General";

            const description = document.createElement("p");
            description.textContent =
                book.description || "No description available.";

            const link = document.createElement("a");
            link.href = "catalogue.html";
            link.textContent = "Explore Catalogue →";

            card.append(title, author, category, description, link);
            messages.appendChild(card);
        });

        messages.scrollTop = messages.scrollHeight;
    }

    // Send a message to the Flask backend and receive an OpenAI response.
    async function sendMessage(text) {
        const message = text.trim();

        if (!message || isSending) return;

        addMessage(message, "user");

        isSending = true;
        input.disabled = true;
        sendButton.disabled = true;

        const loadingMessage = addMessage("Thinking... 🤖", "bot");

        try {
            // The API key stays on the backend, never in this JavaScript file.
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: message,
                    catalog: libraryBooks
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || `Request failed (${response.status}).`
                );
            }

            if (typeof data.reply !== "string" || !data.reply.trim()) {
                throw new Error("The AI returned an empty response.");
            }

            // Show the real AI response.
            loadingMessage.textContent = data.reply;

        } catch (error) {
            console.error("Smart Library AI error:", error);

            loadingMessage.textContent =
                "Sorry, I couldn't connect to the AI. " +
                "Please check that Flask is running and your OpenAI API " +
                "settings are correct.";
        } finally {
            isSending = false;
            input.disabled = false;
            sendButton.disabled = false;
            input.focus();
        }
    }

    // Open the chatbot.
    function openChat() {
        chatWindow.hidden = false;
        launcher.setAttribute("aria-expanded", "true");
        launcher.classList.add("is-open");
        input.focus();

        if (!messages.dataset.initialized) {
            addMessage(
                "Hi! 👋 I'm your Smart Library AI Assistant. " +
                "Ask me a question or tell me what you want to learn, " +
                "and I'll help you explore books."
            );

            messages.dataset.initialized = "true";
        }
    }

    // Close the chatbot.
    function closeChat() {
        chatWindow.hidden = true;
        launcher.setAttribute("aria-expanded", "false");
        launcher.classList.remove("is-open");
        launcher.focus();
    }

    // Toggle the chat window.
    launcher.addEventListener("click", () => {
        if (chatWindow.hidden) {
            openChat();
        } else {
            closeChat();
        }
    });

    closeButton.addEventListener("click", closeChat);

    // Submit a message when the user presses Send or Enter.
    form.addEventListener("submit", async event => {
        event.preventDefault();

        if (isSending) return;

        const message = input.value.trim();
        if (!message) return;

        input.value = "";
        await sendMessage(message);
    });

    // Send suggested prompts to the real AI model.
    suggestions.addEventListener("click", event => {
        const button = event.target.closest("[data-prompt]");

        if (!button || isSending) return;

        sendMessage(button.dataset.prompt);
    });

})();
