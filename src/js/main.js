/* ================================================================
   START WORKING v2.0 — Main JavaScript
   ================================================================ */

(function () {
  'use strict';

  /* ===== DOM REFERENCES ===== */
  const header = document.getElementById('header');
  const heroSection = document.getElementById('hero');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuCloseBtn = document.getElementById('menu-close');
  const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link');
  const allLangBtns = document.querySelectorAll('.lang-toggle__btn');
  const navLinks = document.querySelectorAll('.header__nav-link');
  const sections = document.querySelectorAll('main > section[id]');

  /* ===== i18n SYSTEM ===== */
  const i18nCache = {};
  let currentLang = localStorage.getItem('sw-lang') || detectBrowserLang();

  function detectBrowserLang() {
    const nav = navigator.language || navigator.userLanguage || 'it';
    return nav.startsWith('en') ? 'en' : 'it';
  }

  async function loadTranslations(lang) {
    if (i18nCache[lang]) return i18nCache[lang];
    try {
      const res = await fetch('i18n/' + lang + '.json');
      if (!res.ok) throw new Error('Failed to load ' + lang + '.json');
      const data = await res.json();
      i18nCache[lang] = data;
      return data;
    } catch (err) {
      console.warn('[i18n] Could not load translations for "' + lang + '":', err);
      return null;
    }
  }

  function applyTranslations(translations) {
    if (!translations) return;

    // Text content: data-i18n="key.subkey"
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var value = getNestedValue(translations, key);
      if (value != null) {
        el.textContent = value;
      }
    });

    // Attributes: data-i18n-attr="attrName:key.subkey"
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      var pairs = el.getAttribute('data-i18n-attr').split(',');
      pairs.forEach(function (pair) {
        var parts = pair.trim().split(':');
        if (parts.length === 2) {
          var attrName = parts[0];
          var key = parts[1];
          var value = getNestedValue(translations, key);
          if (value != null) {
            el.setAttribute(attrName, value);
          }
        }
      });
    });

    // Update page title
    var titleValue = getNestedValue(translations, 'meta.title');
    if (titleValue) {
      document.title = titleValue;
    }

    // Update html lang
    document.documentElement.lang = currentLang;
  }

  function getNestedValue(obj, path) {
    return path.split('.').reduce(function (acc, part) {
      return acc && acc[part] != null ? acc[part] : null;
    }, obj);
  }

  async function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('sw-lang', lang);

    var translations = await loadTranslations(lang);
    applyTranslations(translations);

    // Update all toggle buttons
    allLangBtns.forEach(function (btn) {
      var isActive = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  // Language button handlers
  allLangBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLanguage(btn.getAttribute('data-lang'));
    });
  });

  /* ===== HEADER SCROLL: transparent ↔ solid ===== */
  var headerObserver = new IntersectionObserver(
    function (entries) {
      var isHeroVisible = entries[0].isIntersecting;
      header.classList.toggle('header--transparent', isHeroVisible);
      header.classList.toggle('header--solid', !isHeroVisible);
    },
    { threshold: 0.1 }
  );
  headerObserver.observe(heroSection);

  // Set initial state
  header.classList.add('header--transparent');

  /* ===== SCROLL SPY ===== */
  var currentActive = null;

  var spyObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          if (id !== currentActive) {
            currentActive = id;
            navLinks.forEach(function (link) {
              var href = link.getAttribute('href');
              link.classList.toggle('active', href === '#' + id);
            });
            // Update URL hash without scrolling
            if (history.replaceState) {
              history.replaceState(null, '', '#' + id);
            }
          }
        }
      });
    },
    {
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0
    }
  );

  sections.forEach(function (section) {
    spyObserver.observe(section);
  });

  /* ===== SMOOTH SCROLL NAV ===== */
  function handleNavClick(e) {
    var href = e.currentTarget.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      var target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', handleNavClick);
  });

  // Logo click → scroll to top
  var logo = document.querySelector('.header__logo');
  if (logo) {
    logo.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===== MOBILE MENU ===== */
  function openMobileMenu() {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // Focus the close button
    menuCloseBtn.focus();
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    // Return focus to hamburger
    hamburgerBtn.focus();
  }

  hamburgerBtn.addEventListener('click', openMobileMenu);
  menuCloseBtn.addEventListener('click', closeMobileMenu);

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      closeMobileMenu();
      // Small delay so menu closes visually before scroll
      var href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        setTimeout(function () {
          var target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    });
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  /* ===== INIT ===== */
  // Load translations on page load
  setLanguage(currentLang);

})();
