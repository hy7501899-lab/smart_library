// ========================================
// SMART LIBRARY - AUTHENTICATION SCRIPT
// ========================================

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

// 1. Check active session and update the Navbar UI on page load
document.addEventListener("DOMContentLoaded", function () {
    const currentUser = JSON.parse(localStorage.getItem(SESSION_KEY));
    const authLink = document.getElementById("authLink");
    const registerLink = document.getElementById("registerLink");

    if (currentUser && currentUser.name) {
        if (authLink) {
            authLink.textContent = `Hi, ${currentUser.name}`;
            authLink.href = "dashboard.html";
        }
        if (registerLink) {
            registerLink.textContent = "Logout";
            registerLink.href = "#";
            registerLink.addEventListener("click", function (e) {
                e.preventDefault();
                localStorage.removeItem(SESSION_KEY);
                window.location.href = "index.html";
            });
        }
    }
});

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

// 2. Register logic
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

// 3. Login logic
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
            localStorage.setItem(
                SESSION_KEY,
                JSON.stringify({ name: user.name, email: user.email })
            );

            message.textContent = "Login successful!";

            setTimeout(() => {
                window.location.href = "index.html";
            }, 700);
        } catch {
            message.textContent =
                "Could not save your session in this browser.";
        }
    });
}
