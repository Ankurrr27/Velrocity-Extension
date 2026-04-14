import { getTodayLabel } from "../utils/date-utils.js";

export function showSkeleton(container, count = 4) {
  if (!container) return;
  container.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const item = document.createElement("div");
    item.className = "surface-card skeleton";
    item.style.height = "80px";
    item.style.marginBottom = "12px";
    container.appendChild(item);
  }
}

export function renderTodayHabits(container, items) {
  if (!container) return;
  container.innerHTML = "";

  if (!items || !items.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No habits scheduled for today.";
    container.appendChild(empty);
    return;
  }

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "surface-card";

    const meta = document.createElement("div");
    meta.className = "card-meta";
    const title = document.createElement("h3");
    title.textContent = item.title;
    const copy = document.createElement("p");
    copy.textContent = item.done
      ? `Completed`
      : `Planned`;
    meta.appendChild(title);
    meta.appendChild(copy);

    const badge = document.createElement("div");
    badge.className = `action-pill ${item.done ? "done" : "pending"}`;
    badge.textContent = item.done ? "Done" : "Pending";

    card.appendChild(meta);
    card.appendChild(badge);
    container.appendChild(card);
  });
}
