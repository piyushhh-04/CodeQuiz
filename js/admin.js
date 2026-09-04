// ====== Admin Dashboard Logic ======
import { auth } from "./firebase.js";
import {
    signOut,
    onAuthStateChanged,
    getIdToken
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const API_BASE_URL = window.CODEQUIZ_API_BASE_URL;

const subjectNames = {
    python: "Python", java: "Java", html: "HTML & CSS",
    sql: "SQL", c: "C Programming", cpp: "C++"
};

// ====== State ======
let currentUser = null;
let idToken = null;

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
        if (data.isAdmin) await showDashboard(user);
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

async function showDashboard(user) {
    loadingScreen.style.display = "none";
    adminDashboard.style.display = "block";
    document.getElementById("admin-email-text").textContent = user.email;

    setupListeners();
    try {
        await loadQuestions();
    } catch (error) {
        console.error("Question catalog unavailable:", error);
        showToast("Question catalog is unavailable. Showing bundled questions.", "error");
    }
    loadStats();
    loadUserCount();
}

function replaceQuestions(questionMap) {
    Object.keys(quizData).forEach(subject => delete quizData[subject]);
    Object.assign(quizData, questionMap);
}

function questionCount(questionMap) {
    return Object.values(questionMap || {}).reduce(
        (total, questions) => total + (Array.isArray(questions) ? questions.length : 0), 0
    );
}

async function loadQuestions() {
    const token = await getIdToken(currentUser);
    const response = await fetch(`${API_BASE_URL}/admin/questions`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error(`Question catalog request failed (${response.status})`);

    const data = await response.json();
    if (data.source === "unavailable") throw new Error("Persistent question storage is unavailable.");
    if (data.source === "default" && questionCount(data.questions) < questionCount(quizData)) {
        const bootstrap = await fetch(`${API_BASE_URL}/admin/questions/bootstrap`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ questions: quizData })
        });
        if (!bootstrap.ok) throw new Error(`Question catalog bootstrap failed (${bootstrap.status})`);
        const refreshed = await fetch(`${API_BASE_URL}/admin/questions`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!refreshed.ok) throw new Error(`Question catalog refresh failed (${refreshed.status})`);
        const refreshedData = await refreshed.json();
        if (refreshedData.questions) replaceQuestions(refreshedData.questions);
        return;
    }

    if (data.questions) replaceQuestions(data.questions);
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
        if (!resp.ok) throw new Error(`User count request failed (${resp.status})`);
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
        const label = document.createElement("span");
        label.className = "subject-bar-label";
        label.textContent = subjectNames[s] || s;
        const track = document.createElement("div");
        track.className = "subject-bar-track";
        const fill = document.createElement("div");
        fill.className = "subject-bar-fill";
        fill.style.width = `${(c / max) * 100}%`;
        track.appendChild(fill);
        const count = document.createElement("span");
        count.className = "subject-bar-count";
        count.textContent = c;
        row.append(label, track, count);
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
