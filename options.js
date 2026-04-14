const extensionApi = typeof browser !== "undefined" ? browser : chrome;
const DEFAULT_API_BASE = "https://velrocity.vercel.app/api";

const settingsForm = document.getElementById("settingsForm");
const apiBaseInput = document.getElementById("apiBase");
const authTokenInput = document.getElementById("authToken");
const settingsStatus = document.getElementById("settingsStatus");

function storageGet(keys) {
  return new Promise((resolve) => extensionApi.storage.local.get(keys, resolve));
}

function storageSet(values) {
  return new Promise((resolve) => extensionApi.storage.local.set(values, resolve));
}

function showStatus(message, tone = "info") {
  settingsStatus.textContent = message;
  settingsStatus.classList.remove("hidden");
  settingsStatus.style.borderColor = tone === "error" ? "rgba(244, 63, 94, 0.5)" : "rgba(129, 140, 248, 0.5)";
}

async function initialize() {
  const result = await storageGet(["habtrackApiBase", "habtrackAuthToken"]);
  apiBaseInput.value = result.habtrackApiBase || DEFAULT_API_BASE;
  authTokenInput.value = result.habtrackAuthToken || "";
}

settingsForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const apiBase = apiBaseInput.value.trim().replace(/\/$/, "");

  if (!apiBase) {
    showStatus("Please enter a valid API base URL.", "error");
    return;
  }

  const authToken = authTokenInput.value.trim();

  await storageSet({ habtrackApiBase: apiBase, habtrackAuthToken: authToken });
  showStatus("Settings saved.");
});

initialize();
