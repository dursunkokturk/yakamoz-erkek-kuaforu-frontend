import { useMemo } from "react";
import { useAppointments } from "../context/AppointmentContext";
import {
  generateTimeSlots,
  isPastDateTime,
  isWorkingDay,
  MAX_APPOINTMENTS_PER_SLOT,
} from "../utils/dateUtils";

/**
 * Verilen tarih için tüm saat dilimlerini, her birinin dolu/boş durumuyla birlikte döner.
 * Salı günleri ve geçmiş saatler otomatik olarak pasif sayılır.
 */
export function useAvailability(dateISO) {
  const { countActiveAppointmentsAt } = useAppointments();

  return useMemo(() => {
    if (!dateISO || !isWorkingDay(dateISO)) {
      return { isOpen: false, slots: [] };
    }
    const slots = generateTimeSlots().map((time) => {
      const takenCount = countActiveAppointmentsAt(dateISO, time);
      const isPast = isPastDateTime(dateISO, time);
      return {
        time,
        takenCount,
        remaining: Math.max(0, MAX_APPOINTMENTS_PER_SLOT - takenCount),
        isFull: takenCount >= MAX_APPOINTMENTS_PER_SLOT,
        isPast,
        isDisabled: takenCount >= MAX_APPOINTMENTS_PER_SLOT || isPast,
      };
    });
    return { isOpen: true, slots };
  }, [dateISO, countActiveAppointmentsAt]);
}
