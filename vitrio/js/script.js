const COURSE_CONFIG = {
  // Ajuste os valores conforme a sua oferta final
  courseInstallment: "12x de R$ 29,90",
  ebookPrice: "R$ 27,90",
  // Exemplo: "2026-10-31T23:59:59" - Deixe vazio ("") para não exibir urgência por data
  launchEndsAt: "",
  courseCheckoutUrl: "https://pay.kiwify.com.br/HkJj6Bd",
  ebookCheckoutUrl: "https://pay.kiwify.com.br/YYmeZal"
};

// UX e Acessibilidade: Detecta preferências do usuário
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const setText = (selector, value) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = value;
  });
};

const setHref = (selector, value) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.setAttribute("href", value);
  });
};

// CRO: Aplica a configuração da oferta dinamicamente
const applyConfig = () => {
  setText('[data-config="courseInstallment"]', COURSE_CONFIG.courseInstallment);
  setText('[data-config="ebookPrice"]', COURSE_CONFIG.ebookPrice);
  setHref("[data-checkout-course]", COURSE_CONFIG.courseCheckoutUrl);
  setHref("[data-checkout-ebook]", COURSE_CONFIG.ebookCheckoutUrl);

  // Gatilho de Escassez/Urgência Visual
  document.querySelectorAll("[data-launch-deadline]").forEach((element) => {
    if (!COURSE_CONFIG.launchEndsAt) return;

    const date = new Date(COURSE_CONFIG.launchEndsAt);
    if (Number.isNaN(date.getTime())) return;

    element.hidden = false;
    element.textContent = `⏳ Condição especial encerra em ${date.toLocaleDateString("pt-BR")}.`;
    element.style.color = "var(--color-orange-soft)";
    element.style.fontWeight = "bold";
  });

  const year = document.querySelector("[data-year]");
  if (year) {
    year.textContent = new Date().getFullYear();
  }
};

// UX/CRO: Tempo de carregamento ajustado para não perder retenção
const initIntroLoader = () => {
  const loader = document.querySelector("[data-loader]");
  if (!loader) return;

  const alreadySeen = sessionStorage.getItem("pflab-loader-seen") === "true";
  if (alreadySeen || prefersReducedMotion) {
    loader.remove();
    return;
  }

  sessionStorage.setItem("pflab-loader-seen", "true");
  // Reduzido de 2100ms para 1200ms: Mantém o efeito "Wow" sem prejudicar a conversão
  window.setTimeout(() => loader.remove(), 1200);
};

const initHeader = () => {
  const header = document.querySelector("[data-header]");
  const progress = document.querySelector(".page-progress__bar");
  const backTop = document.querySelector("[data-back-top]");
  const sticky = document.querySelector("[data-mobile-sticky]");
  const hero = document.querySelector("#hero");
  let ticking = false;

  const updateScrollState = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const percent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

    header?.classList.toggle("is-scrolled", scrollTop > 24);
    if (progress) progress.style.width = `${percent}%`;
    backTop?.classList.toggle("is-visible", scrollTop > 760);

    // CRO: Mostra a barra de oferta mobile apenas após o usuário passar da promessa principal (Hero)
    if (sticky && hero) {
      const showSticky = scrollTop > hero.offsetHeight * 0.78;
      sticky.classList.toggle("is-visible", showSticky && !sticky.dataset.closed);
    }

    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollState);
      ticking = true;
    }
  };

  updateScrollState();
  window.addEventListener("scroll", onScroll, { passive: true });
};

const initMobileNav = () => {
  const button = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-nav-menu]");
  const header = document.querySelector("[data-header]");
  const links = document.querySelectorAll("[data-nav-link]");

  if (!button || !menu) return;

  const setOpen = (isOpen) => {
    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    menu.classList.toggle("is-open", isOpen);
    header?.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("nav-open", isOpen);
  };

  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";
    setOpen(!isOpen);
  });

  links.forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
};

const initReveal = () => {
  const items = document.querySelectorAll(".reveal");
  if (!items.length || prefersReducedMotion) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -40px 0px" });

  items.forEach((item) => observer.observe(item));
};

const initOptionalImages = () => {
  document.querySelectorAll("[data-optional-image]").forEach((image) => {
    const holder = image.closest(".ebook__capa");
    if (!holder) return;

    const showImage = () => holder.classList.add("has-image");
    const hideImage = () => {
      holder.classList.remove("has-image");
      image.removeAttribute("src");
    };

    if (image.complete && image.naturalWidth > 0) showImage();

    image.addEventListener("load", showImage);
    image.addEventListener("error", hideImage);
  });
};

const initActiveNav = () => {
  const links = [...document.querySelectorAll("[data-nav-link]")].filter((link) => {
    const href = link.getAttribute("href") || "";
    return href.startsWith("#") && href.length > 1;
  });

  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!links.length || !sections.length) return;

  const setActive = (id) => {
    links.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 });

  sections.forEach((section) => observer.observe(section));
};

const initGlowCards = () => {
  if (!hasFinePointer) return;

  document.querySelectorAll("[data-glow-card], [data-tilt-card]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);
    });
  });
};

const initHeroTilt = () => {
  const lab = document.querySelector("[data-tilt-card]");
  if (!lab || !hasFinePointer || prefersReducedMotion) return;

  lab.addEventListener("pointermove", (event) => {
    const rect = lab.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    lab.style.transform = `perspective(900px) rotateX(${y * -2.6}deg) rotateY(${x * 3.2}deg)`;
  });

  lab.addEventListener("pointerleave", () => {
    lab.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  });
};

const initTerminal = () => {
  const output = document.querySelector("[data-terminal-output]");
  if (!output) return;

  const lines = [
    "$ python lab.py",
    "> cansado de copiar projeto batido...",
    "> abrindo laboratório de sistemas raros...",
    "> conectando analogia com código real...",
    "> construindo ponto, passagens e votação...",
    "> status: PRONTO PARA CONSTRUIR_"
  ];

  if (prefersReducedMotion) {
    output.textContent = lines.join("\n");
    return;
  }

  output.textContent = lines[0];
  lines.slice(1).forEach((line, index) => {
    window.setTimeout(() => {
      output.textContent += `\n${line}`;
    }, 720 + index * 520);
  });
};

const initJourneyProgress = () => {
  const track = document.querySelector("[data-journey]");
  const progress = document.querySelector("[data-journey-progress]");
  const levels = document.querySelectorAll("[data-level]");
  if (!track || !progress || !levels.length) return;

  let ticking = false;

  const update = () => {
    const rect = track.getBoundingClientRect();
    const viewportAnchor = window.innerHeight * 0.62;
    const raw = (viewportAnchor - rect.top) / rect.height;
    const percent = Math.max(0, Math.min(1, raw)) * 100;

    track.style.setProperty("--journey-progress", `${percent}%`);

    levels.forEach((level) => {
      const levelRect = level.getBoundingClientRect();
      const isActive = levelRect.top < viewportAnchor && levelRect.bottom > window.innerHeight * 0.14;
      level.classList.toggle("is-active", isActive);
    });

    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  };

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
};

const initAccordion = () => {
  document.querySelectorAll("[data-accordion] .faq-item").forEach((item) => {
    const button = item.querySelector("button");
    if (!button) return;

    button.addEventListener("click", () => {
      const isOpen = item.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  });
};

const initBackTop = () => {
  const button = document.querySelector("[data-back-top]");
  if (!button) return;

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
};

const initStickyOffer = () => {
  const sticky = document.querySelector("[data-mobile-sticky]");
  const closeButton = document.querySelector("[data-close-sticky]");
  if (!sticky || !closeButton) return;

  closeButton.addEventListener("click", () => {
    sticky.dataset.closed = "true";
    sticky.classList.remove("is-visible");
  });
};

// UX Performance: Otimizado para não consumir bateria em abas em segundo plano
const initNetworkBackground = () => {
  const canvas = document.querySelector("[data-network]");
  // Somente ativa em desktop para economizar bateria em dispositivos móveis
  if (!canvas || !hasFinePointer || prefersReducedMotion || window.innerWidth < 820) return;

  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return;

  const pointer = { x: 0, y: 0, active: false };
  const particles = [];
  let width = 0;
  let height = 0;
  let animationFrame = 0;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    width = Math.max(320, Math.floor(rect.width));
    height = Math.max(320, Math.floor(rect.height));
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    particles.length = 0;
    const count = Math.min(72, Math.floor((width * height) / 18000));
    for (let index = 0; index < count; index += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        radius: Math.random() * 1.5 + 0.7
      });
    }
  };

  const draw = () => {
    context.clearRect(0, 0, width, height);
    context.lineWidth = 1;

    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < -20) particle.x = width + 20;
      if (particle.x > width + 20) particle.x = -20;
      if (particle.y < -20) particle.y = height + 20;
      if (particle.y > height + 20) particle.y = -20;

      context.beginPath();
      context.fillStyle = "rgba(120, 199, 255, 0.52)";
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();

      for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
        const next = particles[nextIndex];
        const dx = particle.x - next.x;
        const dy = particle.y - next.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 112) {
          context.strokeStyle = `rgba(0, 166, 255, ${0.12 * (1 - distance / 112)})`;
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(next.x, next.y);
          context.stroke();
        }
      }

      if (pointer.active) {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 150) {
          context.strokeStyle = `rgba(255, 107, 0, ${0.18 * (1 - distance / 150)})`;
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(pointer.x, pointer.y);
          context.stroke();
        }
      }
    });

    animationFrame = window.requestAnimationFrame(draw);
  };

  const setPointer = (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = true;
  };

  canvas.addEventListener("pointermove", setPointer);
  canvas.addEventListener("pointerleave", () => {
    pointer.active = false;
  });
  window.addEventListener("resize", resize);

  resize();
  draw();

  // Performance: Pausa animação quando o usuário muda de aba (evita travar o navegador)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.cancelAnimationFrame(animationFrame);
    } else {
      draw();
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  initIntroLoader();
  initHeader();
  initMobileNav();
  initReveal();
  initActiveNav();
  initOptionalImages();
  initGlowCards();
  initHeroTilt();
  initTerminal();
  initJourneyProgress();
  initAccordion();
  initBackTop();
  initStickyOffer();
  initNetworkBackground();
});
