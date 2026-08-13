// --- yuxi.js ---
// Combined script for gallery.html, stretchingandflexibility.html, and
// mainActivity.html. All three source files carried their own copy of the
// shared nav/dropdown/hero/login/flip-card boilerplate — that's collapsed
// into one copy here, run once on DOMContentLoaded, followed by each page's
// unique logic (gallery filter / stretch filter / activity tracker).

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

// --- STRETCH & FLEXIBILITY: warm-up / cool-down filter ---
function filterCategory(category, clickedButton) {
    // 1. Remove the 'active' styling from all buttons
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // 2. Add the 'active' styling to the button you just clicked
    clickedButton.classList.add('active');

    // 3. Hide both cards by adding Bootstrap's 'd-none' class
    document.getElementById('card-warmup')?.classList.add('d-none');
    document.getElementById('card-cooldown')?.classList.add('d-none');

    // 4. Show the correct card based on the category passed in
    if (category === 'warm-up') {
        document.getElementById('card-warmup')?.classList.remove('d-none');
    } else if (category === 'cool-down') {
        document.getElementById('card-cooldown')?.classList.remove('d-none');
    }
}

// expose so inline onclick="filterGallery(...)" / onclick="filterCategory(...)" in the HTML can reach them
window.filterGallery = filterGallery;
window.filterCategory = filterCategory;

// --- ACTIVITY TRACKER: XP/FP counters + achievements ---
function initActivityTracker() {
    const submitBtn = document.getElementById("submitActivitiesBtn");
    if (!submitBtn) return;

    // Base starting points matching HTML defaults
    const baseXP = 1250;
    const baseFP = 1200;

    submitBtn.addEventListener("click", function() {
        // 1. Get checkbox states safely
        const task1 = document.getElementById("task1")?.checked || false; // Walk
        const task2 = document.getElementById("task2")?.checked || false; // Water
        const task3 = document.getElementById("task3")?.checked || false; // Push-ups
        const task4 = document.getElementById("task4")?.checked || false; // Meal
        const task5 = document.getElementById("task5")?.checked || false; // Stretch

        // 2. Calculate newly earned points (50 per checked task)
        const completedTasks = [task1, task2, task3, task4, task5].filter(Boolean).length;
        const currentXP = baseXP + (completedTasks * 50);
        const currentFP = baseFP + (completedTasks * 50);

        // 3. Update top UI counters dynamically
        const xpElement = document.getElementById("xpCount");
        const fpElement = document.getElementById("fpCount");

        if (xpElement) xpElement.textContent = currentXP.toLocaleString() + " XP";
        if (fpElement) fpElement.textContent = currentFP.toLocaleString() + " FP";

        // Add a brief color pop to show it updated
        if (completedTasks > 0) {
            if (xpElement) xpElement.classList.add("text-success");
            if (fpElement) fpElement.classList.add("text-success");

            setTimeout(() => {
                if (xpElement) xpElement.classList.remove("text-success");
                if (fpElement) fpElement.classList.remove("text-success");
            }, 1000);
        }

        // 4. Trigger Advanced Achievements logic

        // Achievement 1: Daily Conqueror (All 5 tasks completed)
        const allCompleted = (completedTasks === 5);
        toggleAchievement("ach-daily", "icon-daily", allCompleted, "text-warning");

        // Achievement 2: XP Master (Reach 1,500 Total XP)
        const isXPMaster = (currentXP >= 1500);
        toggleAchievement("ach-xp", "icon-xp", isXPMaster, "text-primary");

        // Achievement 3: Iron Will (Physical tasks: Walk, Push-ups, Stretch -> task1, task3, task5)
        const isIronWill = (task1 && task3 && task5);
        toggleAchievement("ach-iron", "icon-iron", isIronWill, "text-danger");

        // Achievement 4: Health Nut (Diet tasks: Water, Meal -> task2, task4)
        const isHealthNut = (task2 && task4);
        toggleAchievement("ach-health", "icon-health", isHealthNut, "text-success");
    });

    // Helper function to lock/unlock achievement UI safely
    function toggleAchievement(rowId, iconId, isUnlocked, activeColorClass) {
        const rowElem = document.getElementById(rowId);
        const iconElem = document.getElementById(iconId);

        if (!rowElem || !iconElem) {
            console.warn(`Could not find achievement elements for ID: ${rowId} or ${iconId}`);
            return;
        }

        if (isUnlocked) {
            // Remove grey-out effect, add active color
            rowElem.classList.remove("opacity-50");
            iconElem.classList.remove("text-secondary");
            iconElem.classList.add(activeColorClass);
        } else {
            // Re-apply grey-out effect, remove active color
            rowElem.classList.add("opacity-50");
            iconElem.classList.add("text-secondary");
            iconElem.classList.remove(activeColorClass);
        }
    }
}

// --- SHARED: nav highlighting, dropdowns, hero buttons, login button, flip cards ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Render initial daily motivation quote, if main.js/rex.js's carousel is loaded on this page
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
            const featuresSec = document.querySelector('.features-section');
            if (featuresSec) featuresSec.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // 6. Flip card interaction (e.g. About Us page)
    document.querySelectorAll('.flip-card').forEach((card) => {
        card.addEventListener('click', () => {
            const flipped = card.classList.toggle('flipped');
            card.setAttribute('aria-pressed', String(flipped));
        });
    });

    // 7. Activity tracker (only wires up if #submitActivitiesBtn exists on this page)
    initActivityTracker();
});