/* =====================================================
   EMZ PORTFOLIO - script.js
   Each block below does one small job.
   ===================================================== */

/* ---------- 1. MOBILE MENU ---------- */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

// Open / close the menu when the hamburger is clicked
hamburger.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  hamburger.classList.toggle("open", isOpen);
  hamburger.setAttribute("aria-expanded", isOpen);
});

// Close the menu after tapping a link
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", false);
  });
});

/* ---------- 2. NAVBAR STYLE + SCROLL PROGRESS + ACTIVE LINK ---------- */
const navbar = document.getElementById("navbar");
const progress = document.getElementById("scrollProgress");
const sections = document.querySelectorAll("main section[id]");
const navItems = document.querySelectorAll(".nav-link");

function onScroll() {
  const scrollTop = window.scrollY;

  // Add a background to the navbar once we scroll down a bit
  navbar.classList.toggle("scrolled", scrollTop > 40);

  // Fill the progress bar: (how far scrolled) / (total scrollable height)
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (scrollTop / maxScroll) * 100 + "%";

  // Highlight the nav link of the section we're currently viewing
  let current = "home";
  sections.forEach((section) => {
    if (scrollTop >= section.offsetTop - 200) current = section.id;
  });
  navItems.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + current);
  });
}
window.addEventListener("scroll", onScroll);
onScroll(); // run once on page load

/* ---------- 3. LIGHT / DARK THEME TOGGLE ---------- */
const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;

// Remember the visitor's choice (wrapped in try in case storage is blocked)
try {
  const saved = localStorage.getItem("emz-theme");
  if (saved) root.setAttribute("data-theme", saved);
} catch (e) {}

themeToggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  root.setAttribute("data-theme", next);
  try { localStorage.setItem("emz-theme", next); } catch (e) {}
});

/* ---------- 4. TYPING EFFECT IN THE HERO ---------- */
const typedEl = document.getElementById("typed");
// Change these words to whatever you like!
const roles = ["college student", "web developer", "creative thinker", "lifelong learner"];
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function type() {
  const word = roles[roleIndex];

  if (!deleting) {
    charIndex++;                                   // add a letter
    if (charIndex === word.length) {               // finished typing → pause, then delete
      deleting = true;
      typedEl.textContent = word;
      return setTimeout(type, 1500);
    }
  } else {
    charIndex--;                                   // remove a letter
    if (charIndex === 0) {                         // finished deleting → next word
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  typedEl.textContent = word.substring(0, charIndex);
  setTimeout(type, deleting ? 50 : 100);
}
type();

/* ---------- 5. SCROLL REVEAL + SKILL BARS + COUNTERS ---------- */
// IntersectionObserver tells us when an element enters the screen
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      el.classList.add("visible");                 // triggers the CSS fade/slide-up

      // If this card has a skill bar, fill it to its data-level
      const fill = el.querySelector(".bar-fill");
      if (fill) fill.style.width = fill.dataset.level + "%";

      // If this element has counters, count up
      el.querySelectorAll(".stat-num").forEach(countUp);

      observer.unobserve(el);                      // only animate once
    });
  },
  { threshold: 0.15 }
);

// Small delay between cards so they appear one after another
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 0.1 + "s";
  observer.observe(el);
});

// Counts a number from 0 up to its data-count value
function countUp(el) {
  const target = Number(el.dataset.count);
  let value = 0;
  const step = Math.max(1, Math.ceil(target / 50));
  const timer = setInterval(() => {
    value += step;
    if (value >= target) { value = target; clearInterval(timer); }
    el.textContent = value;
  }, 30);
}

/* ---------- 6. CURSOR GLOW + 3D CARD TILT (desktop only) ---------- */
// "hover: hover" means the device has a real mouse (not a phone)
const hasMouse = window.matchMedia("(hover: hover)").matches;

if (hasMouse) {
  const glow = document.getElementById("cursorGlow");

  // Move the soft blue light to the mouse position
  document.addEventListener("mousemove", (e) => {
    glow.style.opacity = 1;
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  });

  // Tilt cards slightly toward the mouse
  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 → 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform =
        `perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-6px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";                               // back to normal
    });
  });
}

/* ---------- 7. CONTACT FORM ---------- */
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");

form.addEventListener("submit", (e) => {
  e.preventDefault();                              // stop the page from reloading

  const fields = ["name", "email", "message"];
  let valid = true;

  fields.forEach((id) => {
    const input = document.getElementById(id);
    const value = input.value.trim();
    let ok = value !== "";
    if (id === "email") ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); // simple email check
    input.parentElement.classList.toggle("error", !ok);
    if (!ok) valid = false;
  });

  if (!valid) {
    statusEl.textContent = "Please fill in all fields correctly.";
    statusEl.className = "form-status fail";
    return;
  }

  // NOTE: This only simulates sending. To receive real messages, connect the
  // form to a service like Formspree or EmailJS.
  statusEl.textContent = "Thank you! Your message was sent. 💙";
  statusEl.className = "form-status success";
  form.reset();
});

/* ---------- 8. FOOTER YEAR ---------- */
document.getElementById("year").textContent = new Date().getFullYear();