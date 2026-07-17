import { createContext, useContext, useEffect, useState } from "react";
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from "../utils/storage";
import { MAX_APPOINTMENTS_PER_SLOT } from "../utils/dateUtils";

const AppointmentContext = createContext(null);

export const APPOINTMENT_STATUS = {
  PENDING: "pending", // Bekliyor
  APPROVED: "approved", // Onaylandı
  COMPLETED: "completed", // Tamamlandı
  CANCELLED: "cancelled", // İptal
};

export function AppointmentProvider({ children }) {
  const [appointments, setAppointments] = useState(() =>
    loadFromStorage(STORAGE_KEYS.APPOINTMENTS, [])
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, appointments);
  }, [appointments]);

  /** Belirli tarih+saatte, iptal edilmemiş kaç randevu var. */
  function countActiveAppointmentsAt(date, time, excludeId = null) {
    return appointments.filter(
      (a) =>
        a.date === date &&
        a.time === time &&
        a.status !== APPOINTMENT_STATUS.CANCELLED &&
        a.id !== excludeId
    ).length;
  }

  function isSlotFull(date, time, excludeId = null) {
    return countActiveAppointmentsAt(date, time, excludeId) >= MAX_APPOINTMENTS_PER_SLOT;
  }

  function createAppointment(data) {
    if (isSlotFull(data.date, data.time)) {
      throw new Error("SLOT_FULL");
    }
    const appointment = {
      id: `apt-${Date.now()}`,
      status: APPOINTMENT_STATUS.PENDING,
      createdAt: new Date().toISOString(),
      ...data,
    };
    setAppointments((prev) => [...prev, appointment]);
    return appointment;
  }

  function approveAppointment(id) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: APPOINTMENT_STATUS.APPROVED } : a))
    );
  }

  function completeAppointment(id) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: APPOINTMENT_STATUS.COMPLETED } : a))
    );
  }

  function cancelAppointment(id) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: APPOINTMENT_STATUS.CANCELLED } : a))
    );
  }

  function deleteAppointment(id) {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  }

  function rescheduleAppointment(id, newDate, newTime) {
    if (isSlotFull(newDate, newTime, id)) {
      throw new Error("SLOT_FULL");
    }
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, date: newDate, time: newTime } : a))
    );
  }

  function getAppointmentsByDate(date) {
    return appointments
      .filter((a) => a.date === date)
      .sort((a, b) => a.time.localeCompare(b.time));
  }

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        createAppointment,
        approveAppointment,
        completeAppointment,
        cancelAppointment,
        deleteAppointment,
        rescheduleAppointment,
        getAppointmentsByDate,
        countActiveAppointmentsAt,
        isSlotFull,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointments() {
  const ctx = useContext(AppointmentContext);
  if (!ctx) throw new Error("useAppointments, AppointmentProvider içinde kullanılmalı");
  return ctx;
}
