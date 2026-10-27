
document.addEventListener("DOMContentLoaded", function () {
    const authLink = document.getElementById("authLink");
    const registerLink = document.getElementById("registerLink");

    let currentUser = null;

    try {
        currentUser = JSON.parse(
            localStorage.getItem("smartLibraryCurrentUser") || "null"
        );
    } catch {
        currentUser = null;
    }

    if (currentUser && authLink) {
        authLink.textContent = `Hi, ${currentUser.name}`;
        authLink.href = "#";
    }

    if (currentUser && registerLink) {
        registerLink.textContent = "Logout";
        registerLink.href = "#";

        registerLink.addEventListener("click", function (event) {
            event.preventDefault();

            localStorage.removeItem("smartLibraryCurrentUser");
            window.location.href = "home.html";
        });
    }
});
