const extensionApi = typeof browser !== "undefined" ? browser : chrome;
const DEFAULT_API_BASE = "https://velrocity.vercel.app/api";

export function storageGet(keys) {
  return new Promise((resolve) => extensionApi.storage.local.get(keys, resolve));
}

export function storageSet(values) {
  return new Promise((resolve) => extensionApi.storage.local.set(values, resolve));
}

export async function getSettings() {
  const result = await storageGet(["habtrackApiBase", "habtrackLastUsername", "habtrackAuthToken", "habtrackTheme"]);

  return {
    apiBase: (result.habtrackApiBase || DEFAULT_API_BASE).replace(/\/$/, ""),
    lastUsername: result.habtrackLastUsername || "",
    authToken: result.habtrackAuthToken || null,
    theme: result.habtrackTheme || "dark",
  };
}

export async function publicRequest(path) {
  const { apiBase } = await getSettings();
  const response = await fetch(`${apiBase}${path}`);
  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch (err) {
    console.error("JSON Parse Error:", err, "Response Text:", text);
    if (!response.ok) {
        throw new Error(`Server Error (${response.status}): The API returned an invalid response. Usually this means the backend is down or misconfigured.`);
    }
    throw new Error("Invalid API Response: Expected JSON but received mixed content.");
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.error || ("Request failed code: " + response.status));
  }

  return data;
}

export async function authRequest(path, method = "GET", body = null) {
  const { apiBase, authToken } = await getSettings();
  if (!authToken) throw new Error("No Auth Token set in Settings.");

  const headers = {
    "Authorization": `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(`${apiBase}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch (err) {
    console.error("JSON Parse Error:", err, "Response Text:", text);
    if (!response.ok) {
        throw new Error(`Auth Server Error (${response.status}): The API returned an invalid response. Ensure your token is valid and the backend is running.`);
    }
    throw new Error("Invalid Auth API Response: Received HTML instead of JSON. Check your API URL.");
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.error || ("Request failed code: " + response.status));
  }

  return data;
}
