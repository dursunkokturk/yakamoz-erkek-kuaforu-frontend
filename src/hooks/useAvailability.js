import { useMemo } from "react";
import { useAppointments } from "../context/AppointmentContext";
import { useClosedDays } from "../context/ClosedDayContext";
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
  const { isDateClosed, getClosedDayInfo } = useClosedDays();

  return useMemo(() => {
    if (!dateISO) return { isOpen: false, slots: [], closedReason: null };

    if (!isWorkingDay(dateISO)) {
      return { isOpen: false, slots: [], closedReason: "Salı günleri kapalıyız" };
    }
    
    if (isDateClosed(dateISO)) {
      const info = getClosedDayInfo(dateISO);
      return { isOpen: false, slots: [], closedReason: info ? `İşletme Kapalı:${info.reason}` : "İşletme bu tarihte kapalı" };
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
    return { isOpen: true, slots, closedReason: null };
  }, [dateISO, countActiveAppointmentsAt, isDateClosed, getClosedDayInfo]);
}
