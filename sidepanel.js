import { getSettings, authRequest, storageSet } from "./js/core/api.js";
import { getTodayKey, getTodayLabel } from "./js/utils/date-utils.js";
import { showStatus, clearStatus } from "./js/utils/status.js";
import { showSkeleton, renderList } from "./js/ui/renderers.js";
import { switchTab } from "./js/ui/tabs.js";

// DOM ELEMENTS
const openSettingsButton = document.getElementById("openSettings");
const openWebAppButton = document.getElementById("openWebApp");
const todayLabel = document.getElementById("todayLabel");
const streakWrapper = document.getElementById("streakWrapper");
const streakCount = document.getElementById("streakCount");

const myGoalsView = document.getElementById("myGoalsView");
const myGoalsForm = document.getElementById("myGoalsForm");
const myGoalInput = document.getElementById("myGoalInput");
const myGoalsList = document.getElementById("myGoalsList");

const myPersonalHabitsView = document.getElementById("myPersonalHabitsView");
const myHabitsList = document.getElementById("myHabitsList");

const habitsTab = document.getElementById("habitsTab");
const goalsTab = document.getElementById("goalsTab");
const themeToggle = document.getElementById("themeToggle");

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
    const data = await authRequest("/stats/today");
    const list = Array.isArray(data.habits) ? data.habits : [];
    const sorted = [...list].sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));

    // Update Streak
    if (streakWrapper && streakCount) {
      if (data.streak > 0) {
        streakWrapper.classList.remove("hidden");
        streakCount.textContent = data.streak;
      } else {
        streakWrapper.classList.add("hidden");
      }
    }

    renderList(myHabitsList, sorted, {
      type: "habit",
      onToggle: async (habit, toggle) => {
        try {
          toggle.style.pointerEvents = "none";
          await authRequest("/activity/toggle", "POST", { habitId: habit.habitId, date: getTodayKey() });
          await renderMyHabits();
        } catch (e) {
          showStatus(e.message, "error");
          toggle.style.pointerEvents = "auto";
        }
      }
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
    const list = Array.isArray(tasks) ? tasks : [];
    const sorted = [...list].sort((a, b) => (a.status === b.status ? 0 : a.status === "done" ? 1 : -1));

    renderList(myGoalsList, sorted, {
      type: "goal",
      onToggle: async (task, toggle) => {
        try {
          toggle.style.pointerEvents = "none";
          await authRequest(`/tasks/${task._id}/toggle`, "PATCH");
          await renderMyGoals();
        } catch (e) {
          showStatus(e.message, "error");
          toggle.style.pointerEvents = "auto";
        }
      },
      onDelete: async (task) => {
        try {
          await authRequest(`/tasks/${task._id}`, "DELETE");
          await renderMyGoals();
        } catch (e) {
          showStatus(e.message, "error");
        }
      }
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

themeToggle?.addEventListener("click", async () => {
  const isLight = document.body.getAttribute("data-theme") === "light";
  const nextTheme = isLight ? "dark" : "light";
  document.body.setAttribute("data-theme", nextTheme);
  themeToggle.textContent = isLight ? "🌓" : "☀️";
  await storageSet({ habtrackTheme: nextTheme });
});

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
  
  // Persistent Theme
  const settings = await getSettings();
  if (settings.theme === "light") {
    document.body.setAttribute("data-theme", "light");
    if (themeToggle) themeToggle.textContent = "☀️";
  }

  await refreshAllData();
  setInterval(refreshAllData, 5 * 60 * 1000);
})();
