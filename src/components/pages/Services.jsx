import { useNavigate } from "react-router-dom";
import { useServices } from "../../context/ServiceContext";
import { ServiceCard } from "../services/ServiceCard";

export function Services() {
  const { services } = useServices();
  const navigate = useNavigate();

  function handleSelect(service) {
    navigate("/randevu-al", { state: { preselectedServiceId: service.id } });
  }

  return (
    <div className="page page--services">
      <div className="page-header">
        <h1>Hizmetler &amp; Fiyat Listesi</h1>
        <p>Bir hizmete dokunarak doğrudan randevu ekranına geçebilirsiniz.</p>
      </div>
      <div className="service-grid service-grid--wide">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} onSelect={handleSelect} />
        ))}
      </div>
    </div>
  );
}
