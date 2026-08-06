<script>
    document.addEventListener("DOMContentLoaded", function() {
        const submitBtn = document.getElementById('submitActivitiesBtn');
        const xpDisplay = document.getElementById('xpCount');
        const fpDisplay = document.getElementById('fpCount');
        
        // Base values from wireframe
        let currentXP = 1250;
        let currentFP = 1200;

        submitBtn.addEventListener('click', function() {
            const checkboxes = document.querySelectorAll('.activity-cb');
            let pointsEarned = 0;

            checkboxes.forEach(function(checkbox) {
                if (checkbox.checked && !checkbox.disabled) {
                    pointsEarned += parseInt(checkbox.value); // 50 XP per activity
                    checkbox.disabled = true; // Disable after submission to prevent spam
                }
            });

            if (pointsEarned > 0) {
                // Update totals
                currentXP += pointsEarned;
                currentFP += pointsEarned; // 1:1 conversion rate

                // Animate/Update the DOM
                xpDisplay.innerText = currentXP.toLocaleString() + " XP";
                fpDisplay.innerText = currentFP.toLocaleString() + " FP";
                
                alert(`Great job! You earned ${pointsEarned} XP and FitPoly Points!`);
            } else {
                alert("Please complete and select at least one new activity to submit.");
            }
        });
    });