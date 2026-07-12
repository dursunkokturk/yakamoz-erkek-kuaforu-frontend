import { createContext, useContext, useEffect, useState } from "react";
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from "../utils/storage";

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
  businessName: "Yakamoz Erkek Kuaförü",
  phone: "0532 123 45 67",
  address: "Merkez Mahallesi, Berber Sokak No:1",
  workStartHour: 9,
  workEndHour: 19,
  closedWeekday: 2, // Salı
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() =>
    loadFromStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SETTINGS, settings);
  }, [settings]);

  function updateSettings(updates) {
    setSettings((prev) => ({ ...prev, ...updates }));
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings, SettingsProvider içinde kullanılmalı");
  return ctx;
}
