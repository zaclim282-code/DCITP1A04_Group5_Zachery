/* ============================================================
   SPFIT — main.js
   Small, page-aware script. Every init function checks for its
   own elements first, so this one file can be safely included
   on every page.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  initNavDropdowns();
  initFlipCards();
  initFilterButtons();
  initStrengthQuiz();
  initExerciseDetails();
  initWorkoutPlanner();
});

/* ---------- Site nav: dropdown toggles + active link highlighting ---------- */
function initNavDropdowns() {
  var nav = document.querySelector('.main-nav');
  if (!nav) return;

  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('a').forEach(function (link) {
    var linkPath = (link.getAttribute('href') || '').split('/').pop();
    if (linkPath === currentPath) {
      link.classList.add('active');
      var parentDropdown = link.closest('.dropdown');
      if (parentDropdown) {
        var text = parentDropdown.querySelector('.dropdownText');
        if (text) text.classList.add('active');
      }
    }
  });

  var dropdowns = nav.querySelectorAll('.dropdown');

  function closeAllDropdowns() {
    dropdowns.forEach(function (d) {
      var items = d.querySelector('.dropdownItems');
      if (items) items.classList.remove('active');
      d.classList.remove('open');
    });
    nav.querySelectorAll('.dropdownText').forEach(function (t) { t.setAttribute('aria-expanded', 'false'); });
  }

  dropdowns.forEach(function (dropdown) {
    var text = dropdown.querySelector('.dropdownText');
    var items = dropdown.querySelector('.dropdownItems');
    if (!text || !items) return;

    text.setAttribute('tabindex', '0');
    text.setAttribute('role', 'button');
    text.setAttribute('aria-expanded', 'false');

    function toggle() {
      var wasOpen = items.classList.contains('active');
      closeAllDropdowns();
      if (!wasOpen) {
        items.classList.add('active');
        dropdown.classList.add('open');
        text.setAttribute('aria-expanded', 'true');
      }
    }

    text.addEventListener('click', function (e) {
      e.stopPropagation();
      toggle();
    });

    text.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.dropdown')) {
      closeAllDropdowns();
    }
  });
}

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
      '<h5 class="mb-1 text-accent">' + copy.title + '</h5>' +
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
        '<p class="fw-semibold mb-1 text-accent">Muscles Worked</p>' +
        '<p class="text-secondary">' + d.muscles + '</p>' +
        '<p class="fw-semibold mb-1 text-accent">Benefits</p>' +
        '<ul class="text-secondary">' + d.benefits.map(function (b) { return '<li>' + b + '</li>'; }).join('') + '</ul>' +
        '<p class="fw-semibold mb-1 text-accent">Common Mistakes</p>' +
        '<ul class="text-secondary mb-3">' + d.mistakes.map(function (m) { return '<li>' + m + '</li>'; }).join('') + '</ul>' +
        '<p class="fw-semibold mb-1 text-accent">Coach\u2019s Tip</p>' +
        '<p class="text-secondary mb-0">' + d.cue + '</p>';
    });
  });
}

/* ---------- Workout Planner page: schedule of day tabs + exercise cards ---------- */
function initWorkoutPlanner() {
  var tabsEl = document.getElementById('dayTabs');
  var panesEl = document.getElementById('dayPanes');
  if (!tabsEl || !panesEl) return;

  var STORAGE_KEY = 'spfit_workout_plan';
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  var SHORT = { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun' };
  var CATEGORY = {
    /* label = badge text, border/badge = Bootstrap contextual classes (no custom CSS needed),
       icon = a tiny hand-drawn stick figure so each category also reads at a glance,
       matching the icon style already used on the Strength page. */
    upper: {
      label: 'Upper Body', border: 'border-danger', badge: 'text-bg-danger', text: 'text-danger',
      icon: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><circle cx="20" cy="8" r="4" fill="currentColor" stroke="none"/><path d="M20 12 L20 24"/><path d="M20 15 L12 10"/><path d="M20 15 L28 10"/><path d="M20 24 L14 34"/><path d="M20 24 L26 34"/></svg>'
    },
    lower: {
      label: 'Lower Body', border: 'border-success', badge: 'text-bg-success', text: 'text-success',
      icon: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><circle cx="20" cy="7" r="4" fill="currentColor" stroke="none"/><path d="M20 11 L20 20"/><path d="M20 13 L13 17"/><path d="M20 13 L27 17"/><path d="M20 20 L12 24 L11 34"/><path d="M20 20 L28 24 L29 34"/></svg>'
    },
    core: {
      label: 'Core', border: 'border-info', badge: 'text-bg-info', text: 'text-info',
      icon: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><circle cx="6" cy="14" r="4" fill="currentColor" stroke="none"/><path d="M10 16 L32 22"/><path d="M14 17 L12 27"/><path d="M32 22 L30 28"/></svg>'
    }
  };
  var todayName = DAYS[(new Date().getDay() + 6) % 7]; // getDay(): Sun=0 -> shift so Monday=0

  /* Same 9 exercises as the Strength Training page, so the planner's quick-add
     list and the default plan always match what's actually taught there. */
  var PRESET_EXERCISES = [
    { id: 'benchpress', name: 'Barbell Bench Press', category: 'upper', sets: 4, reps: '6-10' },
    { id: 'latpulldown', name: 'Lat Pulldown', category: 'upper', sets: 3, reps: '10-12' },
    { id: 'barbellshoulderpress', name: 'Barbell Overhead Press', category: 'upper', sets: 3, reps: '6-8' },
    { id: 'backsquat', name: 'Barbell Back Squat', category: 'lower', sets: 4, reps: '6-10' },
    { id: 'legpress', name: 'Leg Press', category: 'lower', sets: 3, reps: '10-15' },
    { id: 'romaniandeadlift', name: 'Romanian Deadlift', category: 'lower', sets: 3, reps: '8-10' },
    { id: 'cablewoodchop', name: 'Cable Woodchopper', category: 'core', sets: 3, reps: '12 per side' },
    { id: 'hanginglegraise', name: 'Hanging Leg Raise', category: 'core', sets: 3, reps: '10-12' },
    { id: 'declinesitup', name: 'Decline Weighted Sit-Up', category: 'core', sets: 3, reps: '12-15' }
  ];

  var plan = loadPlan();

  function defaultPlan() {
    return [
      { day: 'Monday', exercise: 'Barbell Bench Press', category: 'upper', sets: 4, reps: '6-10' },
      { day: 'Wednesday', exercise: 'Barbell Back Squat', category: 'lower', sets: 4, reps: '6-10' },
      { day: 'Friday', exercise: 'Hanging Leg Raise', category: 'core', sets: 3, reps: '10-12' }
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
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (s) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[s];
    });
  }

  /* Build the tab buttons + empty panes once */
  tabsEl.innerHTML = DAYS.map(function (day) {
    var isToday = day === todayName;
    return '<button type="button" class="btn filter-btn' + (isToday ? ' active' : '') +
      '" data-bs-toggle="pill" data-bs-target="#day-' + day + '" role="tab">' +
      SHORT[day] + (isToday ? ' <span class="small">(Today)</span>' : '') + '</button>';
  }).join('');

  panesEl.innerHTML = DAYS.map(function (day) {
    return '<div class="tab-pane fade' + (day === todayName ? ' show active' : '') + '" id="day-' + day + '" role="tabpanel">' +
      '<h5 class="d-none d-print-block mb-3">' + day + '</h5>' +
      '<div class="row g-3" data-day-list="' + day + '"></div>' +
      '</div>';
  }).join('');

  function renderStats() {
    var statsEl = document.getElementById('planStats');
    if (!statsEl) return;
    var daysUsed = new Set(plan.map(function (p) { return p.day; })).size;
    statsEl.innerHTML =
      '<div><div class="stat-num">' + plan.length + '</div><div class="text-secondary small">Exercises</div></div>' +
      '<div><div class="stat-num">' + daysUsed + '</div><div class="text-secondary small">Days Planned</div></div>';

    var bar = document.getElementById('weekProgressBar');
    var label = document.getElementById('weekProgressLabel');
    if (bar && label) {
      var pct = Math.round((daysUsed / DAYS.length) * 100);
      bar.style.width = pct + '%';
      bar.setAttribute('aria-valuenow', pct);
      label.textContent = daysUsed + ' of ' + DAYS.length + ' days';
    }
  }

  function renderCards() {
    DAYS.forEach(function (day) {
      var list = panesEl.querySelector('[data-day-list="' + day + '"]');
      var rows = plan.filter(function (p) { return p.day === day; });

      if (!rows.length) {
        list.innerHTML = '<p class="text-secondary text-center py-4 mb-0">No exercises planned for ' + day + ' yet.</p>';
        return;
      }

      list.innerHTML = rows.map(function (row) {
        var idx = plan.indexOf(row);
        var cat = CATEGORY[row.category] || CATEGORY.upper;
        return (
          '<div class="col-md-4">' +
            '<div class="card h-100 border-top border-3 ' + cat.border + ' position-relative">' +
              '<button type="button" class="btn-close position-absolute top-0 end-0 m-2 planner-remove" data-idx="' + idx + '" aria-label="Remove"></button>' +
              '<div class="card-body">' +
                /* icon + badge share a row so the stick figure sits right next to its label */
                '<div class="d-flex align-items-center gap-2 mb-2">' +
                  '<span class="exercise-icon ' + cat.text + '">' + cat.icon + '</span>' +
                  '<span class="badge ' + cat.badge + '">' + cat.label + '</span>' +
                '</div>' +
                '<h6 class="fw-bold">' + escapeHtml(row.exercise) + '</h6>' +
                '<p class="text-secondary small mb-0">' + escapeHtml(row.sets) + ' sets &middot; ' + escapeHtml(row.reps) + '</p>' +
              '</div>' +
            '</div>' +
          '</div>'
        );
      }).join('');
    });
  }

  function render() {
    renderCards();
    renderStats();
  }

  /* One delegated click handler covers every card's × button, even ones
     that get re-rendered later — no need to re-bind listeners each time. */
  panesEl.addEventListener('click', function (e) {
    var btn = e.target.closest('.planner-remove');
    if (!btn) return;
    plan.splice(btn.dataset.idx, 1);
    savePlan();
    render();
  });

  /* Add exercise modal: fill the Day dropdown + preset picker, then listen for submit */
  var dayField = document.getElementById('fieldDay');
  if (dayField) {
    dayField.innerHTML = DAYS.map(function (d) { return '<option value="' + d + '">' + d + '</option>'; }).join('');
  }

  var presetField = document.getElementById('fieldPreset');
  var exerciseField = document.getElementById('fieldExercise');
  var customWrap = document.getElementById('customExerciseWrap');
  var categoryField = document.getElementById('fieldCategory');
  var setsField = document.getElementById('fieldSets');
  var repsField = document.getElementById('fieldReps');

  if (presetField) {
    var groupLabels = { upper: 'Upper Body', lower: 'Lower Body', core: 'Core' };
    presetField.innerHTML = Object.keys(groupLabels).map(function (cat) {
      var options = PRESET_EXERCISES.filter(function (p) { return p.category === cat; })
        .map(function (p) { return '<option value="' + p.id + '">' + p.name + '</option>'; }).join('');
      return '<optgroup label="' + groupLabels[cat] + '">' + options + '</optgroup>';
    }).join('') + '<option value="custom">+ Custom Exercise&hellip;</option>';

    presetField.addEventListener('change', function () {
      var chosen = PRESET_EXERCISES.filter(function (p) { return p.id === presetField.value; })[0];
      if (chosen) {
        customWrap.classList.add('d-none');
        exerciseField.required = false;
        exerciseField.value = chosen.name;
        categoryField.value = chosen.category;
        setsField.value = chosen.sets;
        repsField.value = chosen.reps;
      } else {
        customWrap.classList.remove('d-none');
        exerciseField.required = true;
        exerciseField.value = '';
        exerciseField.focus();
      }
    });
    presetField.dispatchEvent(new Event('change')); // pre-fill using the first preset
  }

  var addForm = document.getElementById('addExerciseForm');
  if (addForm) {
    addForm.addEventListener('submit', function (e) {
      e.preventDefault(); // stop the form from actually navigating anywhere
      plan.push({
        day: document.getElementById('fieldDay').value,
        exercise: document.getElementById('fieldExercise').value.trim(),
        category: document.getElementById('fieldCategory').value,
        sets: document.getElementById('fieldSets').value,
        reps: document.getElementById('fieldReps').value.trim()
      });
      savePlan();
      render();
      addForm.reset();
      if (presetField) presetField.dispatchEvent(new Event('change'));
      // close the modal the same way a Bootstrap data-bs-dismiss button would
      var modalEl = document.getElementById('addExerciseModal');
      var modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.hide();
    });
  }

  var confirmClearBtn = document.getElementById('confirmClearBtn');
  if (confirmClearBtn) {
    confirmClearBtn.addEventListener('click', function () {
      plan = [];
      savePlan();
      render();
    });
  }

  var printBtn = document.getElementById('printPlanBtn');
  if (printBtn) {
    printBtn.addEventListener('click', function () { window.print(); });
  }

  render();
}
