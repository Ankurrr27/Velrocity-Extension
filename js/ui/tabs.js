export function switchTab(viewId, activeBtn, views, buttons) {
  if (!views || !buttons) return;

  views.forEach(v => v?.classList.add("hidden"));
  buttons.forEach(b => b?.classList.remove("active"));

  const targetView = document.getElementById(viewId);
  if (targetView) {
    targetView.classList.remove("hidden");
    targetView.classList.add("view-transition");
  }
  activeBtn?.classList.add("active");
}
