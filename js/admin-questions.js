// ====== Admin Questions Page Logic ======
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
let deleteTarget = null;
let editingQuestionId = null;

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
        if (data.isAdmin) await showPage(user);
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

async function showPage(user) {
    loadingScreen.style.display = "none";
    adminDashboard.style.display = "block";
    document.getElementById("admin-email-text").textContent = user.email;

    setupListeners();
    try {
        await loadQuestions();
    } catch (error) {
        console.error("Question catalog unavailable:", error);
        showToast("Question catalog is unavailable. Changes cannot be saved.", "error");
    }
    populateSubjectFilter();
    populateSubjectDatalist();
    renderQuestionsTable();
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
    idToken = await getIdToken(currentUser);
    const response = await fetch(`${API_BASE_URL}/admin/questions`, {
        headers: { Authorization: `Bearer ${idToken}` }
    });
    if (!response.ok) throw new Error(`Question catalog request failed (${response.status})`);

    const data = await response.json();
    if (data.source === "unavailable") throw new Error("Persistent question storage is unavailable.");
    if (data.source === "default" && questionCount(data.questions) < questionCount(quizData)) {
        const bootstrap = await fetch(`${API_BASE_URL}/admin/questions/bootstrap`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${idToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ questions: quizData })
        });
        if (!bootstrap.ok) throw new Error(`Question catalog bootstrap failed (${bootstrap.status})`);
        const refreshed = await fetch(`${API_BASE_URL}/admin/questions`, {
            headers: { Authorization: `Bearer ${idToken}` }
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

    document.getElementById("questions-tbody").addEventListener("click", (event) => {
        const editButton = event.target.closest(".btn-edit-row");
        const deleteButton = event.target.closest(".btn-delete-row");
        if (editButton) openEditModal(editButton.dataset.id);
        if (deleteButton) {
            deleteTarget = { id: deleteButton.dataset.id };
            document.getElementById("delete-modal").style.display = "flex";
        }
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
            const numberCell = document.createElement("td");
            numberCell.className = "num-cell";
            numberCell.textContent = count;
            const subjectCell = document.createElement("td");
            const subjectPill = document.createElement("span");
            subjectPill.className = "subject-pill";
            subjectPill.textContent = subjectNames[subject] || subject;
            subjectCell.appendChild(subjectPill);
            const questionCell = document.createElement("td");
            questionCell.className = "question-cell";
            questionCell.textContent = q.question;
            const correctCell = document.createElement("td");
            const correctBadge = document.createElement("span");
            correctBadge.className = "correct-badge";
            const correctIcon = document.createElement("i");
            correctIcon.className = "fas fa-check";
            correctBadge.append(correctIcon, document.createTextNode(` ${q.options[q.correct]}`));
            correctCell.appendChild(correctBadge);
            const actionsCell = document.createElement("td");
            const editButton = document.createElement("button");
            editButton.className = "btn-edit-row";
            editButton.title = "Edit question";
            editButton.dataset.id = q.id;
            editButton.innerHTML = '<i class="fas fa-pen"></i>';
            const deleteButton = document.createElement("button");
            deleteButton.className = "btn-delete-row";
            deleteButton.title = "Delete question";
            deleteButton.dataset.id = q.id;
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
            actionsCell.append(editButton, deleteButton);
            tr.append(numberCell, subjectCell, questionCell, correctCell, actionsCell);
            tbody.appendChild(tr);
        });
    });

    empty.style.display = count === 0 ? "block" : "none";
    tableEl.style.display = count === 0 ? "none" : "block";
    footer.textContent = search ? `Showing ${count} of ${total} questions` : `${count} questions`;
}

// ====== Add Question ======
function openAddModal() {
    editingQuestionId = null;
    document.getElementById("question-form").reset();
    document.getElementById("form-subject").disabled = false;
    document.getElementById("modal-title").innerHTML = '<i class="fas fa-plus-circle"></i> Add Question';
    document.getElementById("modal-save-btn").innerHTML = '<i class="fas fa-save"></i> Save Question';
    document.getElementById("question-modal").style.display = "flex";
}

function openEditModal(id) {
    const question = Object.values(quizData).flat().find(item => item.id === id);
    if (!question) return;
    editingQuestionId = id;
    document.getElementById("form-subject").disabled = true;
    document.getElementById("form-subject").value = Object.entries(quizData)
        .find(([, questions]) => questions.some(item => item.id === id))?.[0] || "";
    document.getElementById("form-question").value = question.question;
    question.options.forEach((option, index) => {
        document.getElementById(`form-option-${index}`).value = option;
    });
    document.getElementById("form-correct").value = question.correct;
    document.getElementById("modal-title").innerHTML = '<i class="fas fa-pen"></i> Edit Question';
    document.getElementById("modal-save-btn").innerHTML = '<i class="fas fa-save"></i> Save Changes';
    document.getElementById("question-modal").style.display = "flex";
}

function closeAddModal() {
    document.getElementById("question-modal").style.display = "none";
    editingQuestionId = null;
}

async function handleAddQuestion(e) {
    e.preventDefault();
    const rawSubject = document.getElementById("form-subject").value.trim();
    const question = document.getElementById("form-question").value.trim();
    const options = [0, 1, 2, 3].map(i => document.getElementById(`form-option-${i}`).value.trim());
    const correct = parseInt(document.getElementById("form-correct").value);

    if (!rawSubject || !question || options.some(o => !o)) {
        showToast("Complete all question fields.", "error");
        return;
    }

    const rawSubjectLower = rawSubject.toLowerCase();
    let subjectKey = Object.keys(subjectNames).find(
        k => k.toLowerCase() === rawSubjectLower || (subjectNames[k] && subjectNames[k].toLowerCase() === rawSubjectLower)
    );

    if (!subjectKey) {
        subjectKey = rawSubjectLower.replace(/[^a-z0-9]+/g, '');
    }

    const wasEditing = Boolean(editingQuestionId);
    try {
        idToken = await getIdToken(currentUser);
        const endpoint = editingQuestionId
            ? `${API_BASE_URL}/admin/questions/${encodeURIComponent(editingQuestionId)}`
            : `${API_BASE_URL}/admin/questions`;
        const response = await fetch(endpoint, {
            method: editingQuestionId ? "PUT" : "POST",
            headers: {
                Authorization: `Bearer ${idToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ subject: subjectKey, question, options, correct })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Question could not be saved.");

        await loadQuestions();
        closeAddModal();
        populateSubjectFilter();
        populateSubjectDatalist();
        renderQuestionsTable();
        showToast(wasEditing ? "Question updated!" : `Question added to "${subjectNames[subjectKey] || subjectKey}"!`);
    } catch (error) {
        showToast(error.message, "error");
    }
}

// ====== Delete Question ======
function closeDeleteModal() {
    document.getElementById("delete-modal").style.display = "none";
    deleteTarget = null;
}

async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    try {
        idToken = await getIdToken(currentUser);
        const response = await fetch(`${API_BASE_URL}/admin/questions/${encodeURIComponent(deleteTarget.id)}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${idToken}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Question could not be deleted.");
        await loadQuestions();
        closeDeleteModal();
        populateSubjectFilter();
        populateSubjectDatalist();
        renderQuestionsTable();
        showToast("Question deleted!");
    } catch (error) {
        showToast(error.message, "error");
    }
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
