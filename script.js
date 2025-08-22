// =========================================================================
// JavaScript Functions — Scope, Parameters & Return Values
// This section defines reusable functions that demonstrate the key concepts.
// =========================================================================

/**
 * Computes an animation duration (in seconds) given a distance and speed.
 * This demonstrates the use of parameters and returning a calculated value. 
 * @param {number} distance - The distance the element should travel in pixels.
 * @param {number} speed - The speed of the element in pixels per second.
 * @returns {number} The calculated duration in seconds (precision: 2 decimals).
 */
function computeDuration(distance, speed){
  // Ensure speed is not zero to avoid division by zero
  const s = Math.max(0.1, distance / Math.max(1, speed));
  return Math.round(s * 100) / 100;
}

/**
 * Apply the computed duration to the CSS variable of the box.
 * @param {HTMLElement} box - The HTML element whose CSS variable will be updated.
 * @param {number} seconds - The duration in seconds.
 * @returns {string} - A CSS-formatted time string (e.g., "0.7s"), demonstrating a return value.
 */
function setBoxDuration(box, seconds){
  const time = `${seconds}s`;
  box.style.setProperty('--duration', time);
  return time; // Return the string for use elsewhere
}

/**
 * A higher-order function that creates and returns a new function.
 * This is an advanced demonstration of scope, known as a 'closure'.
 * The inner function 'remembers' the 'box' and 'current' variables even after 'makeBoxAnimator' has finished executing. 
 * @param {"left"|"right"} direction
 * @param {number} distance
 * @returns {function} A function that animates the box.
 */
function makeBoxAnimator(box){
  // The 'current' variable belongs to the local/closed-over scope.
  // It maintains the state of the box's position between calls.
  let current = 0; // local (closure) state
  return function animate(direction, distance){
    const dir = direction === 'left' ? -1 : 1;
    current += dir * distance;
    box.style.transform = `translateX(${current}px)`;
    return current; // Return the new position
  };
}

// ------ Execute when the DOM is ready ------
document.addEventListener('DOMContentLoaded', () => {
  // Select all necessary DOM elements
  const root = document.documentElement;
  const box = document.getElementById('box');
  const distanceInput = document.getElementById('distanceInput');
  const speedInput = document.getElementById('speedInput');
  const animateRightBtn = document.getElementById('animateRight');
  const animateLeftBtn = document.getElementById('animateLeft');
  const durationOut = document.getElementById('durationOut');
  const flipCard = document.getElementById('flipCard');
  const modal = document.getElementById('modal');
  const openModalBtn = document.getElementById('openModal');
  const closeModalBtn = document.getElementById('closeModal');
  const loader = document.getElementById('loader');
  const toggleLoaderBtn = document.getElementById('toggleLoader');
  const themeToggle = document.getElementById('themeToggle');

  // Bonus feature: Theme toggle (global scope var: 'root' used by inner function)
  function toggleTheme(){
    const isLight = root.classList.toggle('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    return isLight;
  }
  themeToggle.addEventListener('click', toggleTheme);
  // Initialize theme from storage
  if(localStorage.getItem('theme') === 'light'){ root.classList.add('light'); }

  // Animator setup (closure demonstration)
  const animateBox = makeBoxAnimator(box);

  // Helper to read inputs safely (local scope example)
  function readParams(){
	// 'distance' and 'speed' are local variables, existing only here.
    const distance = Math.max(1, Number(distanceInput.value || 0));
    const speed = Math.max(1, Number(speedInput.value || 1));
    return { distance, speed };
  }

  // Function that combines calculation and animation logic
  function updateAndAnimate(direction){
    const { distance, speed } = readParams();
    const seconds = computeDuration(distance, speed);
    const timeString = setBoxDuration(box, seconds);
    durationOut.textContent = `Duration: ${timeString} (distance: ${distance}px, speed: ${speed}px/s)`;
    animateBox(direction, distance);
  }

  animateRightBtn.addEventListener('click', () => updateAndAnimate('right'));
  animateLeftBtn.addEventListener('click', () => updateAndAnimate('left'));

  // ===================================================
  // Combining CSS & JS
  // We use JavaScript to add/remove classes, 
  // triggering the animations defined in the CSS.
  // ===================================================

  // Flip card logic
  function flip(){
    flipCard.classList.toggle('is-flipped'); // Triggers the flip animation
    const pressed = flipCard.classList.contains('is-flipped');
    flipCard.setAttribute('aria-pressed', String(pressed));
    return pressed;
  }
  flipCard.addEventListener('click', flip);
  flipCard.addEventListener('keyup', (e) => { if(e.key === 'Enter' || e.key === ' ') flip(); });

  // Modal logic
  function openModal(){
    modal.setAttribute('aria-hidden', 'false'); // Triggers the modal's entrance animation
  }
  function closeModal(){
    modal.setAttribute('aria-hidden', 'true');
  }
  openModalBtn.addEventListener('click', openModal);
  closeModalBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); }); // Close if clicking outside
 
 document.addEventListener('DOMContentLoaded', () => {
  const modal=document.getElementById('modal');
  const closeModal=()=>modal.setAttribute('aria-hidden','true');
  const toggleLoaderBtn={addEventListener:()=>{}};
});
  // Close modal with Escape key (accessibility bonus)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });

  // Loader logic
  function toggleLoader(){
    const on = loader.classList.toggle('is-on');
    loader.setAttribute('aria-hidden', String(!on));
    return on;
  }
  toggleLoaderBtn.addEventListener('click', toggleLoader);
});
