import React from "react";

export function PanelWrapper({ title, subtitle, children, actions, className = "" }) {
  return (
    <div className={`panel fade-in ${className}`} style={{ height: "100%" }}>
      {(title || actions) && (
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            {title && <h3 style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{title}</h3>}
            {subtitle && <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{subtitle}</p>}
          </div>
          {actions && <div style={{ display: "flex", gap: 8 }}>{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export function LoadingPanel({ lines = 3 }) {
  return (
    <div className="panel" style={{ height: "100%" }}>
      <div className="skeleton" style={{ height: 12, width: "40%", marginBottom: 16 }} />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 32, marginBottom: 10, opacity: 1 - i * 0.15 }} />
      ))}
    </div>
  );
}

export function ErrorPanel({ message, onRetry }) {
  return (
    <div className="panel fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 120, gap: 12, textAlign: "center" }}>
      <span style={{ fontSize: 28 }}>⚠️</span>
      <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>{message || "Something went wrong"}</p>
      {onRetry && (
        <button onClick={onRetry} style={{ padding: "6px 16px", borderRadius: 8, background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid var(--accent)", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
          Retry
        </button>
      )}
    </div>
  );
}

export function EmptyState({ icon = "🔍", title, description }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300, gap: 16, textAlign: "center", padding: 40 }}>
      <div style={{ fontSize: 56, lineHeight: 1 }}>{icon}</div>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>{title}</h2>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 340, lineHeight: 1.6 }}>{description}</p>
      </div>
    </div>
  );
}
