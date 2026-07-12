const STATUS_LABELS = {
  pending: "Bekliyor",
  approved: "Onaylandı",
  cancelled: "İptal",
};

export function Badge({ status, children }) {
  const label = children ?? STATUS_LABELS[status] ?? status;
  return <span className={`ui-badge ui-badge--${status}`}>{label}</span>;
}
