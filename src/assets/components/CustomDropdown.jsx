import React, { useEffect, useMemo, useRef, useState } from "react";
import "./CustomDropdown.css";

export default function CustomDropdown({
  value,
  onChange,
  options = [],
  placeholder = "Seleccionar...",
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const selected = useMemo(() => {
    return options.find((o) => String(o.value) === String(value)) || null;
  }, [options, value]);

  useEffect(() => {
    const close = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={rootRef} className={`custom-dropdown ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="custom-dropdown__trigger"
        onClick={() => !disabled && setOpen(!open)}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <span>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="custom-dropdown__menu">
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`custom-dropdown__item ${String(opt.value) === String(value) ? "active" : ""}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}