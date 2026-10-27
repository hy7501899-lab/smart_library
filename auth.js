
const USERS_KEY = "smartLibraryUsers";
const SESSION_KEY = "smartLibraryCurrentUser";

function getUsers() {
    try {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
        return Array.isArray(users) ? users : [];
    } catch {
        return [];
    }
}

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("fullName").value.trim();
        const email = document.getElementById("registerEmail")
            .value.trim().toLowerCase();
        const password = document.getElementById("registerPassword").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;
        const message = document.getElementById("registerMessage");

        if (!name || !email) {
            message.textContent = "Please complete all fields.";
            return;
        }

        if (password.length < 8) {
            message.textContent =
                "Password must contain at least 8 characters.";
            return;
        }

        if (password !== confirmPassword) {
            message.textContent = "Passwords do not match.";
            return;
        }

        const users = getUsers();

        if (users.some(user => user.email === email)) {
            message.textContent =
                "This email is already registered. Please log in.";
            return;
        }

        // Demo only: never store real passwords in LocalStorage.
        users.push({ name, email, password });

        try {
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
            message.textContent =
                "Account created successfully! Redirecting to Login...";

            registerForm.reset();

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);
        } catch {
            message.textContent =
                "Could not save the account in this browser.";
        }
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail")
            .value.trim().toLowerCase();
        const password =
            document.getElementById("loginPassword").value;
        const message = document.getElementById("loginMessage");

        const user = getUsers().find(
            item => item.email === email && item.password === password
        );

        if (!user) {
            message.textContent =
                "Incorrect email or password. Please try again.";
            return;
        }

        try {
            // Save only the demo session identity, not the password.
            localStorage.setItem(
                SESSION_KEY,
                JSON.stringify({ name: user.name, email: user.email })
            );

            message.textContent = "Login successful!";

            setTimeout(() => {
                window.location.href = "home.html";
            }, 700);
        } catch {
            message.textContent =
                "Could not save your session in this browser.";
        }
    });
}
