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

// Wire everything up once the page has finished loading
document.addEventListener('DOMContentLoaded', () => {
    buildQuiz();

    document.getElementById('startQuizBtn')?.addEventListener('click', startQuiz);
    document.getElementById('submitQuizBtn')?.addEventListener('click', gradeQuiz);

    // Note: meal-card flip behavior is handled by main.js (loaded before
    // this file) — it already attaches a click listener to every
    // .flip-card on the page, so it doesn't need to be duplicated here.
});