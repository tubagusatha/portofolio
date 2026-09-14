import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import jsVectorMap from 'jsvectormap';
import 'jsvectormap/dist/maps/world.js';
import 'jsvectormap/dist/jsvectormap.css';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 1. PRELOADER & INTRO ANIMATION
// ==========================================
const preloader = document.getElementById('preloader');
const preloaderWords = document.querySelectorAll('.preloader-text .word');
const loadingBar = document.querySelector('.loading-bar');

// Lock scroll initially
document.body.style.overflow = 'hidden';

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
}

const preloaderTl = gsap.timeline({
  onComplete: () => {
    preloader.style.display = 'none';
    document.body.style.overflow = '';
    
    // Reveal Hero Section smoothly
    gsap.fromTo('.hero-badge', 
      { y: 20, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    );
    gsap.fromTo('.hero .title', 
      { y: 40, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out' },
      "-=0.7"
    );
    gsap.fromTo('.hero .desc', 
      { y: 20, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
      "-=0.9"
    );
    gsap.fromTo('.hero .cta-group', 
      { y: 20, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
      "-=0.8"
    );
    gsap.fromTo('.hero-visual', 
      { scale: 0.95, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 1.5, ease: 'expo.out' },
      "-=1.2"
    );
    gsap.fromTo('.navbar', 
      { y: -100, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
      "-=1"
    );
  }
});

// Preloader sequence
preloaderTl.to(preloaderWords, {
  y: 0,
  opacity: 1,
  duration: 1,
  stagger: 0.2,
  ease: 'expo.out',
  delay: 0.2
})
.to(loadingBar, {
  width: "100%",
  duration: 1.2,
  ease: "power2.inOut"
}, "-=0.5")
.to(preloaderWords, {
  y: -30,
  opacity: 0,
  duration: 0.6,
  stagger: 0.1,
  ease: "power3.in"
})
.to(loadingBar, {
  opacity: 0,
  duration: 0.3
}, "<")
.to(preloader, {
  yPercent: -100,
  duration: 1,
  ease: "expo.inOut"
});

// ==========================================
// 2. CUSTOM CURSOR & INTERACTIVITY
// ==========================================
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (window.matchMedia("(pointer: fine)").matches) {
  // Cursor movement
  window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    gsap.set(cursorDot, { x: posX, y: posY });
    gsap.to(cursorOutline, {
      x: posX,
      y: posY,
      duration: 0.15,
      ease: "power2.out"
    });
  });

  // Hover states
  const interactables = document.querySelectorAll('a, button, .btn, .feature-card, .sticky-card');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.classList.add('hover');
      cursorOutline.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.classList.remove('hover');
      cursorOutline.classList.remove('hover');
    });
  });

  // Magnetic Buttons (Subtle)
  const magneticBtns = document.querySelectorAll('.btn');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.2;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.2;

      gsap.to(btn, {
        x: x,
        y: y,
        duration: 0.3,
        ease: "power2.out"
      });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.4)"
      });
    });
  });
}

// ==========================================
// 3. SCROLL REVEALS (GSAP)
// ==========================================

// Hide elements initially for reveal
const revealSelectors = ".section-header, .timeline-step, .feature-card, .skills-badges .badge, .title-large, .subtitle-large, .travel-desc, .map-wrapper, .gallery-img-wrapper, .award-hero-card, .award-row, .cert-card, .final .content > *";
gsap.set(revealSelectors, { autoAlpha: 0, y: 30 });

setTimeout(() => {
  // Generic Section Header Reveal
  gsap.utils.toArray(".section-header").forEach((header) => {
    ScrollTrigger.create({
      trigger: header,
      start: "top 85%",
      onEnter: () => {
        gsap.to(header, { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out" });
      }
    });
  });

  // Education Grid
  gsap.utils.toArray(".timeline-step").forEach((card) => {
    ScrollTrigger.create({
      trigger: card,
      start: "top 85%",
      onEnter: () => {
        gsap.to(card, { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out" });
      }
    });
  });

  // Experience Grid
  ScrollTrigger.create({
    trigger: ".grid-cards",
    start: "top 85%",
    onEnter: () => {
      gsap.to(".feature-card", {
        autoAlpha: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out"
      });
    }
  });

  // Skills
  ScrollTrigger.create({
    trigger: ".skills-badges",
    start: "top 85%",
    onEnter: () => {
      gsap.to(".skills-badges .badge", {
        autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.02, ease: "back.out(1.5)"
      });
    }
  });

  // Travel Elements
  ScrollTrigger.create({
    trigger: ".travel",
    start: "top 80%",
    onEnter: () => {
      gsap.to([".title-large", ".subtitle-large", ".travel-desc", ".map-wrapper"], {
        autoAlpha: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out"
      });
    }
  });

  // Gallery
  ScrollTrigger.create({
    trigger: ".gallery-grid",
    start: "top 85%",
    onEnter: () => {
      gsap.to(".gallery-img-wrapper", {
        autoAlpha: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out"
      });
    }
  });

  // Awards & Certificates
  ScrollTrigger.create({
    trigger: ".achievement",
    start: "top 85%",
    onEnter: () => {
      gsap.to(".award-hero-card", { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out" });
      gsap.to(".award-row", { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.2 });
      gsap.to(".cert-card", { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.3 });
    }
  });

  // Final Contact
  ScrollTrigger.create({
    trigger: ".final",
    start: "top 80%",
    onEnter: () => {
      gsap.to(".final .content > *", { autoAlpha: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out" });
    }
  });

  ScrollTrigger.refresh();
}, 200);

// ==========================================
// 4. WORLD MAP (Premium Theme)
// ==========================================
const map = new jsVectorMap({
  selector: '#world-map',
  map: 'world',
  backgroundColor: 'transparent',
  regionStyle: {
    initial: {
      fill: '#1A1A1A', // Dark surface
      stroke: '#333333', // Subtle border
      strokeWidth: 0.5,
    },
    hover: {
      fill: '#262626'
    }
  },
  // Highlighted regions
  selectedRegions: ['IN', 'PK', 'TR', 'KH', 'VN', 'TH', 'SG', 'MY', 'SA'],
  selectedRegionsStyle: {
    fill: '#FAFAFA', // High contrast white for visited
  },
  zoomOnScroll: false,
});

window.addEventListener('resize', () => {
  if (map) map.updateSize();
});

// ==========================================
// 5. STICKY CARDS SCROLL EFFECT
// ==========================================
gsap.utils.toArray(".sticky-card").forEach((card, i, cards) => {
  if (i !== cards.length - 1) {
    gsap.to(card, {
      scale: 0.95, // Softer scale down for premium feel
      opacity: 0.5, // Don't fade out completely
      scrollTrigger: {
        trigger: card,
        start: "top 15%", 
        endTrigger: cards[i + 1], 
        end: "top 15%", 
        scrub: true,
      }
    });
  }
});
