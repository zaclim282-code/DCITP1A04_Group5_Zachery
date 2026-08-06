 function filterGallery(category, clickedButton) {
        // 1. Reset active styling on all buttons
        let buttons = document.querySelectorAll('.filter-btn');
        buttons.forEach(function(btn) {
            btn.classList.remove('active');
            btn.classList.add('bg-white');
        });

        // 2. Add active styling to the clicked button
        clickedButton.classList.add('active');
        clickedButton.classList.remove('bg-white');

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