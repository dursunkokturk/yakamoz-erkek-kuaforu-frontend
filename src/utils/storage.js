// Basit localStorage sarmalayıcı — tüm veri kalıcılığı bu dosya üzerinden yürür.

export function loadFromStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`storage: "${key}" okunamadı`, err);
    return fallback;
  }
}

export function saveToStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`storage: "${key}" kaydedilemedi`, err);
  }
}

export const STORAGE_KEYS = {
  APPOINTMENTS: "yakamoz_appointments",
  SERVICES: "yakamoz_services",
  BLOCKED_CUSTOMERS: "yakamoz_blocked_customers",
  AUTH_TOKEN: "yakamoz_auth_token",
  SETTINGS: "yakamoz_settings",
  CLOSED_DAYS: "yakamoz_closed_days",
  THEME: "yakamoz_theme",
};
