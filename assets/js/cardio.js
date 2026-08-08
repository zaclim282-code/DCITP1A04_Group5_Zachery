document.addEventListener('DOMContentLoaded', () => {
    // 1. Flip Card Interaction Logic
    document.querySelectorAll('.flip-card').forEach(card => {
        card.addEventListener('click', function () {
            this.classList.toggle('flipped');
            const isFlipped = this.classList.contains('flipped');
            this.setAttribute('aria-pressed', isFlipped);
        });
    });

    // 2. Random Daily Challenge Script
    const challenges = [
        "Walk 5,000 steps today!",
        "Perform 30 minutes of brisk cycling.",
        "Complete 3 rounds of 1-minute jump rope.",
        "Try a 15-minute HIIT session.",
        "Take a 20-minute power walk after dinner.",
        "Climb 10 flights of stairs today!"
    ];

    const challengeBtn = document.getElementById('new-challenge-btn');
    if (challengeBtn) {
        challengeBtn.addEventListener('click', generateChallenge);
    }

    function generateChallenge() {
        const randomIndex = Math.floor(Math.random() * challenges.length);
        const challengeText = document.getElementById('challenge-text');
        if (challengeText) {
            challengeText.innerText = challenges[randomIndex];
        }
    }

    // 3. Workout Timer Logic
    let timerInterval = null;
    let seconds = 0;
    let isRunning = false;

    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');

    if (startBtn) {
        startBtn.addEventListener('click', toggleTimer);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', resetTimer);
    }

    function toggleTimer() {
        if (isRunning) {
            clearInterval(timerInterval);
            startBtn.innerText = 'Start Timer';
            startBtn.classList.replace('btn-danger', 'btn-dark');
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
            startBtn.innerText = 'Stop Timer';
            startBtn.classList.replace('btn-dark', 'btn-danger');
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
        if (startBtn) {
            startBtn.innerText = 'Start Timer';
            startBtn.classList.replace('btn-danger', 'btn-dark');
        }
    }
});