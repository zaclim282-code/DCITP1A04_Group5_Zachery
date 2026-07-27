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

    // Highlight the current page in the nav (covers top-level links and
    // links tucked inside a dropdown category)
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.main-nav a').forEach((link) => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath) {
            link.classList.add('active');
            const parentDropdown = link.closest('.dropdown');
            if (parentDropdown) {
                parentDropdown.querySelector('.dropdown-toggle')?.classList.add('active');
            }
        }
    });

    // Dropdown categories.
    // Note: CSS `:hover` is intentionally NOT used to trigger these menus.
    // Since the menus (210px) are wider than the gaps between nav items,
    // their boxes overlap on screen — and `:hover` matches per-element
    // geometry regardless of stacking, so a pure-CSS approach opens several
    // overlapping menus at once. Real mouse events use proper hit-testing
    // (only the topmost element under the pointer responds), so we drive
    // everything from JS and keep a single source of truth: the "open" class.
    const dropdowns = document.querySelectorAll('.main-nav .dropdown');
    const hoverCapable = window.matchMedia('(hover: hover)').matches;

    function openDropdown(target) {
        dropdowns.forEach((d) => {
            if (d !== target) d.classList.remove('open');
        });
        target.classList.add('open');
    }

    function closeDropdown(target) {
        target.classList.remove('open');
    }

    dropdowns.forEach((dropdown) => {
        const toggle = dropdown.querySelector('.dropdown-toggle');

        if (hoverCapable) {
            dropdown.addEventListener('mouseenter', () => openDropdown(dropdown));
            dropdown.addEventListener('mouseleave', () => closeDropdown(dropdown));
        }

        // Click/tap always works too, so touch and keyboard users aren't left out
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const wasOpen = dropdown.classList.contains('open');
            wasOpen ? closeDropdown(dropdown) : openDropdown(dropdown);
        });
    });

    // Close open dropdowns when clicking anywhere outside the nav
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.main-nav')) {
            dropdowns.forEach((d) => closeDropdown(d));
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

    // Login button
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