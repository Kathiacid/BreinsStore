import React, { useEffect, useMemo, useRef, useState } from "react";
import "./CustomDropdown.css";

export default function CustomDropdown({
  value,
  onChange,
  options = [],
  placeholder = "Seleccionar...",
  className = "",
  disabled = false,
}) {
  // ✅ HOOKS SIEMPRE ARRIBA (nunca condicionales)
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const selected = useMemo(() => {
    return options.find((o) => o.value === value) || null;
  }, [options, value]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleSelect = (opt) => {
    if (disabled) return;
    onChange?.(opt.value);
    setOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className={`custom-dropdown ${className} ${disabled ? "is-disabled" : ""}`}
    >
      <button
        type="button"
        className="custom-dropdown__trigger"
        onClick={() => !disabled && setOpen((s) => !s)}
        aria-expanded={open}
        disabled={disabled}
      >
        <span className="custom-dropdown__label">
          {selected ? selected.label : placeholder}
        </span>
        <span className="custom-dropdown__chev">▾</span>
      </button>

      {open && (
        <div className="custom-dropdown__menu" role="listbox">
          {options.length === 0 ? (
            <div className="custom-dropdown__empty">Sin opciones</div>
          ) : (
            options.map((opt) => (
              <button
                type="button"
                key={opt.value}
                className={`custom-dropdown__item ${
                  opt.value === value ? "is-active" : ""
                }`}
                onClick={() => handleSelect(opt)}
              >
                {opt.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
