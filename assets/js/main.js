(() => {
  'use strict';

  /* ---------- Year ---------- */
  const yEl = document.getElementById('year');
  if (yEl) yEl.textContent = new Date().getFullYear();

  /* ---------- Nav: scrolled state + mobile toggle ---------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- Counter animation ---------- */
  const counters = document.querySelectorAll('.counter');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.target || '0');
      const dur = 1400;
      const start = performance.now();
      const isFloat = !Number.isInteger(target);
      const tick = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        const v = target * eased;
        el.textContent = isFloat ? v.toFixed(1) : Math.floor(v).toString();
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = isFloat ? target.toFixed(1) : target.toString();
      };
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(el => counterIO.observe(el));

  /* ---------- Smooth-scroll offset for fixed nav ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- Case Study Modals ---------- */
  let lastFocusedEl = null;

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    lastFocusedEl = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.openModal));
  });

  document.querySelectorAll('[data-modal-close]').forEach(el => {
    el.addEventListener('click', () => closeModal(el.closest('.modal')));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const open = document.querySelector('.modal:not([hidden])');
      if (open) closeModal(open);
    }
  });

})();

/* ---------- Contact form ---------- */
function handleContact(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const note = document.getElementById('form-note');
  const btn = form.querySelector('button[type="submit"]');
  const btnLabel = btn.querySelector('span');

  if (!name || !email || !message) {
    note.textContent = 'Please fill in all fields.';
    note.className = 'form-note';
    return false;
  }

  const configured =
    typeof emailjs !== 'undefined' &&
    window.EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY';

  if (!configured) {
    /* Fallback: open mail client if EmailJS not yet configured */
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:varun.vashisht@live.com?subject=${subject}&body=${body}`;
    note.textContent = 'Opening your email client…';
    note.className = 'form-note success';
    return false;
  }

  btn.disabled = true;
  btnLabel.textContent = 'Sending…';
  note.textContent = '';
  note.className = 'form-note';

  emailjs.send(window.EMAILJS_SERVICE_ID, window.EMAILJS_TEMPLATE_ID, {
    name: name,
    email: email,
    message: message
  }).then(() => {
    note.textContent = "Message sent! I'll be in touch soon.";
    note.className = 'form-note success';
    form.reset();
    btn.disabled = false;
    btnLabel.textContent = 'Send message';
  }).catch(() => {
    note.textContent = 'Something went wrong. Please email me directly at varun.vashisht@live.com';
    note.className = 'form-note';
    btn.disabled = false;
    btnLabel.textContent = 'Send message';
  });

  return false;
}
