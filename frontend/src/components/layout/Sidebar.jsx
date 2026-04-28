import React, { useState } from "react";
import { formatNumber, packageColor } from "../../lib/utils.js";

function NavItem({ icon, label, active, onClick, badge }) {
  return (
    <button onClick={onClick} style={{
      display:"flex", alignItems:"center", gap:10, width:"100%",
      padding:"9px 12px", borderRadius:9, border:"none", cursor:"pointer",
      background: active ? "var(--accent-dim)" : "transparent",
      color: active ? "var(--accent)" : "var(--text-secondary)",
      fontSize:13, fontWeight: active ? 600 : 400, transition:"all .15s", textAlign:"left",
    }}
    onMouseEnter={e=>{ if(!active) e.currentTarget.style.background="var(--bg-hover)"; }}
    onMouseLeave={e=>{ if(!active) e.currentTarget.style.background="transparent"; }}>
      <span style={{ fontSize:16, width:20, textAlign:"center" }}>{icon}</span>
      <span style={{ flex:1 }}>{label}</span>
      {badge > 0 && (
        <span style={{ background:"var(--red)", color:"#fff", borderRadius:10, fontSize:10, fontWeight:700, padding:"1px 6px", minWidth:18, textAlign:"center" }}>{badge}</span>
      )}
    </button>
  );
}

export function Sidebar({ accounts, watchlist, packageData, activePackage, onSelectPackage, onNavigate, currentPage }) {
  const [collapsed, setCollapsed] = useState(false);

  const totalVulns = watchlist.reduce((sum, p) => sum + (packageData?.[p.name]?.security?.count || 0), 0);

  if (collapsed) {
    return (
      <aside style={{ width:52, flexShrink:0, background:"var(--bg-surface)", borderRight:"1px solid var(--border)", display:"flex", flexDirection:"column", alignItems:"center", paddingTop:16, gap:12 }}>
        <button onClick={()=>setCollapsed(false)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, color:"var(--text-muted)" }} title="Expand">☰</button>
        <button onClick={()=>onNavigate("dashboard")} style={{ background:"none", border:"none", cursor:"pointer", fontSize:18 }} title="Dashboard">📊</button>
        <button onClick={()=>onNavigate("compare")}   style={{ background:"none", border:"none", cursor:"pointer", fontSize:18 }} title="Compare">⚖️</button>
        <button onClick={()=>onNavigate("settings")}  style={{ background:"none", border:"none", cursor:"pointer", fontSize:18 }} title="Settings">⚙️</button>
      </aside>
    );
  }

  return (
    <aside style={{ width:240, flexShrink:0, background:"var(--bg-surface)", borderRight:"1px solid var(--border)", display:"flex", flexDirection:"column", overflowY:"auto" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 14px 8px" }}>
        <span style={{ fontSize:11, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.08em" }}>Navigation</span>
        <button onClick={()=>setCollapsed(true)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text-muted)", fontSize:14 }} title="Collapse">←</button>
      </div>

      {/* Nav links */}
      <div style={{ padding:"0 8px 8px" }}>
        <NavItem icon="📊" label="My Dashboard" active={currentPage==="dashboard" && !activePackage} onClick={()=>{ onNavigate("dashboard"); onSelectPackage(null); }} />
        <NavItem icon="⚖️" label="Compare"      active={currentPage==="compare"}                   onClick={()=>onNavigate("compare")} />
        <NavItem icon="🛡️" label="Security"      active={currentPage==="security"}                  onClick={()=>onNavigate("security")} badge={totalVulns} />
        <NavItem icon="⚙️" label="Settings"      active={currentPage==="settings"}                  onClick={()=>onNavigate("settings")} />
      </div>

      <div style={{ height:1, background:"var(--border)", margin:"4px 0" }} />

      {/* Linked accounts */}
      {accounts.length > 0 && (
        <div style={{ padding:"12px 14px 4px" }}>
          <span style={{ fontSize:11, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.08em" }}>Linked Accounts</span>
          <div style={{ marginTop:8, display:"flex", flexDirection:"column", gap:6 }}>
            {accounts.map(acc => (
              <div key={acc.username} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 8px", borderRadius:8, background:"var(--bg-hover)" }}>
                <div style={{ width:26, height:26, borderRadius:"50%", background:"linear-gradient(135deg,var(--accent),var(--purple))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:"#fff", flexShrink:0 }}>
                  {acc.username[0].toUpperCase()}
                </div>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:"var(--text-primary)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{acc.username}</div>
                  <div style={{ fontSize:10, color:"var(--text-muted)" }}>npm account</div>
                </div>
                <div style={{ width:7, height:7, borderRadius:"50%", background:"var(--green)", flexShrink:0 }} title="Active" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ height:1, background:"var(--border)", margin:"10px 0 4px" }} />

      {/* Monitored packages list */}
      <div style={{ padding:"4px 14px 4px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize:11, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.08em" }}>Monitored ({watchlist.length})</span>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"4px 8px 16px" }}>
        {watchlist.length === 0 && (
          <p style={{ fontSize:12, color:"var(--text-muted)", padding:"8px 6px" }}>No packages yet. Add from Settings.</p>
        )}
        {watchlist.map((pkg, i) => {
          const stats   = packageData?.[pkg.name];
          const vulns   = stats?.security?.count || 0;
          const isActive = activePackage === pkg.name;
          const color   = packageColor(i);
          return (
            <button
              key={pkg.name}
              onClick={() => { onSelectPackage(pkg.name); onNavigate("dashboard"); }}
              style={{
                display:"flex", alignItems:"center", gap:8, width:"100%",
                padding:"9px 10px", borderRadius:9, border:"none", cursor:"pointer", textAlign:"left",
                background: isActive ? `${color}18` : "transparent",
                borderLeft: isActive ? `3px solid ${color}` : "3px solid transparent",
                marginBottom:2, transition:"all .15s",
              }}
              onMouseEnter={e=>{ if(!isActive) e.currentTarget.style.background="var(--bg-hover)"; }}
              onMouseLeave={e=>{ if(!isActive) e.currentTarget.style.background="transparent"; }}
              title={`View analytics for ${pkg.name}`}
            >
              <div style={{ width:7, height:7, borderRadius:"50%", background:color, flexShrink:0 }} />
              <span style={{ flex:1, fontSize:13, color: isActive ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: isActive ? 600 : 400, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {pkg.name}
              </span>
              {vulns > 0 && <span style={{ fontSize:10, background:"var(--red-dim)", color:"var(--red)", borderRadius:6, padding:"1px 5px", fontWeight:700 }}>{vulns}</span>}
              {stats && vulns === 0 && <span style={{ fontSize:10, color:"var(--green)" }}>✓</span>}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
