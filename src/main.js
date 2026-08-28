import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import jsVectorMap from 'jsvectormap';
import 'jsvectormap/dist/maps/world.js';
import 'jsvectormap/dist/jsvectormap.css';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 1. PRELOADER & HERO ANIMATION
// ==========================================
const preloader = document.getElementById('preloader');
const preloaderWords = document.querySelectorAll('.preloader-text .word');
const loadingBar = document.querySelector('.loading-bar');
const app = document.getElementById('app');

// Lock scroll during preloader
document.body.style.overflow = 'hidden';

// Custom Typing Function
function typeText(element, text, speed, callback) {
  element.innerHTML = '';
  element.style.opacity = '1';
  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
    } else {
      clearInterval(interval);
      if (callback) callback();
    }
  }, speed);
}

// Preloader Timeline
const preloaderTl = gsap.timeline({
  onComplete: () => {
    preloader.style.display = 'none';
    document.body.style.overflow = 'auto';
    document.body.style.overflowX = 'hidden'; // Restore X hiding
    
    // Start typing hero text after preloader finishes
    const subtitle = document.querySelector('.hero .subtitle');
    const title = document.querySelector('.hero .title');
    const desc = document.querySelector('.hero .desc');
    const ctaGroup = document.querySelector('.hero .cta-group');
    const heroImage = document.querySelector('.hero-image');

    // Make elements visible for typing
    gsap.set([subtitle, title], { autoAlpha: 1 });
    
    typeText(subtitle, "SOFTWARE DEVELOPER & TECHNOLOGY ENTHUSIAST", 40, () => {
      typeText(title, "TB ATHALLA", 60, () => {
        // Fade in remaining hero content
        gsap.to([desc, ctaGroup, heroImage], {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out"
        });
      });
    });
  }
});

preloaderTl.to(preloaderWords, {
  y: 0,
  opacity: 1,
  duration: 0.8,
  stagger: 0.1,
  ease: "power4.out",
  delay: 0.2
})
.to(loadingBar, {
  width: "100%",
  duration: 1.5,
  ease: "power2.inOut"
}, "-=0.5")
.to(preloaderWords, {
  y: -50,
  opacity: 0,
  duration: 0.5,
  stagger: 0.05,
  ease: "power4.in"
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

// ==========================================
// 4. CUSTOM CURSOR & INTERACTIVITY
// ==========================================
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (window.matchMedia("(pointer: fine)").matches) {
  // Cursor movement
  window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Smooth trailing outline
    gsap.to(cursorOutline, {
      x: posX,
      y: posY,
      duration: 0.15,
      ease: "power2.out",
      left: 0,
      top: 0
    });
  });

  // Hover states
  const interactables = document.querySelectorAll('a, button, .btn, .project-card');
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

  // Magnetic Buttons
  const magneticBtns = document.querySelectorAll('.btn');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out"
      });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      });
    });
  });

  // Interactive Hero Section (Parallax & 3D)
  // ------------------------------------------
  const heroSection = document.querySelector('.hero');
  const heroText = document.querySelector('.hero-text');
  const heroImageWrapper = document.querySelector('.image-wrapper');

  if (heroSection && heroText && heroImageWrapper) {
    heroSection.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const xPos = (clientX - centerX) / centerX;
      const yPos = (clientY - centerY) / centerY;

      // Parallax text
      gsap.to(heroText, {
        x: xPos * -25,
        y: yPos * -25,
        duration: 1.5,
        ease: "power2.out"
      });

      // 3D Tilt and Parallax Image
      gsap.to(heroImageWrapper, {
        rotateY: xPos * 20,
        rotateX: -yPos * 20,
        x: xPos * 40,
        y: yPos * 40,
        duration: 1.5,
        ease: "power2.out",
        transformPerspective: 1000
      });
    });

    heroSection.addEventListener('mouseleave', () => {
      gsap.to([heroText, heroImageWrapper], {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 1.5,
        ease: "elastic.out(1, 0.4)"
      });
    });
  }
}

// ==========================================
// 5. SCROLL ANIMATIONS (GSAP)
// ==========================================

// Scroll Progress Bar
gsap.to(".scroll-progress", {
  width: "100%",
  ease: "none",
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 0.1
  }
});

// Removed 3D scroll triggers


// Hide elements initially via JS (graceful degradation)
const hiddenElements = ".section-title, .timeline-node, .list-item, .project-swiper, .badge, .title-large, .subtitle-large, .travel-desc, .ach-hero-card, .ach-row, .cert-panel, .final .content > *";
gsap.set(hiddenElements, { autoAlpha: 0, y: 100 });
gsap.set('.hero .desc, .hero .cta-group, .hero .hero-image', { autoAlpha: 0, y: 30 }); // Specifically hide these for typing anim

// ==========================================
// BACKGROUND PARALLAX EFFECTS
// ==========================================
// 1. Continuous floating for Neon Shapes (Lava lamp effect)
gsap.utils.toArray(".shape").forEach((shape) => {
  gsap.to(shape, {
    x: "random(-200, 200)",
    y: "random(-200, 200)",
    rotation: "random(-90, 90)",
    duration: gsap.utils.random(10, 15),
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
    repeatRefresh: true
  });
});

// 2. Parallax for Background Watermark Texts
gsap.utils.toArray(".bg-watermark").forEach((watermark) => {
  gsap.to(watermark, {
    y: -350, // Move up significantly during scroll
    ease: "none",
    scrollTrigger: {
      trigger: watermark.parentElement,
      start: "top bottom",
      end: "bottom top",
      scrub: 1.5,
    }
  });
});

// HTML Elements Reveal
const revealElements = (selector) => {
  gsap.utils.toArray(selector).forEach((el) => {
    gsap.fromTo(el,
      { autoAlpha: 0, y: 100 },
      {
        duration: 1.5,
        autoAlpha: 1,
        y: 0,
        ease: "power4.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });
};

// Apply reveals after a slight delay to ensure layout is computed
setTimeout(() => {
  // Hero reveal
  gsap.to(".hero .content > *", {
    duration: 1.5,
    autoAlpha: 1,
    y: 0,
    stagger: 0.2,
    ease: "power4.out"
  });

  // Section titles
  revealElements(".section-title");

  // Timeline
  gsap.utils.toArray(".timeline-node").forEach((node) => {
    ScrollTrigger.create({
      trigger: node,
      start: "top 85%",
      onEnter: () => {
        gsap.to(node, {
          y: 0,
          autoAlpha: 1,
          duration: 1.5,
          ease: "expo.out"
        });
      }
    });
  });

  // Experience grid
  revealElements(".list-item");
  
  // Skills
  gsap.utils.toArray(".skills").forEach(section => {
    const badges = section.querySelectorAll(".badge");
    gsap.fromTo(badges,
      { autoAlpha: 0, scale: 0.5 },
      {
        duration: 0.5,
        autoAlpha: 1,
        scale: 1,
        stagger: 0.05,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Travel
  revealElements(".title-large");
  revealElements(".subtitle-large");
  revealElements(".travel-desc");
  revealElements(".map-container");

  // Achievements
  ScrollTrigger.create({
    trigger: ".ach-showcase",
    start: "top 85%",
    onEnter: () => {
      // Smooth hero card reveal
      gsap.to(".ach-hero-card", {
        y: 0,
        autoAlpha: 1,
        duration: 2,
        ease: "expo.out"
      });
      // Staggered ripple reveal for the list
      gsap.to(".ach-row", {
        y: 0,
        autoAlpha: 1,
        duration: 1.5,
        stagger: 0.15,
        ease: "power4.out",
        delay: 0.2
      });
    }
  });

  // Certificates
  gsap.utils.toArray(".cert-accordion").forEach((accordion) => {
    ScrollTrigger.create({
      trigger: accordion,
      start: "top 85%",
      onEnter: () => {
        gsap.to(accordion.querySelectorAll(".cert-panel"), {
          y: 0,
          autoAlpha: 1,
          duration: 1.5,
          stagger: 0.15,
          ease: "expo.out"
        });
      }
    });
  });

  // Final
  revealElements(".final .content > *");

  // Refresh ScrollTrigger to recalculate positions
  ScrollTrigger.refresh();

}, 100);

// ==========================================
// 6. WORLD MAP INITIALIZATION
// ==========================================
const map = new jsVectorMap({
  selector: '#world-map',
  map: 'world',
  backgroundColor: 'transparent',
  regionStyle: {
    initial: {
      fill: 'rgba(255, 255, 255, 0.1)',
      stroke: 'rgba(255, 255, 255, 0.2)',
      strokeWidth: 0.5,
    },
    hover: {
      fill: '#06b6d4'
    }
  },
  // IN=India, PK=Pakistan, TR=Turkey, KH=Cambodia, VN=Vietnam, TH=Thailand, SG=Singapore, MY=Malaysia, SA=Saudi Arabia
  selectedRegions: ['IN', 'PK', 'TR', 'KH', 'VN', 'TH', 'SG', 'MY', 'SA'],
  selectedRegionsStyle: {
    fill: '#8b5cf6', // Glow purple for visited countries
  },
  zoomOnScroll: false,
});

// ==========================================
// 7. STICKY CARDS SCROLL EFFECT
// ==========================================
gsap.utils.toArray(".sticky-card").forEach((card, i, cards) => {
  if (i !== cards.length - 1) {
    gsap.to(card, {
      scale: 0.9,
      opacity: 0,
      scrollTrigger: {
        trigger: card,
        start: "top 15%", // When it sticks
        endTrigger: cards[i + 1], // Wait until the next card hits
        end: "top 15%", 
        scrub: true,
      }
    });
  }
});

// ==========================================
// 8. RESIZE HANDLER
// ==========================================
window.addEventListener('resize', () => {
  if (map) map.updateSize();
});
