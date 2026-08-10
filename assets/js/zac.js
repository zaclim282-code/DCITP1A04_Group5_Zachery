// zac.js — combined script for index.html, connect.html, beginner.html
// Sections: shared (nav/dropdown/flip-card, runs everywhere) → index-only
// (quote carousel, hero buttons) → beginner-only (view all toggle) →
// connect-only (join form validation)

document.addEventListener('DOMContentLoaded', () => {

    /* ================= Shared: active nav link highlighting ================= */
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

    /* ================= Shared: dropdown categories (click/tap, one open at a time) ================= */
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

        text.setAttribute('tabindex', '0');
        text.setAttribute('role', 'button');
        text.setAttribute('aria-expanded', 'false');

        function toggle() {
            const wasOpen = items.classList.contains('active');
            closeAllDropdowns();
            if (!wasOpen) {
                items.classList.add('active');
                dropdown.classList.add('open'); // drives arrow rotation in CSS
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

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            closeAllDropdowns();
        }
    });

    /* ================= Shared: header Login/Join button ================= */
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const onHomePage = !window.location.pathname.includes('/html/');
            window.location.href = onHomePage ? 'html/joinus.html' : 'joinus.html';
        });
    }

    /* ================= Shared: flip-card click-to-flip ================= */
    document.querySelectorAll('.flip-card').forEach((card) => {
        card.addEventListener('click', () => {
            const flipped = card.classList.toggle('flipped');
            card.setAttribute('aria-pressed', String(flipped));
        });
    });

    /* ================= Index-only: motivation quote carousel ================= */
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

    // expose for any inline onclick="nextQuote()" / prevQuote() handlers in the HTML
    window.nextQuote = nextQuote;
    window.prevQuote = prevQuote;

    renderQuote(); // no-ops harmlessly on pages without #quote-text

    /* ================= Index-only: hero section buttons ================= */
    const workoutBtn = document.getElementById('Workoutbtn');
    if (workoutBtn) {
        workoutBtn.addEventListener('click', () => {
            window.location.href = 'html/workoutTable.html';
        });
    }

    const searchBtn = document.getElementById('Searchbtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            document.querySelector('.features-section')?.scrollIntoView({ behavior: 'smooth' });
        });
    }

    /* ================= Beginner-only: "View All Beginner Workouts" toggle ================= */
    const viewAllBtn = document.getElementById('viewAllBtn');
    const extraWorkouts = document.getElementById('extraWorkouts');

    if (viewAllBtn && extraWorkouts) {
        viewAllBtn.addEventListener('click', () => {
            const isHidden = extraWorkouts.style.display === 'none' || extraWorkouts.style.display === '';

            if (isHidden) {
                extraWorkouts.style.display = 'grid'; // matches .workout-grid's display type
                viewAllBtn.textContent = 'Hide Beginner Workouts';
                viewAllBtn.setAttribute('aria-expanded', 'true');
            } else {
                extraWorkouts.style.display = 'none';
                viewAllBtn.textContent = 'View All Beginner Workouts';
                viewAllBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* ================= Connect-only: join form validation ================= */
    const joinForm = document.getElementById('joinForm');
    const countryCode = document.getElementById('countryCode');
    const phoneInput = document.getElementById('phoneNumber');
    const phoneHint = document.getElementById('phoneHint');
    const phoneError = document.getElementById('phoneError');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const joinAlert = document.getElementById('joinAlert');

    if (joinForm && countryCode && phoneInput && phoneHint && phoneError && emailInput && emailError) {

        function updatePhoneHint() {
            const opt = countryCode.selectedOptions[0];
            const digits = opt.dataset.digits.split(',').join(' or ');
            phoneHint.textContent = `${opt.textContent.trim()} numbers must be ${digits} digits.`;
        }

        function isValidPhone() {
            const digitsOnly = phoneInput.value.replace(/\D/g, '');
            const allowedLengths = countryCode.selectedOptions[0].dataset.digits.split(',').map(Number);
            const valid = allowedLengths.includes(digitsOnly.length);

            phoneInput.setCustomValidity(valid ? '' : 'Invalid phone number length');
            phoneError.textContent = valid
                ? ''
                : `Enter a valid number (${allowedLengths.join(' or ')} digits) for ${countryCode.value}.`;

            return valid;
        }

        function isValidEmail() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const valid = emailRegex.test(emailInput.value.trim());

            emailInput.setCustomValidity(valid ? '' : 'Invalid email address');
            emailError.textContent = valid
                ? ''
                : 'Email must include "@" and a domain, e.g. name@example.com';

            return valid;
        }

        countryCode.addEventListener('change', () => {
            updatePhoneHint();
            isValidPhone();
        });
        updatePhoneHint(); // run once on load

        phoneInput.addEventListener('input', () => {
            if (phoneInput.classList.contains('is-invalid') || joinForm.classList.contains('was-validated')) {
                isValidPhone();
            }
        });

        emailInput.addEventListener('input', () => {
            if (emailInput.classList.contains('is-invalid') || joinForm.classList.contains('was-validated')) {
                isValidEmail();
            }
        });

        joinForm.addEventListener('submit', function (e) {
            e.preventDefault();

            isValidEmail();
            isValidPhone();

            if (!this.checkValidity()) {
                this.classList.add('was-validated');
                return;
            }

            if (joinAlert) joinAlert.style.display = 'flex';
            this.reset();
            this.classList.remove('was-validated');
            countryCode.selectedIndex = 0;
            updatePhoneHint();
        });
    }

});