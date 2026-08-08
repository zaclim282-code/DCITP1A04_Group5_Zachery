
function filterCategory(category, clickedButton) {
    // 1. Remove the 'active' styling from all buttons
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // 2. Add the 'active' styling to the button you just clicked
    clickedButton.classList.add('active');

    // 3. Hide both cards by adding Bootstrap's 'd-none' class
    document.getElementById('card-warmup').classList.add('d-none');
    document.getElementById('card-cooldown').classList.add('d-none');

    // 4. Show the correct card based on the category passed in
    if (category === 'warm-up') {
        document.getElementById('card-warmup').classList.remove('d-none');
    } else if (category === 'cool-down') {
        document.getElementById('card-cooldown').classList.remove('d-none');
    }
}