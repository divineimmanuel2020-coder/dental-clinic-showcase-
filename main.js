(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const menuButton = $('.menu-toggle');
  const mobileMenu = $('.mobile-menu');
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    mobileMenu.classList.toggle('open', open);
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  $$('.mobile-menu a').forEach(link => link.addEventListener('click', () => {
    mobileMenu.classList.remove('open'); menuButton.setAttribute('aria-expanded','false');
  }));

  const translations = {
    en: { title: 'Clínica Solmar — Dentistry, thoughtfully considered' },
    es: { title: 'Clínica Solmar — Odontología, pensada para ti' }
  };
  function setLanguage(lang) {
    document.documentElement.lang = lang;
    document.title = translations[lang].title;
    $$('[data-en][data-es]').forEach(el => { el.textContent = el.dataset[lang]; });
    $$('[data-lang]').forEach(btn => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }
  $$('[data-lang]').forEach(btn => btn.addEventListener('click', () => setLanguage(btn.dataset.lang)));

  const cookie = $('.cookie-banner');
  if (sessionStorage.getItem('solmar-cookie-choice')) cookie?.remove();
  $$('.cookie-banner button').forEach(btn => btn.addEventListener('click', () => {
    sessionStorage.setItem('solmar-cookie-choice', btn.classList.contains('cookie-accept') ? 'accepted' : 'declined');
    cookie?.remove();
  }));

  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: .12 });
  $$('section:not(.hero) .section-index, .treatment-card, .person, .story-copy, .tech-copy, .visit-copy').forEach(el => {
    el.classList.add('reveal'); observer.observe(el);
  });

  $('#bookingForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('name')?.toString().trim();
    const contact = data.get('contact')?.toString().trim();
    const interest = data.get('interest')?.toString();
    const message = `Hello Clínica Solmar, my name is ${name}. You can reach me at ${contact}. I am interested in: ${interest}. I'd like to arrange a consultation.`;
    // Demonstration contact number: replace with the clinic's real WhatsApp number before launch.
    const demoNumber = '34600000000';
    window.open(`https://wa.me/${demoNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });
})();
