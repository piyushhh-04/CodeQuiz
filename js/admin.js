// ====== Admin Dashboard Logic ======
import { auth } from "./firebase.js";
import {
    signOut,
    onAuthStateChanged,
    getIdToken
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5500'
    : 'https://codequiz-ai-server.onrender.com';

const subjectNames = {
    python: "Python", java: "Java", html: "HTML & CSS",
    sql: "SQL", c: "C Programming", cpp: "C++"
};

// ====== State ======
let currentUser = null;
let idToken = null;

// ====== LocalStorage Persistence ======
const STORAGE_KEY = "codequiz_admin_questions";

function loadFromStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            Object.keys(quizData).forEach(k => delete quizData[k]);
            Object.assign(quizData, parsed);
        } catch (e) { console.log("No saved data"); }
    }
}

// ====== DOM ======
const loadingScreen = document.getElementById("loading-screen");
const accessDenied = document.getElementById("access-denied");
const adminDashboard = document.getElementById("admin-dashboard");

// ====== Auth ======
onAuthStateChanged(auth, async (user) => {
    if (!user) { window.location.href = "login.html"; return; }

    currentUser = user;
    idToken = await getIdToken(user);

    try {
        const resp = await fetch(`${API_BASE_URL}/auth/check-admin`, {
            headers: { Authorization: `Bearer ${idToken}` }
        });
        const data = await resp.json();
        if (data.isAdmin) showDashboard(user);
        else showAccessDenied();
    } catch (err) {
        console.error("Admin check failed:", err);
        showAccessDenied();
    }
});

function showAccessDenied() {
    loadingScreen.style.display = "none";
    accessDenied.style.display = "flex";
}

function showDashboard(user) {
    loadingScreen.style.display = "none";
    adminDashboard.style.display = "block";
    document.getElementById("admin-email-text").textContent = user.email;

    loadFromStorage();
    setupListeners();
    loadStats();
    loadUserCount();
}

// ====== Event Listeners ======
function setupListeners() {
    document.getElementById("admin-logout-btn").addEventListener("click", async () => {
        await signOut(auth);
        window.location.href = "login.html";
    });

    // Stat card navigation
    document.getElementById("questions-stat-card").addEventListener("click", () => {
        window.location.href = "admin-questions.html";
    });
    document.getElementById("subjects-stat-card").addEventListener("click", () => {
        document.getElementById("subject-section").scrollIntoView({ behavior: "smooth" });
    });
    document.getElementById("users-stat-card").addEventListener("click", () => {
        window.location.href = "admin-users.html";
    });
}

// ====== Stats ======
function loadStats() {
    const subjects = Object.keys(quizData);
    let total = 0;
    const counts = {};
    subjects.forEach(s => {
        const c = quizData[s]?.length || 0;
        total += c;
        counts[s] = c;
    });

    document.getElementById("stat-total-questions").textContent = total;
    document.getElementById("stat-total-subjects").textContent = subjects.length;
    renderSubjectBars(counts);
}

async function loadUserCount() {
    try {
        idToken = await getIdToken(currentUser);
        const resp = await fetch(`${API_BASE_URL}/admin/users-count`, {
            headers: { Authorization: `Bearer ${idToken}` }
        });
        const data = await resp.json();
        document.getElementById("stat-users").textContent = data.totalUsers || 0;
    } catch (err) {
        document.getElementById("stat-users").textContent = "—";
    }
}

function renderSubjectBars(subjects) {
    const container = document.getElementById("subject-bars");
    container.innerHTML = "";
    const max = Math.max(...Object.values(subjects), 1);

    Object.entries(subjects).sort((a, b) => b[1] - a[1]).forEach(([s, c]) => {
        const row = document.createElement("div");
        row.className = "subject-bar-row";
        row.innerHTML = `
            <span class="subject-bar-label">${subjectNames[s] || s}</span>
            <div class="subject-bar-track">
                <div class="subject-bar-fill" style="width:${(c / max) * 100}%"></div>
            </div>
            <span class="subject-bar-count">${c}</span>`;
        container.appendChild(row);
    });
}

function formatDate(str) {
    if (!str) return "—";
    return new Date(str).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// ====== Toast ======
function showToast(msg, type = "success") {
    const toast = document.getElementById("toast");
    const icon = document.getElementById("toast-icon");
    document.getElementById("toast-message").textContent = msg;
    toast.className = `toast-notification${type === "error" ? " toast-error" : ""}`;
    icon.className = type === "error" ? "fas fa-exclamation-circle" : "fas fa-check-circle";
    toast.style.display = "flex";
    setTimeout(() => toast.style.display = "none", 3000);
}
