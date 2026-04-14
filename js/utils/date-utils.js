const APP_TIMEZONE_OFFSET_MINUTES = 330;
const APP_TIMEZONE_OFFSET_MS = APP_TIMEZONE_OFFSET_MINUTES * 60 * 1000;

export function shiftToAppTime(date = new Date()) {
  return new Date(new Date(date).getTime() + APP_TIMEZONE_OFFSET_MS);
}

export function getTodayKey() {
  const shifted = shiftToAppTime(new Date());
  const year = shifted.getUTCFullYear();
  const month = String(shifted.getUTCMonth() + 1).padStart(2, "0");
  const day = String(shifted.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayLabel() {
  return shiftToAppTime(new Date()).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
