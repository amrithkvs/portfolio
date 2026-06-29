// Small, dependency-free interactions.

// Theme toggle (light / dark). Initial theme is set by an inline <head> script
// to avoid a flash; this just handles clicks and persists the choice.
(function () {
  var root = document.documentElement;
  var btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var toLight = root.getAttribute('data-theme') !== 'light';
    if (toLight) root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');
    try { localStorage.setItem('theme', toLight ? 'light' : 'dark'); } catch (e) {}
  });
})();

// Current year in footer
document.querySelectorAll('#year').forEach(el => { el.textContent = '2026'; });

// Mobile nav toggle
const nav = document.getElementById('nav');
const toggle = document.getElementById('navToggle');
if (toggle && nav) {
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('.nav__links a').forEach(a =>
    a.addEventListener('click', () => nav.classList.remove('open'))
  );
}

// Reveal-on-scroll
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && reveals.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => el.classList.add('in'));
}

// Coverflow & banner stack — only animate while the card is in frame; static otherwise.
(function () {
  var flows = document.querySelectorAll('.coverflow, .bannerstack, .scaleshow, .cardswipe');
  if (!flows.length) return;
  if (!('IntersectionObserver' in window)) {
    flows.forEach(function (f) { f.classList.add('is-playing'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { e.target.classList.toggle('is-playing', e.isIntersecting); });
  }, { threshold: 0.5 });
  flows.forEach(function (f) { io.observe(f); });
})();

// Lightbox — click case-study figure images to view them larger.
// Scoped to `.cs-figure img`, which only exists on case-study pages (not the landing page).
(function () {
  var imgs = document.querySelectorAll('.cs-figure img');
  if (!imgs.length) return;
  var lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.innerHTML = '<button class="lightbox__close" type="button" aria-label="Close">✕</button><img alt="" />';
  document.body.appendChild(lb);
  var lbImg = lb.querySelector('img');
  function open(src, alt) { lbImg.src = src; lbImg.alt = alt || ''; lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close() { lb.classList.remove('open'); document.body.style.overflow = ''; lbImg.removeAttribute('src'); }
  imgs.forEach(function (img) {
    img.addEventListener('click', function () { open(img.currentSrc || img.src, img.alt); });
  });
  lb.addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lb.classList.contains('open')) close(); });
})();
