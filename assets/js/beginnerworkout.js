
  const viewAllBtn = document.getElementById('viewAllBtn');
  const extraWorkouts = document.getElementById('extraWorkouts');

  viewAllBtn.addEventListener('click', () => {
    const isHidden = extraWorkouts.style.display === 'none';

    if (isHidden) {
      extraWorkouts.style.display = 'grid';
      viewAllBtn.textContent = 'Show Less';
      viewAllBtn.setAttribute('aria-expanded', 'true');
      extraWorkouts.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      extraWorkouts.style.display = 'none';
      viewAllBtn.textContent = 'View All Beginner Workouts';
      viewAllBtn.setAttribute('aria-expanded', 'false');
    }
  });
