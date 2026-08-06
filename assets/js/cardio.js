// Flip Card Logic
document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', function () {        
        const isFlipped = this.getAttribute('aria-pressed') === 'true';
        this.setAttribute('aria-pressed', !isFlipped);
    });
});

// Random Daily Challenge Script
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
    document.getElementById('challenge-text').innerText = challenges[randomIndex];
}

// Simple Timer Logic
let timerInterval;
let seconds = 0;
let isRunning = false;

function toggleTimer() {
    const btn = document.getElementById('start-btn');
    if (isRunning) {
        clearInterval(timerInterval);
        btn.innerText = 'Start Timer';
        btn.classList.replace('btn-danger', 'btn-dark');
    } else {
        timerInterval = setInterval(() => {
            seconds++;
            let mins = Math.floor(seconds / 60);
            let secs = seconds % 60;
            document.getElementById('timer').innerText = 
            (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
        }, 1000);
        btn.innerText = 'Stop Timer';
        btn.classList.replace('btn-dark', 'btn-danger');
    }
    isRunning = !isRunning;
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    seconds = 0;
    document.getElementById('timer').innerText = "00:00";
    const btn = document.getElementById('start-btn');
    btn.innerText = 'Start Timer';
    btn.classList.replace('btn-danger', 'btn-dark');
}