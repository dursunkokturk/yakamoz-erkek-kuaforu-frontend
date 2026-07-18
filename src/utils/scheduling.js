import { isWorkingDay } from "./dateUtils";

/**
 * Bir tarihin randevuya acik olup olmadigini tek bir yerden belirler.
 * Hem haftalik kapali gunu (orn. Sali) hem de admin tarafindan eklenen
 * ozel kapali gunleri kontrol eder. UI (Calendar, useAvailability) ve
 * veri katmani (AppointmentContext) AYNI fonksiyonu kullanmali,
 * aksi halde iki kontrol birbirinden sapabilir.
 */
export function getDateClosureInfo(dateISO, { closedWeekday, isDateClosed, getClosedDayInfo }) {
  if (!isWorkingDay(dateISO, closedWeekday)) {
    return { isClosed: true, reason: "Haftalık kapalı gün" };
  }
  if (isDateClosed(dateISO)) {
    const info = getClosedDayInfo(dateISO);
    return { isClosed: true, reason: info?.reason || "İşletme bu tarihte kapalı" };
  }
  return { isClosed: false, reason: null };
}