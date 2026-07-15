import { createContext, useContext, useEffect, useState } from "react";
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from "../utils/storage";

const ClosedDayContext = createContext(null);

export function ClosedDayProvider({ children }) {
  const [closedDays, setClosedDays] = useState(() =>
    loadFromStorage(STORAGE_KEYS.CLOSED_DAYS, [])
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CLOSED_DAYS, closedDays);
  }, [closedDays]);

  function addClosedDay(date, reason = "") {
    if (closedDays.some((d) => d.date === date)) {
      throw new Error("ALREADY_CLOSED");
    }

    const entry = { id: `cd-${Date.now()}`, date, reason:reason.trim() };
    setClosedDays((prev) => [...prev, entry].sort((a,b)=>a.date.localeCompare(b.date)));
    return entry;
  }

  function removeClosedDay(id) {
    setClosedDays((prev) => prev.filter((d) => d.id !== id));
  }

  function isDateClosed(dateISO) {
    return closedDays.some((d) => d.date === dateISO);
  }

  function getClosedDayInfo(dateISO) {
    return closedDays.find((d) => d.date === dateISO) || null;
  }

  return (
    <ClosedDayContext.Provider
      value={{ closedDays, addClosedDay, removeClosedDay, isDateClosed, getClosedDayInfo }}
    >
      {children}
    </ClosedDayContext.Provider>
  );
}

export function useClosedDays() {
  const ctx = useContext(ClosedDayContext);
  if (!ctx) throw new Error("useClosedDays, ClosedDayProvider içinde kullanılmalı");
  return ctx;
}