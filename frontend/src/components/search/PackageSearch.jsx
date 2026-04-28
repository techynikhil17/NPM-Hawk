import React, { useState, useRef, useEffect } from "react";
import { api } from "../../lib/api.js";
import { useDebounce } from "../../hooks/useDebounce.js";

export function PackageSearch({ onSelect, disabledPackages = [], placeholder = "Search npm packages..." }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounced = useDebounce(query, 300);
  const ref = useRef(null);

  useEffect(() => {
    if (debounced.length < 2) { setResults([]); return; }
    setLoading(true);
    api.search(debounced)
      .then(setResults)
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debounced]);

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleSelect(name) {
    if (!disabledPackages.includes(name)) onSelect(name);
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  return (
    <div ref={ref} style={{ position: "relative", flex: 1, maxWidth: 480 }}>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 15, pointerEvents: "none" }}>🔍</span>
        <input
          id="package-search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          style={{
            width: "100%",
            padding: "10px 12px 10px 38px",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-bright)",
            borderRadius: 10,
            color: "var(--text-primary)",
            fontSize: 14,
            outline: "none",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => e.target.style.borderColor = "var(--accent)"}
          onMouseLeave={(e) => e.target.style.borderColor = query ? "var(--accent)" : "var(--border-bright)"}
        />
      </div>

      {open && (results.length > 0 || loading) && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          left: 0,
          right: 0,
          background: "var(--bg-panel)",
          border: "1px solid var(--border-bright)",
          borderRadius: 12,
          zIndex: 100,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        }}>
          {loading && <div style={{ padding: "14px 16px", color: "var(--text-muted)", fontSize: 13 }}>Searching...</div>}
          {results.map((r) => {
            const disabled = disabledPackages.includes(r.name);
            return (
              <div
                key={r.name}
                onClick={() => handleSelect(r.name)}
                style={{
                  padding: "12px 16px",
                  cursor: disabled ? "default" : "pointer",
                  opacity: disabled ? 0.4 : 1,
                  borderBottom: "1px solid var(--border)",
                  transition: "background 0.15s",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
                onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = "var(--bg-hover)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 280 }}>{r.description}</div>
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0 }}>v{r.version}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function PackageChip({ name, color, onRemove }) {
  return (
    <div className="chip" style={{ borderColor: `${color}44`, background: `${color}14`, color }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <span style={{ color: "var(--text-primary)" }}>{name}</span>
      <span className="chip-remove" onClick={() => onRemove(name)} title={`Remove ${name}`}>✕</span>
    </div>
  );
}

