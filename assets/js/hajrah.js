/*
 * hajrah.js — combined script for cardio.html, nutrition.html, tips.html
 * (companion to Hajrah.css). Everything is guarded with element checks,
 * so this one file can be safely loaded on all three pages even though
 * each page only uses some of it:
 *   - Flip cards: cardio, nutrition, tips
 *   - Daily challenge + workout timer: cardio only
 *   - Nutrition quiz: nutrition only
 */

/*
 * NUTRITION QUIZ
 * --------------
 * How this works, in plain terms:
 *
 * 1. `questions` below is just a list (an "array") of quiz questions.
 *    Each question is an object with:
 *      - text: the question itself
 *      - options: the 4 possible answers
 *      - correctIndex: which option (0, 1, 2, or 3) is the right one
 *        (arrays start counting at 0, so option "1" is index 0)
 *
 * 2. When the page loads, buildQuiz() reads that list and generates the
 *    HTML for each question automatically — so if you want to add a
 *    5th or 6th question later, you only ever edit the `questions` list
 *    below, never the HTML by hand.
 *
 * 3. When "Take Nutrition Quiz" is clicked, the quiz section (which starts
 *    hidden) is revealed and the page scrolls to it.
 *
 * 4. When "Submit Answers" is clicked, gradeQuiz() checks which radio
 *    button is selected for each question, compares it to correctIndex,
 *    and tallies up a score.
 */

const questions = [
    {
        text: "Which food group should make up the largest portion of your plate at most meals?",
        options: ["Refined grains", "Vegetables", "Fried foods", "Sugary drinks"],
        correctIndex: 1
    },
    {
        text: "About how many cups of water should the average adult drink daily?",
        options: ["1-2 cups", "3-4 cups", "6-8 cups", "15+ cups"],
        correctIndex: 2
    },
    {
        text: "Which of these is a lean protein source?",
        options: ["Grilled chicken breast", "Bacon", "Fried shrimp", "Processed sausage"],
        correctIndex: 0
    },
    {
        text: "What's a good strategy for portion control?",
        options: ["Eat straight from the bag or box", "Use a smaller plate", "Skip meals, then eat extra later", "Always finish everything on your plate"],
        correctIndex: 1
    },
    {
        text: "Which snack is the healthiest choice?",
        options: ["Candy bar", "Potato chips", "Apple with peanut butter", "Soda"],
        correctIndex: 2
    }
];

// Builds the quiz HTML from the `questions` list above and inserts it
// into the page (inside the element with id="quizQuestions")
function buildQuiz() {
    const container = document.getElementById('quizQuestions');
    if (!container) return;

    questions.forEach((q, questionIndex) => {
        const wrapper = document.createElement('fieldset');
        wrapper.className = 'mb-4';

        const legend = document.createElement('legend');
        legend.className = 'fs-6 fw-semibold';
        legend.textContent = `${questionIndex + 1}. ${q.text}`;
        wrapper.appendChild(legend);

        q.options.forEach((optionText, optionIndex) => {
            const optionWrapper = document.createElement('div');
            optionWrapper.className = 'form-check';

            const input = document.createElement('input');
            input.type = 'radio';
            input.className = 'form-check-input';
            input.name = `question-${questionIndex}`;   // same name = only one can be picked
            input.value = optionIndex;
            input.id = `q${questionIndex}-opt${optionIndex}`;

            const label = document.createElement('label');
            label.className = 'form-check-label';
            label.setAttribute('for', input.id);
            label.textContent = optionText;

            optionWrapper.appendChild(input);
            optionWrapper.appendChild(label);
            wrapper.appendChild(optionWrapper);
        });

        container.appendChild(wrapper);
    });
}

// Reveals the quiz section and scrolls to it
function startQuiz() {
    const quizSection = document.getElementById('quizSection');
    if (!quizSection) return;
    quizSection.classList.remove('d-none');
    quizSection.scrollIntoView({ behavior: 'smooth' });
}

// Reads the selected answers, scores them, and shows a result message
function gradeQuiz() {
    let score = 0;
    let unanswered = 0;

    questions.forEach((q, questionIndex) => {
        const selected = document.querySelector(`input[name="question-${questionIndex}"]:checked`);
        if (!selected) {
            unanswered++;
            return;
        }
        if (Number(selected.value) === q.correctIndex) {
            score++;
        }
    });

    const resultBox = document.getElementById('quizResult');
    if (!resultBox) return;

    if (unanswered > 0) {
        resultBox.className = 'alert alert-warning mt-3';
        resultBox.textContent = `Please answer all questions before submitting (${unanswered} left).`;
        resultBox.classList.remove('d-none');
        return;
    }

    let message;
    if (score === questions.length) {
        message = `Perfect score! ${score}/${questions.length} — you know your nutrition basics.`;
    } else if (score >= questions.length - 2) {
        message = `Nice work — ${score}/${questions.length}. Pretty solid grasp of the basics.`;
    } else {
        message = `You got ${score}/${questions.length}. Worth a re-read of the Dietary Guidelines above!`;
    }

    resultBox.className = 'alert alert-success mt-3';
    resultBox.textContent = message;
    resultBox.classList.remove('d-none');
}

// --- CARDIO: Daily Challenge (random generator) ---
const challenges = [
    "Walk 5,000 steps today!",
    "Perform 30 minutes of brisk cycling.",
    "Complete 3 rounds of 1-minute jump rope.",
    "Try a 15-minute HIIT session.",
    "Take a 20-minute power walk after dinner.",
    "Climb 10 flights of stairs today!"
];

function generateChallenge() {
    const randomIndex = Math.floor(Math.random() * challenges.length);
    const challengeText = document.getElementById('challenge-text');
    if (challengeText) {
        challengeText.innerText = challenges[randomIndex];
    }
}

// --- CARDIO: Workout Timer ---
let timerInterval = null;
let seconds = 0;
let isRunning = false;

function toggleTimer() {
    const startBtn = document.getElementById('start-btn');

    if (isRunning) {
        clearInterval(timerInterval);
        if (startBtn) {
            startBtn.innerText = 'Start Timer';
            startBtn.classList.replace('btn-danger', 'btn-dark');
        }
    } else {
        timerInterval = setInterval(() => {
            seconds++;
            let mins = Math.floor(seconds / 60);
            let secs = seconds % 60;
            const timerDisplay = document.getElementById('timer');
            if (timerDisplay) {
                timerDisplay.innerText =
                    (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
            }
        }, 1000);
        if (startBtn) {
            startBtn.innerText = 'Stop Timer';
            startBtn.classList.replace('btn-dark', 'btn-danger');
        }
    }
    isRunning = !isRunning;
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    seconds = 0;
    const timerDisplay = document.getElementById('timer');
    if (timerDisplay) {
        timerDisplay.innerText = "00:00";
    }
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.innerText = 'Start Timer';
        startBtn.classList.replace('btn-danger', 'btn-dark');
    }
}

// --- Wire everything up once the page has finished loading ---
document.addEventListener('DOMContentLoaded', () => {

    // Shared: Flip Card Interaction (cardio, nutrition, tips) — one listener,
    // not duplicated per page.
    document.querySelectorAll('.flip-card').forEach(card => {
        card.addEventListener('click', function () {
            this.classList.toggle('flipped');
            const isFlipped = this.classList.contains('flipped');
            this.setAttribute('aria-pressed', isFlipped);
        });
    });

    // Cardio-only: Daily Challenge button
    const challengeBtn = document.getElementById('new-challenge-btn');
    if (challengeBtn) {
        challengeBtn.addEventListener('click', generateChallenge);
    }

    // Cardio-only: Workout Timer buttons
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    if (startBtn) {
        startBtn.addEventListener('click', toggleTimer);
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', resetTimer);
    }

    // Nutrition-only: quiz
    buildQuiz();
    document.getElementById('startQuizBtn')?.addEventListener('click', startQuiz);
    document.getElementById('submitQuizBtn')?.addEventListener('click', gradeQuiz);
});