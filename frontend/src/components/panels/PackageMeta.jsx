import React from "react";
import { PanelWrapper, LoadingPanel } from "../shared/index.jsx";
import { formatDate } from "../../lib/utils.js";

export function PackageMeta({ packageData, packageNames, loading }) {
  if (loading) return <PanelWrapper title="Package Info"><LoadingPanel lines={4} /></PanelWrapper>;

  const name = packageNames[0];
  const pkg = packageData[name];
  if (!pkg) return null;

  const { meta, github } = pkg;

  return (
    <PanelWrapper title="Package Info">
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)" }}>{meta?.name}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>v{meta?.version}</div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 8, lineHeight: 1.6 }}>{meta?.description || "No description"}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { label: "License", value: meta?.license, icon: "📜" },
            { label: "Maintainers", value: meta?.maintainers?.length, icon: "👥" },
            { label: "Stars", value: github?.stars != null ? github.stars.toLocaleString() : "—", icon: "⭐" },
            { label: "Issues", value: github?.openIssues != null ? github.openIssues.toLocaleString() : "—", icon: "🐛" },
            { label: "Dependencies", value: meta?.dependencies, icon: "📦" },
            { label: "Forks", value: github?.forks != null ? github.forks.toLocaleString() : "—", icon: "🍴" },
          ].map(({ label, value, icon }) => (
            <div key={label} style={{ padding: "10px 12px", background: "var(--bg-surface)", borderRadius: 8, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>{icon} {label}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{value ?? "—"}</div>
            </div>
          ))}
        </div>

        {meta?.repository && (
          <a href={meta.repository} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "var(--accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
            <span>🔗</span> View Repository
          </a>
        )}
        {meta?.keywords?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {meta.keywords.slice(0, 8).map((kw) => (
              <span key={kw} className="badge badge-gray">{kw}</span>
            ))}
          </div>
        )}
      </div>
    </PanelWrapper>
  );
}
