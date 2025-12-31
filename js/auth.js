// login.js
// Used ONLY by login.html

// DOM Elements
const loginFormEl = document.getElementById("loginFormElement");
const signupFormEl = document.getElementById("signupFormElement");

const loginBox = document.getElementById("loginForm");
const signupBox = document.getElementById("signupForm");

// ========== INIT ==========
document.addEventListener("DOMContentLoaded", () => {
    // Redirect if already logged in
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
        window.location.href = "pages/dashboard.html";
    }

    // Events
    if (loginFormEl) loginFormEl.addEventListener("submit", handleLogin);
    if (signupFormEl) signupFormEl.addEventListener("submit", handleSignup);
});

// ========== LOGIN ==========
function handleLogin(e) {
    e.preventDefault();
    clearErrors();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    let valid = true;

    if (!email) {
        showError("email", "Email is required");
        valid = false;
    }
    if (!password) {
        showError("password", "Password is required");
        valid = false;
    }
    if (!valid) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        showError("email", "Invalid email or password");
        return;
    }

    localStorage.setItem("currentUser", JSON.stringify({
        id: user.id,
        fullName: user.fullName,
        email: user.email
    }));

    showSuccess("loginSuccess", "Login successful! Redirecting...");

    setTimeout(() => {
        window.location.href = "pages/dashboard.html";
    }, 1200);
}

// ========== SIGNUP ==========
function handleSignup(e) {
    e.preventDefault();
    clearErrors();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirm = document.getElementById("confirmPassword").value;
    const agree = document.getElementById("agreeTerms").checked;

    let valid = true;

    if (!fullName) {
        showError("fullName", "Name required");
        valid = false;
    }
    if (!email || !isValidEmail(email)) {
        showError("signupEmail", "Valid email required");
        valid = false;
    }
    if (password.length < 8) {
        showError("signupPassword", "Min 8 characters");
        valid = false;
    }
    if (password !== confirm) {
        showError("confirmPassword", "Passwords do not match");
        valid = false;
    }
    if (!agree) {
        showError("agreeTerms", "Accept terms");
        valid = false;
    }

    if (!valid) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find(u => u.email === email)) {
        showError("signupEmail", "Email already exists");
        return;
    }

    users.push({
        id: Date.now(),
        fullName,
        email,
        password,
        createdAt: new Date().toISOString()
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created! Please login.");
    showLogin();
}

// ========== UI HELPERS ==========
function showLogin() {
    signupBox.classList.remove("active");
    loginBox.classList.add("active");
}

function showSignup() {
    loginBox.classList.remove("active");
    signupBox.classList.add("active");
}

function togglePassword(id) {
    const input = document.getElementById(id);
    input.type = input.type === "password" ? "text" : "password";
}

// ========== UTILITIES ==========
function showError(fieldId, msg) {
    const errorEl = document.getElementById(fieldId + "Error");
    const input = document.getElementById(fieldId);

    if (errorEl) errorEl.textContent = msg;
    if (input) input.classList.add("error");
}

function clearErrors() {
    document.querySelectorAll(".error-message").forEach(el => el.textContent = "");
    document.querySelectorAll("input").forEach(i => i.classList.remove("error"));
}

function showSuccess(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.style.display = "block";
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
