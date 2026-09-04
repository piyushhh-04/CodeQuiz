// ====== Admin Users Page Logic ======
import { auth } from "./firebase.js";
import {
    signOut,
    onAuthStateChanged,
    getIdToken
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const API_BASE_URL = window.CODEQUIZ_API_BASE_URL;

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
        if (!resp.ok) throw new Error(`Admin check failed (${resp.status})`);
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

    setupListeners();
    loadUsers();
}

// ====== Event Listeners ======
function setupListeners() {
    document.getElementById("admin-logout-btn").addEventListener("click", async () => {
        await signOut(auth);
        window.location.href = "login.html";
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
        if (!resp.ok) throw new Error(`User list request failed (${resp.status})`);
        const data = await resp.json();
        const tbody = document.getElementById("users-tbody");
        tbody.innerHTML = "";

        if (!Array.isArray(data.users) || data.users.length === 0) {
            loading.textContent = "No registered users found.";
            return;
        }

        data.users.forEach((user, i) => {
            const tr = document.createElement("tr");
            const numberCell = document.createElement("td");
            numberCell.className = "num-cell";
            numberCell.textContent = i + 1;
            const emailCell = document.createElement("td");
            emailCell.className = "user-email-cell";
            emailCell.textContent = user.email || "No email";
            const createdCell = document.createElement("td");
            createdCell.textContent = formatDate(user.createdAt);
            const activeCell = document.createElement("td");
            activeCell.textContent = formatDate(user.lastSignIn);
            const roleCell = document.createElement("td");
            const roleBadge = document.createElement("span");
            roleBadge.className = `role-badge ${user.isAdmin ? "role-admin" : "role-user"}`;
            const roleIcon = document.createElement("i");
            roleIcon.className = user.isAdmin ? "fas fa-shield-alt" : "fas fa-user";
            roleBadge.append(roleIcon, document.createTextNode(user.isAdmin ? " Admin" : " User"));
            roleCell.appendChild(roleBadge);
            tr.append(numberCell, emailCell, createdCell, activeCell, roleCell);
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
