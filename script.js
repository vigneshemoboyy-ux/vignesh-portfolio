// ============================================================
// VIGNESH R — portfolio interactions
// ============================================================
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Sticky nav shadow ---------- */
  var nav = document.getElementById('siteNav');
  function onScrollNav() {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  document.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- Mobile menu ---------- */
  var navToggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');

  function closeMobileMenu() {
    if (!mobileNav) return;
    mobileNav.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('menu-open', isOpen);
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMobileMenu();
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('section[id]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));

  function setActiveLink() {
    var scrollPos = window.scrollY + 140;
    var current = sections[0] && sections[0].id;
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos) current = sec.id;
    });
    navLinks.forEach(function (link) {
      var match = link.getAttribute('href') === '#' + current;
      link.classList.toggle('is-active', match);
    });
  }
  document.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Skill bar fill animation ---------- */
  var skillBars = document.querySelectorAll('.skill-bar span');
  if ('IntersectionObserver' in window) {
    var barIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var w = el.style.width;
          el.style.width = '0%';
          requestAnimationFrame(function () {
            el.style.transition = 'width 1.1s cubic-bezier(.16,1,.3,1)';
            el.style.width = w;
          });
          barIo.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    skillBars.forEach(function (el) { barIo.observe(el); });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Contact form validation (client-side only) ---------- */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      var name = document.getElementById('fName');
      var email = document.getElementById('fEmail');
      var type = document.getElementById('fType');
      var message = document.getElementById('fMsg');
      var note = document.getElementById('formNote');

      function setError(id, msg) {
        var el = document.getElementById('err-' + id);
        if (el) el.textContent = msg || '';
        if (msg) valid = false;
      }

      setError('name', name.value.trim() ? '' : 'Please enter your name.');
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      setError('email', emailOk ? '' : 'Please enter a valid email.');
      setError('type', type.value ? '' : 'Please select a project type.');
      setError('message', message.value.trim().length >= 10 ? '' : 'Message should be at least 10 characters.');

      if (valid) {
        note.textContent = 'Thanks — this demo form validated successfully. Connect it to Formspree, EmailJS or your own backend to send messages for real.';
        note.classList.add('ok');
        form.reset();
      } else {
        note.textContent = 'Please fix the highlighted fields above.';
        note.classList.remove('ok');
      }
    });
  }
})();



/* ============================================================
   SELECTED WORK — GALLERY BEHAVIOR
   Drag-to-scroll, arrow buttons, progress bar, hover-to-play.
   Load this AFTER your existing script.js.
   ============================================================ */
(function () {
  "use strict";

  var scrollers = document.querySelectorAll("[data-hscroll]");

  scrollers.forEach(function (wrap) {
    var name  = wrap.getAttribute("data-hscroll");
    var track = wrap.querySelector(".hscroll-track");
    var bar   = document.querySelector('[data-progress="' + name + '"]');
    var arrows = document.querySelectorAll('[data-scroll-target="' + name + '"]');

    if (!track) return;

    /* ---- arrow buttons: move by one card + gap ---- */
    arrows.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var card = track.querySelector(".gcard");
        var cardWidth = card ? card.getBoundingClientRect().width : 260;
        var gap = 18; // matches --gap in .hscroll-track
        var dir = parseInt(btn.getAttribute("data-dir"), 10);
        track.scrollBy({ left: dir * (cardWidth + gap), behavior: "smooth" });
      });
    });

    /* ---- progress bar + arrow enabled/disabled state ---- */
    function updateProgress() {
      var max = track.scrollWidth - track.clientWidth;
      var ratio = max > 0 ? track.scrollLeft / max : 0;
      var visibleFraction = Math.min(track.clientWidth / track.scrollWidth, 1);

      if (bar) {
        var barWidthPct = Math.max(visibleFraction * 100, 8);
        var travel = 100 - barWidthPct;
        bar.style.width = barWidthPct + "%";
        bar.style.transform = "translateX(" + ratio * travel + "%)";
      }

      arrows.forEach(function (btn) {
        var dir = parseInt(btn.getAttribute("data-dir"), 10);
        if (dir < 0) btn.disabled = track.scrollLeft <= 4;
        if (dir > 0) btn.disabled = track.scrollLeft >= max - 4;
      });
    }

    track.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();

    /* ---- drag-to-scroll (mouse only; touch uses native scroll) ---- */
    var isDown = false, startX = 0, startScroll = 0, moved = false;

    track.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "touch") return;
      isDown = true; moved = false;
      startX = e.clientX;
      startScroll = track.scrollLeft;
      track.classList.add("is-dragging");
    });

    window.addEventListener("pointermove", function (e) {
      if (!isDown) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      track.scrollLeft = startScroll - dx;
    });

    window.addEventListener("pointerup", function () {
      if (!isDown) return;
      isDown = false;
      track.classList.remove("is-dragging");
    });

    /* prevent a click firing on a card right after a drag */
    track.addEventListener("click", function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation(); }
    }, true);
  });

  /* ---- hover-to-play for AI video / reel cards ---- */
  var videoCards = document.querySelectorAll("[data-video-card]");

  videoCards.forEach(function (card) {
    var video = card.querySelector("video");
    if (!video) return;

    function play() {
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
      card.classList.add("is-playing");
    }
    function pause() {
      video.pause();
      video.currentTime = 0;
      card.classList.remove("is-playing");
    }

    card.addEventListener("mouseenter", play);
    card.addEventListener("mouseleave", pause);

    /* tap-to-play on touch devices */
    card.addEventListener("click", function () {
      if (window.matchMedia("(hover: none)").matches) {
        card.classList.contains("is-playing") ? pause() : play();
      }
    });
  });

  /* ---- reveal-on-scroll for the gallery blocks
         (skip this if your existing script.js already observes .reveal) ---- */
  if (!window.__revealObserverActive) {
    var revealTargets = document.querySelectorAll(".gallery-block.reveal");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(function (el) { io.observe(el); });
  }
})();



// ==================================================================================




