/* ============================================
   SecureAuth — script.js
   Handles validation, password visibility,
   password strength, and demo localStorage auth.

   NOTE: This is a frontend demo only.
   Passwords are stored in plain text in
   localStorage for learning purposes.
   This is NOT secure and should never be
   used for a real authentication system.
   ============================================ */

const STORAGE_KEY = "secureAuthUsers";

/* ---------- Helpers ---------- */

// Basic email format check
function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

// Read the list of demo accounts from localStorage
function getStoredUsers() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

// Save the list of demo accounts to localStorage
function saveStoredUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

// Show a field-level error message under an input
function showFieldError(inputEl, errorEl, message) {
  inputEl.classList.add("input-error");
  errorEl.textContent = message;
  errorEl.classList.add("show");
}

// Clear a field-level error message
function clearFieldError(inputEl, errorEl) {
  inputEl.classList.remove("input-error");
  errorEl.textContent = "";
  errorEl.classList.remove("show");
}

// Show a page-level alert (success or error) above the form
function showAlert(alertEl, message, type) {
  alertEl.textContent = message;
  alertEl.className = "alert-box show " + type; // type = "success" | "error"
}

// Hide the page-level alert
function hideAlert(alertEl) {
  alertEl.className = "alert-box";
  alertEl.textContent = "";
}

/* ---------- Show / Hide Password ---------- */

function setupPasswordToggles() {
  const toggleButtons = document.querySelectorAll(".toggle-password");

  toggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      const input = document.getElementById(targetId);

      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";

      button.textContent = isHidden ? "🙈" : "👁";
      button.classList.toggle("active", isHidden);
      button.setAttribute(
        "aria-label",
        isHidden ? "Hide password" : "Show password"
      );
    });
  });
}

/* ---------- Password Strength Meter ---------- */

function getPasswordStrength(password) {
  if (password.length === 0) return "none";

  let score = 0;

  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return "weak";
  if (score <= 3) return "medium";
  return "strong";
}

function setupPasswordStrengthMeter() {
  const passwordInput = document.getElementById("signupPassword");
  const strengthBar = document.querySelector(".strength-bar");
  const strengthLabel = document.getElementById("strengthLabel");

  if (!passwordInput) return; // Only present on the signup page

  passwordInput.addEventListener("input", () => {
    const strength = getPasswordStrength(passwordInput.value);

    strengthBar.classList.remove("weak", "medium", "strong");

    if (strength === "none") {
      strengthLabel.textContent = "Password strength: —";
      return;
    }

    strengthBar.classList.add(strength);

    const labelText =
      strength === "weak" ? "Weak" : strength === "medium" ? "Medium" : "Strong";

    strengthLabel.textContent = "Password strength: " + labelText;
  });
}

/* ---------- Login Form ---------- */

function setupLoginForm() {
  const form = document.getElementById("loginForm");
  if (!form) return; // Only present on the login page

  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");
  const emailError = document.getElementById("loginEmailError");
  const passwordError = document.getElementById("loginPasswordError");
  const alertBox = document.getElementById("loginAlert");
  const forgotLink = document.getElementById("forgotPasswordLink");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    hideAlert(alertBox);

    clearFieldError(emailInput, emailError);
    clearFieldError(passwordInput, passwordError);

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    let isValid = true;

    if (email === "") {
      showFieldError(emailInput, emailError, "Email is required");
      isValid = false;
    } else if (!isValidEmail(email)) {
      showFieldError(emailInput, emailError, "Please enter a valid email address");
      isValid = false;
    }

    if (password === "") {
      showFieldError(passwordInput, passwordError, "Password is required");
      isValid = false;
    } else if (password.length < 6) {
      showFieldError(
        passwordInput,
        passwordError,
        "Password must be at least 6 characters"
      );
      isValid = false;
    }

    if (!isValid) return;

    // Check credentials against demo accounts in localStorage
    const users = getStoredUsers();
    const matchedUser = users.find((user) => user.email === email);

    if (!matchedUser) {
      showAlert(alertBox, "No account found with this email. Please sign up first.", "error");
      return;
    }

    if (matchedUser.password !== password) {
      showAlert(alertBox, "Incorrect email or password.", "error");
      return;
    }

    showAlert(alertBox, `Login successful! Welcome back, ${matchedUser.fullName}.`, "success");
    form.reset();
  });

  if (forgotLink) {
    forgotLink.addEventListener("click", (event) => {
      event.preventDefault();
      showAlert(
        alertBox,
        "This is a demo project — password reset isn't implemented.",
        "error"
      );
    });
  }
}

/* ---------- Signup Form ---------- */

function setupSignupForm() {
  const form = document.getElementById("signupForm");
  if (!form) return; // Only present on the signup page

  const nameInput = document.getElementById("signupName");
  const emailInput = document.getElementById("signupEmail");
  const passwordInput = document.getElementById("signupPassword");
  const confirmInput = document.getElementById("confirmPassword");
  const termsCheckbox = document.getElementById("termsCheckbox");

  const nameError = document.getElementById("signupNameError");
  const emailError = document.getElementById("signupEmailError");
  const passwordError = document.getElementById("signupPasswordError");
  const confirmError = document.getElementById("confirmPasswordError");

  const alertBox = document.getElementById("signupAlert");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    hideAlert(alertBox);

    clearFieldError(nameInput, nameError);
    clearFieldError(emailInput, emailError);
    clearFieldError(passwordInput, passwordError);
    clearFieldError(confirmInput, confirmError);

    const fullName = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;

    let isValid = true;

    if (fullName === "") {
      showFieldError(nameInput, nameError, "Full name is required");
      isValid = false;
    }

    if (email === "") {
      showFieldError(emailInput, emailError, "Email is required");
      isValid = false;
    } else if (!isValidEmail(email)) {
      showFieldError(emailInput, emailError, "Please enter a valid email address");
      isValid = false;
    }

    if (password === "") {
      showFieldError(passwordInput, passwordError, "Password is required");
      isValid = false;
    } else if (password.length < 6) {
      showFieldError(
        passwordInput,
        passwordError,
        "Password must be at least 6 characters"
      );
      isValid = false;
    }

    if (confirmPassword === "") {
      showFieldError(confirmInput, confirmError, "Please confirm your password");
      isValid = false;
    } else if (password !== confirmPassword) {
      showFieldError(confirmInput, confirmError, "Passwords do not match");
      isValid = false;
    }

    if (!termsCheckbox.checked) {
      showAlert(alertBox, "You must accept the Terms & Conditions to continue.", "error");
      isValid = false;
    }

    if (!isValid) return;

    // Prevent duplicate accounts for the same email
    const users = getStoredUsers();
    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
      showAlert(alertBox, "An account with this email already exists.", "error");
      return;
    }

    // Save the new demo account
    users.push({ fullName, email, password });
    saveStoredUsers(users);

    showAlert(alertBox, "Account created successfully! You can now log in.", "success");
    form.reset();

    const strengthBar = document.querySelector(".strength-bar");
    const strengthLabel = document.getElementById("strengthLabel");
    strengthBar.classList.remove("weak", "medium", "strong");
    strengthLabel.textContent = "Password strength: —";
  });
}

/* ---------- Init ---------- */

document.addEventListener("DOMContentLoaded", () => {
  setupPasswordToggles();
  setupPasswordStrengthMeter();
  setupLoginForm();
  setupSignupForm();
});
