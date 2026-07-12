import { createContext, useContext, useEffect, useState } from "react";
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from "../utils/storage";

const ServiceContext = createContext(null);

const DEFAULT_SERVICES = [
  { id: "svc-1", name: "Saç Kesimi", durationMinutes: 30, price: 300 },
  { id: "svc-2", name: "Sakal Tıraşı", durationMinutes: 20, price: 200 },
  { id: "svc-3", name: "Saç + Sakal", durationMinutes: 45, price: 450 },
  { id: "svc-4", name: "Çocuk Saç Kesimi", durationMinutes: 25, price: 250 },
  { id: "svc-5", name: "Fön / Şekillendirme", durationMinutes: 15, price: 150 },
];

export function ServiceProvider({ children }) {
  const [services, setServices] = useState(() =>
    loadFromStorage(STORAGE_KEYS.SERVICES, DEFAULT_SERVICES)
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SERVICES, services);
  }, [services]);

  function addService(service) {
    const newService = { ...service, id: `svc-${Date.now()}` };
    setServices((prev) => [...prev, newService]);
    return newService;
  }

  function updateService(id, updates) {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  }

  function deleteService(id) {
    setServices((prev) => prev.filter((s) => s.id !== id));
  }

  function getServiceById(id) {
    return services.find((s) => s.id === id) || null;
  }

  return (
    <ServiceContext.Provider
      value={{ services, addService, updateService, deleteService, getServiceById }}
    >
      {children}
    </ServiceContext.Provider>
  );
}

export function useServices() {
  const ctx = useContext(ServiceContext);
  if (!ctx) throw new Error("useServices, ServiceProvider içinde kullanılmalı");
  return ctx;
}
