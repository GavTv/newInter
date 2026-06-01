const wrapper = document.querySelector(".wrapper");
if (!wrapper) return;

const panels = [...wrapper.children];
const touchUI = window.matchMedia("(hover: none), (pointer: coarse)");

function setActive(panel) {
  const on = panel.classList.contains("is-active");
  panels.forEach((p) => p.classList.remove("is-active"));
  if (!on) panel.classList.add("is-active");
}

function bindTouch() {
  panels.forEach((panel) => {
    panel.addEventListener("click", () => setActive(panel));
  });
}

function unbindTouch() {
  panels.forEach((p) => p.classList.remove("is-active"));
}

if (touchUI.matches) bindTouch();

touchUI.addEventListener("change", (e) => {
  if (e.matches) bindTouch();
  else unbindTouch();
});
