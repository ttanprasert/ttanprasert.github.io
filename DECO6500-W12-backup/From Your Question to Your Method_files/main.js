const navigationQuery = window.matchMedia("(max-width: 64rem)");

document.body.classList.add("nav-enhanced");

document.querySelectorAll(".nav-toggle[aria-controls]").forEach((toggle) => {
  const navId = toggle.getAttribute("aria-controls");
  const navigation = document.getElementById(navId);
  if (!navigation) return;

  function setNavigationState() {
    const isCollapsed = navigationQuery.matches;
    const isExpanded = toggle.getAttribute("aria-expanded") === "true";

    navigation.dataset.open = String(!isCollapsed || isExpanded);
    toggle.hidden = !isCollapsed;

    if (!isCollapsed) {
      toggle.setAttribute("aria-expanded", "false");
    }
  }

  function closeNavigation() {
    toggle.setAttribute("aria-expanded", "false");
    setNavigationState();
  }

  toggle.addEventListener("click", () => {
    const isExpanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isExpanded));
    setNavigationState();
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (!navigationQuery.matches) return;
      closeNavigation();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !navigationQuery.matches) return;
    closeNavigation();
    toggle.focus();
  });

  document.addEventListener("click", (event) => {
    if (!navigationQuery.matches) return;
    if (navigation.contains(event.target) || toggle.contains(event.target)) return;
    closeNavigation();
  });

  navigationQuery.addEventListener("change", setNavigationState);
  setNavigationState();
});
