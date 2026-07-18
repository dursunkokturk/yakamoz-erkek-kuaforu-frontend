import { createContext, useContext, useEffect, useState } from "react";
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from "../utils/storage";
import { MAX_APPOINTMENTS_PER_SLOT } from "../utils/dateUtils";
import { getDateClosureInfo } from "../utils/scheduling";
import { useClosedDays } from "./ClosedDayContext";
import { useSettings } from "./SettingsContext";

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

  // isDateBookable'ın Ihtiyac Duydugu Bagimliliklar
  const { isDateClosed, getClosedDayInfo } = useClosedDays();
  const { settings } = useSettings();

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

  /* Tarih Kapali Mi? 
    Hem haftalık kapalı gün 
    hem admin tarafından eklenen özel günler dahil. */
  function isDateBookable(date) {
    const { isClosed } = getDateClosureInfo(date, {
      closedWeekday: settings.closedWeekday,
      isDateClosed,
      getClosedDayInfo,
    });
    return !isClosed;
  }

  function createAppointment(data) {

    // Kapali Gun Kontrolu Artik Burada Uygulaniyor
    if (!isDateBookable(data.date)) {
      throw new Error("DATE_CLOSED");
    }
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
    if (!isDateBookable(newDate)) {
      throw new Error("DATE_CLOSED");
    }

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
        isDateBookable
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
