// ====== Configuration ======
// Change this to your production server URL when deploying
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5500'
    : 'https://codequiz-ai-server.onrender.com';

// ====== HTML Sanitizer (XSS Protection) ======
const ALLOWED_TAGS = new Set([
    'P', 'STRONG', 'EM', 'B', 'I', 'CODE', 'PRE', 'UL', 'OL', 'LI',
    'BR', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'DIV', 'A', 'BLOCKQUOTE'
]);

const ALLOWED_ATTRIBUTES = {
    'A': ['href'],
    'CODE': ['class'],
    'PRE': ['class'],
    'SPAN': ['class'],
    'DIV': ['class'],
};

function sanitizeHTML(dirtyHTML) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(dirtyHTML, 'text/html');

    function cleanNode(node) {
        const clean = document.createDocumentFragment();

        for (const child of Array.from(node.childNodes)) {
            if (child.nodeType === Node.TEXT_NODE) {
                clean.appendChild(document.createTextNode(child.textContent));
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                if (ALLOWED_TAGS.has(child.tagName)) {
                    const el = document.createElement(child.tagName);

                    // Copy only allowed attributes
                    const allowedAttrs = ALLOWED_ATTRIBUTES[child.tagName] || [];
                    for (const attr of allowedAttrs) {
                        if (child.hasAttribute(attr)) {
                            let value = child.getAttribute(attr);
                            // For href, only allow http/https URLs
                            if (attr === 'href' && !/^https?:\/\//i.test(value)) {
                                continue;
                            }
                            el.setAttribute(attr, value);
                        }
                    }

                    // Recursively clean children
                    el.appendChild(cleanNode(child));
                    clean.appendChild(el);
                } else {
                    // Skip disallowed tags but keep their text content
                    clean.appendChild(cleanNode(child));
                }
            }
        }
        return clean;
    }

    const container = document.createElement('div');
    container.appendChild(cleanNode(doc.body));
    return container.innerHTML;
}

// ====== Main Quiz Application ======
class QuizApp {
    constructor() {
        // State
        this.currentSubject = '';
        this.allQuestions = [];
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.score = 0;
        this.timer = null;
        this.timeLeft = 30;
        this.startTime = null;
        this.totalTime = 0;
        this.selectedOption = null;
        this.userAnswers = [];

        // DOM Elements
        this.welcomeScreen = document.getElementById('welcome-screen');
        this.learningScreen = document.getElementById('learning-screen');
        this.quizScreen = document.getElementById('quiz-screen');
        this.scoreboardScreen = document.getElementById('scoreboard-screen');
        this.subjectsGrid = document.querySelector('.subjects-grid');

        // Initialize
        this.init();
    }

    init() {
        this.loadSubjects();
        this.setupEventListeners();
        clearQuizState(); // Always start fresh — don't resume mid-quiz
    }

    // ====== Quiz State Persistence ======
    tryRestoreQuizState() {
        const saved = loadQuizState();
        if (saved && saved.currentSubject && saved.questions && saved.questions.length > 0) {
            // Restore state
            this.currentSubject = saved.currentSubject;
            this.allQuestions = quizData[saved.currentSubject] || [];
            this.questions = saved.questions;
            this.currentQuestionIndex = saved.currentQuestionIndex || 0;
            this.correctCount = saved.correctCount || 0;
            this.wrongCount = saved.wrongCount || 0;
            this.score = saved.score || 0;
            this.totalTime = saved.totalTime || 0;
            this.chatHistory = saved.chatHistory || [];

            // Update UI and jump to quiz
            document.getElementById('current-subject').textContent = subjectNames[this.currentSubject];
            document.getElementById('learning-subject').textContent = subjectNames[this.currentSubject];
            this.showQuizTip();
            this.showQuizScreen();
        }
    }

    persistQuizState() {
        saveQuizState({
            currentSubject: this.currentSubject,
            questions: this.questions,
            currentQuestionIndex: this.currentQuestionIndex,
            correctCount: this.correctCount,
            wrongCount: this.wrongCount,
            score: this.score,
            totalTime: this.totalTime,
            chatHistory: this.chatHistory || [],
        });
    }

    loadSubjects() {
        // Clear grid
        this.subjectsGrid.innerHTML = '';

        // Load subjects from quizData
        Object.keys(quizData).forEach(subject => {
            const card = this.createSubjectCard(subject);
            this.subjectsGrid.appendChild(card);
        });
    }

    createSubjectCard(subject) {
        const card = document.createElement('div');
        card.className = 'subject-card';
        card.dataset.subject = subject;
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Start ${subjectNames[subject] || subject} quiz`);

        const icon = document.createElement('i');
        icon.className = subjectIcons[subject] || 'fas fa-code';
        icon.setAttribute('aria-hidden', 'true');

        const title = document.createElement('h3');
        title.textContent = subjectNames[subject] || subject;

        const count = document.createElement('p');
        count.textContent = subjectDescriptions[subject] || '30 Questions';

        card.appendChild(icon);
        card.appendChild(title);
        card.appendChild(count);

        card.addEventListener('click', () => this.startQuiz(subject));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.startQuiz(subject);
            }
        });

        return card;
    }

    setupEventListeners() {
        // Back button (quiz screen)
        document.getElementById('back-btn').addEventListener('click', () => {
            this.showBackDialog();
        });

        // Back button (learning screen)
        document.getElementById('learning-back-btn').addEventListener('click', () => {
            this.showWelcomeScreen();
        });

        // Start quiz button (learning screen)
        document.getElementById('start-quiz-btn').addEventListener('click', () => {
            this.showQuizScreen();
        });

        // Play again button
        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.startQuiz(this.currentSubject);
        });

        // New subject button
        document.getElementById('new-subject-btn').addEventListener('click', () => {
            this.showWelcomeScreen();
        });
    }

    showBackDialog() {
        dialog.confirm({
            title: 'Go Back?',
            message: 'Are you sure you want to go back? Your progress will be lost.',
            onConfirm: (confirmed) => {
                if (confirmed) {
                    clearQuizState();
                    this.showWelcomeScreen();
                }
            }
        });
    }

    startQuiz(subject) {
        // Reset state
        this.currentSubject = subject;
        this.allQuestions = quizData[subject];

        // Select random 10 questions from 30
        this.questions = this.getRandomQuestions(10);
        this.currentQuestionIndex = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.score = 0;
        this.totalTime = 0;
        this.userAnswers = [];

        // Reset chat history
        this.chatHistory = [];

        // Clear any previous saved state
        clearQuizState();

        // Update UI
        document.getElementById('current-subject').textContent = subjectNames[subject];
        document.getElementById('learning-subject').textContent = subjectNames[subject];
        this.showQuizTip();

        // Show learning screen (chat)
        this.showLearningScreen();
    }

    showLearningScreen() {
        // Switch to learning screen
        this.welcomeScreen.classList.remove('active');
        this.quizScreen.classList.remove('active');
        this.scoreboardScreen.classList.remove('active');
        this.learningScreen.classList.add('active');

        // Clear chat messages and show welcome
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.innerHTML = '';

        // Add AI welcome message (this is our own trusted HTML, safe to insert)
        this.addChatBubble('ai', `<p>Hi! I'm your <strong>AI Tutor</strong> for <strong>${subjectNames[this.currentSubject]}</strong>. 🤖</p><p>You can ask me anything about this topic, or use the quick buttons below to get started. When you're ready, hit <strong>Start Quiz</strong>!</p>`, true);

        // Show quick prompts
        document.getElementById('quick-prompts').style.display = 'flex';

        // Setup chat input
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('chat-send-btn');
        chatInput.value = '';
        sendBtn.disabled = false;

        // Remove old listeners by cloning
        const newInput = chatInput.cloneNode(true);
        chatInput.parentNode.replaceChild(newInput, chatInput);
        const newSendBtn = sendBtn.cloneNode(true);
        sendBtn.parentNode.replaceChild(newSendBtn, sendBtn);

        // Send on Enter key
        newInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendChatMessage();
            }
        });

        // Send on button click
        newSendBtn.addEventListener('click', () => this.sendChatMessage());

        // Quick prompt buttons
        document.querySelectorAll('.quick-prompt-btn').forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', () => {
                document.getElementById('chat-input').value = newBtn.dataset.prompt;
                this.sendChatMessage();
            });
        });
    }

    // isTrusted = true means it's our own HTML (e.g. welcome message), skip sanitization
    addChatBubble(role, html, isTrusted = false) {
        const chatMessages = document.getElementById('chat-messages');
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${role}`;
        bubble.setAttribute('role', 'log');

        if (role === 'ai') {
            const safeHTML = isTrusted ? html : sanitizeHTML(html);
            bubble.innerHTML = `<div class="bubble-label"><i class="fas fa-robot" aria-hidden="true"></i> AI Tutor</div>${safeHTML}`;
        } else {
            bubble.textContent = html;
        }

        chatMessages.appendChild(bubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return bubble;
    }

    addThinkingBubble() {
        const chatMessages = document.getElementById('chat-messages');
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble ai thinking';
        bubble.id = 'thinking-bubble';
        bubble.setAttribute('role', 'status');
        bubble.setAttribute('aria-label', 'AI is thinking');
        bubble.innerHTML = `<div class="bubble-label"><i class="fas fa-robot" aria-hidden="true"></i> AI Tutor</div><div class="thinking-dots"><span></span><span></span><span></span></div>`;
        chatMessages.appendChild(bubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return bubble;
    }

    removeThinkingBubble() {
        const thinking = document.getElementById('thinking-bubble');
        if (thinking) thinking.remove();
    }

    async sendChatMessage() {
        const input = document.getElementById('chat-input');
        const sendBtn = document.getElementById('chat-send-btn');
        const message = input.value.trim();

        if (!message) return;

        // Add user message to UI
        this.addChatBubble('user', message);
        input.value = '';
        sendBtn.disabled = true;

        // Hide quick prompts after first message
        document.getElementById('quick-prompts').style.display = 'none';

        // Add to history
        this.chatHistory.push({ role: 'user', text: message });

        // Show thinking indicator
        this.addThinkingBubble();

        try {
            const response = await fetch(`${API_BASE_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: subjectNames[this.currentSubject] || this.currentSubject,
                    questions: this.questions.map(q => ({ question: q.question })),
                    history: this.chatHistory
                })
            });

            const data = await response.json();
            this.removeThinkingBubble();

            if (data.reply) {
                // AI response is sanitized inside addChatBubble
                this.addChatBubble('ai', data.reply);
                this.chatHistory.push({ role: 'model', text: data.reply });
            } else {
                this.addChatBubble('ai', '<p>Sorry, something went wrong. Try asking again!</p>', true);
            }
        } catch (error) {
            console.error('Chat error:', error);
            this.removeThinkingBubble();
            this.addChatBubble('ai', `<p>Could not reach the AI server. Make sure it's running!</p><p><button class="quick-prompt-btn" onclick="quizApp.retrySendChat('${message.replace(/'/g, "\\'")}')"><i class="fas fa-redo"></i> Retry</button></p>`, true);
        }

        sendBtn.disabled = false;
        input.focus();
    }

    retrySendChat(message) {
        document.getElementById('chat-input').value = message;
        // Remove the error bubble
        const chatMessages = document.getElementById('chat-messages');
        const lastBubble = chatMessages.lastElementChild;
        if (lastBubble) lastBubble.remove();
        this.sendChatMessage();
    }

    showQuizScreen() {
        this.learningScreen.classList.remove('active');
        this.welcomeScreen.classList.remove('active');
        this.quizScreen.classList.add('active');

        // Save state when entering quiz
        this.persistQuizState();

        // Load first question
        this.loadQuestion();
    }

    getRandomQuestions(count) {
        // Create a copy of all questions and shuffle
        const shuffled = [...this.allQuestions];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        // Return first 'count' questions
        return shuffled.slice(0, Math.min(count, shuffled.length));
    }

    loadQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.showScoreboard();
            return;
        }

        this.resetTimer();
        this.selectedOption = null;

        const question = this.questions[this.currentQuestionIndex];
        document.getElementById('question-text').textContent = question.question;

        // Load options
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        optionsContainer.setAttribute('role', 'radiogroup');
        optionsContainer.setAttribute('aria-label', 'Answer options');

        question.options.forEach((option, index) => {
            const optionBtn = document.createElement('div');
            optionBtn.className = 'option-btn';
            optionBtn.textContent = option;
            optionBtn.dataset.index = index;
            optionBtn.setAttribute('role', 'radio');
            optionBtn.setAttribute('aria-checked', 'false');
            optionBtn.setAttribute('tabindex', '0');
            optionBtn.setAttribute('aria-label', `Option ${index + 1}: ${option}`);

            optionBtn.addEventListener('click', () => this.selectOption(index));
            optionBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectOption(index);
                }
            });

            optionsContainer.appendChild(optionBtn);
        });

        // Update counter
        document.getElementById('question-counter').textContent =
            `Question ${this.currentQuestionIndex + 1}/${this.questions.length}`;

        // Update progress
        this.updateProgress();

        // Start timer
        this.startTimer();
    }

    selectOption(index) {
        if (this.selectedOption !== null) return;

        this.selectedOption = index;
        const question = this.questions[this.currentQuestionIndex];
        const options = document.querySelectorAll('.option-btn');

        // Disable all options
        options.forEach(option => {
            option.classList.add('disabled');
            option.setAttribute('tabindex', '-1');
        });

        // Show correct/incorrect
        options.forEach((option, i) => {
            if (i === question.correct) {
                option.classList.add('correct');
                option.setAttribute('aria-checked', 'true');
                option.setAttribute('aria-label', option.textContent + ' — Correct answer');
            } else if (i === index && i !== question.correct) {
                option.classList.add('wrong');
                option.setAttribute('aria-label', option.textContent + ' — Wrong answer');
            }
        });

        // Update scores (+10 for correct, -5 for wrong)
        const isCorrect = index === question.correct;
        if (isCorrect) {
            this.correctCount++;
            this.score += 10;
        } else {
            this.wrongCount++;
            this.score -= 5;
        }

        // Track answer for review
        this.userAnswers.push({
            questionIndex: this.currentQuestionIndex,
            selectedIndex: index,
            isCorrect: isCorrect,
            timedOut: false
        });

        this.showQuizTip();

        // Clear timer
        clearInterval(this.timer);

        // Save progress after each answer
        this.totalTime += (30 - this.timeLeft);
        this.currentQuestionIndex++;
        this.persistQuizState();

        // Auto move to next question after 1.5 seconds
        setTimeout(() => {
            this.loadQuestion();
        }, 1500);
    }

    startTimer() {
        this.timeLeft = 30;
        this.updateTimerDisplay();

        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();

            if (this.timeLeft <= 0) {
                clearInterval(this.timer);

                if (this.selectedOption === null) {
                    // Time's up - auto mark as wrong
                    const question = this.questions[this.currentQuestionIndex];
                    const options = document.querySelectorAll('.option-btn');

                    options.forEach(option => {
                        option.classList.add('disabled');
                        option.setAttribute('tabindex', '-1');
                    });
                    options[question.correct].classList.add('correct');

                    this.wrongCount++;
                    this.score -= 5;
                    this.showQuizTip();

                    // Track timed-out answer
                    this.userAnswers.push({
                        questionIndex: this.currentQuestionIndex,
                        selectedIndex: -1,
                        isCorrect: false,
                        timedOut: true
                    });

                    // Save progress
                    this.totalTime += 30;
                    this.currentQuestionIndex++;
                    this.persistQuizState();

                    setTimeout(() => {
                        this.loadQuestion();
                    }, 1500);
                }
            }
        }, 1000);
    }

    resetTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    updateTimerDisplay() {
        const timerDisplay = document.getElementById('timer');
        timerDisplay.textContent = this.timeLeft;

        // Add warning class
        const timerBadge = document.querySelector('.timer-badge');
        if (this.timeLeft <= 10) {
            timerBadge.classList.add('warning');
        } else {
            timerBadge.classList.remove('warning');
        }
    }

    updateProgress() {
        const progress = ((this.currentQuestionIndex) / this.questions.length) * 100;
        document.getElementById('progress-bar').style.width = `${progress}%`;
        document.getElementById('progress-bar').setAttribute('aria-valuenow', progress);
    }

    showQuizTip() {
        const tips = [
            '💡 Take your time and read each question carefully!',
            '🎯 Eliminate obviously wrong answers first!',
            '🧠 Trust your first instinct — it\'s often correct!',
            '⏱️ Keep an eye on the timer, but don\'t rush!',
            '🔥 Stay focused — you\'ve got this!',
            '💪 Every question is a chance to learn!',
            '🚀 You\'re doing great — keep going!',
            '✨ Confidence is key — believe in yourself!',
            '📖 Think back to what you learned earlier!',
            '🏆 Almost there — finish strong!'
        ];
        const tipEl = document.getElementById('quiz-tip-text');
        if (tipEl) {
            const randomTip = tips[Math.floor(Math.random() * tips.length)];
            tipEl.textContent = randomTip;
        }
    }

    showScoreboard() {
        this.resetTimer();

        // Clear saved state — quiz is complete
        clearQuizState();

        // Switch screens
        this.quizScreen.classList.remove('active');
        this.scoreboardScreen.classList.add('active');

        // Calculate stats
        const total = this.correctCount + this.wrongCount;
        const accuracy = total > 0 ? Math.round((this.correctCount / total) * 100) : 0;
        const avgTime = total > 0 ? Math.round(this.totalTime / total) : 0;

        // Performance tier
        let emoji, title, subtitle;
        if (accuracy >= 90) {
            emoji = '🏆'; title = 'Quiz Master!'; subtitle = 'Outstanding performance!';
        } else if (accuracy >= 70) {
            emoji = '🌟'; title = 'Great Job!'; subtitle = 'You really know your stuff!';
        } else if (accuracy >= 50) {
            emoji = '💪'; title = 'Good Effort!'; subtitle = 'Keep practicing to improve!';
        } else {
            emoji = '📚'; title = 'Keep Learning!'; subtitle = 'Review the topics and try again!';
        }

        document.getElementById('results-emoji').textContent = emoji;
        document.getElementById('results-title').textContent = title;
        document.getElementById('results-subtitle').textContent = subtitle;

        // Stats
        document.getElementById('final-accuracy').textContent = `${accuracy}%`;
        document.getElementById('final-time').textContent = formatTime(this.totalTime);
        document.getElementById('final-avg-time').textContent = `${avgTime}s`;
        document.getElementById('final-score').textContent = this.score;

        // Render answer review
        this.renderAnswerReview();
    }

    renderAnswerReview() {
        const container = document.getElementById('answer-review-list');
        container.innerHTML = '';

        this.userAnswers.forEach((answer, i) => {
            const q = this.questions[answer.questionIndex];
            const item = document.createElement('div');

            let statusClass, statusIcon, statusLabel;
            if (answer.timedOut) {
                statusClass = 'review-timeout';
                statusIcon = 'fas fa-clock';
                statusLabel = 'Timed Out';
            } else if (answer.isCorrect) {
                statusClass = 'review-correct';
                statusIcon = 'fas fa-check-circle';
                statusLabel = 'Correct';
            } else {
                statusClass = 'review-wrong';
                statusIcon = 'fas fa-times-circle';
                statusLabel = 'Wrong';
            }

            item.className = `review-item ${statusClass}`;
            item.innerHTML = `
                <div class="review-item-header">
                    <span class="review-q-number">Q${i + 1}</span>
                    <span class="review-status"><i class="${statusIcon}"></i> ${statusLabel}</span>
                </div>
                <p class="review-question-text">${q.question}</p>
                <div class="review-answers">
                    ${answer.timedOut ? '' : `<div class="review-answer your-answer ${answer.isCorrect ? 'is-correct' : 'is-wrong'}">
                        <span class="answer-label">Your Answer:</span> ${q.options[answer.selectedIndex]}
                    </div>`}
                    ${!answer.isCorrect ? `<div class="review-answer correct-answer">
                        <span class="answer-label">Correct:</span> ${q.options[q.correct]}
                    </div>` : ''}
                </div>
            `;

            container.appendChild(item);
        });
    }

    showWelcomeScreen() {
        this.resetTimer();
        clearQuizState();
        this.welcomeScreen.classList.add('active');
        this.learningScreen.classList.remove('active');
        this.quizScreen.classList.remove('active');
        this.scoreboardScreen.classList.remove('active');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.quizApp = new QuizApp();
});