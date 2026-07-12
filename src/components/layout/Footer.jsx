import { useSettings } from "../../context/SettingsContext";

export function Footer() {
  const { settings } = useSettings();
  return (
    <footer className="site-footer">
      <p>
        {settings.businessName} · {settings.phone}
      </p>
      <p className="site-footer__muted">{settings.address}</p>
    </footer>
  );
}
