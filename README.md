# Velrocity Elite Extension ⚡

The official browser companion for the **Velrocity Productivity Workspace**. This extension brings your clinical, data-driven habit tracking and goal management directly into your browser's side panel.

## About Velrocity Elite

Velrocity is designed for elite performers who need a silent, high-density interface to manage their daily routine. The extension allows you to stay focused on your deep work while having instantaneous access to your progress.

### Key Features
- **Elite Design System**: A compact, premium interface optimized for productivity.
- **Real-Time Habit Tracking**: Tick off your daily habits without leaving your current tab.
- **Goal Management**: Quick-add and toggle your daily goals with a streamlined workflow.
- **Live Streak Tracking**: Stay motivated with your global streak count prominently displayed.
- **Dual Themes**: Seamless switching between high-contrast Dark mode and clinical Light mode.

---

## How to Use

### 1. Installation
1. Download or clone this repository.
2. Open your browser and navigate to `chrome://extensions`.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select this directory.

### 2. Configuration
1. Click the extension icon to open the **Velrocity Side Panel**.
2. Click the **Settings (⚙️)** icon at the bottom.
3. Enter your **Elite Key** (Auth Token) from your Velrocity Dashboard settings.
4. (Optional) Adjust the API Base URL if you are using a self-hosted backend.

### 3. Daily Workflow
- **Habits Tab**: View and toggle your scheduled habits for the current day.
- **Goals Tab**: Add quick goals and toggle them as "Smashed It" to track your micro-wins.
- **Theme Switch**: Click the 🌓 icon in the header to toggle between light and dark visuals.
- **Dashboard Link**: Use the bottom link to jump directly to your full Velrocity Dashboard for advanced analytics.

---

## Folder Structure
- `js/ui/components.js`: Atomic UI components for cards and buttons.
- `js/ui/renderers.js`: Specialized list rendering and skeleton logic.
- `js/core/api.js`: Unified API request handler with Auth support.
- `popup.css`: The "Elite" design system tokens and styles.
- `sidepanel.html/js`: The core side panel entry point.

---

## Technical Notes
- Built with Vanilla JS & Semantic HTML for zero-overhead performance.
- Uses `chrome.storage` for persistent theme and auth state synchronization.
- Optimized for the Chromium Side Panel API.

---

© 2026 Velrocity Elite. Built for those who demand more from their workspace.
