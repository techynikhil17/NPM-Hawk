import React from "react";
import { PanelWrapper } from "../shared/index.jsx";
import { formatNumber, packageColor, scoreColor, gradeColor } from "../../lib/utils.js";

function Cell({ value, highlight }) {
  return (
    <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", color: highlight ? "var(--accent)" : "var(--text-primary)", fontSize: 14, fontWeight: highlight ? 700 : 400 }}>
      {value}
    </td>
  );
}

export function ComparisonTable({ packageData, packageNames, loading }) {
  if (loading || !packageNames.length) return null;

  const rows = [
    { label: "Weekly Downloads", getValue: (p) => formatNumber(p?.downloads?.weekly) },
    { label: "Monthly Downloads", getValue: (p) => formatNumber(p?.downloads?.monthly) },
    { label: "All-Time Downloads", getValue: (p) => p?.downloads?.allTime != null ? formatNumber(p.downloads.allTime) : "—" },
    { label: "GitHub Stars", getValue: (p) => p?.github?.stars != null ? p.github.stars.toLocaleString() : "—" },
    { label: "Open Issues", getValue: (p) => p?.github?.openIssues != null ? p.github.openIssues.toLocaleString() : "—" },
    { label: "Forks", getValue: (p) => p?.github?.forks != null ? p.github.forks.toLocaleString() : "—" },
    { label: "License", getValue: (p) => p?.meta?.license || "—" },
    { label: "Version", getValue: (p) => p?.meta?.version ? `v${p.meta.version}` : "—" },
    { label: "Maintainers", getValue: (p) => p?.meta?.maintainers?.length ?? "—" },
    { label: "Vulnerabilities", getValue: (p) => { const n = p?.security?.count ?? 0; return n === 0 ? "✅ Clean" : `⚠️ ${n}`; } },
    { label: "Health Score", getValue: (p) => p?.health ? `${p.health.total} (${p.health.grade})` : "—" },
  ];

  return (
    <PanelWrapper title="Comparison">
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid var(--border-bright)" }}>Metric</th>
              {packageNames.map((name, i) => (
                <th key={name} style={{ padding: "10px 16px", textAlign: "left", fontSize: 13, fontWeight: 700, color: packageColor(i), borderBottom: "1px solid var(--border-bright)" }}>{name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} style={{ transition: "background 0.15s" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-hover)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>{row.label}</td>
                {packageNames.map((name) => <Cell key={name} value={row.getValue(packageData[name])} />)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PanelWrapper>
  );
}

