/* =============================================================
   NYABINGHI · main.js
   ============================================================= */

(function () {
  'use strict';

  /* ── Scroll: header state ──────────────────────────────── */
  var header = document.getElementById('site-header');
  var SCROLL_THRESHOLD = 60;

  function onScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial state

  /* ── Mobile nav toggle ─────────────────────────────────── */
  var navToggle = document.getElementById('nav-toggle');
  var mainNav   = document.getElementById('main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close nav when a link is clicked
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Ouvrir le menu');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Reveal on scroll (IntersectionObserver) ──────────── */
  var revealEls = document.querySelectorAll(
    '.section-label, .section-title, .section-intro, ' +
    '.esprit-body, .features-list, ' +
    '.room-card, .stat, ' +
    '.galerie-item, ' +
    '.panorama-text, .panorama-sub, ' +
    '.contact-info, .contact-map, ' +
    '.reserver-inner, ' +
    '.esprit-media'
  );

  revealEls.forEach(function (el) {
    el.classList.add('reveal');
  });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ── Stagger delay for grids ───────────────────────────── */
  document.querySelectorAll('.rooms-grid .room-card').forEach(function (card, i) {
    card.style.transitionDelay = (i * 0.12) + 's';
  });

  document.querySelectorAll('.galerie-grid .galerie-item').forEach(function (item, i) {
    item.style.transitionDelay = (i * 0.07) + 's';
  });

  document.querySelectorAll('.stats-inner .stat').forEach(function (stat, i) {
    stat.style.transitionDelay = (i * 0.1) + 's';
  });

  /* ── Smooth scroll for same-page anchors ───────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;
      var target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      var headerH = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

}());
