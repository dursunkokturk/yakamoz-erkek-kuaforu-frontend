import { forwardRef } from "react";

export const Input = forwardRef(function Input(
  { label, error, hint, id, className = "", ...rest },
  ref
) {
  const inputId = id || rest.name;
  return (
    <div className={`ui-field ${error ? "ui-field--error" : ""} ${className}`}>
      {label ? (
        <label className="ui-field__label" htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <input ref={ref} id={inputId} className="ui-field__input" {...rest} />
      {error ? (
        <span className="ui-field__error">{error}</span>
      ) : hint ? (
        <span className="ui-field__hint">{hint}</span>
      ) : null}
    </div>
  );
});
