const canvas = document.getElementById('hero-canvas');
const context = canvas.getContext('2d');

const frameCount = 240;
const currentFrame = index => (
  `./frames/frame_${index.toString().padStart(4, '0')}.jpg`
);

const images = [];

// Preload all images
for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

// Variables for smooth easing
let currentScroll = 0;
let targetScroll = 0;
let ease = 0.08; // Adjust this for more/less smoothing

function setupCanvas() {
    canvas.width = images[0].naturalWidth || window.innerWidth;
    canvas.height = images[0].naturalHeight || window.innerHeight;
}

// Once the first image is loaded, set up the canvas dimensions and draw it
images[0].onload = () => {
    setupCanvas();
    renderFrame(0);
};

// Handle window resizing
window.addEventListener('resize', setupCanvas);

// Track the actual scroll position
window.addEventListener('scroll', () => {
    targetScroll = window.scrollY;
});

function renderFrame(index) {
    if (images[index] && images[index].complete) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(images[index], 0, 0);
    }
}

function update() {
    // Easing formula for smooth scrolling effect
    currentScroll += (targetScroll - currentScroll) * ease;
    
    // Calculate fraction based on smoothed scroll
    // document.documentElement.scrollHeight is more reliable than document.body.scrollHeight in some browsers
    const maxScroll = Math.max(
        document.body.scrollHeight, 
        document.documentElement.scrollHeight,
        document.body.offsetHeight, 
        document.documentElement.offsetHeight,
        document.body.clientHeight, 
        document.documentElement.clientHeight
    ) - window.innerHeight;

    let fraction = currentScroll / maxScroll;
    
    // Clamp fraction between 0 and 1
    fraction = Math.max(0, Math.min(1, fraction));
    
    // Determine which frame to draw
    const frameIndex = Math.floor(fraction * (frameCount - 1));
    
    renderFrame(frameIndex);
    
    requestAnimationFrame(update);
}

// Start animation loop
update();

// --- Additional Cinematic Interactions ---

// 1. Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');

if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Close mobile menu when a link is clicked
const navItems = document.querySelectorAll('.nav-links a');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
});

// 2. Intersection Observer for Scroll Reveals
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // Trigger when 15% of the element is visible
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Reveal only once
        }
    });
}, observerOptions);

const fadeElements = document.querySelectorAll('.fade-in');
fadeElements.forEach(el => observer.observe(el));
