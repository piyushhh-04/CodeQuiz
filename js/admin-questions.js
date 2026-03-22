// ====== Admin Questions Page Logic ======
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
        if (data.isAdmin) showPage(user);
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

function showPage(user) {
    loadingScreen.style.display = "none";
    adminDashboard.style.display = "block";
    document.getElementById("admin-email-text").textContent = user.email;

    loadFromStorage();
    setupListeners();
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

    const subjectKey = rawSubject.toLowerCase().replace(/[^a-z0-9]+/g, '');

    if (!quizData[subjectKey]) {
        quizData[subjectKey] = [];
        if (!subjectNames[subjectKey]) subjectNames[subjectKey] = rawSubject;
    }

    quizData[subjectKey].push({ question, options, correct });
    saveToStorage();

    closeAddModal();
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
