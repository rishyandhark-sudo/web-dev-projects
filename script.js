/* =========================================================
   TRIBUTE PAGE — SCRIPT
   Handles: (1) dark/light mode toggle with saved preference,
            (2) scroll-triggered reveal animation for sections
                and timeline items via IntersectionObserver.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* -----------------------------------------------------
     1) DARK MODE / LIGHT MODE TOGGLE
     ----------------------------------------------------- */
  const body = document.body;
  const toggleBtn = document.getElementById("theme-toggle");
  const toggleIcon = toggleBtn.querySelector(".theme-toggle__icon");
  const toggleLabel = toggleBtn.querySelector(".theme-toggle__label");

  const STORAGE_KEY = "tribute-theme";

  // Apply a theme ("dark" | "light") and keep the button in sync
  function applyTheme(theme) {
    const isDark = theme === "dark";
    body.classList.toggle("dark-mode", isDark);
    toggleBtn.setAttribute("aria-pressed", String(isDark));
    toggleIcon.innerHTML = isDark ? "&#9789;" : "&#9788;"; // moon : sun
    toggleLabel.textContent = isDark ? "Dark" : "Light";
  }

  // On load: prefer a saved choice, otherwise fall back to the
  // visitor's OS-level preference for dark mode.
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }

  toggleBtn.addEventListener("click", () => {
    const nextTheme = body.classList.contains("dark-mode") ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem(STORAGE_KEY, nextTheme);
  });

  /* -----------------------------------------------------
     2) SCROLL REVEAL ANIMATION
     Every element with the ".reveal" class fades/slides into
     view the first time it enters the viewport.
     ----------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target); // animate once, then stop watching
          }
        });
      },
      {
        threshold: 0.15,       // reveal once ~15% of the element is visible
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealEls.forEach((el) => observer.observe(el));

    // Stagger the timeline cards slightly for a nicer cascading feel
    document.querySelectorAll(".timeline__item").forEach((item, index) => {
      item.style.transitionDelay = `${index * 90}ms`;
    });
  } else {
    // Fallback for very old browsers: just show everything
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

});
