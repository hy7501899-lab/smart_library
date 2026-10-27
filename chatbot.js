/* Smart Library - Smart Assistant Engine */

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
    if (document.getElementById("libraryChatWidget")) return;

    const styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = "css/chatbot.css";
    document.head.appendChild(styleLink);

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
                        Smart Assistant Active
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
                <button type="button" data-prompt="Recommend AI books">
                    🤖 AI Books
                </button>
                <button type="button" data-prompt="Recommend Programming books">
                    💻 Programming
                </button>
                <button type="button" data-prompt="I am a beginner. Help me choose a book">
                    🌱 Beginner
                </button>
            </div>

            <form class="chat-input-area" id="chatForm">
                <input id="chatInput"
                       type="text"
                       placeholder="Ask me anything..."
                       aria-label="Your message"
                       autocomplete="off"
                       maxlength="1000"
                       required>
                <button type="submit"
                        id="chatSendButton"
                        aria-label="Send message">➤</button>
            </form>

            <p class="chat-disclaimer">
                Powered by Smart Assistant
            </p>
        </section>
    `;

    document.body.appendChild(widget);

    const launcher = document.getElementById("chatLauncher");
    const chatWindow = document.getElementById("chatWindow");
    const closeButton = document.getElementById("chatClose");
    const messages = document.getElementById("chatMessages");
    const form = document.getElementById("chatForm");
    const input = document.getElementById("chatInput");
    const sendButton = document.getElementById("chatSendButton");
    const suggestions = document.getElementById("chatSuggestions");

    let isSending = false;

    function addMessage(text, sender = "bot") {
        const bubble = document.createElement("div");
        bubble.className = `chat-message ${sender}`;
        bubble.textContent = text;

        messages.appendChild(bubble);
        messages.scrollTop = messages.scrollHeight;

        return bubble;
    }

    // محرك ردود ذكي وشامل يعالج محتوى المكتبة والأسئلة العامة
    function generateAdvancedResponse(query) {
        const q = query.toLowerCase();
        
        if (q.includes("محتوى") || q.includes("مكتبه") || q.includes("كتب") || q.includes("books") || q.includes("library") || q.includes("محتوى المكتبه")) {
            let bookList = libraryBooks.map(b => `• ${b.title} by ${b.author} (${b.category})`).join("\n");
            return `Here is the current collection of books available in Smart Library:\n\n${bookList}\n\nYou can explore them in detail on our Catalogue page!`;
        } else if (q.includes("ai") || q.includes("artificial intelligence") || q.includes("machine learning") || q.includes("ذكاء اصطناعي") || q.includes("التعلم العميق")) {
            return "Artificial Intelligence (AI) and Machine Learning empower computers to learn from data. To master this field, I highly recommend exploring 'Artificial Intelligence' by Stuart Russell and 'Deep Learning' by Ian Goodfellow available in our library!";
        } else if (q.includes("program") || q.includes("code") || q.includes("python") || q.includes("java") || q.includes("c++") || q.includes("برمجة") || q.includes("كود")) {
            return "Programming is about designing logical solutions and writing clean, efficient code. For writing maintainable software, check out 'Clean Code' by Robert C. Martin and 'Introduction to Algorithms' by Thomas H. Cormen.";
        } else if (q.includes("design") || q.includes("ui") || q.includes("ux") || q.includes("تصميم")) {
            return "Great design focuses on user experience and simplicity. I recommend reading 'The Design of Everyday Things' by Don Norman from our collection.";
        } else if (q.includes("business") || q.includes("startup") || q.includes("entrepreneurship") || q.includes("بزنس") || q.includes("مشروع")) {
            return "Building a successful startup requires validating ideas quickly. An essential guide for this is 'The Lean Startup' by Eric Ries.";
        } else if (q.includes("hello") || q.includes("hi") || q.includes("مرحبا") || q.includes("السلام")) {
            return "Hello! 👋 I'm your Smart Library Assistant. Ask me anything about our books, programming, AI, or general topics!";
        } else {
            return `That's an interesting question about "${query}". As your Smart Library assistant, I'm here to help you explore knowledge and discover amazing books across programming, AI, design, and business!`;
        }
    }

    async function sendMessage(text) {
        const message = text.trim();

        if (!message || isSending) return;

        addMessage(message, "user");

        isSending = true;
        input.disabled = true;
        sendButton.disabled = true;

        const loadingMessage = addMessage("Thinking... 🤖", "bot");

        setTimeout(() => {
            const reply = generateAdvancedResponse(message);
            loadingMessage.textContent = reply;

            isSending = false;
            input.disabled = false;
            sendButton.disabled = false;
            input.focus();
        }, 500);
    }

    function openChat() {
        chatWindow.hidden = false;
        launcher.setAttribute("aria-expanded", "true");
        launcher.classList.add("is-open");
        input.focus();

        if (!messages.dataset.initialized) {
            addMessage(
                "Hi! 👋 I'm your Smart Library Assistant. Ask me anything about programming, books, or general topics!"
            );
            messages.dataset.initialized = "true";
        }
    }

    function closeChat() {
        chatWindow.hidden = true;
        launcher.setAttribute("aria-expanded", "false");
        launcher.classList.remove("is-open");
        launcher.focus();
    }

    launcher.addEventListener("click", () => {
        if (chatWindow.hidden) {
            openChat();
        } else {
            closeChat();
        }
    });

    closeButton.addEventListener("click", closeChat);

    form.addEventListener("submit", async event => {
        event.preventDefault();
        if (isSending) return;

        const message = input.value.trim();
        if (!message) return;

        input.value = "";
        await sendMessage(message);
    });

    suggestions.addEventListener("click", event => {
        const button = event.target.closest("[data-prompt]");
        if (!button || isSending) return;

        sendMessage(button.dataset.prompt);
    });

})();
