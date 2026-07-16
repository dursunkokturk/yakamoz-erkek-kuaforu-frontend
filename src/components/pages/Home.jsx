import { Link, useNavigate } from "react-router-dom";
import { Scissors, Clock, ShieldCheck } from "lucide-react";
import { useServices } from "../../context/ServiceContext";
import { ServiceCard } from "../services/ServiceCard";
import { BarberStripe } from "../visuals/BarberStripe";
import { Button } from "../ui/Button";

export function Home() {
  const navigate = useNavigate();
  const { activeServices } = useServices();

  return (
    <div className="page page--home">
      <section className="hero">
        <div className="hero__content">
          <span className="hero__eyebrow">Yakamoz Erkek Kuaförü</span>
          <h1 className="hero__title">
            Randevunu ayarla,
            <br />
            sıra sende, koltuk hazır.
          </h1>
          <p className="hero__subtitle">
            Saç, sakal ve tıraş hizmetlerinde deneyimli ellerle, işine yakışan bir görünüm.
            Randevunu birkaç dokunuşla ayırt, gerisini bize bırak.
          </p>
          <div className="hero__actions">
            <Button size="lg" onClick={() => navigate("/randevu-al")}>
              Randevu Al
            </Button>
            <Link to="/hizmetler" className="hero__secondary-link">
              Hizmetleri incele
            </Link>
          </div>
        </div>
      </section>

      <BarberStripe />

      <section className="home-highlights">
        <div className="home-highlight">
          <Scissors size={22} />
          <h3>Deneyimli usta</h3>
          <p>Klasikten modern kesime, her tarza hakim bir el.</p>
        </div>
        <div className="home-highlight">
          <Clock size={22} />
          <h3>09:00 – 19:00</h3>
          <p>Salı hariç her gün hizmetinizdeyiz.</p>
        </div>
        <div className="home-highlight">
          <ShieldCheck size={22} />
          <h3>Onaylı randevu</h3>
          <p>Her randevu berber onayından geçer, boşa gelmezsiniz.</p>
        </div>
      </section>

      <section className="home-services">
        <div className="section-heading">
          <h2>Hizmetlerimiz</h2>
          <Link to="/hizmetler" className="section-heading__link">
            Tümünü gör
          </Link>
        </div>
        <div className="service-grid">
          {activeServices.slice(0, 4).map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      <section className="home-about">
        <div className="section-heading">
          <h2>Hakkımızda</h2>
        </div>
        <p>
          Yakamoz Erkek Kuaförü, mahallenin güvenilir berberi olarak her yaştan erkeğe hizmet
          veriyor. Temiz bir tıraş, düzgün bir kesim ve sıcak bir sohbet — kapımızdan içeri
          girdiğiniz andan itibaren kendinizi evinizde hissedeceksiniz.
        </p>
      </section>
    </div>
  );
}
