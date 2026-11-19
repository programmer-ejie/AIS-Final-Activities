"use strict";

// Hash-based views keep audit results in memory while navigating.
const viewTitles = {
  instructions: "Activity instructions",
  overview: "Security overview",
  activity: "Audit history",
};
function showView() {
  // Preserve old links to the former control checks view.
  const requested =
    location.hash === "#controls" ? "overview" : location.hash.slice(1);
  const view = Object.hasOwn(viewTitles, requested)
    ? requested
    : "instructions";
  document.querySelectorAll("[data-view]").forEach((section) => {
    section.hidden = section.dataset.view !== view;
  });
  document.querySelectorAll(".nav").forEach((link) => {
    const active = link.getAttribute("href") === `#${view}`;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  byId("viewTitle").textContent = viewTitles[view];
}
window.addEventListener("hashchange", showView);
showView();
