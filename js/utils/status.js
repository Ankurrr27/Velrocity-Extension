export function showStatus(message, tone = "info") {
  const statusMessage = document.getElementById("statusMessage");
  if (!statusMessage) return;
  statusMessage.textContent = message;
  statusMessage.classList.remove("hidden");
  statusMessage.style.background =
    tone === "error" ? "rgba(220, 38, 38, 0.95)" : "rgba(15, 23, 42, 0.95)";
  
  // Auto-hide after 4 seconds
  setTimeout(clearStatus, 4000);
}

export function clearStatus() {
  const statusMessage = document.getElementById("statusMessage");
  if (!statusMessage) return;
  statusMessage.classList.add("hidden");
  statusMessage.textContent = "";
}
