"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

export type PickerOption = {
  value: string;
  label: string;
  sub?: string;
  group?: string;
};

type PlacePickerProps = {
  label: string;
  value: string;
  options: PickerOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
};

export function PlacePicker({
  label,
  value,
  options,
  onChange,
  placeholder = "বেছে নাও",
  searchPlaceholder = "খোঁজো…",
  disabled = false,
}: PlacePickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    const id = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(id);
    };
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((option) =>
      `${option.label} ${option.sub ?? ""} ${option.group ?? ""}`
        .toLowerCase()
        .includes(q),
    );
  }, [options, query]);

  const groups = useMemo(() => {
    const map = new Map<string, PickerOption[]>();
    for (const option of filtered) {
      const key = option.group ?? "";
      const list = map.get(key);
      if (list) list.push(option);
      else map.set(key, [option]);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="place-picker" ref={rootRef}>
      <span className="place-picker-label">{label}</span>
      <button
        type="button"
        className="place-picker-button"
        onClick={() => {
          setQuery("");
          setOpen((current) => !current);
        }}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="value">
          <span>{selected?.label ?? placeholder}</span>
          {selected?.sub ? <span className="sub">{selected.sub}</span> : null}
        </span>
        <ChevronDown size={17} className="chev" aria-hidden="true" />
      </button>

      {open ? (
        <div className="place-panel">
          <div style={{ position: "relative" }}>
            <Search
              size={15}
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--ink-3)",
              }}
            />
            <input
              ref={inputRef}
              className="place-search"
              style={{ paddingLeft: 36 }}
              placeholder={searchPlaceholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label={searchPlaceholder}
            />
          </div>

          <div className="place-options" role="listbox" aria-label={label}>
            {filtered.length === 0 ? (
              <p className="place-empty">কিছু খুঁজে পাওয়া যায়নি</p>
            ) : (
              groups.map(([group, items]) => (
                <div key={group || "all"}>
                  {group ? <div className="place-option-group">{group}</div> : null}
                  {items.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={option.value === value}
                      className="place-option"
                      data-selected={option.value === value}
                      onClick={() => {
                        onChange(option.value);
                        setQuery("");
                        setOpen(false);
                      }}
                    >
                      <span>
                        {option.label}
                        {option.sub ? (
                          <span
                            style={{
                              display: "block",
                              color: "var(--ink-3)",
                              fontSize: 11,
                              lineHeight: 1.3,
                            }}
                          >
                            {option.sub}
                          </span>
                        ) : null}
                      </span>
                      {option.value === value ? (
                        <Check size={15} aria-hidden="true" />
                      ) : null}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
