/* ============================================================
   NORTHERN ARBORISTS — main.js
   ============================================================ */

(function () {
  'use strict';

  /* ── Hamburger / mobile nav ── */
  const hamburger = document.getElementById('navHamburger');
  const mobileNav = document.getElementById('navMobile');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      mobileNav.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.site-header') && mobileNav.classList.contains('open')) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });

    // Close nav when a mobile link is clicked
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Header scroll shadow ── */
  const header = document.getElementById('siteHeader');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Active nav link ── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPage = href.split('/').pop().split('#')[0] || 'index.html';
    if (linkPage === page || (page === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Scroll reveal (IntersectionObserver) ── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      );
      reveals.forEach(el => io.observe(el));
    } else {
      reveals.forEach(el => el.classList.add('visible'));
    }
  }

  /* ── Contact form ── */
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Clear previous errors
      form.querySelectorAll('.field-error').forEach(el => { el.textContent = ''; });
      form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));

      // Required field check
      form.querySelectorAll('[data-required]').forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.classList.add('invalid');
          const err = document.getElementById(field.id + 'Err');
          if (err) err.textContent = 'This field is required.';
        }
      });

      // Email format
      const emailField = document.getElementById('email');
      if (emailField && emailField.value.trim()) {
        const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRx.test(emailField.value.trim())) {
          valid = false;
          emailField.classList.add('invalid');
          const emailErr = document.getElementById('emailErr');
          if (emailErr) emailErr.textContent = 'Please enter a valid email address.';
        }
      }

      // Phone basic check (at least 10 digits if provided)
      const phoneField = document.getElementById('phone');
      if (phoneField && phoneField.value.trim()) {
        const digits = phoneField.value.replace(/\D/g, '');
        if (digits.length < 10) {
          valid = false;
          phoneField.classList.add('invalid');
          const phoneErr = document.getElementById('phoneErr');
          if (phoneErr) phoneErr.textContent = 'Please enter a valid phone number.';
        }
      }

      if (valid) {
        form.style.display = 'none';
        if (success) {
          success.classList.add('visible');
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });

    // Live validation: clear error on input
    form.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('input', () => {
        field.classList.remove('invalid');
        const err = document.getElementById(field.id + 'Err');
        if (err) err.textContent = '';
      });
    });
  }
})();
