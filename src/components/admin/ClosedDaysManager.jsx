import { useState } from "react";
import { toast } from "react-toastify";
import { Trash2, Plus } from "lucide-react";
import { useClosedDays } from "../../context/ClosedDayContext";
import { Button } from "../ui/Button";
import { formatDateTR } from "../../utils/dateUtils";

export function ClosedDaysManager() {
  const { closedDays, addClosedDay, removeClosedDay } = useClosedDays();
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");

  function handleAdd() {
    if (!date) return toast.error("Lütfen bir tarih seçin");
    try {
      addClosedDay(date, reason.trim());
      toast.success("Kapalı gün eklendi");
      setDate("");
      setReason("");
    } catch (err) {
      if (err.message === "ALREADY_CLOSED") {
        toast.error("Bu tarih zaten kapalı olarak işaretli");
      } else {
        toast.error("Kapalı gün eklenemedi");
      }
    }
  }

  return (
    <div className="closed-days-manager">
      <div className="closed-days-manager__form">
        <input type="date" className="ui-field__input" value={date} onChange={(e) => setDate(e.target.value)} />
        <input
          type="text"
          className="ui-field__input"
          placeholder="Neden (Resmi tatil, bakım, vb.)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <Button size="sm" onClick={handleAdd}><Plus size={16} /> Ekle</Button>
      </div>
      <ul className="closed-days-manager__list">
        {closedDays.map((d) => (
          <li key={d.id}>
            <span>{formatDateTR(d.date)} — {d.reason || "Belirtilmedi"}</span>
            <button onClick={() => removeClosedDay(d.id)} aria-label="Sil"><Trash2 size={16} /></button>
          </li>
        ))}
        {closedDays.length === 0 && <p className="service-manager__empty">Kapalı gün eklenmedi.</p>}
      </ul>
    </div>
  );
}