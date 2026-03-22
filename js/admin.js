// ====== Admin Dashboard Logic ======
import { auth } from "./firebase.js";
import {
    signOut,
    onAuthStateChanged,
    getIdToken,
    getIdTokenResult
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// API base URL (same logic as quiz.js)
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5500'
    : 'https://codequiz-ai-server.onrender.com';

// Subject display names
const subjectNames = {
    python: "Python",
    java: "Java",
    html: "HTML & CSS",
    sql: "SQL",
    c: "C Programming",
    cpp: "C++",
};

// ====== State ======
let currentUser = null;
let idToken = null;
let allQuestions = {};
let editingQuestionId = null;

// ====== DOM ======
const loadingScreen = document.getElementById("loading-screen");
const accessDenied = document.getElementById("access-denied");
const adminDashboard = document.getElementById("admin-dashboard");

// ====== Auth Check ======
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;
    idToken = await getIdToken(user);

    // Check admin status via backend
    try {
        const resp = await fetch(`${API_BASE_URL}/auth/check-admin`, {
            headers: { Authorization: `Bearer ${idToken}` }
        });
        const data = await resp.json();

        if (data.isAdmin) {
            showDashboard();
        } else {
            showAccessDenied();
        }
    } catch (err) {
        console.error("Admin check failed:", err);
        showAccessDenied();
    }
});

function showAccessDenied() {
    loadingScreen.style.display = "none";
    accessDenied.style.display = "flex";
    adminDashboard.style.display = "none";
}

async function showDashboard() {
    loadingScreen.style.display = "none";
    accessDenied.style.display = "none";
    adminDashboard.style.display = "block";

    // Set email
    document.getElementById("admin-email-text").textContent = currentUser.email;

    // Setup event listeners
    setupListeners();

    // Load data
    await Promise.all([loadStats(), loadQuestions()]);
}

// ====== Event Listeners ======
function setupListeners() {
    // Logout
    document.getElementById("admin-logout-btn").addEventListener("click", async () => {
        await signOut(auth);
        window.location.href = "login.html";
    });

    // Add question
    document.getElementById("add-question-btn").addEventListener("click", () => {
        openModal();
    });

    // Modal close / cancel
    document.getElementById("modal-close-btn").addEventListener("click", closeModal);
    document.getElementById("modal-cancel-btn").addEventListener("click", closeModal);

    // Modal overlay click to close
    document.getElementById("question-modal").addEventListener("click", (e) => {
        if (e.target.id === "question-modal") closeModal();
    });

    // Form submit
    document.getElementById("question-form").addEventListener("submit", handleSaveQuestion);

    // Filter & search
    document.getElementById("filter-subject").addEventListener("change", renderQuestionsTable);
    document.getElementById("search-input").addEventListener("input", renderQuestionsTable);
}

// ====== API Helpers ======
async function apiRequest(endpoint, method = "GET", body = null) {
    // Refresh token if needed
    idToken = await getIdToken(currentUser);

    const opts = {
        method,
        headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json"
        }
    };
    if (body) opts.body = JSON.stringify(body);

    const resp = await fetch(`${API_BASE_URL}${endpoint}`, opts);
    const data = await resp.json();

    if (!resp.ok) {
        throw new Error(data.error || "API request failed");
    }
    return data;
}

// ====== Load Stats ======
async function loadStats() {
    try {
        const stats = await apiRequest("/admin/stats");

        document.getElementById("stat-total-questions").textContent = stats.totalQuestions;
        document.getElementById("stat-total-subjects").textContent = stats.totalSubjects;
        document.getElementById("stat-uptime").textContent = formatUptime(stats.serverUptime);
        document.getElementById("stat-firebase").textContent = stats.firebaseConnected ? "Connected" : "Offline";

        // Render subject bars
        renderSubjectBars(stats.subjects, stats.totalQuestions);
    } catch (err) {
        console.error("Failed to load stats:", err);
        showToast("Failed to load stats", "error");
    }
}

function formatUptime(seconds) {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
}

function renderSubjectBars(subjects, total) {
    const container = document.getElementById("subject-bars");
    container.innerHTML = "";

    const maxCount = Math.max(...Object.values(subjects), 1);

    Object.entries(subjects)
        .sort((a, b) => b[1] - a[1])
        .forEach(([subject, count]) => {
            const row = document.createElement("div");
            row.className = "subject-bar-row";

            const label = document.createElement("span");
            label.className = "subject-bar-label";
            label.textContent = subjectNames[subject] || subject;

            const track = document.createElement("div");
            track.className = "subject-bar-track";

            const fill = document.createElement("div");
            fill.className = "subject-bar-fill";
            fill.style.width = `${(count / maxCount) * 100}%`;

            track.appendChild(fill);

            const countEl = document.createElement("span");
            countEl.className = "subject-bar-count";
            countEl.textContent = count;

            row.append(label, track, countEl);
            container.appendChild(row);
        });
}

// ====== Load Questions ======
async function loadQuestions() {
    try {
        allQuestions = await apiRequest("/admin/questions");
        populateSubjectFilter();
        renderQuestionsTable();
    } catch (err) {
        console.error("Failed to load questions:", err);
        showToast("Failed to load questions", "error");
    }
}

function populateSubjectFilter() {
    const select = document.getElementById("filter-subject");
    // Keep "All" option, remove others
    while (select.options.length > 1) select.remove(1);

    Object.keys(allQuestions).forEach(subject => {
        const option = document.createElement("option");
        option.value = subject;
        option.textContent = subjectNames[subject] || subject;
        select.appendChild(option);
    });
}

function renderQuestionsTable() {
    const filterSubject = document.getElementById("filter-subject").value;
    const searchQuery = document.getElementById("search-input").value.toLowerCase().trim();
    const tbody = document.getElementById("questions-tbody");
    const emptyState = document.getElementById("empty-state");

    tbody.innerHTML = "";
    let count = 0;

    const subjects = filterSubject ? [filterSubject] : Object.keys(allQuestions);

    subjects.forEach(subject => {
        const questions = allQuestions[subject] || [];
        questions.forEach(q => {
            // Search filter
            if (searchQuery && !q.question.toLowerCase().includes(searchQuery)) {
                return;
            }

            count++;
            const tr = document.createElement("tr");

            // Subject
            const tdSubject = document.createElement("td");
            const pill = document.createElement("span");
            pill.className = "subject-pill";
            pill.textContent = subjectNames[subject] || subject;
            tdSubject.appendChild(pill);

            // Question
            const tdQuestion = document.createElement("td");
            tdQuestion.className = "question-cell";
            tdQuestion.textContent = q.question;

            // Options
            const tdOptions = document.createElement("td");
            tdOptions.className = "options-cell";
            q.options.forEach((opt, i) => {
                const tag = document.createElement("span");
                tag.className = `option-tag${i === q.correct ? " correct" : ""}`;
                tag.textContent = `${String.fromCharCode(65 + i)}. ${opt}`;
                tdOptions.appendChild(tag);
            });

            // Correct answer
            const tdCorrect = document.createElement("td");
            const badge = document.createElement("span");
            badge.className = "correct-badge";
            badge.innerHTML = `<i class="fas fa-check"></i> ${String.fromCharCode(65 + q.correct)}`;
            tdCorrect.appendChild(badge);

            // Actions
            const tdActions = document.createElement("td");
            const actionsDiv = document.createElement("div");
            actionsDiv.className = "action-btns";

            const editBtn = document.createElement("button");
            editBtn.className = "btn-edit";
            editBtn.title = "Edit";
            editBtn.innerHTML = '<i class="fas fa-pen"></i>';
            editBtn.addEventListener("click", () => openModal(subject, q));

            const deleteBtn = document.createElement("button");
            deleteBtn.className = "btn-delete";
            deleteBtn.title = "Delete";
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteBtn.addEventListener("click", () => handleDelete(q.id));

            actionsDiv.append(editBtn, deleteBtn);
            tdActions.appendChild(actionsDiv);

            tr.append(tdSubject, tdQuestion, tdOptions, tdCorrect, tdActions);
            tbody.appendChild(tr);
        });
    });

    emptyState.style.display = count === 0 ? "block" : "none";
    document.querySelector(".table-container").style.display = count === 0 ? "none" : "block";
    if (count === 0) {
        document.querySelector(".questions-manager").appendChild(emptyState);
    }
}

// ====== Modal ======
function openModal(subject = "", question = null) {
    const modal = document.getElementById("question-modal");
    const title = document.getElementById("modal-title");
    const form = document.getElementById("question-form");

    if (question) {
        title.innerHTML = '<i class="fas fa-pen"></i> Edit Question';
        editingQuestionId = question.id;
        document.getElementById("form-subject").value = subject;
        document.getElementById("form-subject").disabled = true;
        document.getElementById("form-question").value = question.question;
        question.options.forEach((opt, i) => {
            document.getElementById(`form-option-${i}`).value = opt;
        });
        document.getElementById("form-correct").value = question.correct;
    } else {
        title.innerHTML = '<i class="fas fa-plus-circle"></i> Add Question';
        editingQuestionId = null;
        form.reset();
        document.getElementById("form-subject").disabled = false;
    }

    modal.style.display = "flex";
}

function closeModal() {
    document.getElementById("question-modal").style.display = "none";
    editingQuestionId = null;
}

async function handleSaveQuestion(e) {
    e.preventDefault();
    const saveBtn = document.getElementById("modal-save-btn");
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

    const subject = document.getElementById("form-subject").value;
    const question = document.getElementById("form-question").value;
    const options = [0, 1, 2, 3].map(i => document.getElementById(`form-option-${i}`).value);
    const correct = parseInt(document.getElementById("form-correct").value);

    try {
        if (editingQuestionId) {
            await apiRequest(`/admin/questions/${editingQuestionId}`, "PUT", {
                question, options, correct
            });
            showToast("Question updated successfully!");
        } else {
            await apiRequest("/admin/questions", "POST", {
                subject, question, options, correct
            });
            showToast("Question added successfully!");
        }

        closeModal();
        await Promise.all([loadStats(), loadQuestions()]);
    } catch (err) {
        console.error("Save failed:", err);
        showToast(err.message || "Failed to save question", "error");
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Question';
    }
}

async function handleDelete(questionId) {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
        await apiRequest(`/admin/questions/${questionId}`, "DELETE");
        showToast("Question deleted!");
        await Promise.all([loadStats(), loadQuestions()]);
    } catch (err) {
        console.error("Delete failed:", err);
        showToast(err.message || "Failed to delete question", "error");
    }
}

// ====== Toast ======
function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    const icon = document.getElementById("toast-icon");
    const msg = document.getElementById("toast-message");

    toast.className = `toast-notification${type === "error" ? " toast-error" : ""}`;
    icon.className = type === "error" ? "fas fa-exclamation-circle" : "fas fa-check-circle";
    msg.textContent = message;
    toast.style.display = "flex";

    setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
}
