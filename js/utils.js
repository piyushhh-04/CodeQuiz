// Utility functions for the quiz application

// Shuffle array function (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Get random questions from subject
function getRandomQuestions(subject, count = 30) {
    const subjectQuestions = quizData[subject];
    if (!subjectQuestions) return [];
    
    // Create a copy and shuffle
    const shuffled = shuffleArray([...subjectQuestions]);
    
    // Return requested number of questions (or all if less than count)
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Format time
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Calculate accuracy
function calculateAccuracy(correct, total) {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
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

// Show notification (can be enhanced with toast notifications)
function showNotification(message, type = 'info') {
    // You can implement a toast notification system here
    console.log(`[${type.toUpperCase()}] ${message}`);
}

// Validate answer
function isAnswerCorrect(question, selectedIndex) {
    return selectedIndex === question.correct;
}

// Calculate score
function calculateScore(correctCount, wrongCount) {
    return (correctCount * 10) - (wrongCount * 5);
}

// Get timer color based on time left
function getTimerColor(timeLeft) {
    if (timeLeft > 20) return 'normal';
    if (timeLeft > 10) return 'warning';
    return 'danger';
}

// Create element with classes
function createElement(tag, classes = [], text = '') {
    const element = document.createElement(tag);
    if (classes.length) {
        element.classList.add(...classes);
    }
    if (text) {
        element.textContent = text;
    }
    return element;
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export utilities if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        shuffleArray,
        getRandomQuestions,
        formatTime,
        calculateAccuracy,
        saveQuizState,
        loadQuizState,
        clearQuizState,
        showNotification,
        isAnswerCorrect,
        calculateScore,
        getTimerColor,
        createElement,
        debounce
    };
}