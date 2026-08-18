const intro = document.getElementById('introScreen');
window.addEventListener('load', () => setTimeout(() => intro?.classList.add('hide'), 1500));

const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
toggle?.addEventListener('click', () => { const open = links.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); });
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => { links.classList.remove('open'); toggle?.setAttribute('aria-expanded','false'); }));

const revealObserver = new IntersectionObserver((entries) => entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } }), {threshold:.12});
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const counterObserver = new IntersectionObserver((entries) => entries.forEach(entry => {
  if(!entry.isIntersecting) return;
  const el = entry.target; const target = Number(el.dataset.value); const suffix = el.dataset.suffix || ''; const start = performance.now(); const duration = 1300;
  const animate = now => { const p = Math.min((now-start)/duration,1); const eased = 1-Math.pow(1-p,3); el.textContent = `${Math.round(target*eased)}${suffix}`; if(p<1) requestAnimationFrame(animate); };
  requestAnimationFrame(animate); counterObserver.unobserve(el);
}),{threshold:.55});
document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

const progress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => { const max = document.documentElement.scrollHeight - innerHeight; const pct = max > 0 ? (scrollY/max)*100 : 0; progress.style.width = `${pct}%`; }, {passive:true});

const glow = document.getElementById('cursorGlow');
window.addEventListener('pointermove', e => { if(glow){ glow.style.left = `${e.clientX}px`; glow.style.top = `${e.clientY}px`; } }, {passive:true});

const dialog = document.getElementById('lightbox'); const img = document.getElementById('lightboxImg');
document.querySelectorAll('[data-image]').forEach(btn => btn.addEventListener('click', () => { img.src = btn.dataset.image; img.alt = btn.dataset.alt || ''; dialog.showModal(); }));
document.querySelector('.lightbox-close')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', e => { const r = dialog.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) dialog.close(); });

if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => { if(innerWidth<900) return; const r=card.getBoundingClientRect(); const rx=((e.clientY-r.top)/r.height-.5)*-6; const ry=((e.clientX-r.left)/r.width-.5)*8; card.style.transform=`perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`; });
    card.addEventListener('mouseleave', () => card.style.transform='');
  });
}

document.getElementById('year').textContent = new Date().getFullYear();