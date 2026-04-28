import React, { useState } from "react";
import { usePackageData, useDownloadHistory } from "../hooks/usePackageData.js";
import { DownloadSummary }  from "../components/panels/DownloadSummary.jsx";
import { DownloadChart }    from "../components/panels/DownloadChart.jsx";
import { HealthGauge }      from "../components/panels/HealthGauge.jsx";
import { SecurityPanel }    from "../components/panels/SecurityPanel.jsx";
import { PackageMeta }      from "../components/panels/PackageMeta.jsx";
import { ComparisonTable }  from "../components/panels/ComparisonTable.jsx";
import { EmptyState }       from "../components/shared/index.jsx";
import { packageColor, formatNumber, scoreColor } from "../lib/utils.js";

const PAGE_SIZE = 30;

// ── Progress bar ──────────────────────────────────────────────────────
function ProgressBar({ done, total }) {
  if (!total || done >= total) return null;
  const pct = Math.round((done / total) * 100);
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"var(--text-muted)", marginBottom:6 }}>
        <span>⏳ Fetching package data… {done} / {total}</span>
        <span>{pct}%</span>
      </div>
      <div style={{ height:4, background:"var(--bg-hover)", borderRadius:2, overflow:"hidden" }}>
        <div style={{ height:"100%", borderRadius:2, background:"var(--accent)", width:`${pct}%`, transition:"width .4s ease" }} />
      </div>
    </div>
  );
}

// ── Overview card ─────────────────────────────────────────────────────
function PackageCard({ pkg, stats, color, onClick }) {
  const health = stats?.health;
  const vulns  = stats?.security?.count || 0;
  return (
    <button onClick={onClick} style={{
      background:"var(--bg-panel)", border:"1px solid var(--border)",
      borderRadius:12, padding:16, textAlign:"left", cursor:"pointer",
      transition:"all .18s", width:"100%",
    }}
    onMouseEnter={e=>{ e.currentTarget.style.borderColor=color; e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 6px 24px ${color}22`; }}
    onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="none"; }}>
      <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:10 }}>
        <div style={{ width:7, height:7, borderRadius:"50%", background:color, flexShrink:0 }} />
        <span style={{ fontSize:13, fontWeight:700, color:"var(--text-primary)", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{pkg.name}</span>
        {health && <span style={{ fontSize:12, fontWeight:800, color:scoreColor(health.total) }}>{health.grade}</span>}
        {!stats && <span style={{ fontSize:10, color:"var(--text-muted)" }}>…</span>}
      </div>
      {stats ? (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
          <div>
            <div style={{ fontSize:10, color:"var(--text-muted)" }}>Weekly DL</div>
            <div style={{ fontSize:15, fontWeight:700, color:"var(--text-primary)" }}>{formatNumber(stats.downloads?.weekly)}</div>
          </div>
          <div>
            <div style={{ fontSize:10, color:"var(--text-muted)" }}>All-Time DL</div>
            <div style={{ fontSize:15, fontWeight:700, color:"var(--text-primary)" }}>{stats.downloads?.allTime != null ? formatNumber(stats.downloads.allTime) : "—"}</div>
          </div>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          <div className="skeleton" style={{ height:14, width:"70%", borderRadius:4 }} />
          <div className="skeleton" style={{ height:14, width:"50%", borderRadius:4 }} />
        </div>
      )}
      <div style={{ marginTop:8, fontSize:11 }}>
        {vulns > 0
          ? <span style={{ color:"var(--red)", background:"var(--red-dim)", padding:"2px 8px", borderRadius:6, fontWeight:600 }}>⚠️ {vulns} vuln{vulns>1?"s":""}</span>
          : stats ? <span style={{ color:"var(--green)" }}>✅ Clean</span> : null}
      </div>
    </button>
  );
}

// ── Single-package detail view ────────────────────────────────────────
function PackageDetail({ name, data, loading, onBack }) {
  const [period, setPeriod] = useState("last-month");
  const { data: history, loading: histLoading } = useDownloadHistory([name], period);
  const pkgData = useMemo => ({ [name]: data[name] });
  const d = { [name]: data[name] };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={onBack} style={{ padding:"7px 14px", borderRadius:8, border:"1px solid var(--border-bright)", background:"transparent", color:"var(--text-muted)", fontSize:13, cursor:"pointer" }}>
          ← All Packages
        </button>
        <span style={{ fontSize:17, fontWeight:800, color:"var(--text-primary)" }}>{name}</span>
        {data[name]?.meta?.version && <span className="badge badge-gray">v{data[name].meta.version}</span>}
      </div>

      <DownloadSummary data={d} loading={!data[name] && loading} packages={[name]} />

      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:16 }}>
        <DownloadChart historyData={history} packageNames={[name]} onPeriodChange={setPeriod} loading={histLoading} />
        <HealthGauge   packageData={d} packageNames={[name]} loading={!data[name] && loading} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <SecurityPanel packageData={d} packageNames={[name]} loading={!data[name] && loading} />
        <PackageMeta   packageData={d} packageNames={[name]} loading={!data[name] && loading} />
      </div>
    </div>
  );
}

// ── Dashboard root ────────────────────────────────────────────────────
export function Dashboard({ watchlist, focusedPackage, onClearFocus }) {
  const [localFocused, setLocalFocused] = useState(null);
  const [page, setPage]                 = useState(0);
  const [search, setSearch]             = useState("");

  // External focus (from sidebar click) takes precedence
  const focused = focusedPackage || localFocused;
  function handleBack() { if (focusedPackage) onClearFocus(); else setLocalFocused(null); }

  const allNames = watchlist.map(p => p.name);
  const { data, loading, progress } = usePackageData(allNames);

  const filtered = allNames
    .filter(n => n.toLowerCase().includes(search.toLowerCase()))
    .map(n => watchlist.find(p => p.name === n));

  const totalPages  = Math.ceil(filtered.length / PAGE_SIZE);
  const visiblePkgs = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (allNames.length === 0) {
    return (
      <EmptyState
        icon="📡"
        title="No packages monitored yet"
        description="Link your npm account or add packages manually from Settings to start monitoring."
      />
    );
  }

  // Drill-down view
  if (focused) {
    return (
      <div style={{ padding:"24px 24px 48px" }}>
        <PackageDetail name={focused} data={data} loading={loading} onBack={handleBack} />
      </div>
    );
  }

  // Overview grid
  return (
    <div style={{ padding:"24px 24px 48px" }}>
      <ProgressBar done={progress.done} total={progress.total} />

      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20, flexWrap:"wrap" }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:800, color:"var(--text-primary)", marginBottom:2 }}>My Packages</h1>
          <p style={{ fontSize:12, color:"var(--text-muted)" }}>
            {allNames.length} monitored · {Object.keys(data).length} loaded
            {Object.values(data).reduce((n,d)=>n+(d?.security?.count||0),0) > 0 && (
              <span style={{ color:"var(--red)", marginLeft:8 }}>
                ⚠️ {Object.values(data).reduce((n,d)=>n+(d?.security?.count||0),0)} vulnerabilities total
              </span>
            )}
          </p>
        </div>
        <input
          value={search}
          onChange={e=>{ setSearch(e.target.value); setPage(0); }}
          placeholder={`Search ${allNames.length} packages…`}
          style={{ marginLeft:"auto", padding:"8px 14px", minWidth:220, background:"var(--bg-surface)", border:"1px solid var(--border-bright)", borderRadius:9, color:"var(--text-primary)", fontSize:13, outline:"none" }}
        />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))", gap:12, marginBottom:20 }}>
        {visiblePkgs.map((pkg, i) => (
          <PackageCard
            key={pkg.name} pkg={pkg} stats={data[pkg.name]}
            color={packageColor(watchlist.findIndex(p=>p.name===pkg.name))}
            onClick={() => setLocalFocused(pkg.name)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          <button onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0}
            style={{ padding:"7px 16px", borderRadius:8, border:"1px solid var(--border-bright)", background:"transparent", color:"var(--text-muted)", cursor:page===0?"default":"pointer", opacity:page===0?.4:1 }}>← Prev</button>
          <span style={{ fontSize:13, color:"var(--text-muted)" }}>Page {page+1} of {totalPages}</span>
          <button onClick={()=>setPage(p=>Math.min(totalPages-1,p+1))} disabled={page===totalPages-1}
            style={{ padding:"7px 16px", borderRadius:8, border:"1px solid var(--border-bright)", background:"transparent", color:"var(--text-muted)", cursor:page===totalPages-1?"default":"pointer", opacity:page===totalPages-1?.4:1 }}>Next →</button>
        </div>
      )}
    </div>
  );
}
