import React from "react";
import { LoadingPanel } from "../shared/index.jsx";
import { formatNumber, packageColor } from "../../lib/utils.js";

function KpiCard({ label, value, icon, color, sub }) {
  return (
    <div style={{
      background:"var(--bg-surface)", border:"1px solid var(--border)", borderRadius:12,
      padding:"16px 20px", flex:1, minWidth:0, transition:"all .2s",
    }}
    onMouseEnter={e=>{ e.currentTarget.style.borderColor=color; e.currentTarget.style.boxShadow=`0 0 20px ${color}22`; }}
    onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.boxShadow="none"; }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ fontSize:11, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.06em", fontWeight:600 }}>{label}</div>
          <div style={{ fontSize:26, fontWeight:800, color, marginTop:6, fontVariantNumeric:"tabular-nums" }}>{value}</div>
          {sub && <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:3 }}>{sub}</div>}
        </div>
        <span style={{ fontSize:22, opacity:.7 }}>{icon}</span>
      </div>
    </div>
  );
}

export function DownloadSummary({ data, loading, packages }) {
  if (loading && !Object.keys(data||{}).length) return <LoadingPanel lines={1} />;
  if (!packages?.length) return null;

  if (packages.length === 1) {
    const pkg = data?.[packages[0]];
    if (!pkg) return null;
    const { weekly=0, monthly=0, allTime=null } = pkg.downloads || {};
    return (
      <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
        <KpiCard label="Weekly"    value={formatNumber(weekly)}          icon="📦" color="var(--accent)"  />
        <KpiCard label="Monthly"   value={formatNumber(monthly)}         icon="📈" color="var(--green)"   />
        <KpiCard label="All-Time"  value={allTime!=null ? formatNumber(allTime) : "—"} icon="🏆" color="var(--purple)" sub="since 2015-01-10" />
        {pkg.github?.stars != null && <KpiCard label="Stars" value={formatNumber(pkg.github.stars)} icon="⭐" color="var(--yellow)" />}
      </div>
    );
  }

  // Multi-package: weekly card per package
  return (
    <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
      {packages.map((name,i) => {
        const pkg = data?.[name];
        return (
          <KpiCard key={name} label={name}
            value={pkg ? formatNumber(pkg.downloads?.weekly)+"/wk" : "…"}
            sub={pkg?.downloads?.allTime != null ? `${formatNumber(pkg.downloads.allTime)} all-time` : null}
            icon="📦" color={packageColor(i)} />
        );
      })}
    </div>
  );
}
