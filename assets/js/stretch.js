function filterCategory(category, clickedElement) {
        // 1. Reset buttons
        let allButtons = document.querySelectorAll('.filter-btn');
        allButtons.forEach(function(btn) {
            btn.classList.remove('active');
        });
        
        // Make clicked button active
        clickedElement.classList.add('active');

        // 2. Grab our exact cards
        let warmupCard = document.getElementById('card-warmup');
        let cooldownCard = document.getElementById('card-cooldown');

        // 3. Add Bootstrap's invisible 'd-none' class to BOTH cards first to clear the screen
        warmupCard.classList.add('d-none');
        cooldownCard.classList.add('d-none');

        // 4. Remove 'd-none' from the ONE card we want to show
        if (category === 'warm-up') {
            warmupCard.classList.remove('d-none');
        } else if (category === 'cool-down') {
            cooldownCard.classList.remove('d-none');
        }
    }