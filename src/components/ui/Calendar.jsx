import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { dayjs, WEEKDAY_LABELS } from "../../utils/dateUtils";
import { getDateClosureInfo } from "../../utils/scheduling";
import { useClosedDays } from "../../context/ClosedDayContext";
import { useSettings } from "../../context/SettingsContext";

const WEEKDAY_SHORT_LABELS = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"];

export function Calendar({ selectedDate, onSelectDate }) {
  const { isDateClosed, getClosedDayInfo } = useClosedDays();
  const { settings } = useSettings();
  const [visibleMonth, setVisibleMonth] = useState(() =>
    (selectedDate ? dayjs(selectedDate) : dayjs()).startOf("month")
  );

  const today = dayjs().startOf("day");
  const startOfMonth = visibleMonth.startOf("month");
  const startWeekday = startOfMonth.weekday(); // 0=Pazartesi
  const daysInMonth = visibleMonth.daysInMonth();

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(startOfMonth.date(d));

  function goToPrevMonth() {
    setVisibleMonth((m) => m.subtract(1, "month"));
  }
  function goToNextMonth() {
    setVisibleMonth((m) => m.add(1, "month"));
  }

  const closedDayLabel = WEEKDAY_LABELS[settings.closedWeekday] ?? "";

  return (
    <div className="ui-calendar">
      <div className="ui-calendar__header">
        <button
          type="button"
          className="ui-calendar__nav"
          onClick={goToPrevMonth}
          aria-label="Önceki ay"
          disabled={visibleMonth.isSame(today, "month")}
        >
          <ChevronLeft size={18} />
        </button>
        <span className="ui-calendar__month-label">{visibleMonth.format("MMMM YYYY")}</span>
        <button
          type="button"
          className="ui-calendar__nav"
          onClick={goToNextMonth}
          aria-label="Sonraki ay"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="ui-calendar__weekdays">
        {WEEKDAY_SHORT_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="ui-calendar__grid">
        {cells.map((date, idx) => {
          if (!date) return <span key={`empty-${idx}`} className="ui-calendar__cell ui-calendar__cell--empty" />;
          const iso = date.format("YYYY-MM-DD");
          const isPast = date.isBefore(today, "day");
          const { isClosed, reason: title } = getDateClosureInfo(iso, {
            closedWeekday: settings.closedWeekday,
            isDateClosed,
            getClosedDayInfo,
          });
          const isSelected = selectedDate === iso;
          const isDisabled = isPast || isClosed;

          return (
            <button
              key={iso}
              type="button"
              className={[
                "ui-calendar__cell",
                isSelected ? "ui-calendar__cell--selected" : "",
                isDisabled ? "ui-calendar__cell--disabled" : "",
                isClosed && !isPast ? "ui-calendar__cell--closed" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              disabled={isDisabled}
              onClick={() => onSelectDate(iso)}
              title={title || undefined}
            >
              {date.date()}
            </button>
          );
        })}
      </div>
      <p className="ui-calendar__legend">{closedDayLabel} günleri kapalıyız · Hizmet saatleri 09:00 – 19:00</p>
    </div>
  );
}
