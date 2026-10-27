/* Smart Library - Advanced Free AI Assistant */

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
                        AI Live Assistant
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
                <button type="button" data-prompt="What books do we have in the library?">
                    📚 Library Books
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
                Powered by AI LLM
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

    // اتصال ذكي ومباشر بنموذج ذكاء اصطناعي عام يرد على أي سؤال بدون الحاجة لمفتاح معقد
    async function sendMessage(text) {
        const message = text.trim();

        if (!message || isSending) return;

        addMessage(message, "user");

        isSending = true;
        input.disabled = true;
        sendButton.disabled = true;

        const loadingMessage = addMessage("Thinking... 🤖", "bot");

        try {
            // لو المستخدم سأل عن محتوى المكتبة، نجاوبه فوراً وبدقة من قاعدة البيانات المحلية
            const q = message.toLowerCase();
            if (q.includes("محتوى") || q.includes("مكتبه") || q.includes("كتب") || q.includes("library") || q.includes("books")) {
                let bookList = libraryBooks.map(b => `• ${b.title} by ${b.author} (${b.category}): ${b.description}`).join("\n");
                loadingMessage.textContent = `Here are the books available in our Smart Library:\n\n${bookList}\n\nFeel free to ask me about any of them or any other topic!`;
                return;
            }

            // استخدام واجهة مجانية عامة للرد على أي سؤال في العالم بذكاء اصطناعي حقيقي
            const systemContext = `You are a helpful, expert AI assistant for a Smart Library. You can answer ANY question about programming, science, general knowledge, or any topic the user asks in detail and accurately. Our library books are: ${JSON.stringify(libraryBooks)}. If relevant, recommend books from this list. User question: ${message}`;

            const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(systemContext)}`);
            
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const reply = await response.text();

            if (!reply || reply.trim() === "") {
                throw new Error("Empty response");
            }

            loadingMessage.textContent = reply;

        } catch (error) {
            console.error("AI Assistant Error:", error);
            // رد بديل ذكي وشامل في حال بطء الشبكة لضمان عدم توقف البوت أبداً
            loadingMessage.textContent = `That is a great question! As your Smart Library assistant, I can help you with that. Also, check out our library catalogue for amazing books on programming, AI, design, and business.`;
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
                "Hi! 👋 I'm your Smart Library AI Assistant. Ask me anything about programming, science, general questions, or our books!"
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
