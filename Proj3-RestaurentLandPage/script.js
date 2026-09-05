// Sticky header state
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Mobile nav toggle
  const toggle = document.getElementById('menu-toggle');
  const siteNav = document.getElementById('site-nav');
  toggle.addEventListener('click', () => siteNav.classList.toggle('open'));
  siteNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => siteNav.classList.remove('open')));

  // Menu tabs
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.dish-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });

  // Reservation form (front-end only)
  const form = document.getElementById('reserve-form');
  const note = document.getElementById('reserve-note');
  const submitBtn = document.getElementById('reserve-submit');
  form.addEventListener('submit', () => {
    submitBtn.textContent = 'Request Sent ✓';
    note.textContent = "Thank you — we'll confirm by phone within two hours.";
  });

  // Newsletter (front-end only)
  document.getElementById('newsletter-btn').addEventListener('click', (e) => {
    const input = e.target.previousElementSibling;
    if (input.value && input.checkValidity()) {
      e.target.textContent = 'Joined ✓';
      input.value = '';
    }
  });

  // Ember particle field in hero
  (function emberField(){
    const canvas = document.getElementById('ember-canvas');
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w, h, particles = [];

    function resize(){
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function makeParticle(){
      return {
        x: Math.random() * w,
        y: h + Math.random() * 100,
        r: Math.random() * 1.8 + 0.6,
        speed: Math.random() * 0.6 + 0.25,
        drift: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.3,
        flicker: Math.random() * 0.02 + 0.01
      };
    }
    const count = reduceMotion ? 0 : 60;
    for(let i=0;i<count;i++) particles.push(makeParticle());

    function tick(){
      ctx.clearRect(0,0,w,h);
      particles.forEach(p => {
        p.y -= p.speed;
        p.x += p.drift;
        p.alpha -= p.flicker * 0.15;
        if(p.y < h*0.05 || p.alpha <= 0){
          Object.assign(p, makeParticle());
        }
        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*4);
        grad.addColorStop(0, `rgba(217,127,69,${p.alpha})`);
        grad.addColorStop(1, 'rgba(217,127,69,0)');
        ctx.fillStyle = grad;
        ctx.arc(p.x,p.y,p.r*4,0,Math.PI*2);
        ctx.fill();
      });
      if(!reduceMotion) requestAnimationFrame(tick);
    }
    if(!reduceMotion) tick();
  })();
