export function Spinner({ size = 24, label = "Yükleniyor" }) {
  return (
    <div className="ui-spinner" role="status" aria-label={label}>
      <span className="ui-spinner__circle" style={{ width: size, height: size }} />
    </div>
  );
}
