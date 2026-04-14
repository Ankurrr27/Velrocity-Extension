import { getSettings, authRequest } from "./js/core/api.js";
import { getTodayKey, getTodayLabel } from "./js/utils/date-utils.js";
import { showStatus, clearStatus } from "./js/utils/status.js";
import { showSkeleton } from "./js/ui/renderers.js";
import { switchTab } from "./js/ui/tabs.js";

// DOM ELEMENTS
const todayHabitsContainer = document.getElementById("todayHabits");
const openSettingsButton = document.getElementById("openSettings");
const openWebAppButton = document.getElementById("openWebApp");
const todayLabel = document.getElementById("todayLabel");

const myGoalsView = document.getElementById("myGoalsView");
const myGoalsForm = document.getElementById("myGoalsForm");
const myGoalInput = document.getElementById("myGoalInput");
const myGoalsList = document.getElementById("myGoalsList");

const myPersonalHabitsView = document.getElementById("myPersonalHabitsView");
const myHabitsList = document.getElementById("myHabitsList");

const habitsTab = document.getElementById("habitsTab");
const goalsTab = document.getElementById("goalsTab");

// STATE
const VIEWS = [myPersonalHabitsView, myGoalsView];
const TABS = [habitsTab, goalsTab];

// ACTIONS
async function renderMyHabits() {
  const { authToken } = await getSettings();
  if (!authToken) {
    myHabitsList.innerHTML = '<div class="empty-state">Welcome! Please connect your <b>Elite Key</b> in Settings to track your habits.</div>';
    return;
  }

  showSkeleton(myHabitsList, 5);

  try {
    const habits = await authRequest("/stats/today");
    myHabitsList.innerHTML = "";

    const list = Array.isArray(habits) ? habits : [];
    if (!list.length) {
      myHabitsList.innerHTML = '<div class="empty-state">No habits scheduled for today. Have a rest!</div>';
      return;
    }

    const sorted = [...list].sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));

    sorted.forEach((habit) => {
      const card = document.createElement("article");
      card.className = "surface-card";

      const meta = document.createElement("div");
      meta.className = "card-meta";
      const title = document.createElement("h3");
      title.textContent = habit.title;
      if (habit.done) {
        title.style.textDecoration = "line-through";
        title.style.opacity = "0.6";
      }

      const copy = document.createElement("p");
      copy.textContent = habit.type || "Daily";
      meta.appendChild(title);
      meta.appendChild(copy);

      const toggleBtn = document.createElement("button");
      toggleBtn.className = `action-pill ${habit.done ? "done" : "pending"}`;
      toggleBtn.textContent = habit.done ? "Done" : "Check";
      toggleBtn.onclick = async () => {
        try {
          toggleBtn.disabled = true;
          await authRequest("/activity/toggle", "POST", {
            habitId: habit.habitId,
            date: getTodayKey(),
          });
          await renderMyHabits();
        } catch (e) {
          showStatus(e.message, "error");
        } finally {
          toggleBtn.disabled = false;
        }
      };

      card.appendChild(meta);
      card.appendChild(toggleBtn);
      myHabitsList.appendChild(card);
    });
  } catch (err) {
    myHabitsList.innerHTML = `<div class="empty-state" style="color:var(--danger)">Connection Error: ${err.message}</div>`;
  }
}

async function renderMyGoals() {
  const { authToken } = await getSettings();
  if (!authToken) {
    myGoalsList.innerHTML = '<div class="empty-state">Identity Key is required to manage goals.</div>';
    return;
  }
  
  showSkeleton(myGoalsList, 4);

  try {
    const tasks = await authRequest("/tasks");
    myGoalsList.innerHTML = "";
    const list = Array.isArray(tasks) ? tasks : [];
    
    if (!list.length) {
      myGoalsList.innerHTML = `<div class="empty-state">No active goals. Stay focused!</div>`;
      return;
    }

    const sorted = [...list].sort((a, b) => (a.status === b.status ? 0 : a.status === "done" ? 1 : -1));

    sorted.forEach((task) => {
      const card = document.createElement("article");
      card.className = "surface-card";
      
      const meta = document.createElement("div");
      meta.className = "card-meta";
      const title = document.createElement("h3");
      title.textContent = task.title;
      if (task.status === "done") {
        title.style.textDecoration = "line-through";
        title.style.opacity = "0.6";
      }

      const copy = document.createElement("p");
      copy.textContent = task.status === "pending" ? "In Progress" : "Achieved Goal";
      
      meta.appendChild(title);
      meta.appendChild(copy);

      const actionDiv = document.createElement("div");
      actionDiv.style.display = "flex";
      actionDiv.style.gap = "8px";

      const toggleBtn = document.createElement("button");
      toggleBtn.className = `action-pill ${task.status === "done" ? "done" : "pending"}`;
      toggleBtn.textContent = task.status === "done" ? "Undo" : "Complete";
      toggleBtn.onclick = async () => {
        try {
          toggleBtn.disabled = true;
          await authRequest(`/tasks/${task._id}/toggle`, "PATCH");
          await renderMyGoals();
        } catch (e) {
          showStatus(e.message, "error");
        } finally {
          toggleBtn.disabled = false;
        }
      };

      const delBtn = document.createElement("button");
      delBtn.className = "btn-circle";
      delBtn.style.width = "28px";
      delBtn.style.height = "28px";
      delBtn.style.background = "#ef4444";
      delBtn.style.color = "white";
      delBtn.style.border = "none";
      delBtn.style.borderRadius = "8px";
      delBtn.style.fontSize = "16px";
      delBtn.style.cursor = "pointer";
      delBtn.innerHTML = "×";
      delBtn.onclick = async () => {
        try {
          await authRequest(`/tasks/${task._id}`, "DELETE");
          await renderMyGoals();
        } catch (e) {
          showStatus(e.message, "error");
        }
      };

      actionDiv.appendChild(toggleBtn);
      actionDiv.appendChild(delBtn);

      card.appendChild(meta);
      card.appendChild(actionDiv);
      myGoalsList.appendChild(card);
    });
  } catch (err) {
    myGoalsList.innerHTML = `<div class="empty-state" style="color:var(--danger)">Error: ${err.message}</div>`;
  }
}

// EVENTS
openSettingsButton?.addEventListener("click", () => chrome.runtime.openOptionsPage());
openWebAppButton?.addEventListener("click", () => chrome.tabs.create({ url: "https://velrocity.vercel.app/dashboard" }));

habitsTab?.addEventListener("click", () => switchTab("myPersonalHabitsView", habitsTab, VIEWS, TABS));
goalsTab?.addEventListener("click", () => switchTab("myGoalsView", goalsTab, VIEWS, TABS));

myGoalsForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const val = myGoalInput.value.trim();
  if (!val) return;
  try {
    myGoalInput.disabled = true;
    await authRequest("/tasks", "POST", { title: val });
    myGoalInput.value = "";
    await renderMyGoals();
  } catch (err) {
    showStatus(err.message, "error");
  } finally {
    myGoalInput.disabled = false;
  }
});

// INIT
async function refreshAllData() {
  const settings = await getSettings();
  const token = settings.authToken;

  if (token) {
    await renderMyHabits();
    await renderMyGoals();
  } else {
    clearStatus();
  }
}

(async function init() {
  if (todayLabel) todayLabel.textContent = getTodayLabel();
  await refreshAllData();
  setInterval(refreshAllData, 5 * 60 * 1000);
})();
