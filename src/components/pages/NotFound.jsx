import { Link } from "react-router-dom";
import { Scissors } from "lucide-react";

export function NotFound() {
  return (
    <div className="page page--not-found">
      <Scissors size={40} />
      <h1>404</h1>
      <p>Aradığınız sayfa bulunamadı.</p>
      <Link to="/" className="hero__secondary-link">
        Ana sayfaya dön
      </Link>
    </div>
  );
}
