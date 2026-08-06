const countryCode = document.getElementById('countryCode');
const phoneInput = document.getElementById('phoneNumber');
const phoneHint = document.getElementById('phoneHint');
const phoneError = document.getElementById('phoneError');
const emailInput = document.getElementById('email');
const emailError = document.getElementById('emailError');

// Update hint text whenever country changes
function updatePhoneHint() {
  const opt = countryCode.selectedOptions[0];
  const digits = opt.dataset.digits.split(',').join(' or ');
  phoneHint.textContent = `${opt.textContent.trim()} numbers must be ${digits} digits.`;
}
countryCode.addEventListener('change', () => {
  updatePhoneHint();
  isValidPhone();
});
updatePhoneHint(); // run once on load

function isValidPhone() {
  const digitsOnly = phoneInput.value.replace(/\D/g, '');
  const allowedLengths = countryCode.selectedOptions[0].dataset.digits.split(',').map(Number);
  const valid = allowedLengths.includes(digitsOnly.length);

  phoneInput.setCustomValidity(valid ? '' : 'Invalid phone number length');
  phoneError.textContent = valid
    ? ''
    : `Enter a valid number (${allowedLengths.join(' or ')} digits) for ${countryCode.value}.`;

  return valid;
}

function isValidEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const valid = emailRegex.test(emailInput.value.trim());

  emailInput.setCustomValidity(valid ? '' : 'Invalid email address');
  emailError.textContent = valid
    ? ''
    : 'Email must include "@" and a domain, e.g. name@example.com';

  return valid;
}

// Real-time feedback as user types (after first interaction)
phoneInput.addEventListener('input', () => {
  if (phoneInput.classList.contains('is-invalid') || document.getElementById('joinForm').classList.contains('was-validated')) {
    isValidPhone();
  }
});
emailInput.addEventListener('input', () => {
  if (emailInput.classList.contains('is-invalid') || document.getElementById('joinForm').classList.contains('was-validated')) {
    isValidEmail();
  }
});

document.getElementById('joinForm').addEventListener('submit', function (e) {
  e.preventDefault();

  isValidEmail();
  isValidPhone();

  if (!this.checkValidity()) {
    this.classList.add('was-validated');
    return;
  }

  document.getElementById('joinAlert').style.display = 'flex';
  this.reset();
  this.classList.remove('was-validated');
  countryCode.selectedIndex = 0;
  updatePhoneHint();
});