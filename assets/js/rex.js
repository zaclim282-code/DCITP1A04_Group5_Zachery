/* ============================================================
   SPFIT — main.js
   Small, page-aware script. Every init function checks for its
   own elements first, so this one file can be safely included
   on every page.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  initFlipCards();
  initFilterButtons();
  initStrengthQuiz();
  initExerciseDetails();
  initWorkoutPlanner();
});

/* ---------- About page: flip cards ---------- */
function initFlipCards() {
  document.querySelectorAll('.flip-card').forEach(function (card) {
    card.addEventListener('click', function () {
      card.classList.toggle('flipped');
    });
  });
}

/* ---------- Strength page: filter pills ---------- */
function initFilterButtons() {
  var buttons = document.querySelectorAll('.filter-btn');
  var cols = document.querySelectorAll('.exercise-col');
  if (!buttons.length || !cols.length) return;

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.dataset.filter;
      cols.forEach(function (col) {
        var card = col.querySelector('.exercise-card');
        var match = filter === 'all' || card.dataset.category === filter;
        col.style.display = match ? '' : 'none';
      });
    });
  });
}

/* ---------- Strength page: "Find Your Focus" quiz ---------- */
function initStrengthQuiz() {
  var form = document.getElementById('strengthQuiz');
  var resultBox = document.getElementById('quizResult');
  if (!form || !resultBox) return;

  var FOCUS_COPY = {
    upper: {
      title: 'Your focus: Upper Body',
      text: 'Start with Barbell Bench Press, Lat Pulldown, and Barbell Overhead Press. Two or three sessions a week will build the pressing and pulling strength you need for daily tasks.'
    },
    lower: {
      title: 'Your focus: Lower Body',
      text: 'Start with Barbell Back Squat, Leg Press, and Romanian Deadlift. Strong legs make standing, stairs, and walking noticeably easier.'
    },
    core: {
      title: 'Your focus: Core',
      text: 'Start with Cable Woodchopper, Hanging Leg Raise, and Decline Weighted Sit-Up. A stable core protects your back and improves balance in everything else you do.'
    }
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var answers = [form.q1.value, form.q2.value, form.q3.value].filter(Boolean);

    resultBox.classList.remove('d-none');
    resultBox.classList.add('mt-4', 'p-3', 'rounded-3');

    if (answers.length < 3) {
      resultBox.innerHTML = '<p class="mb-0 fw-semibold">Please answer all three questions to see your focus.</p>';
      return;
    }

    var counts = { upper: 0, lower: 0, core: 0 };
    answers.forEach(function (a) { counts[a]++; });
    var winner = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; })[0];
    var copy = FOCUS_COPY[winner];

    resultBox.innerHTML =
      '<h5 class="mb-1" style="color:var(--accent-700);">' + copy.title + '</h5>' +
      '<p class="mb-0 text-secondary">' + copy.text + '</p>';

    var targetBtn = document.querySelector('.filter-btn[data-filter="' + winner + '"]');
    if (targetBtn) targetBtn.click();

    resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

/* ---------- Strength page: exercise detail modal ---------- */
var EXERCISE_DETAILS = {
  benchpress: {
    name: 'Barbell Bench Press',
    muscles: 'Chest, shoulders, and triceps',
    benefits: [
      'Builds raw upper-body pressing strength with progressive overload',
      'Trains the shoulders and triceps alongside the chest',
      'One of the most measurable lifts for tracking strength gains'
    ],
    mistakes: [
      'Bouncing the bar off the chest instead of controlling it',
      'Flaring the elbows out to 90 degrees instead of tucking slightly',
      'Lifting the hips off the bench to help drive the bar up'
    ],
    cue: 'Keep your feet planted, shoulder blades pinched together, and lower the bar to the same spot on your chest every rep.'
  },
  latpulldown: {
    name: 'Lat Pulldown',
    muscles: 'Lats, upper back, and biceps',
    benefits: [
      'Builds pulling strength before progressing to pull-ups',
      'Improves posture by strengthening the upper back',
      'Adjustable weight makes it easy to scale to your level'
    ],
    mistakes: [
      'Leaning back too far and turning it into a rowing motion',
      'Using momentum to yank the bar down instead of a controlled pull',
      'Not letting the bar rise all the way back up between reps'
    ],
    cue: 'Drive your elbows down and back, and imagine pulling with your back muscles rather than just your hands.'
  },
  barbellshoulderpress: {
    name: 'Barbell Overhead Press',
    muscles: 'Shoulders, triceps, and upper chest',
    benefits: [
      'Builds full overhead strength for lifting and reaching',
      'Strengthens the shoulder stabilizers and upper back',
      'Carries over to almost every other pressing movement'
    ],
    mistakes: [
      'Arching the lower back to help the bar up',
      'Pressing the bar forward instead of straight overhead',
      'Starting the bar in front of the shoulders instead of racked on them'
    ],
    cue: 'Brace your core hard, squeeze your glutes, and press the bar in a straight line right past your face.'
  },
  backsquat: {
    name: 'Barbell Back Squat',
    muscles: 'Quads, glutes, hamstrings, and core',
    benefits: [
      'Foundational barbell movement for total lower-body strength',
      'Builds core stability from carrying load on your back',
      'Directly transfers to sitting, standing, and everyday strength'
    ],
    mistakes: [
      'Letting the knees cave inward on the way up',
      'Losing a neutral spine and rounding the lower back at the bottom',
      'Not reaching consistent depth rep to rep'
    ],
    cue: 'Brace your core before you unrack the bar, and sit your hips back and down like you\u2019re sitting into a low chair.'
  },
  legpress: {
    name: 'Leg Press',
    muscles: 'Quads, glutes, and hamstrings',
    benefits: [
      'Lets you load the legs heavily with less balance demand than squats',
      'Machine-guided path makes it easier to isolate the legs',
      'Good option when the lower back needs a break from barbell work'
    ],
    mistakes: [
      'Locking the knees out hard at the top of each rep',
      'Letting the lower back round and lift off the pad',
      'Placing the feet too low on the platform, overloading the knees'
    ],
    cue: 'Keep your lower back pressed into the pad the whole time and stop just short of locking your knees out.'
  },
  romaniandeadlift: {
    name: 'Romanian Deadlift',
    muscles: 'Hamstrings, glutes, and lower back',
    benefits: [
      'Builds the hamstrings and glutes through a deep stretch',
      'Teaches a strong, safe hip hinge pattern',
      'Complements squats by targeting the back of the legs'
    ],
    mistakes: [
      'Rounding the lower back instead of hinging with a flat spine',
      'Bending the knees too much and turning it into a squat',
      'Letting the bar drift away from the legs as it lowers'
    ],
    cue: 'Push your hips back first, keep the bar brushing your legs, and stop once you feel a stretch in your hamstrings.'
  },
  cablewoodchop: {
    name: 'Cable Woodchopper',
    muscles: 'Obliques, core, and hips',
    benefits: [
      'Trains rotational core strength used in sports and daily movement',
      'Builds control through the whole torso, not just the front abs',
      'Easy to adjust resistance as you get stronger'
    ],
    mistakes: [
      'Pulling with just the arms instead of rotating through the torso',
      'Letting the hips spin instead of staying grounded through the legs',
      'Moving too fast and losing control of the cable'
    ],
    cue: 'Rotate from your ribcage and hips together, keeping your arms relatively straight throughout the pull.'
  },
  hanginglegraise: {
    name: 'Hanging Leg Raise',
    muscles: 'Lower abs, hip flexors, and grip',
    benefits: [
      'Targets the lower abs more directly than floor-based core work',
      'Builds grip and shoulder stability as a side benefit',
      'Scalable from bent knees to fully straight legs'
    ],
    mistakes: [
      'Swinging the body to generate momentum instead of using the abs',
      'Only lifting the legs partway before lowering',
      'Arching the lower back at the top of the movement'
    ],
    cue: 'Curl your pelvis up and under you rather than just kicking your legs forward.'
  },
  declinesitup: {
    name: 'Decline Weighted Sit-Up',
    muscles: 'Rectus abdominis (front abs) and hip flexors',
    benefits: [
      'Adds resistance to a classic movement for continued progress',
      'Builds strength through a longer range of motion than a floor sit-up',
      'Easy to scale by changing the plate weight or bench angle'
    ],
    mistakes: [
      'Pulling on the neck to generate momentum',
      'Using the hip flexors to yank the torso up instead of curling through the spine',
      'Choosing a plate that\u2019s too heavy and sacrificing control'
    ],
    cue: 'Curl up one vertebra at a time, exhaling as you rise, and lower back down just as slowly.'
  }
};

function initExerciseDetails() {
  var modalEl = document.getElementById('exerciseModal');
  var titleEl = document.getElementById('exerciseModalLabel');
  var bodyEl = document.getElementById('exerciseModalBody');
  var buttons = document.querySelectorAll('.detail-btn');
  if (!modalEl || !titleEl || !bodyEl || !buttons.length) return;

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.dataset.exercise;
      var d = EXERCISE_DETAILS[key];
      if (!d) return;

      titleEl.textContent = d.name;
      bodyEl.innerHTML =
        '<p class="fw-semibold mb-1" style="color:var(--accent-700);">Muscles Worked</p>' +
        '<p class="text-secondary">' + d.muscles + '</p>' +
        '<p class="fw-semibold mb-1" style="color:var(--accent-700);">Benefits</p>' +
        '<ul class="text-secondary">' + d.benefits.map(function (b) { return '<li>' + b + '</li>'; }).join('') + '</ul>' +
        '<p class="fw-semibold mb-1" style="color:var(--accent-700);">Common Mistakes</p>' +
        '<ul class="text-secondary mb-3">' + d.mistakes.map(function (m) { return '<li>' + m + '</li>'; }).join('') + '</ul>' +
        '<p class="fw-semibold mb-1" style="color:var(--accent-700);">Coach\u2019s Tip</p>' +
        '<p class="text-secondary mb-0">' + d.cue + '</p>';
    });
  });
}

/* ---------- Workout Planner page ---------- */
function initWorkoutPlanner() {
  var body = document.getElementById('plannerBody');
  if (!body) return;

  var STORAGE_KEY = 'spfit_workout_plan';
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  var plan = loadPlan();

  function defaultPlan() {
    return [
      { day: 'Monday', exercise: 'Push-Ups', sets: 3, reps: '10-15' },
      { day: 'Wednesday', exercise: 'Bodyweight Squats', sets: 3, reps: '12-15' },
      { day: 'Friday', exercise: 'Plank', sets: 3, reps: '30-45 sec' }
    ];
  }

  function loadPlan() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : defaultPlan();
    } catch (e) {
      return defaultPlan();
    }
  }

  function savePlan() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(plan)); } catch (e) { /* storage unavailable */ }
    renderStats();
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (s) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[s];
    });
  }

  function renderStats() {
    var statsEl = document.getElementById('planStats');
    if (!statsEl) return;
    var totalExercises = plan.length;
    var daysUsed = new Set(plan.map(function (p) { return p.day; })).size;
    var totalSets = plan.reduce(function (sum, p) { return sum + (parseInt(p.sets, 10) || 0); }, 0);
    statsEl.innerHTML =
      '<div><div class="stat-num">' + totalExercises + '</div><div class="text-secondary small">Exercises</div></div>' +
      '<div><div class="stat-num">' + daysUsed + '</div><div class="text-secondary small">Days Planned</div></div>' +
      '<div><div class="stat-num">' + totalSets + '</div><div class="text-secondary small">Total Sets</div></div>';
  }

  function renderRows() {
    if (!plan.length) {
      body.innerHTML = '<tr><td colspan="5" class="text-center text-secondary py-4">No exercises yet — click "+ Add Exercise" to build your week.</td></tr>';
      return;
    }
    body.innerHTML = plan.map(function (row, idx) {
      var options = DAYS.map(function (d) {
        return '<option value="' + d + '"' + (d === row.day ? ' selected' : '') + '>' + d + '</option>';
      }).join('');
      return (
        '<tr>' +
          '<td><select class="form-select form-select-sm" data-field="day" data-idx="' + idx + '">' + options + '</select></td>' +
          '<td><input type="text" class="form-control form-control-sm" data-field="exercise" data-idx="' + idx + '" value="' + escapeHtml(row.exercise) + '" placeholder="e.g. Push-Ups"></td>' +
          '<td><input type="number" min="1" class="form-control form-control-sm" style="width:70px;" data-field="sets" data-idx="' + idx + '" value="' + escapeHtml(row.sets) + '"></td>' +
          '<td><input type="text" class="form-control form-control-sm" style="width:100px;" data-field="reps" data-idx="' + idx + '" value="' + escapeHtml(row.reps) + '" placeholder="e.g. 10-12"></td>' +
          '<td class="text-center"><button type="button" class="planner-remove fs-5" data-idx="' + idx + '" aria-label="Remove row">&times;</button></td>' +
        '</tr>'
      );
    }).join('');
  }

  body.addEventListener('input', function (e) {
    var idx = e.target.dataset.idx;
    var field = e.target.dataset.field;
    if (idx === undefined || !field) return;
    plan[idx][field] = e.target.value;
    savePlan();
  });

  body.addEventListener('change', function (e) {
    if (e.target.dataset.field === 'day') {
      plan[e.target.dataset.idx].day = e.target.value;
      savePlan();
    }
  });

  body.addEventListener('click', function (e) {
    if (e.target.classList.contains('planner-remove')) {
      plan.splice(e.target.dataset.idx, 1);
      renderRows();
      savePlan();
    }
  });

  var addBtn = document.getElementById('addRowBtn');
  if (addBtn) {
    addBtn.addEventListener('click', function () {
      plan.push({ day: 'Monday', exercise: '', sets: 3, reps: '' });
      renderRows();
      savePlan();
    });
  }

  var clearBtn = document.getElementById('clearPlanBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      if (window.confirm('Clear your entire weekly plan? This cannot be undone.')) {
        plan = [];
        renderRows();
        savePlan();
      }
    });
  }

  var printBtn = document.getElementById('printPlanBtn');
  if (printBtn) {
    printBtn.addEventListener('click', function () { window.print(); });
  }

  renderRows();
  renderStats();
}
