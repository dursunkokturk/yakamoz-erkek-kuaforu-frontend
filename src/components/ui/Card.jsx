export function Card({ children, className = "", onClick, as = "div" }) {
  const Tag = as;
  return (
    <Tag className={`ui-card ${onClick ? "ui-card--clickable" : ""} ${className}`} onClick={onClick}>
      {children}
    </Tag>
  );
}
