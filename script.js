// ==============================
// OUSE LASH CLINIC - Interações
// ==============================
const header = document.querySelector(".site-header");
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const navItems = navLinks.querySelectorAll("a");
const scrollProgressBar = document.getElementById("scroll-progress-bar");
const navSectionLinks = Array.from(navLinks.querySelectorAll('a[href^="#"]'));
const pageSections = navSectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter((section) => section instanceof HTMLElement);
const backToTopButton = document.getElementById("back-to-top");
const whatsappCtas = document.querySelectorAll('a[href*="wa.me/5551996816693"]');
const whatsappPhone = "5551996816693";

// Sombra no menu ao rolar
const onScrollHeader = () => {
  if (window.scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
};

// Barra de progresso do scroll
const updateScrollProgress = () => {
  if (!scrollProgressBar) return;

  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;

  scrollProgressBar.style.transform = `scaleX(${progress})`;
};

// Link ativo no menu conforme seção visível
const updateActiveNavLink = () => {
  if (!navSectionLinks.length || !pageSections.length) return;

  const referenceY = window.scrollY + header.offsetHeight + 28;
  let currentSectionId = pageSections[0].id;

  pageSections.forEach((section) => {
    if (section.offsetTop <= referenceY) {
      currentSectionId = section.id;
    }
  });

  navSectionLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentSectionId}`;
    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

// Exibe o botão de voltar ao topo após rolagem mínima
const updateBackToTopVisibility = () => {
  if (!backToTopButton) return;
  backToTopButton.classList.toggle("is-visible", window.scrollY > 420);
};

// Gera links de WhatsApp com mensagem contextual
const buildWhatsAppUrl = (serviceName = "") => {
  const cleanService = serviceName.trim();
  const serviceSuffix = cleanService ? ` para ${cleanService}` : "";
  const message = `Olá! Vim pelo site da Ouse Lash Clinic e gostaria de agendar um horário${serviceSuffix}.`;

  return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
};

const configureWhatsAppCtas = () => {
  whatsappCtas.forEach((link) => {
    const serviceName =
      link.dataset.service ?? link.closest(".service-card")?.querySelector("h3")?.textContent ?? "";
    link.href = buildWhatsAppUrl(serviceName);
  });
};

configureWhatsAppCtas();

const onPageScroll = () => {
  onScrollHeader();
  updateScrollProgress();
  updateActiveNavLink();
  updateBackToTopVisibility();
};

window.addEventListener("scroll", onPageScroll, { passive: true });
onPageScroll();

if (backToTopButton) {
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Menu hamburguer
const closeMobileMenu = () => {
  navLinks.classList.remove("is-open");
  menuToggle.classList.remove("is-active");
  menuToggle.setAttribute("aria-expanded", "false");
};

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  menuToggle.classList.toggle("is-active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navItems.forEach((item) => {
  item.addEventListener("click", closeMobileMenu);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 860) {
    closeMobileMenu();
  }

  updateScrollProgress();
  updateActiveNavLink();
  updateBackToTopVisibility();
});

// Fade-in dos elementos ao rolar
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -40px 0px"
  }
);

revealElements.forEach((element) => revealObserver.observe(element));
