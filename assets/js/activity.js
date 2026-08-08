document.addEventListener("DOMContentLoaded", function() {
    const submitBtn = document.getElementById("submitActivitiesBtn");
    
    // Base starting points matching HTML defaults
    const baseXP = 1250;
    const baseFP = 1200;
    
    if (!submitBtn) {
        console.error("Submit button #submitActivitiesBtn not found in the DOM.");
        return;
    }
    
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
});
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
});