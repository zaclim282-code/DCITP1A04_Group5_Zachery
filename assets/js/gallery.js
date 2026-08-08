// --- GALLERY FILTERING LOGIC ---
function filterGallery(category, clickedButton) {
    // 1. Reset active styling on all buttons
    let buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(function(btn) {
        btn.classList.remove('active');
        btn.classList.add('bg-white', 'text-dark');
    });

    // 2. Add active styling to the clicked button
    clickedButton.classList.add('active');
    clickedButton.classList.remove('bg-white', 'text-dark');

    // 3. Show/Hide gallery items using Bootstrap's d-none class
    let items = document.querySelectorAll('.gallery-item');
    items.forEach(function(item) {
        if (category === 'all') {
            item.classList.remove('d-none');
        } else if (item.classList.contains(category)) {
            item.classList.remove('d-none');
        } else {
            item.classList.add('d-none');
        }
    });
}
    
// --- MAIN INITIALIZATION ON DOM LOAD ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Render initial daily motivation quote (requires main.js to have this function)
    if (typeof renderQuote === "function") {
        renderQuote();
    }

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

        text.setAttribute('tabindex', '0');
        text.setAttribute('role', 'button');
        text.setAttribute('aria-expanded', 'false');

        function toggle() {
            const wasOpen = items.classList.contains('active');
            closeAllDropdowns();
            if (!wasOpen) {
                items.classList.add('active');
                dropdown.classList.add('open'); 
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
            window.location.href = 'workoutTable.html';
        });
    }

    const searchBtn = document.getElementById('Searchbtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const featuresSec = document.querySelector('.features-section');
            if(featuresSec) featuresSec.scrollIntoView({ behavior: 'smooth' });
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