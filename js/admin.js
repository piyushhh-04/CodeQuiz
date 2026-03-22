// ====== Admin Dashboard Logic ======
import { auth } from "./firebase.js";
import {
    signOut,
    onAuthStateChanged,
    getIdToken
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// API base URL
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5500'
    : 'https://codequiz-ai-server.onrender.com';

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

    const idToken = await getIdToken(user);

    // Check admin status via backend
    try {
        const resp = await fetch(`${API_BASE_URL}/auth/check-admin`, {
            headers: { Authorization: `Bearer ${idToken}` }
        });
        const data = await resp.json();

        if (data.isAdmin) {
            showDashboard(user);
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

function showDashboard(user) {
    loadingScreen.style.display = "none";
    accessDenied.style.display = "none";
    adminDashboard.style.display = "block";

    // Set email
    document.getElementById("admin-email-text").textContent = user.email;

    // Setup
    setupListeners();
    loadStats();
    populateSubjectFilter();
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
}

// ====== Load Stats from data.js ======
function loadStats() {
    // quizData comes from data.js (loaded via <script> tag)
    const subjects = Object.keys(quizData);
    let totalQuestions = 0;
    const subjectCounts = {};

    subjects.forEach(subject => {
        const count = quizData[subject]?.length || 0;
        totalQuestions += count;
        subjectCounts[subject] = count;
    });

    document.getElementById("stat-total-questions").textContent = totalQuestions;
    document.getElementById("stat-total-subjects").textContent = subjects.length;
    document.getElementById("stat-per-subject").textContent = subjects.length > 0
        ? Math.round(totalQuestions / subjects.length)
        : 0;

    renderSubjectBars(subjectCounts);
}

function renderSubjectBars(subjects) {
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

// ====== Question Browser ======
function populateSubjectFilter() {
    const select = document.getElementById("filter-subject");
    while (select.options.length > 1) select.remove(1);

    Object.keys(quizData).forEach(subject => {
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
    const tableContainer = document.querySelector(".table-container");
    const footer = document.getElementById("table-footer");

    tbody.innerHTML = "";
    let count = 0;
    let total = 0;

    const subjects = filterSubject ? [filterSubject] : Object.keys(quizData);

    subjects.forEach(subject => {
        const questions = quizData[subject] || [];
        questions.forEach((q, idx) => {
            total++;

            // Search filter
            if (searchQuery && !q.question.toLowerCase().includes(searchQuery)) {
                return;
            }

            count++;
            const tr = document.createElement("tr");

            // Number
            const tdNum = document.createElement("td");
            tdNum.className = "num-cell";
            tdNum.textContent = count;

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

            // Correct answer
            const tdCorrect = document.createElement("td");
            const badge = document.createElement("span");
            badge.className = "correct-badge";
            badge.innerHTML = `<i class="fas fa-check"></i> ${q.options[q.correct]}`;
            tdCorrect.appendChild(badge);

            tr.append(tdNum, tdSubject, tdQuestion, tdCorrect);
            tbody.appendChild(tr);
        });
    });

    emptyState.style.display = count === 0 ? "block" : "none";
    tableContainer.style.display = count === 0 ? "none" : "block";

    footer.textContent = searchQuery
        ? `Showing ${count} of ${total} questions`
        : `${count} questions`;
}
