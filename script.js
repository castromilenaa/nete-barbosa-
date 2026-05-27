'use strict';

/* ============================================================
   1. REVEAL ON SCROLL
============================================================ */
(function initReveal() {
  const els = document.querySelectorAll(
    '.reveal-up, .reveal-fade, .reveal-left, .reveal-right'
  );
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach((el) => observer.observe(el));
})();

/* ============================================================
   2. SMOOTH SCROLL
============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ============================================================
   3. PARALLAX — hero calligraphy + photo
============================================================ */
(function initParallax() {
  const hero = document.querySelector('.hero');
  const calligraphy = document.querySelectorAll('.calligraphy');
  const heroPhoto = document.querySelector('.hero__photo');
  if (!hero || !calligraphy.length) return;

  if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (scrollY > hero.offsetHeight) { ticking = false; return; }

        calligraphy.forEach((el, i) => {
          const speed = i === 0 ? 0.32 : 0.20;
          el.style.transform = `translateY(${scrollY * speed}px) rotate(${i === 0 ? -6 : -3}deg)`;
        });

        if (heroPhoto) {
          heroPhoto.style.transform = `scale(1) translateY(${scrollY * 0.15}px)`;
        }

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ============================================================
   4. HERO SCROLL INDICATOR FADE
============================================================ */
(function initScrollFade() {
  const indicator = document.querySelector('.hero__scroll');
  if (!indicator) return;

  window.addEventListener('scroll', () => {
    const opacity = Math.max(0, 1 - window.scrollY / 160);
    indicator.style.opacity = String(opacity * 0.36);
  }, { passive: true });
})();

/* ============================================================
   5. MAGNETIC BUTTONS — desktop only
============================================================ */
(function initMagneticButtons() {
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('.btn--primary, .btn--outline').forEach((btn) => {
    btn.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.12;
      const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.12;
      this.style.transform = `translate(${dx}px, ${dy}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave', function () {
      this.style.transform = '';
    });
  });
})();

/* ============================================================
   6. MOCKUP FLOAT ANIMATION
============================================================ */
(function initMockupFloat() {
  const mockup = document.querySelector('.preview__mockup-img');
  if (!mockup) return;
  if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;

  let startTime = null;
  let animFrame = null;
  let isVisible = false;

  new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    if (isVisible) {
      startTime = null;
      animFrame = requestAnimationFrame(floatStep);
    } else {
      cancelAnimationFrame(animFrame);
      mockup.style.transform = '';
    }
  }, { threshold: 0.2 }).observe(mockup);

  function floatStep(ts) {
    if (!startTime) startTime = ts;
    const t = (ts - startTime) / 1000;
    mockup.style.transform = `translateY(${Math.sin(t * 0.65) * 7}px)`;
    if (isVisible) animFrame = requestAnimationFrame(floatStep);
  }
})();

/* ============================================================
   7. GLOW TRACKING
============================================================ */
(function initGlowTracking() {
  const section = document.querySelector('.inscricao');
  const glow = document.querySelector('.inscricao__bg-glow');
  if (!section || !glow) return;

  const isTouch = window.matchMedia('(hover: none)').matches;

  if (!isTouch) {
    section.addEventListener('mousemove', (e) => {
      const rect = section.getBoundingClientRect();
      glow.style.transition = 'left 0.6s ease, top 0.6s ease';
      glow.style.left = `${e.clientX - rect.left}px`;
      glow.style.top = `${e.clientY - rect.top}px`;
      glow.style.transform = 'translate(-50%, -50%)';
    });
    section.addEventListener('mouseleave', () => {
      glow.style.left = '50%';
      glow.style.top = '50%';
      glow.style.transform = 'translate(-50%, -50%)';
    });
  } else {
    window.addEventListener('scroll', () => {
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;
      const progress = Math.max(0, Math.min(1, 1 - (rect.top / viewH)));
      const x = 30 + progress * 40;
      const y = 20 + progress * 60;
      glow.style.transition = 'left 0.8s ease, top 0.8s ease';
      glow.style.left = `${x}%`;
      glow.style.top  = `${y}%`;
      glow.style.transform = 'translate(-50%, -50%)';
    }, { passive: true });
  }
})();

/* ============================================================
   8. PREVIEW SCENE 3D TILT
============================================================ */
(function initSceneTilt() {
  const scene = document.querySelector('.preview__scene');
  if (!scene) return;
  if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;

  const isTouch = window.matchMedia('(hover: none)').matches;

  if (!isTouch) {
    scene.addEventListener('mousemove', (e) => {
      const rect = scene.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const rx =  ((e.clientY - cy) / (rect.height / 2)) * -4;
      const ry =  ((e.clientX - cx) / (rect.width  / 2)) *  5;
      scene.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
    });
    scene.addEventListener('mouseleave', () => {
      scene.style.transform = '';
    });
  } else {
    let orientationActive = false;

    scene.addEventListener('touchmove', (e) => {
      if (orientationActive) return;
      const touch = e.touches[0];
      const rect = scene.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const rx = ((touch.clientY - cy) / (rect.height / 2)) * -3;
      const ry = ((touch.clientX - cx) / (rect.width  / 2)) *  4;
      scene.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
      scene.classList.add('is-active');
    }, { passive: true });

    scene.addEventListener('touchend', () => {
      if (orientationActive) return;
      scene.style.transform = '';
      scene.classList.remove('is-active');
    }, { passive: true });

    const applyOrientation = (e) => {
      orientationActive = true;
      const ry = Math.max(-5, Math.min(5, (e.gamma || 0) * 0.18));
      const rx = Math.max(-4, Math.min(4, ((e.beta  || 0) - 40) * 0.10));
      scene.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
    };

    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      scene.addEventListener('touchstart', () => {
        DeviceOrientationEvent.requestPermission()
          .then((state) => {
            if (state === 'granted') {
              window.addEventListener('deviceorientation', applyOrientation, { passive: true });
            }
          })
          .catch(() => {});
      }, { once: true, passive: true });
    } else if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', applyOrientation, { passive: true });
    }

    let isVisible = false;
    new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (!isVisible && !orientationActive) scene.style.transform = '';
    }, { threshold: 0.2 }).observe(scene);

    window.addEventListener('scroll', () => {
      if (!isVisible || orientationActive) return;
      const rect = scene.getBoundingClientRect();
      const viewH = window.innerHeight;
      const progress = Math.max(-1, Math.min(1, 1 - (rect.top + rect.height / 2) / viewH * 2));
      scene.style.transform = `rotateX(${progress * -3}deg) rotateY(${progress * 2}deg) translateZ(4px)`;
    }, { passive: true });
  }
})();

/* ============================================================
   9. FAQ ACCORDION
============================================================ */
(function initFaq() {
  const items = document.querySelectorAll('.faq__item');
  if (!items.length) return;

  items.forEach((item) => {
    const btn = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    if (!btn || !answer) return;

    // Remove hidden attribute and use CSS for visibility
    answer.removeAttribute('hidden');

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all others
      items.forEach((other) => {
        const otherBtn = other.querySelector('.faq__question');
        const otherAnswer = other.querySelector('.faq__answer');
        if (otherBtn && otherAnswer && other !== item) {
          otherBtn.setAttribute('aria-expanded', 'false');
          otherAnswer.classList.remove('faq__answer--open');
        }
      });

      // Toggle current
      const nextState = !isOpen;
      btn.setAttribute('aria-expanded', String(nextState));
      answer.classList.toggle('faq__answer--open', nextState);
    });
  });
})();