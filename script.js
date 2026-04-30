// ============================================================
// Campement Nyabinghi · interactivity layer
// ============================================================
window.addEventListener('DOMContentLoaded', init);

function init() {
  refreshIcons();
  initLang();
  initNav();
  initMobileMenu();
  initHeroSlideshow();
  initReveals();
  initReviews();
  initLightbox();
  initCas3D();
  registerImageFallbacks();
  initSmoothScroll();
  initScrollProgress();
  initStatCounters();
  initGalleryIcons();
}

// ----- Scroll progress bar -----
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  const onScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    bar.style.width = pct + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ----- Animated stat counters (in-view) -----
function initStatCounters() {
  const stats = document.querySelectorAll('.hero-stats .stat[data-count]');
  if (!stats.length) return;

  const animate = (el) => {
    if (el.classList.contains('in-view')) return;
    el.classList.add('in-view');
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimal || '0', 10);
    const suffix = el.dataset.suffix || '';
    const suffixHtml = el.dataset.suffixHtml || '';
    const numEl = el.querySelector('.stat-num');
    if (!numEl) return;

    const duration = 1400;
    const start = performance.now();
    const fmt = (n) => {
      const fixed = n.toFixed(decimals);
      // French-style decimal comma
      return decimals > 0 ? fixed.replace('.', ',') : fixed;
    };

    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const v = target * eased;
      numEl.innerHTML = fmt(v) + (suffixHtml || suffix);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (!('IntersectionObserver' in window)) {
    stats.forEach(animate);
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        animate(en.target);
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.4 });
  stats.forEach(s => io.observe(s));
}

// ----- Inject zoom icons into gallery items -----
function initGalleryIcons() {
  const items = document.querySelectorAll('.gal-item');
  items.forEach(it => {
    if (it.querySelector('.gal-icon')) return;
    const span = document.createElement('span');
    span.className = 'gal-icon';
    span.innerHTML = '<i data-lucide="maximize-2"></i>';
    it.appendChild(span);
  });
  refreshIcons();
}

// ----- Casamance 3D mouse tilt -----
function initCas3D() {
  const stage = document.querySelector('.cas-stage');
  const stack = document.getElementById('casStack');
  if (!stage || !stack) return;

  const isTouch = window.matchMedia('(hover: none)').matches;
  if (isTouch || window.innerWidth < 900) return;

  let rafId = null;
  let targetX = 0, targetY = 0;
  let curX = 0, curY = 0;

  const onMove = (e) => {
    const rect = stage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    targetX = x * 14;   // max ±7° tilt
    targetY = -y * 12;
    if (!rafId) rafId = requestAnimationFrame(animate);
  };

  const onLeave = () => {
    targetX = 0;
    targetY = 0;
    if (!rafId) rafId = requestAnimationFrame(animate);
  };

  function animate() {
    curX += (targetX - curX) * 0.08;
    curY += (targetY - curY) * 0.08;
    stack.style.transform = `rotateY(${curX}deg) rotateX(${curY}deg)`;
    if (Math.abs(targetX - curX) > 0.1 || Math.abs(targetY - curY) > 0.1) {
      rafId = requestAnimationFrame(animate);
    } else {
      rafId = null;
    }
  }

  stage.addEventListener('mousemove', onMove);
  stage.addEventListener('mouseleave', onLeave);
}

function refreshIcons() {
  if (window.lucide) {
    try { lucide.createIcons(); } catch (e) { console.warn('lucide failed', e); }
  }
}

// ----- Image error fallback -----
function registerImageFallbacks() {
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function onErr() {
      this.removeEventListener('error', onErr);
      this.style.background = 'linear-gradient(135deg,#B85C2E,#1E3D4C)';
      this.style.minHeight = '200px';
      this.removeAttribute('src');
    });
  });
}

// ----- Nav scroll effect -----
function initNav() {
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav?.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ----- Mobile menu -----
function initMobileMenu() {
  const btn = document.getElementById('menuBtn');
  const menu = document.getElementById('mobileMenu');
  const close = document.getElementById('closeMenuBtn');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => menu.classList.add('open'));
  close?.addEventListener('click', () => menu.classList.remove('open'));
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => menu.classList.remove('open'));
  });
}

// ----- Hero slideshow (with lazy bg loading + dots) -----
function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  const dotsWrap = document.getElementById('heroDots');
  if (slides.length < 2) return;

  // Lazy-load: convert data-bg into background-image just before showing
  const ensureLoaded = (slide) => {
    const url = slide.dataset.bg;
    if (url) {
      slide.style.backgroundImage = `url('${url}')`;
      delete slide.dataset.bg;
    }
  };

  // Build dots
  const dots = [];
  if (dotsWrap) {
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.className = 'hd' + (i === 0 ? ' active' : '');
      b.setAttribute('aria-label', 'Slide ' + (i + 1));
      b.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(b);
      dots.push(b);
    });
  }

  // Preload the next slide so the transition is smooth
  ensureLoaded(slides[1]);

  let idx = 0;
  let timer = null;

  function setActive(nextIdx) {
    const afterIdx = (nextIdx + 1) % slides.length;
    ensureLoaded(slides[nextIdx]);
    ensureLoaded(slides[afterIdx]);
    slides[idx].classList.remove('active');
    slides[nextIdx].classList.add('active');
    if (dots.length) {
      dots.forEach((d, j) => {
        // Reset progress fill animation for the active dot
        d.classList.toggle('active', j === nextIdx);
        if (j === nextIdx) {
          // Force reflow to restart CSS transition on ::after
          d.style.animation = 'none';
          // eslint-disable-next-line no-unused-expressions
          d.offsetHeight;
          d.style.animation = '';
        }
      });
    }
    idx = nextIdx;
  }

  function goTo(i) {
    if (i === idx) return;
    setActive(((i % slides.length) + slides.length) % slides.length);
    resetTimer();
  }

  function tick() { setActive((idx + 1) % slides.length); }
  function resetTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(tick, 6000);
  }
  resetTimer();
}

// ----- Reveal on scroll (handles .reveal, .reveal-up, .reveal-r, .reveal-l) -----
function initReveals() {
  const els = document.querySelectorAll('.reveal, .reveal-up, .reveal-r, .reveal-l');
  if (!('IntersectionObserver' in window)) {
    els.forEach(e => e.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        // Stagger children inside grids for a nicer cascade
        const children = en.target.parentElement && en.target.parentElement.matches('.cul-grid, .stay-grid, .exp-grid')
          ? Array.from(en.target.parentElement.children).indexOf(en.target)
          : 0;
        en.target.style.transitionDelay = (children * 80) + 'ms';
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  els.forEach(e => io.observe(e));
}

// ----- Language switcher -----
function initLang() {
  const btn = document.getElementById('langBtn');
  const menu = document.getElementById('langMenu');
  btn?.addEventListener('click', (e) => {
    e.stopPropagation();
    menu?.classList.toggle('open');
  });
  document.addEventListener('click', () => menu?.classList.remove('open'));
  document.querySelectorAll('.lang-option').forEach(b => {
    b.addEventListener('click', () => {
      setLanguage(b.dataset.lang);
      menu?.classList.remove('open');
    });
  });

  // restore or auto-detect
  let saved = null;
  try { saved = localStorage.getItem('nyabinghi-lang'); } catch (e) {}
  if (saved && window.translations && translations[saved]) {
    setLanguage(saved);
    return;
  }
  const nav = (navigator.language || 'fr').slice(0, 2).toLowerCase();
  if (window.translations && translations[nav] && nav !== 'fr') setLanguage(nav);
}

function setLanguage(lang) {
  if (!window.translations || !translations[lang]) return;
  const dict = translations[lang];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (!dict[key]) return;
    setSafeText(el, dict[key]);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) el.setAttribute('placeholder', dict[key]);
  });

  const cur = document.getElementById('langCurrent');
  if (cur) cur.textContent = lang.toUpperCase();
  document.documentElement.setAttribute('lang', lang);
  try { localStorage.setItem('nyabinghi-lang', lang); } catch (e) {}
  refreshIcons();
}

function setSafeText(el, text) {
  if (el.children.length === 0) {
    el.textContent = text;
    return;
  }
  let node = Array.from(el.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
  if (node) {
    node.textContent = ' ' + text + ' ';
  } else {
    el.insertBefore(document.createTextNode(text + ' '), el.firstChild);
  }
}

// ----- Reviews carousel -----
function initReviews() {
  const slider = document.getElementById('revSlider');
  const slides = document.querySelectorAll('.rev-slide');
  const prev = document.getElementById('revPrev');
  const next = document.getElementById('revNext');
  const dots = document.getElementById('revDots');
  if (!slider || !slides.length) return;

  let idx = 0;
  let auto = null;

  // build dots
  if (dots) {
    dots.innerHTML = '';
    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'slide ' + (i + 1));
      d.addEventListener('click', () => { go(i); resetAuto(); });
      dots.appendChild(d);
    });
  }

  function go(i) {
    idx = ((i % slides.length) + slides.length) % slides.length;
    slider.style.transform = `translateX(-${idx * 100}%)`;
    if (dots) dots.querySelectorAll('.dot').forEach((d, j) => d.classList.toggle('active', j === idx));
  }
  function startAuto() { stopAuto(); auto = setInterval(() => go(idx + 1), 7000); }
  function stopAuto() { if (auto) clearInterval(auto); }
  function resetAuto() { stopAuto(); startAuto(); }

  prev?.addEventListener('click', () => { go(idx - 1); resetAuto(); });
  next?.addEventListener('click', () => { go(idx + 1); resetAuto(); });

  const wrap = slider.closest('.rev-wrap');
  wrap?.addEventListener('mouseenter', stopAuto);
  wrap?.addEventListener('mouseleave', startAuto);

  startAuto();
}

// ----- Lightbox -----
function initLightbox() {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const close = document.getElementById('lbClose');
  if (!lb || !lbImg) return;

  document.addEventListener('click', (e) => {
    const item = e.target.closest('.gal-item');
    if (item) {
      const img = item.querySelector('img');
      if (img && img.src) {
        lbImg.src = img.src;
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    }
  });

  function closeLb() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
  close?.addEventListener('click', closeLb);
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLb(); });
}

// ----- Smooth scroll -----
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ----- Form → WhatsApp -----
window.handleSubmit = function (e) {
  e.preventDefault();
  const f = e.target;
  const inputs = f.querySelectorAll('input, textarea, select');
  const v = Array.from(inputs).map(i => i.value || '');
  const [name, email, dates, guests, stay, msg] = v;
  const lines = [
    'Bonjour Nyabinghi !',
    '',
    'Je souhaite réserver un séjour.',
    '• Nom: ' + name,
    '• Email: ' + email,
    '• Dates: ' + dates,
    '• Voyageurs: ' + guests,
    '• Hébergement: ' + stay,
    '',
    msg
  ].filter(Boolean).join('\n');
  window.open('https://wa.me/221770758313?text=' + encodeURIComponent(lines), '_blank');
};
