const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".nav");

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "메뉴 열기" : "메뉴 닫기");
  navigation.classList.toggle("open", !isOpen);
  document.body.style.overflow = isOpen ? "" : "hidden";
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "메뉴 열기");
    document.body.style.overflow = "";
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);

document.querySelectorAll(".service-card").forEach((card, index) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(28px)";
  card.style.transitionDelay = `${index * 90}ms`;
  observer.observe(card);
});

const style = document.createElement("style");
style.textContent = `
  .service-card.is-visible {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
  .service-card.is-visible:hover {
    transform: translateY(-8px) !important;
  }
`;
document.head.appendChild(style);
