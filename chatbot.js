/* Smart Library - Gemini AI Library Assistant (Free & Direct) */

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
                AI-powered assistant
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

    // Send a message directly to Gemini API (Free & No Server required)
    async function sendMessage(text) {
        const message = text.trim();

        if (!message || isSending) return;

        addMessage(message, "user");

        isSending = true;
        input.disabled = true;
        sendButton.disabled = true;

        const loadingMessage = addMessage("Thinking... 🤖", "bot");

        try {
            // حطي مفتاح Gemini الخاص بكِ هنا بين العلامتين
            const GEMINI_API_KEY = "حطي_مفتاح_جيميني_هنا"; 
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

            // تم توسيع الـ Prompt هنا لكي يجيب على أي سؤال عام ومع توفير ترشيح الكتب لو ناسب السياق
            const promptText = `You are a highly intelligent and helpful AI assistant for the Smart Library. 
You can answer ANY question the user asks about programming, science, general knowledge, life, or any other topic accurately and professionally. 
Additionally, keep in mind our available library books: ${JSON.stringify(libraryBooks)}. If the user's question relates to these books or topics, recommend them naturally. 
User question: ${message}`;

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: promptText }] }]
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || "Request failed.");
            }

            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!reply) {
                throw new Error("The AI returned an empty response.");
            }

            loadingMessage.textContent = reply;

        } catch (error) {
            console.error("Smart Library AI error:", error);
            loadingMessage.textContent = "Sorry, I couldn't connect to the AI. Please check your API key.";
        } finally {
            isSending = false;
            input.disabled = false;
            sendButton.disabled = false;
            input.focus();
        }
    }

    function openChat() {
        chatWindow.hidden = false;
        launcher.setAttribute("aria-expanded", "true");
        launcher.classList.add("is-open");
        input.focus();

        if (!messages.dataset.initialized) {
            addMessage(
                "Hi! 👋 I'm your Smart Library AI Assistant. " +
                "You can ask me anything about books, programming, or any general question!"
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
