// Utility functions for the quiz application

// Format time
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Save quiz state to localStorage
function saveQuizState(state) {
    localStorage.setItem('quizState', JSON.stringify(state));
}

// Load quiz state from localStorage
function loadQuizState() {
    const state = localStorage.getItem('quizState');
    return state ? JSON.parse(state) : null;
}

// Clear quiz state from localStorage
function clearQuizState() {
    localStorage.removeItem('quizState');
}