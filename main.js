// ═══════════════════════════════════════════════
//  VIDHYADHAN — Shared JS
// ═══════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ── Nav scroll effect ──
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  // ── Mobile nav toggle ──
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.classList.toggle('open');
    });
  }

  // ── Active nav link ──
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  // ── Reveal on scroll ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.transitionDelay = (e.target.dataset.delay || 0) + 'ms';
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach((el, i) => {
    if (!el.dataset.delay) el.dataset.delay = (i % 4) * 80;
    observer.observe(el);
  });

  // ── Counter animation ──
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dec = el.dataset.dec || 0;
    let start = null;
    const dur = 1800;
    const step = (ts) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      el.textContent = (target * ease).toFixed(dec) + suffix;
      if (prog < 1) requestAnimationFrame(step);
    };
    const countObs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { requestAnimationFrame(step); countObs.unobserve(el); }
    }, { threshold: 0.5 });
    countObs.observe(el);
  });

  // ── Accordion ──
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // ── Tabs ──
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.tabs-wrap');
      const target = btn.dataset.tab;
      group.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
      group.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === target));
    });
  });

  // ── Search/filter ──
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      document.querySelectorAll('[data-searchable]').forEach(el => {
        el.style.display = el.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  }


  // ── Auto-inject Last Verified ──
  document.querySelectorAll('.scheme-card, .scholarship-card').forEach(card => {
    if(card.classList.contains('scheme-card')) {
      const detail = card.querySelector('.scheme-detail');
      if(detail) {
        detail.insertAdjacentHTML('beforeend', `
          <div style="margin-top:14px; padding-top:12px; border-top:1px dashed rgba(255,255,255,0.08); display:flex; justify-content:space-between; font-size:0.75rem; color:var(--white-faint); font-family:'Poppins', sans-serif;">
            <span>✓ Verified: April 2026</span>
            <a href="about.html" style="color:var(--gold);text-decoration:none;">Report Update</a>
          </div>
        `);
      }
    } else if(card.classList.contains('scholarship-card')) {
      const rightCol = card.querySelector('.sc-right');
      if(rightCol) {
        rightCol.insertAdjacentHTML('beforeend', `
          <div style="margin-top:14px; font-size:0.72rem; color:var(--white-faint); font-family:'Poppins', sans-serif;">
            <div style="margin-bottom:4px;">✓ Verified: Apr 2026</div>
            <a href="about.html" style="color:var(--gold);text-decoration:none;">Report</a>
          </div>
        `);
      }
    }
  });

  // ── Theme Toggle ──
  const navLinksList = document.querySelector('.nav-links');
  if(navLinksList) {
    navLinksList.insertAdjacentHTML('beforeend', `<li class="theme-toggle" style="cursor:pointer; font-size:1.2rem; margin-left:12px; user-select:none;" title="Toggle Light/Dark Mode">🌓</li>`);
    const themeBtn = document.querySelector('.theme-toggle');
    
    // Load preference
    if(localStorage.getItem('theme') === 'light') {
      document.body.classList.add('light-mode');
    }
    
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });

    // Language Change Option (Google Translate)
    const translateLi = document.createElement('li');
    translateLi.id = "google_translate_element";
    // Adjust margin based on screen size, on desktop give it left margin
    translateLi.style.margin = "0 8px";
    translateLi.style.display = "flex";
    translateLi.style.alignItems = "center";
    navLinksList.appendChild(translateLi);

    const gtScript = document.createElement('script');
    gtScript.type = 'text/javascript';
    gtScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(gtScript);

    window.googleTranslateElementInit = function() {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,hi,bn,te,mr,ta,ur,gu,kn,ml,pa', // English + major Indian languages
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
      }, 'google_translate_element');
    };
  }

});
