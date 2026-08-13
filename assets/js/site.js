(() => {
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');
  const body = document.body;

  if (menuToggle && nav) {
    const closeMenu = () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
      nav.classList.remove('is-open');
      body.classList.remove('menu-open');
    };

    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!open));
      menuToggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
      nav.classList.toggle('is-open', !open);
      body.classList.toggle('menu-open', !open);
    });

    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMenu(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
  }

  const header = document.querySelector('[data-header]');
  if (header) {
    const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  document.querySelectorAll('[data-before-after]').forEach((component) => {
    const range = component.querySelector('[data-before-after-range]');
    if (!range) return;
    const update = () => component.style.setProperty('--position', `${range.value}%`);
    range.addEventListener('input', update);
    update();
  });

  document.querySelectorAll('[data-slider]').forEach((slider) => {
    const track = slider.querySelector('[data-slider-track]');
    const dotsWrap = slider.querySelector('[data-slider-dots]');
    const prevBtn = slider.querySelector('[data-slider-prev]');
    const nextBtn = slider.querySelector('[data-slider-next]');
    const toggleBtn = slider.querySelector('[data-slider-toggle]');
    if (!track) return;
    const slides = Array.from(track.children);
    let index = 0;

    const dots = slides.map((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Go to photo ${i + 1}`);
      dot.addEventListener('click', () => { goTo(i); restartAutoplay(); });
      if (dotsWrap) dotsWrap.appendChild(dot);
      return dot;
    });

    function update() {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      update();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(index - 1); restartAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(index + 1); restartAutoplay(); });

    let startX = null;
    track.addEventListener('touchstart', (event) => { startX = event.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', (event) => {
      if (startX === null) return;
      const diff = event.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 40) { goTo(index + (diff < 0 ? 1 : -1)); restartAutoplay(); }
      startX = null;
    });

    const AUTOPLAY_MS = 3000;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let autoplayTimer = null;
    let userPaused = false;

    function stopAutoplay() {
      if (autoplayTimer) { window.clearInterval(autoplayTimer); autoplayTimer = null; }
    }

    function startAutoplay() {
      if (reduceMotion || slides.length < 2 || userPaused) return;
      stopAutoplay();
      autoplayTimer = window.setInterval(() => goTo(index + 1), AUTOPLAY_MS);
    }

    function restartAutoplay() { startAutoplay(); }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        userPaused = !userPaused;
        toggleBtn.classList.toggle('is-paused', userPaused);
        toggleBtn.setAttribute('aria-pressed', String(userPaused));
        toggleBtn.setAttribute('aria-label', userPaused ? 'Play slideshow' : 'Pause slideshow');
        if (userPaused) stopAutoplay(); else startAutoplay();
      });
    }

    update();

    if ('IntersectionObserver' in window) {
      const playObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          startAutoplay();
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.3 });
      playObserver.observe(slider);
    } else {
      startAutoplay();
    }
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  document.querySelectorAll('[data-track]').forEach((element) => {
    element.addEventListener('click', () => {
      const eventName = element.getAttribute('data-track');
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, {
          link_url: element.href || '',
          link_text: (element.textContent || '').trim(),
          page_path: window.location.pathname
        });
      }
    });
  });

  // Cookie consent: default non-essential storage (analytics/ads) to denied
  // until the visitor chooses, using the Google Consent Mode signal shape so
  // it's ready for whichever analytics tag gets added later.
  window.dataLayer = window.dataLayer || [];
  function gtagConsent() { window.dataLayer.push(arguments); }
  if (typeof window.gtag !== 'function') { window.gtag = gtagConsent; }
  window.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied' });

  const CONSENT_KEY = 'showtime_cookie_consent';
  const banner = document.querySelector('[data-cookie-consent]');

  function applyConsent(choice) {
    localStorage.setItem(CONSENT_KEY, choice);
    window.gtag('consent', 'update', {
      analytics_storage: choice === 'accepted' ? 'granted' : 'denied',
      ad_storage: choice === 'accepted' ? 'granted' : 'denied'
    });
  }

  function hideBanner() {
    if (!banner) return;
    banner.classList.remove('is-visible');
    window.setTimeout(() => banner.setAttribute('hidden', ''), 300);
  }

  function showBanner() {
    if (!banner) return;
    banner.removeAttribute('hidden');
    window.requestAnimationFrame(() => banner.classList.add('is-visible'));
  }

  if (banner) {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === 'accepted' || stored === 'declined') {
      applyConsent(stored);
    } else {
      window.setTimeout(showBanner, 600);
    }

    const acceptBtn = banner.querySelector('[data-cookie-accept]');
    const declineBtn = banner.querySelector('[data-cookie-decline]');
    if (acceptBtn) acceptBtn.addEventListener('click', () => { applyConsent('accepted'); hideBanner(); });
    if (declineBtn) declineBtn.addEventListener('click', () => { applyConsent('declined'); hideBanner(); });
  }

  document.querySelectorAll('[data-cookie-manage]').forEach((el) => {
    el.addEventListener('click', (event) => {
      event.preventDefault();
      showBanner();
    });
  });
})();
