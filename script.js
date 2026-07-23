const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".nav");

const closeMenu = () => {
  navigation.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "메뉴 열기");
  document.body.style.overflow = "";
};

menuButton.addEventListener("click", () => {
  const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(willOpen));
  menuButton.setAttribute("aria-label", willOpen ? "메뉴 닫기" : "메뉴 열기");
  navigation.classList.toggle("open", willOpen);
  document.body.style.overflow = willOpen ? "hidden" : "";
});

navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 3, 2) * 70}ms`;
  observer.observe(element);
});
