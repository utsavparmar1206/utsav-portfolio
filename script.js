document.documentElement.classList.add('js');
document.body.classList.add('enhanced');

document.querySelector('.kicker')?.remove();

const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');

toggle?.addEventListener('click', () => {
  const open = links?.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(Boolean(open)));
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    links?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});

const progress = document.getElementById('scrollProgress');
const updateProgress = () => {
  if (!progress) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  progress.style.width = `${pct}%`;
};
updateProgress();
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress, { passive: true });

const glow = document.getElementById('cursorGlow');
if (glow && matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', event => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });
}

const scenes = document.querySelectorAll('.scene');
if ('IntersectionObserver' in window) {
  const sceneObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
  scenes.forEach(scene => sceneObserver.observe(scene));
} else {
  scenes.forEach(scene => scene.classList.add('in-view'));
}

const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const navTargets = navLinks
  .map(link => ({ link, target: document.querySelector(link.getAttribute('href')) }))
  .filter(item => item.target);

if ('IntersectionObserver' in window && navTargets.length) {
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.remove('active'));
      navTargets.find(item => item.target === entry.target)?.link.classList.add('active');
    });
  }, { threshold: 0.25, rootMargin: '-25% 0px -60% 0px' });
  navTargets.forEach(item => navObserver.observe(item.target));
}

const numericEls = [
  ...document.querySelectorAll('.metric-card > strong'),
  ...document.querySelectorAll('.project-metrics strong')
];

const animateNumber = el => {
  if (el.dataset.animated === 'true') return;
  const original = el.textContent.trim();
  const match = original.match(/([\d,.]+)(.*)/);
  if (!match) return;
  const target = Number(match[1].replace(/,/g, ''));
  if (!Number.isFinite(target)) return;
  const suffix = match[2] || '';
  const duration = 1150;
  const start = performance.now();
  el.dataset.animated = 'true';

  const frame = now => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const value = Math.round(target * eased);
    el.textContent = `${value.toLocaleString()}${suffix}`;
    if (t < 1) requestAnimationFrame(frame);
    else el.textContent = original;
  };
  requestAnimationFrame(frame);
};

if ('IntersectionObserver' in window) {
  const numberObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateNumber(entry.target);
      numberObserver.unobserve(entry.target);
    });
  }, { threshold: 0.65 });
  numericEls.forEach(el => numberObserver.observe(el));
}

const dialog = document.getElementById('lightbox');
const dialogImg = document.getElementById('lightboxImg');

document.querySelectorAll('[data-image]').forEach(button => {
  button.addEventListener('click', () => {
    if (!dialog || !dialogImg) return;
    dialogImg.src = button.dataset.image || '';
    dialogImg.alt = button.dataset.alt || '';
    if (typeof dialog.showModal === 'function') dialog.showModal();
  });
});

document.querySelector('.lightbox-close')?.addEventListener('click', () => dialog?.close());
dialog?.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (outside) dialog.close();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && dialog?.open) dialog.close();
});

const motionAllowed = !matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer:fine)').matches;

if (motionAllowed && finePointer) {
  const interactiveCards = document.querySelectorAll('.tilt-card, .role-card');
  interactiveCards.forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - y) * 4.5;
      const rotateY = (x - 0.5) * 5.5;

      card.style.setProperty('--mx', `${x * 100}%`);
      card.style.setProperty('--my', `${y * 100}%`);

      if (card.classList.contains('tilt-card')) {
        card.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
      }
    });

    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('transform');
      card.style.setProperty('--mx', '50%');
      card.style.setProperty('--my', '50%');
    });
  });

  const portrait = document.querySelector('.portrait-stage');
  const hero = document.querySelector('.hero');
  hero?.addEventListener('pointermove', event => {
    if (!portrait) return;
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    portrait.style.setProperty('--hero-x', `${x * 8}px`);
    portrait.style.setProperty('--hero-y', `${y * 8}px`);
  }, { passive: true });
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
