const quotes = [
    { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
    { text: "Strength doesn't come from what you can do. It comes from overcoming what you once couldn't.", author: "Rikki Rogers" },
    { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
    { text: "Success starts with self-discipline.", author: "Unknown" }
];

let currentQuote = 0;

function renderQuote() {
    const textEl = document.getElementById('quote-text');
    const authorEl = document.getElementById('quote-author');
    if (!textEl || !authorEl) return;
    textEl.textContent = `"${quotes[currentQuote].text}"`;
    authorEl.textContent = `- ${quotes[currentQuote].author}`;
}

function nextQuote() {
    currentQuote = (currentQuote + 1) % quotes.length;
    renderQuote();
}

function prevQuote() {
    currentQuote = (currentQuote - 1 + quotes.length) % quotes.length;
    renderQuote();
}

document.addEventListener('DOMContentLoaded', () => {
    renderQuote();

    // Highlight the current page in the nav
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.main-nav a').forEach((link) => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });

    // Hero buttons: jump to featured programs / learn more
    const workoutBtn = document.getElementById('Workoutbtn');
    if (workoutBtn) {
        workoutBtn.addEventListener('click', () => {
            window.location.href = 'html/workoutTable.html';
        });
    }

    const searchBtn = document.getElementById('Searchbtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            document.querySelector('.features-section').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Login button placeholder
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const onHomePage = !window.location.pathname.includes('/html/');
            window.location.href = onHomePage ? 'html/joinus.html' : 'joinus.html';
        });
    }

    // Team flip cards (About Us page)
    document.querySelectorAll('.flip-card').forEach((card) => {
        card.addEventListener('click', () => {
            const flipped = card.classList.toggle('flipped');
            card.setAttribute('aria-pressed', String(flipped));
        });
    });
});