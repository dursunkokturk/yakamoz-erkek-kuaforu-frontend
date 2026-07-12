import { Clock, Banknote } from "lucide-react";
import { Card } from "../ui/Card";

export function ServiceCard({ service, selected = false, onSelect }) {
  return (
    <Card
      className={`service-card ${selected ? "service-card--selected" : ""}`}
      onClick={onSelect ? () => onSelect(service) : undefined}
    >
      <h3 className="service-card__name">{service.name}</h3>
      <div className="service-card__meta">
        <span className="service-card__meta-item">
          <Clock size={14} /> {service.durationMinutes} dk
        </span>
        <span className="service-card__meta-item">
          <Banknote size={14} /> {service.price} ₺
        </span>
      </div>
    </Card>
  );
}
