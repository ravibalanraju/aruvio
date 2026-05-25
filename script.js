const header = document.querySelector(".site-header");
const progressBar = document.querySelector("[data-progress]");
const revealElements = document.querySelectorAll("[data-reveal]");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const tabButtons = document.querySelectorAll("[data-service]");
const tabPanels = document.querySelectorAll("[data-service-panel]");
const heroStage = document.querySelector(".hero-stage-shell");
const counterElements = document.querySelectorAll("[data-counter]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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
    threshold: 0.18,
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

let serviceRotation;

const startServiceRotation = () => {
  if (prefersReducedMotion.matches || tabButtons.length === 0) {
    return;
  }

  const services = [...tabButtons].map((button) => button.dataset.service);
  let currentIndex = services.findIndex((service) =>
    document.querySelector(`[data-service="${service}"]`)?.classList.contains("is-active")
  );

  serviceRotation = window.setInterval(() => {
    currentIndex = (currentIndex + 1) % services.length;
    setActiveService(services[currentIndex]);
  }, 5200);
};

const stopServiceRotation = () => {
  if (serviceRotation) {
    window.clearInterval(serviceRotation);
  }
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

setRevealDelays();
updateScrollState();

revealElements.forEach((element) => revealObserver.observe(element));
sections.forEach((section) => navObserver.observe(section));
counterElements.forEach((element) => counterObserver.observe(element));

window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollState);

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveService(button.dataset.service);
    stopServiceRotation();
    startServiceRotation();
  });
});

enableHeroParallax();
startServiceRotation();
