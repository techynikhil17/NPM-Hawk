import React from "react";
import { PanelWrapper, LoadingPanel } from "../shared/index.jsx";
import { formatDate } from "../../lib/utils.js";

function severityBadge(sev) {
  const s = String(sev).toUpperCase();
  if (s === "CRITICAL") return <span className="badge badge-red">CRITICAL</span>;
  if (s === "HIGH") return <span className="badge badge-red">HIGH</span>;
  if (s === "MODERATE" || s === "MEDIUM") return <span className="badge badge-orange">MEDIUM</span>;
  if (s === "LOW") return <span className="badge badge-blue">LOW</span>;
  return <span className="badge badge-gray">{sev}</span>;
}

export function SecurityPanel({ packageData, packageNames, loading }) {
  if (loading) return <PanelWrapper title="Security"><LoadingPanel lines={3} /></PanelWrapper>;

  const allVulns = packageNames.flatMap((name) => {
    const sec = packageData[name]?.security;
    return (sec?.vulnerabilities || []).map((v) => ({ ...v, package: name }));
  });

  return (
    <PanelWrapper title="Security Advisories" subtitle={`${allVulns.length} issue${allVulns.length !== 1 ? "s" : ""} found`}>
      {allVulns.length === 0 ? (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 0" }}>
          <span style={{ fontSize: 28 }}>✅</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--green)" }}>No vulnerabilities found</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>All packages are clean</div>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 300, overflowY: "auto" }}>
          {allVulns.map((v) => (
            <div key={v.id} style={{ padding: "12px 14px", background: "var(--bg-surface)", borderRadius: 10, border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    {severityBadge(v.severity)}
                    {packageNames.length > 1 && <span className="badge badge-blue">{v.package}</span>}
                    <span className="mono" style={{ fontSize: 11, color: "var(--text-muted)" }}>{v.id}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-primary)", lineHeight: 1.5 }}>{v.summary}</div>
                </div>
                {v.references?.[0] && (
                  <a href={v.references[0]} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "var(--accent)", textDecoration: "none", flexShrink: 0 }}>View →</a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </PanelWrapper>
  );
}
