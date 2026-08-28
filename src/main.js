import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import jsVectorMap from 'jsvectormap';
import 'jsvectormap/dist/maps/world.js';
import 'jsvectormap/dist/jsvectormap.css';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 1. THREE.JS SETUP
// ==========================================
const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x05050a, 0.03);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0x3b82f6, 2);
pointLight1.position.set(5, 5, 5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x8b5cf6, 2);
pointLight2.position.set(-5, -5, 5);
scene.add(pointLight2);

// ==========================================
// 2. 3D OBJECTS
// ==========================================
const objectsGroup = new THREE.Group();
scene.add(objectsGroup);

// Main abstract shape (representing tech/laptop)
const mainGeometry = new THREE.IcosahedronGeometry(1.5, 1);
const mainMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x111111,
  wireframe: true,
  emissive: 0x3b82f6,
  emissiveIntensity: 0.2,
});
const mainObj = new THREE.Mesh(mainGeometry, mainMaterial);
objectsGroup.add(mainObj);

// Inner core
const coreGeometry = new THREE.OctahedronGeometry(0.8, 0);
const coreMaterial = new THREE.MeshStandardMaterial({
  color: 0x8b5cf6,
  roughness: 0.2,
  metalness: 0.8
});
const coreObj = new THREE.Mesh(coreGeometry, coreMaterial);
mainObj.add(coreObj);

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 500;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 20;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.02,
  color: 0x06b6d4,
  transparent: true,
  opacity: 0.5,
  blending: THREE.AdditiveBlending
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Globe for travel section
const globeGeometry = new THREE.SphereGeometry(2, 32, 32);
const globeMaterial = new THREE.MeshBasicMaterial({
  color: 0x06b6d4,
  wireframe: true,
  transparent: true,
  opacity: 0.15
});
const globe = new THREE.Mesh(globeGeometry, globeMaterial);
globe.position.set(0, -15, 0); // Hide below initially
scene.add(globe);

// Mouse tracking for parallax
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX - windowHalfX);
  mouseY = (event.clientY - windowHalfY);
});

// ==========================================
// 3. ANIMATION LOOP
// ==========================================
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();

  // Mouse Parallax easing
  targetX = mouseX * 0.001;
  targetY = mouseY * 0.001;
  
  objectsGroup.rotation.y += 0.05 * (targetX - objectsGroup.rotation.y);
  objectsGroup.rotation.x += 0.05 * (targetY - objectsGroup.rotation.x);

  // Gentle float
  mainObj.rotation.y += 0.002;
  mainObj.rotation.x += 0.001;
  
  coreObj.rotation.y -= 0.01;
  coreObj.rotation.z += 0.005;

  mainObj.position.y = Math.sin(elapsedTime * 0.5) * 0.2;

  particlesMesh.rotation.y = elapsedTime * 0.02;
  
  globe.rotation.y += 0.003;

  renderer.render(scene, camera);
}
animate();

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

  // 3D Tilt for Project Cards
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate rotation (-15 to 15 degrees)
      const xPct = (x / rect.width) - 0.5;
      const yPct = (y / rect.height) - 0.5;
      
      gsap.to(card, {
        rotateY: xPct * 15,
        rotateX: -yPct * 15,
        duration: 0.5,
        ease: "power2.out",
        transformPerspective: 1000
      });
      
      // Update dynamic glow position
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5,
        ease: "power2.out"
      });
    });
  });

  // ------------------------------------------
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

// 3D Scene scroll triggers
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 1
  }
});

// Animate 3D objects based on scroll progress
tl.to(mainObj.position, { x: 2, z: -2 }, 0)
  .to(mainObj.rotation, { y: Math.PI * 2 }, 0)
  .to(particlesMesh.rotation, { x: Math.PI * 0.5 }, 0)
  .to(mainObj.position, { x: -2, y: -2, z: 1 }, 0.2) // About
  .to(mainObj.position, { x: 0, y: 0, z: 2 }, 0.4) // Experience
  .to(mainObj.rotation, { x: Math.PI, z: Math.PI }, 0.4)
  .to(mainObj.position, { x: 3, y: 1, z: -1 }, 0.6) // Projects
  .to(mainObj.material, { wireframe: false, emissiveIntensity: 0.8 }, 0.6)
  .to(mainObj.scale, { x: 0, y: 0, z: 0 }, 0.7) // Shrink main obj
  .to(globe.position, { y: 0, z: 1 }, 0.75) // Bring globe up for Travel
  .to(globe.position, { y: -5, z: -5 }, 0.9) // Final section
  .to(camera.position, { z: 8 }, 0.9);


// Hide elements initially via JS (graceful degradation)
const hiddenElements = ".hero .content > *, .section-title, .timeline-item, .list-item, .project-card, .badge, .title-large, .subtitle-large, .travel-desc, .ach-item, .final .content > *";
gsap.set(hiddenElements, { autoAlpha: 0, y: 50 });

// HTML Elements Reveal
const revealElements = (selector) => {
  gsap.utils.toArray(selector).forEach((el) => {
    gsap.fromTo(el, 
      { autoAlpha: 0, y: 50 },
      {
        duration: 1, 
        autoAlpha: 1, 
        y: 0,
        ease: "power3.out",
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
    duration: 1,
    autoAlpha: 1,
    y: 0,
    stagger: 0.2,
    ease: "power3.out"
  });

  // Section titles
  revealElements(".section-title");
  
  // Timeline
  revealElements(".timeline-item");
  
  // Experience grid
  revealElements(".list-item");
  
  // Projects
  revealElements(".project-card");
  
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
  revealElements(".ach-item");
  
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
// 7. RESIZE HANDLER
// ==========================================
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  if(map) map.updateSize();
});
