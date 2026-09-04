// Shared frontend configuration
window.CODEQUIZ_API_BASE_URL =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://localhost:5501"
        : "https://codequiz-ai-server.onrender.com";
