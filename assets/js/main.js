// --- QUOTE CAROUSEL DATA & FUNCTIONS ---
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

// --- MAIN INITIALIZATION ON DOM LOAD ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Render initial daily motivation quote
    renderQuote();

    // 2. Highlight current active link in navigation
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.main-nav a').forEach((link) => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath) {
            link.classList.add('active');
            const parentDropdown = link.closest('.dropdown');
            if (parentDropdown) {
                parentDropdown.querySelector('.dropdownText')?.classList.add('active');
            }
        }
    });

    // 3. Dropdown categories logic (click/tap only, one open at a time)
    const dropdowns = document.querySelectorAll('.main-nav .dropdown');

    function closeAllDropdowns() {
        dropdowns.forEach((d) => {
            d.querySelector('.dropdownItems')?.classList.remove('active');
            d.classList.remove('open');
        });
        document.querySelectorAll('.dropdownText').forEach((t) => t.setAttribute('aria-expanded', 'false'));
    }

    dropdowns.forEach((dropdown) => {
        const text = dropdown.querySelector('.dropdownText');
        const items = dropdown.querySelector('.dropdownItems');
        if (!text || !items) return;

        // Make toggle accessible for keyboard navigation
        text.setAttribute('tabindex', '0');
        text.setAttribute('role', 'button');
        text.setAttribute('aria-expanded', 'false');

        function toggle() {
            const wasOpen = items.classList.contains('active');
            closeAllDropdowns();
            if (!wasOpen) {
                items.classList.add('active');
                dropdown.classList.add('open'); // Drives arrow rotation in CSS
                text.setAttribute('aria-expanded', 'true');
            }
        }

        text.addEventListener('click', (e) => {
            e.stopPropagation();
            toggle();
        });

        text.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle();
            }
        });
    });

    // Close open dropdowns when clicking outside nav
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            closeAllDropdowns();
        }
    });

    // 4. Hero section button event listeners
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

    // 5. Header Login/Join button listener
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const onHomePage = !window.location.pathname.includes('/html/');
            window.location.href = onHomePage ? 'html/joinus.html' : 'joinus.html';
        });
    }

    // 6. Flip card interaction for About Us page
    document.querySelectorAll('.flip-card').forEach((card) => {
        card.addEventListener('click', () => {
            const flipped = card.classList.toggle('flipped');
            card.setAttribute('aria-pressed', String(flipped));
        });
    });
});