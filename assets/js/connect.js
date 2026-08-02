// connect.js — Join Us / Contact form handling for connect.html

// Simple front-end only confirmation (no backend wired up yet).
// Replace this with a real fetch/POST to your form handler when ready.
document.getElementById('joinForm').addEventListener('submit', function (e) {
  e.preventDefault();
  if (!this.checkValidity()) {
    this.classList.add('was-validated');
    return;
  }
  document.getElementById('joinAlert').style.display = 'flex';
  this.reset();
  this.classList.remove('was-validated');
});