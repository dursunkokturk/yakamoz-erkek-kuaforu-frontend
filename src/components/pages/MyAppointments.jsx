import { useState } from "react";
import { Search } from "lucide-react";
import { useAppointments } from "../../context/AppointmentContext";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { formatPhoneInput, isValidPhone } from "../../utils/validation";
import { formatDateTR } from "../../utils/dateUtils";

export function MyAppointments() {
  const { appointments } = useAppointments();
  const [phone, setPhone] = useState("");
  const [searchedPhone, setSearchedPhone] = useState(null);

  const results = searchedPhone
    ? appointments
        .filter((a) => a.phone === searchedPhone)
        .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`))
    : [];

  function handleSearch(e) {
    e.preventDefault();
    if (!isValidPhone(phone)) return;
    setSearchedPhone(phone.trim());
  }

  return (
    <div className="page page--my-appointments">
      <div className="page-header">
        <h1>Randevularım</h1>
        <p>Telefon numaranızı girerek randevu geçmişinizi görüntüleyin.</p>
      </div>

      <form className="lookup-form" onSubmit={handleSearch}>
        <Input
          label="Telefon"
          placeholder="0555 555 55 55"
          inputMode="numeric"
          value={phone}
          onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
        />
        <Button type="submit" disabled={!isValidPhone(phone)}>
          <Search size={16} /> Sorgula
        </Button>
      </form>

      {searchedPhone && (
        <div className="appointment-results">
          {results.length === 0 ? (
            <p className="appointment-results__empty">Bu numaraya kayıtlı randevu bulunamadı.</p>
          ) : (
            results.map((a) => (
              <Card key={a.id} className="appointment-result-card">
                <div className="appointment-result-card__row">
                  <strong>{a.serviceName}</strong>
                  <Badge status={a.status} />
                </div>
                <p>
                  {formatDateTR(a.date)} · {a.time}
                </p>
                <p className="appointment-result-card__price">{a.price} ₺</p>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
