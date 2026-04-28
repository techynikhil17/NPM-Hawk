import React, { useState, useMemo } from "react";
import { usePackageData, useDownloadHistory } from "../hooks/usePackageData.js";
import { PackageSearch } from "../components/search/PackageSearch.jsx";
import { DownloadChart }   from "../components/panels/DownloadChart.jsx";
import { HealthGauge }     from "../components/panels/HealthGauge.jsx";
import { ComparisonTable } from "../components/panels/ComparisonTable.jsx";
import { DownloadSummary } from "../components/panels/DownloadSummary.jsx";
import { SecurityPanel }   from "../components/panels/SecurityPanel.jsx";
import { packageColor, formatNumber, scoreColor } from "../lib/utils.js";

const MAX_COMPARE = 5;

function PackagePill({ name, color, onRemove }) {
  return (
    <div style={{
      display:"inline-flex", alignItems:"center", gap:7,
      padding:"6px 12px", borderRadius:20,
      background:`${color}18`, border:`1px solid ${color}55`,
      color:"var(--text-primary)", fontSize:13, fontWeight:600,
    }}>
      <div style={{ width:8, height:8, borderRadius:"50%", background:color }} />
      {name}
      <span onClick={onRemove} style={{ cursor:"pointer", color:"var(--text-muted)", fontSize:15, lineHeight:1, marginLeft:2 }}>✕</span>
    </div>
  );
}

function WatchlistPicker({ watchlist, selected, onToggle }) {
  const [search, setSearch] = useState("");
  const filtered = watchlist.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <input value={search} onChange={e=>setSearch(e.target.value)}
        placeholder="Filter your packages…"
        style={{ width:"100%", padding:"8px 12px", marginBottom:10, background:"var(--bg-surface)", border:"1px solid var(--border-bright)", borderRadius:8, color:"var(--text-primary)", fontSize:13, outline:"none" }} />
      <div style={{ maxHeight:220, overflowY:"auto", display:"flex", flexDirection:"column", gap:4 }}>
        {filtered.map((pkg, i) => {
          const isSelected = selected.includes(pkg.name);
          const isFull = selected.length >= MAX_COMPARE && !isSelected;
          return (
            <label key={pkg.name} style={{
              display:"flex", alignItems:"center", gap:10, padding:"8px 10px",
              borderRadius:8, cursor: isFull ? "not-allowed" : "pointer",
              background: isSelected ? `${packageColor(i)}18` : "transparent",
              border:`1px solid ${isSelected ? packageColor(i)+"55" : "transparent"}`,
              opacity: isFull ? 0.4 : 1, transition:"all .15s",
            }}>
              <input type="checkbox" checked={isSelected} disabled={isFull}
                onChange={() => onToggle(pkg.name)}
                style={{ accentColor: packageColor(i), width:15, height:15 }} />
              <span style={{ fontSize:13, color:"var(--text-primary)", fontWeight: isSelected ? 600 : 400 }}>{pkg.name}</span>
            </label>
          );
        })}
        {filtered.length === 0 && <p style={{ fontSize:12, color:"var(--text-muted)", padding:"6px 0" }}>No matches</p>}
      </div>
    </div>
  );
}

export function Compare({ watchlist }) {
  const [selected, setSelected] = useState([]);
  const [period, setPeriod]     = useState("last-month");
  const [step, setStep]         = useState("pick"); // "pick" | "view"

  function toggle(name) {
    setSelected(prev =>
      prev.includes(name) ? prev.filter(p=>p!==name) : prev.length < MAX_COMPARE ? [...prev, name] : prev
    );
  }
  function addGlobal(name) {
    if (!selected.includes(name) && selected.length < MAX_COMPARE) setSelected(prev => [...prev, name]);
  }
  function remove(name) { setSelected(prev => prev.filter(p=>p!==name)); }

  const { data, loading, progress } = usePackageData(step==="view" ? selected : []);
  const { data: history, loading: histLoading } = useDownloadHistory(selected, period);

  // ── Picker step ──
  if (step === "pick") {
    return (
      <div style={{ padding:"32px 24px", maxWidth:860, margin:"0 auto" }}>
        <h1 style={{ fontSize:22, fontWeight:800, color:"var(--text-primary)", marginBottom:4 }}>Compare Packages</h1>
        <p style={{ fontSize:13, color:"var(--text-muted)", marginBottom:28 }}>
          Select 2–{MAX_COMPARE} packages from your watchlist or search globally to compare side by side.
        </p>

        {/* Selected pills */}
        <div style={{ background:"var(--bg-panel)", border:"1px solid var(--border)", borderRadius:14, padding:20, marginBottom:20 }}>
          <div style={{ fontSize:12, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:12 }}>
            Selected ({selected.length}/{MAX_COMPARE})
          </div>
          {selected.length === 0 ? (
            <p style={{ fontSize:13, color:"var(--text-muted)" }}>No packages selected yet. Pick below.</p>
          ) : (
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {selected.map((name,i) => <PackagePill key={name} name={name} color={packageColor(i)} onRemove={()=>remove(name)} />)}
            </div>
          )}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:24 }}>
          {/* From watchlist */}
          <div style={{ background:"var(--bg-panel)", border:"1px solid var(--border)", borderRadius:14, padding:20 }}>
            <div style={{ fontSize:13, fontWeight:700, color:"var(--text-primary)", marginBottom:14 }}>
              📋 From My Watchlist <span style={{ color:"var(--text-muted)", fontWeight:400 }}>({watchlist.length})</span>
            </div>
            {watchlist.length === 0
              ? <p style={{ fontSize:12, color:"var(--text-muted)" }}>No packages in watchlist yet.</p>
              : <WatchlistPicker watchlist={watchlist} selected={selected} onToggle={toggle} />
            }
          </div>

          {/* Global search */}
          <div style={{ background:"var(--bg-panel)", border:"1px solid var(--border)", borderRadius:14, padding:20 }}>
            <div style={{ fontSize:13, fontWeight:700, color:"var(--text-primary)", marginBottom:14 }}>🌍 Search Any Package</div>
            {selected.length >= MAX_COMPARE
              ? <p style={{ fontSize:12, color:"var(--text-muted)" }}>Max {MAX_COMPARE} packages reached. Remove one to add another.</p>
              : <PackageSearch onSelect={addGlobal} disabledPackages={selected} placeholder="Search npm registry…" />
            }
            {selected.length > 0 && selected.length < MAX_COMPARE && (
              <p style={{ fontSize:11, color:"var(--text-muted)", marginTop:12 }}>
                {MAX_COMPARE - selected.length} more slot{MAX_COMPARE-selected.length!==1?"s":""} available
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => setStep("view")}
          disabled={selected.length < 2}
          style={{
            width:"100%", padding:"14px", borderRadius:12, border:"none",
            background: selected.length >= 2 ? "linear-gradient(135deg, var(--accent), var(--purple))" : "var(--bg-hover)",
            color: selected.length >= 2 ? "#fff" : "var(--text-muted)",
            fontWeight:700, fontSize:15, cursor: selected.length >= 2 ? "pointer" : "not-allowed",
            transition:"all .2s",
            boxShadow: selected.length >= 2 ? "0 4px 20px var(--accent-glow)" : "none",
          }}>
          {selected.length < 2 ? `Select at least 2 packages (${selected.length} chosen)` : `Compare ${selected.length} Packages →`}
        </button>
      </div>
    );
  }

  // ── Comparison view ──
  const isLoading = loading && Object.keys(data).length < selected.length;

  return (
    <div style={{ padding:"24px 24px 48px" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20, flexWrap:"wrap" }}>
        <button onClick={() => setStep("pick")} style={{
          padding:"7px 14px", borderRadius:8, border:"1px solid var(--border-bright)",
          background:"transparent", color:"var(--text-muted)", fontSize:13, cursor:"pointer",
        }}>← Change Selection</button>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {selected.map((name,i) => <PackagePill key={name} name={name} color={packageColor(i)} onRemove={()=>{ remove(name); if(selected.length<=2) setStep("pick"); }} />)}
        </div>
        {isLoading && (
          <span style={{ fontSize:12, color:"var(--text-muted)", marginLeft:"auto" }}>
            Loading {progress.done}/{progress.total}…
          </span>
        )}
      </div>

      {/* KPI summary */}
      <div style={{ marginBottom:16 }}>
        <DownloadSummary data={data} loading={isLoading} packages={selected} />
      </div>

      {/* Download trends chart */}
      <div style={{ marginBottom:16 }}>
        <DownloadChart historyData={history} packageNames={selected} onPeriodChange={setPeriod} loading={histLoading} />
      </div>

      {/* Health gauges */}
      <div style={{ marginBottom:16 }}>
        <HealthGauge packageData={data} packageNames={selected} loading={isLoading} />
      </div>

      {/* Security */}
      <div style={{ marginBottom:16 }}>
        <SecurityPanel packageData={data} packageNames={selected} loading={isLoading} />
      </div>

      {/* Full comparison table */}
      <ComparisonTable packageData={data} packageNames={selected} loading={isLoading} />
    </div>
  );
}
