import { forwardRef } from "react";

export const Select = forwardRef(function Select(
  { label, error, hint, id, className = "", children, ...rest },
  ref
) {
  const selectId = id || rest.name;
  return (
    <div className={`ui-field ${error ? "ui-field--error" : ""} ${className}`}>
      {label ? (
        <label className="ui-field__label" htmlFor={selectId}>
          {label}
        </label>
      ) : null}
      <select ref={ref} id={selectId} className="ui-field__input ui-field__select" {...rest}>
        {children}
      </select>
      {error ? (
        <span className="ui-field__error">{error}</span>
      ) : hint ? (
        <span className="ui-field__hint">{hint}</span>
      ) : null}
    </div>
  );
});
