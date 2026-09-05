/* =========================================================
   CarePlus Hospital — script.js
   Vanilla JS: navbar, mobile menu, scroll reveal, counters,
   accordion, doctor search/filter, form validation, toast.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Sticky navbar shadow ---------- */
  var navbar = document.querySelector('.navbar');
  function handleNavScroll() {
    if (!navbar) return;
    if (window.scrollY > 12) navbar.classList.add('is-scrolled');
    else navbar.classList.remove('is-scrolled');
  }
  handleNavScroll();
  window.addEventListener('scroll', handleNavScroll);

  /* ---------- Mobile hamburger menu ---------- */
  var hamburger = document.querySelector('.hamburger');
  var mobilePanel = document.querySelector('.mobile-panel');
  if (hamburger && mobilePanel) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobilePanel.classList.toggle('open');
      var expanded = hamburger.classList.contains('open');
      hamburger.setAttribute('aria-expanded', expanded);
    });
    mobilePanel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobilePanel.classList.remove('open');
      });
    });
  }

  /* ---------- Active nav link (based on current page) ---------- */
  var current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-panel a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---------- Smooth scroll for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ---------- Scroll reveal animations ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll('[data-counter]');
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-counter'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1400;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var value = Math.floor(progress * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && counters.length) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ---------- FAQ Accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var question = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;
    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      item.closest('.faq-list').querySelectorAll('.faq-item').forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.faq-answer').style.maxHeight = null;
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Back to top button ---------- */
  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) backToTop.classList.add('show');
      else backToTop.classList.remove('show');
    });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Doctor search + specialization filter ---------- */
  var doctorSearch = document.getElementById('doctorSearch');
  var specFilter = document.getElementById('specFilter');
  var doctorCards = document.querySelectorAll('[data-doctor-card]');
  var noResults = document.querySelector('.no-results');

  function filterDoctors() {
    if (!doctorCards.length) return;
    var query = doctorSearch ? doctorSearch.value.trim().toLowerCase() : '';
    var spec = specFilter ? specFilter.value : 'all';
    var visibleCount = 0;

    doctorCards.forEach(function (card) {
      var name = (card.getAttribute('data-name') || '').toLowerCase();
      var cardSpec = card.getAttribute('data-spec') || '';
      var matchesQuery = name.indexOf(query) !== -1;
      var matchesSpec = spec === 'all' || cardSpec === spec;
      var visible = matchesQuery && matchesSpec;
      card.style.display = visible ? '' : 'none';
      if (visible) visibleCount++;
    });

    if (noResults) noResults.classList.toggle('show', visibleCount === 0);
  }

  if (doctorSearch) doctorSearch.addEventListener('input', filterDoctors);
  if (specFilter) specFilter.addEventListener('change', filterDoctors);

  /* ---------- Department filter (departments page grid, optional) ---------- */
  var deptFilterButtons = document.querySelectorAll('[data-dept-filter]');
  var deptCards = document.querySelectorAll('[data-dept-card]');
  deptFilterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      deptFilterButtons.forEach(function (b) { b.classList.remove('active-filter'); });
      btn.classList.add('active-filter');
      var value = btn.getAttribute('data-dept-filter');
      deptCards.forEach(function (card) {
        var cat = card.getAttribute('data-category') || '';
        card.style.display = (value === 'all' || cat === value) ? '' : 'none';
      });
    });
  });

  /* ---------- Toast notification ---------- */
  function showToast(title, message) {
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML =
      '<i class="fa-solid fa-circle-check" aria-hidden="true"></i>' +
      '<div><strong>' + title + '</strong><span>' + message + '</span></div>';
    document.body.appendChild(toast);
    requestAnimationFrame(function () { toast.classList.add('show'); });
    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.remove(); }, 350);
    }, 4200);
  }

  /* ---------- Generic form validation helpers ---------- */
  function setFieldError(group, message) {
    group.classList.add('invalid');
    var err = group.querySelector('.field-error');
    if (err) err.textContent = message;
  }
  function clearFieldError(group) {
    group.classList.remove('invalid');
  }
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
  function isValidPhone(value) {
    return /^[0-9+\-\s()]{7,16}$/.test(value);
  }

  function validateForm(form) {
    var valid = true;
    var groups = form.querySelectorAll('.form-group');
    groups.forEach(function (group) {
      var field = group.querySelector('input, select, textarea');
      if (!field) return;
      clearFieldError(group);

      var value = field.value.trim();
      var required = field.hasAttribute('required');

      if (required && value === '') {
        setFieldError(group, 'This field is required.');
        valid = false;
        return;
      }
      if (field.type === 'email' && value !== '' && !isValidEmail(value)) {
        setFieldError(group, 'Please enter a valid email address.');
        valid = false;
        return;
      }
      if (field.type === 'tel' && value !== '' && !isValidPhone(value)) {
        setFieldError(group, 'Please enter a valid phone number.');
        valid = false;
        return;
      }
    });
    return valid;
  }

  /* ---------- Appointment form ---------- */
  var appointmentForm = document.getElementById('appointmentForm');
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateForm(appointmentForm)) {
        showToast('Appointment requested', "We'll confirm your booking by email shortly.");
        appointmentForm.reset();
      }
    });
  }

  /* ---------- Contact form ---------- */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateForm(contactForm)) {
        showToast('Message sent', "Our team will get back to you within 24 hours.");
        contactForm.reset();
      }
    });
  }

  /* ---------- Min date for appointment date field (today onward) ---------- */
  var dateField = document.getElementById('appointmentDate');
  if (dateField) {
    var today = new Date().toISOString().split('T')[0];
    dateField.setAttribute('min', today);
  }

});
