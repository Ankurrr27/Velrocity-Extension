import { getTodayKey } from "../utils/date-utils.js";

/**
 * Creates a Habit card component
 */
export function HabitCard(habit, { onToggle }) {
  const card = document.createElement("article");
  card.className = "surface-card";
  card.style.padding = "10px 14px";

  const meta = document.createElement("div");
  meta.className = "card-meta";
  
  const title = document.createElement("h3");
  title.textContent = habit.title;
  title.style.fontSize = "14px";
  title.style.marginBottom = "0";

  if (habit.done) {
    title.style.opacity = "0.5";
  }

  const copy = document.createElement("p");
  copy.textContent = (habit.type || "Daily").toLowerCase();
  copy.style.fontSize = "9px";
  copy.style.marginTop = "1px";

  meta.appendChild(title);
  meta.appendChild(copy);

  // PRO TOGGLE SWITCH
  const toggle = document.createElement("div");
  toggle.className = `toggle-shell ${habit.done ? "active" : ""}`;
  toggle.onclick = () => onToggle(habit, toggle);

  card.appendChild(meta);
  card.appendChild(toggle);
  return card;
}

/**
 * Creates a Goal card component
 */
export function GoalCard(task, { onToggle, onDelete }) {
  const card = document.createElement("article");
  card.className = "surface-card";
  card.style.padding = "10px 14px";
  
  const meta = document.createElement("div");
  meta.className = "card-meta";
  
  const title = document.createElement("h3");
  title.textContent = task.title;
  title.style.fontSize = "14px";
  title.style.marginBottom = "0";

  if (task.status === "done") {
    title.style.opacity = "0.4";
    title.style.textDecoration = "line-through";
  }

  const copy = document.createElement("p");
  copy.textContent = task.status === "pending" ? "Active Goal" : "Smashed It";
  copy.style.fontSize = "9px";
  copy.style.marginTop = "1px";
  
  meta.appendChild(title);
  meta.appendChild(copy);

  const actionDiv = document.createElement("div");
  actionDiv.style.display = "flex";
  actionDiv.style.alignItems = "center";
  actionDiv.style.gap = "8px";

  const toggle = document.createElement("div");
  toggle.className = `toggle-shell ${task.status === "done" ? "active" : ""}`;
  toggle.onclick = () => onToggle(task, toggle);

  const delBtn = document.createElement("button");
  delBtn.className = "btn-circle";
  delBtn.style.color = "rgb(var(--muted-text))";
  delBtn.style.background = "transparent";
  delBtn.style.fontSize = "16px";
  delBtn.innerHTML = "×";
  delBtn.title = "Delete Goal";
  delBtn.onclick = () => onDelete(task);

  actionDiv.appendChild(toggle);
  actionDiv.appendChild(delBtn);

  card.appendChild(meta);
  card.appendChild(actionDiv);
  return card;
}
