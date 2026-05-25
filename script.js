const body = document.body;
const header = document.querySelector(".site-header");
const progressBar = document.querySelector("[data-progress]");
const revealElements = document.querySelectorAll("[data-reveal]");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const tabButtons = document.querySelectorAll("[data-service]");
const tabPanels = document.querySelectorAll("[data-service-panel]");
const heroStage = document.querySelector(".hero-stage-shell");
const counterElements = document.querySelectorAll("[data-counter]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeLabel = document.querySelector("[data-theme-label]");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const faqItems = document.querySelectorAll(".faq-item");
const cursorDot = document.querySelector("[data-cursor-dot]");
const cursorRing = document.querySelector("[data-cursor-ring]");
const cursorBurstLayer = document.querySelector("[data-cursor-bursts]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
const finePointerQuery = window.matchMedia("(pointer: fine)");

const THEME_KEY = "aruvio-theme";
const LIGHT_THEME_COLOR = "#fdfaf4";
const DARK_THEME_COLOR = "#091425";
const interactiveSelector = [
  "a",
  "button",
  ".feature-card",
  ".motion-card",
  ".process-card",
  ".outcome-card",
  ".engagement-card",
  ".contact-card",
  ".contact-chip",
  ".infra-node",
  ".service-tab",
  ".faq-trigger",
].join(", ");

let serviceRotation;
let cursorAnimationFrame;
let cursorEnabled = false;
let cursorTargetX = window.innerWidth / 2;
let cursorTargetY = window.innerHeight / 2;
let ringX = cursorTargetX;
let ringY = cursorTargetY;

const setRevealDelays = () => {
  revealElements.forEach((element, index) => {
    element.style.setProperty("--reveal-delay", `${(index % 6) * 80}ms`);
  });
};

const updateScrollState = () => {
  const scrollTop = window.scrollY;
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

  progressBar.style.width = `${progress}%`;
  header.classList.toggle("is-scrolled", scrollTop > 16);
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -10% 0px",
  }
);

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  {
    threshold: 0.45,
  }
);

const animateCounter = (element) => {
  const target = Number(element.dataset.counter || 0);
  const duration = 1400;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(target * eased).toString();

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.5,
  }
);

const updateThemeUi = (theme) => {
  const isDark = theme === "dark";
  body.dataset.theme = theme;
  themeToggle?.setAttribute("aria-pressed", String(isDark));
  themeToggle?.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");

  if (themeLabel) {
    themeLabel.textContent = isDark ? "Light mode" : "Dark mode";
  }

  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", isDark ? DARK_THEME_COLOR : LIGHT_THEME_COLOR);
  }
};

const getStoredTheme = () => localStorage.getItem(THEME_KEY);

const getPreferredTheme = () => {
  const storedTheme = getStoredTheme();

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return prefersDarkScheme.matches ? "dark" : "light";
};

const applyTheme = (theme, shouldStore = true) => {
  updateThemeUi(theme);

  if (shouldStore) {
    localStorage.setItem(THEME_KEY, theme);
  }
};

const setActiveService = (serviceName) => {
  tabButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.service === serviceName);
  });

  tabPanels.forEach((panel) => {
    const isActive = panel.dataset.servicePanel === serviceName;
    panel.classList.toggle("is-active", isActive);

    if (isActive) {
      panel.classList.add("is-visible");
    }
  });
};

const stopServiceRotation = () => {
  if (serviceRotation) {
    window.clearInterval(serviceRotation);
  }
};

const startServiceRotation = () => {
  if (prefersReducedMotion.matches || tabButtons.length === 0) {
    return;
  }

  stopServiceRotation();

  const services = [...tabButtons].map((button) => button.dataset.service);
  let currentIndex = services.findIndex((service) =>
    document.querySelector(`[data-service="${service}"]`)?.classList.contains("is-active")
  );

  serviceRotation = window.setInterval(() => {
    currentIndex = (currentIndex + 1) % services.length;
    setActiveService(services[currentIndex]);
  }, 5200);
};

const enableHeroParallax = () => {
  if (!heroStage || prefersReducedMotion.matches) {
    return;
  }

  heroStage.addEventListener("pointermove", (event) => {
    const rect = heroStage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    heroStage.style.setProperty("--pointer-x", `${x * 18}px`);
    heroStage.style.setProperty("--pointer-y", `${y * 18}px`);
  });

  heroStage.addEventListener("pointerleave", () => {
    heroStage.style.setProperty("--pointer-x", "0px");
    heroStage.style.setProperty("--pointer-y", "0px");
  });
};

const setCursorHoverState = (target) => {
  if (!cursorEnabled) {
    body.classList.remove("cursor-hovering");
    return;
  }

  body.classList.toggle("cursor-hovering", Boolean(target?.closest(interactiveSelector)));
};

const animateCursor = () => {
  if (!cursorEnabled || !cursorDot || !cursorRing) {
    return;
  }

  ringX += (cursorTargetX - ringX) * 0.18;
  ringY += (cursorTargetY - ringY) * 0.18;

  cursorDot.style.setProperty("--dot-x", `${cursorTargetX}px`);
  cursorDot.style.setProperty("--dot-y", `${cursorTargetY}px`);
  cursorRing.style.setProperty("--ring-x", `${ringX}px`);
  cursorRing.style.setProperty("--ring-y", `${ringY}px`);

  cursorAnimationFrame = requestAnimationFrame(animateCursor);
};

const disableCustomCursor = () => {
  cursorEnabled = false;
  body.classList.remove("has-custom-cursor", "cursor-hovering", "cursor-pressed");

  if (cursorAnimationFrame) {
    cancelAnimationFrame(cursorAnimationFrame);
    cursorAnimationFrame = undefined;
  }
};

const enableCustomCursor = () => {
  cursorEnabled = finePointerQuery.matches && !prefersReducedMotion.matches;

  if (!cursorEnabled) {
    disableCustomCursor();
    return;
  }

  body.classList.add("has-custom-cursor");

  if (!cursorAnimationFrame) {
    cursorAnimationFrame = requestAnimationFrame(animateCursor);
  }
};

const createCursorBurst = (x, y) => {
  if (!cursorEnabled || !cursorBurstLayer) {
    return;
  }

  const particleCount = 8;

  for (let index = 0; index < particleCount; index += 1) {
    const particle = document.createElement("span");
    const angle = (Math.PI * 2 * index) / particleCount + Math.random() * 0.34;
    const distance = 20 + Math.random() * 26;

    particle.className = "cursor-burst";
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    cursorBurstLayer.appendChild(particle);

    window.setTimeout(() => particle.remove(), 700);
  }
};

const bindFaqs = () => {
  faqItems.forEach((item) => {
    const trigger = item.querySelector(".faq-trigger");

    trigger?.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      faqItems.forEach((faqItem) => {
        faqItem.classList.remove("is-open");
        faqItem.querySelector(".faq-trigger")?.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });
};

setRevealDelays();
updateScrollState();
applyTheme(getPreferredTheme(), false);

revealElements.forEach((element) => revealObserver.observe(element));
sections.forEach((section) => navObserver.observe(section));
counterElements.forEach((element) => counterObserver.observe(element));

window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollState);

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveService(button.dataset.service);
    startServiceRotation();
  });
});

themeToggle?.addEventListener("click", () => {
  const nextTheme = body.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
});

prefersDarkScheme.addEventListener("change", (event) => {
  if (getStoredTheme()) {
    return;
  }

  applyTheme(event.matches ? "dark" : "light", false);
});

finePointerQuery.addEventListener("change", enableCustomCursor);
prefersReducedMotion.addEventListener("change", enableCustomCursor);

document.addEventListener("pointermove", (event) => {
  if (!cursorEnabled) {
    return;
  }

  body.classList.add("has-custom-cursor");
  cursorTargetX = event.clientX;
  cursorTargetY = event.clientY;
  body.style.setProperty("--cursor-x", `${event.clientX}px`);
  body.style.setProperty("--cursor-y", `${event.clientY}px`);
  setCursorHoverState(event.target);
});

document.addEventListener("pointerleave", () => {
  body.classList.remove("has-custom-cursor", "cursor-hovering");
});

document.addEventListener("pointerenter", () => {
  if (cursorEnabled) {
    body.classList.add("has-custom-cursor");
  }
});

document.addEventListener("pointerdown", (event) => {
  if (!cursorEnabled) {
    return;
  }

  body.classList.add("cursor-pressed");
  createCursorBurst(event.clientX, event.clientY);
});

document.addEventListener("pointerup", () => {
  body.classList.remove("cursor-pressed");
});

bindFaqs();
enableHeroParallax();
enableCustomCursor();
startServiceRotation();
