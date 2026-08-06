
  // assets/js/beginnerworkout.js
document.addEventListener('DOMContentLoaded', function () {
  const viewAllBtn = document.getElementById('viewAllBtn');
  const extraWorkouts = document.getElementById('extraWorkouts');

  if (!viewAllBtn || !extraWorkouts) return;

  viewAllBtn.addEventListener('click', function () {
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
});