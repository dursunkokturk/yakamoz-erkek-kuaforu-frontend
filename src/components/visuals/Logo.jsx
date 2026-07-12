import { Scissors } from "lucide-react";

export function Logo({ compact = false }) {
  return (
    <div className={`brand-logo ${compact ? "brand-logo--compact" : ""}`}>
      <span className="brand-logo__mark">
        <Scissors size={compact ? 18 : 22} />
      </span>
      <span className="brand-logo__text">
        <strong>Yakamoz</strong>
        {!compact && <em>Erkek Kuaförü</em>}
      </span>
    </div>
  );
}
