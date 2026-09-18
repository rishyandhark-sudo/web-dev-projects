# SecureAuth — Login & Signup Mini Project

A clean, beginner-friendly authentication UI built with plain **HTML, CSS, and JavaScript**. This is a frontend-only mini project — there is no backend or real database, so it should **not** be used as a real authentication system.

## Features

- Login page and Signup page with easy navigation between them
- Full form validation (empty fields, invalid email, short password, mismatched passwords, unchecked terms)
- Show / hide password toggle on every password field
- Live password strength meter (Weak / Medium / Strong) on signup
- Demo authentication using the browser's `localStorage`
- Clear success and error messages
- Responsive layout that works on desktop, tablet, and mobile

## Technologies

- HTML5 (semantic markup)
- CSS3 (custom properties / variables, flexbox, media queries)
- JavaScript (vanilla, no frameworks or libraries)
- Browser `localStorage` for demo account storage

## Project Structure

```text
login-signup-project/
│
├── index.html          # Login page
├── signup.html         # Signup page
│
├── css/
│   └── style.css        # All styling
│
├── js/
│   └── script.js         # Validation, password toggle, strength meter, localStorage auth
│
└── README.md
```

## How to Run

1. Download or clone this project folder.
2. Open `index.html` in any modern web browser (double-click it, or right-click → "Open with" your browser).
3. That's it — no build step, no server, and no dependencies to install.

### Try it out

1. Go to the **Sign Up** page and create a demo account (name, email, password, confirm password, accept terms).
2. You'll be redirected in spirit — after signing up, use the **Login** link to go to the login page.
3. Log in with the same email and password you just created.
4. Try invalid inputs (empty fields, bad email format, short password, mismatched passwords, unchecked terms) to see the validation messages.
5. Click the eye icon to show or hide password text.
6. Watch the password strength meter change as you type a new password on the Signup page.

## Important Note on Security

This project stores account information in plain text inside the browser's `localStorage` purely to demonstrate how forms, validation, and client-side storage work together. **This is not secure** and is not suitable for real user data. A production authentication system needs a real backend, encrypted password storage (e.g. hashing with bcrypt/argon2), HTTPS, and proper session management.

## What This Project Demonstrates

- HTML forms → CSS UI → JavaScript DOM manipulation
- Form validation with clear, specific error messages
- Event handling (submit, click, input events)
- Working with `localStorage` for simple client-side data persistence
- Responsive design principles for mobile, tablet, and desktop
