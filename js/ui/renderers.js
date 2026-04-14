import { HabitCard, GoalCard } from "./components.js";

export function showSkeleton(container, count = 4) {
  if (!container) return;
  container.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const item = document.createElement("div");
    item.className = "surface-card skeleton";
    item.style.height = "60px";
    item.style.marginBottom = "8px";
    container.appendChild(item);
  }
}

export function renderList(container, items, { type, onToggle, onDelete }) {
  if (!container) return;
  container.innerHTML = "";

  if (!items || !items.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    if (type === "habit") {
      empty.innerHTML = `No habits scheduled for today.<br><br><span style="font-size: 11px; opacity: 0.7;">Create or manage habits on your <a href="#" id="goDashboard" style="color: rgb(var(--primary)); text-decoration: none;">Velrocity Dashboard</a>.</span>`;
      setTimeout(() => {
        document.getElementById("goDashboard")?.addEventListener("click", (e) => {
          e.preventDefault();
          chrome.tabs.create({ url: "https://velrocity.vercel.app/dashboard" });
        });
      }, 0);
    } else {
      empty.textContent = "No active goals.";
    }
    container.appendChild(empty);
    return;
  }

  items.forEach((item) => {
    let card;
    if (type === "habit") {
      card = HabitCard(item, { onToggle });
    } else {
      card = GoalCard(item, { onToggle, onDelete });
    }
    container.appendChild(card);
  });
}
