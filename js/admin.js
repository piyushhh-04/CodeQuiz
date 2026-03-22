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
let deleteTarget = null;

// ====== LocalStorage Persistence ======
const STORAGE_KEY = "codequiz_admin_questions";

function loadFromStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Replace quizData with saved version
            Object.keys(quizData).forEach(k => delete quizData[k]);
            Object.assign(quizData, parsed);
        } catch (e) { console.log("No saved data"); }
    }
}

function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quizData));
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
    loadUsers();
    populateSubjectFilter();
    populateSubjectDatalist();
    renderQuestionsTable();
}

// ====== Event Listeners ======
function setupListeners() {
    document.getElementById("admin-logout-btn").addEventListener("click", async () => {
        await signOut(auth);
        window.location.href = "login.html";
    });

    document.getElementById("filter-subject").addEventListener("change", renderQuestionsTable);
    document.getElementById("search-input").addEventListener("input", renderQuestionsTable);

    // Stat card scroll-to
    document.getElementById("questions-stat-card").addEventListener("click", () => {
        document.getElementById("questions-section").scrollIntoView({ behavior: "smooth" });
    });
    document.getElementById("subjects-stat-card").addEventListener("click", () => {
        document.getElementById("subject-section").scrollIntoView({ behavior: "smooth" });
    });
    document.getElementById("users-stat-card").addEventListener("click", () => {
        document.getElementById("users-section").scrollIntoView({ behavior: "smooth" });
    });

    // Add question
    document.getElementById("add-question-btn").addEventListener("click", openAddModal);
    document.getElementById("modal-close-btn").addEventListener("click", closeAddModal);
    document.getElementById("modal-cancel-btn").addEventListener("click", closeAddModal);
    document.getElementById("question-modal").addEventListener("click", (e) => {
        if (e.target.id === "question-modal") closeAddModal();
    });
    document.getElementById("question-form").addEventListener("submit", handleAddQuestion);

    // Delete confirmation
    document.getElementById("delete-modal-close").addEventListener("click", closeDeleteModal);
    document.getElementById("delete-cancel-btn").addEventListener("click", closeDeleteModal);
    document.getElementById("delete-confirm-btn").addEventListener("click", handleDeleteConfirm);
    document.getElementById("delete-modal").addEventListener("click", (e) => {
        if (e.target.id === "delete-modal") closeDeleteModal();
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

// ====== Users Section ======
async function loadUsers() {
    const loading = document.getElementById("users-loading");
    const table = document.getElementById("users-table-container");

    try {
        idToken = await getIdToken(currentUser);
        const resp = await fetch(`${API_BASE_URL}/admin/users`, {
            headers: { Authorization: `Bearer ${idToken}` }
        });
        const data = await resp.json();
        const tbody = document.getElementById("users-tbody");
        tbody.innerHTML = "";

        data.users.forEach((user, i) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td class="num-cell">${i + 1}</td>
                <td class="user-email-cell">${user.email}</td>
                <td>${formatDate(user.createdAt)}</td>
                <td>${formatDate(user.lastSignIn)}</td>
                <td>${user.isAdmin
                    ? '<span class="role-badge role-admin"><i class="fas fa-shield-alt"></i> Admin</span>'
                    : '<span class="role-badge role-user"><i class="fas fa-user"></i> User</span>'
                }</td>`;
            tbody.appendChild(tr);
        });

        loading.style.display = "none";
        table.style.display = "block";
    } catch (err) {
        loading.innerHTML = '<i class="fas fa-exclamation-circle"></i> Failed to load users';
    }
}

function formatDate(str) {
    if (!str) return "—";
    return new Date(str).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// ====== Subject Filter & Datalist ======
function populateSubjectFilter() {
    const select = document.getElementById("filter-subject");
    while (select.options.length > 1) select.remove(1);
    Object.keys(quizData).forEach(s => {
        const opt = document.createElement("option");
        opt.value = s;
        opt.textContent = subjectNames[s] || s;
        select.appendChild(opt);
    });
}

function populateSubjectDatalist() {
    const list = document.getElementById("subject-list");
    list.innerHTML = "";
    Object.keys(quizData).forEach(s => {
        const opt = document.createElement("option");
        opt.value = subjectNames[s] || s;
        list.appendChild(opt);
    });
}

// ====== Questions Table ======
function renderQuestionsTable() {
    const filterSubject = document.getElementById("filter-subject").value;
    const search = document.getElementById("search-input").value.toLowerCase().trim();
    const tbody = document.getElementById("questions-tbody");
    const empty = document.getElementById("empty-state");
    const tableEl = document.getElementById("questions-table-container");
    const footer = document.getElementById("table-footer");

    tbody.innerHTML = "";
    let count = 0, total = 0;

    const subjects = filterSubject ? [filterSubject] : Object.keys(quizData);

    subjects.forEach(subject => {
        (quizData[subject] || []).forEach((q, idx) => {
            total++;
            if (search && !q.question.toLowerCase().includes(search)) return;
            count++;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td class="num-cell">${count}</td>
                <td><span class="subject-pill">${subjectNames[subject] || subject}</span></td>
                <td class="question-cell">${q.question}</td>
                <td><span class="correct-badge"><i class="fas fa-check"></i> ${q.options[q.correct]}</span></td>
                <td>
                    <button class="btn-delete-row" title="Delete question" data-subject="${subject}" data-index="${idx}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>`;
            tbody.appendChild(tr);
        });
    });

    // Attach delete handlers
    tbody.querySelectorAll(".btn-delete-row").forEach(btn => {
        btn.addEventListener("click", () => {
            deleteTarget = { subject: btn.dataset.subject, index: parseInt(btn.dataset.index) };
            document.getElementById("delete-modal").style.display = "flex";
        });
    });

    empty.style.display = count === 0 ? "block" : "none";
    tableEl.style.display = count === 0 ? "none" : "block";
    footer.textContent = search ? `Showing ${count} of ${total} questions` : `${count} questions`;
}

// ====== Add Question ======
function openAddModal() {
    document.getElementById("question-form").reset();
    document.getElementById("question-modal").style.display = "flex";
}

function closeAddModal() {
    document.getElementById("question-modal").style.display = "none";
}

function handleAddQuestion(e) {
    e.preventDefault();
    const rawSubject = document.getElementById("form-subject").value.trim();
    const question = document.getElementById("form-question").value.trim();
    const options = [0, 1, 2, 3].map(i => document.getElementById(`form-option-${i}`).value.trim());
    const correct = parseInt(document.getElementById("form-correct").value);

    if (!rawSubject || !question || options.some(o => !o)) return;

    // Normalize subject key
    const subjectKey = rawSubject.toLowerCase().replace(/[^a-z0-9]+/g, '');

    // Create subject array if needed
    if (!quizData[subjectKey]) {
        quizData[subjectKey] = [];
        if (!subjectNames[subjectKey]) subjectNames[subjectKey] = rawSubject;
    }

    quizData[subjectKey].push({ question, options, correct });
    saveToStorage();

    closeAddModal();
    loadStats();
    populateSubjectFilter();
    populateSubjectDatalist();
    renderQuestionsTable();
    showToast(`Question added to "${subjectNames[subjectKey] || subjectKey}"!`);
}

// ====== Delete Question ======
function closeDeleteModal() {
    document.getElementById("delete-modal").style.display = "none";
    deleteTarget = null;
}

function handleDeleteConfirm() {
    if (!deleteTarget) return;
    const { subject, index } = deleteTarget;

    if (quizData[subject] && quizData[subject][index]) {
        quizData[subject].splice(index, 1);
        if (quizData[subject].length === 0) delete quizData[subject];
    }
    saveToStorage();

    closeDeleteModal();
    loadStats();
    populateSubjectFilter();
    populateSubjectDatalist();
    renderQuestionsTable();
    showToast("Question deleted!");
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
