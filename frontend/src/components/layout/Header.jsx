import React from "react";
import { PackageSearch } from "../search/PackageSearch.jsx";
import { packageColor } from "../../lib/utils.js";

export function Header({ accounts, watchlist, onAddPackage, onNavigate, currentPage , onSignOut }) {
  const primaryAccount = accounts[0];

  return (
    <header style={{
      position:"sticky", top:0, zIndex:50,
      background:"rgba(10,11,15,0.88)", backdropFilter:"blur(14px)",
      borderBottom:"1px solid var(--border)", padding:"0 20px", height:58, display:"flex", alignItems:"center",
    }}>
      {/* Logo */}
      <div style={{ display:"flex", alignItems:"center", gap:9, flexShrink:0, marginRight:20 }}>
        <div style={{ width:32, height:32, borderRadius:9, background:"linear-gradient(135deg,var(--accent) 0%,var(--purple) 100%)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🦅</div>
        <div>
          <div style={{ fontSize:14, fontWeight:800, letterSpacing:"-0.02em", color:"var(--text-primary)", lineHeight:1 }}>NPM Hawk</div>
          <div style={{ fontSize:9, color:"var(--text-muted)", letterSpacing:"0.08em" }}>MONITOR</div>
        </div>
      </div>

      {/* Add package quick-search */}
      <PackageSearch
        onSelect={onAddPackage}
        disabledPackages={watchlist.map(p=>p.name)}
        placeholder="Quick-add package to watchlist…"
      />

      <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:12 }}>
        {/* Watchlist count badge */}
        {watchlist.length > 0 && (
          <div style={{ fontSize:12, color:"var(--text-muted)", display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"var(--green)", display:"inline-block" }} />
            {watchlist.length} monitored
          </div>
        )}

        {/* Account avatar */}
        {primaryAccount ? (
          <button onClick={()=>onNavigate("settings")} title={`@${primaryAccount.username}`} style={{
            width:32, height:32, borderRadius:"50%", border:"2px solid var(--accent)",
            background:"linear-gradient(135deg,var(--accent),var(--purple))",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:14, fontWeight:800, color:"#fff", cursor:"pointer",
          }}>
            {primaryAccount.username[0].toUpperCase()}
          </button>
        ) : (
          <button onClick={()=>onNavigate("settings")} style={{
            padding:"7px 14px", borderRadius:8, border:"1px solid var(--accent)",
            background:"var(--accent-dim)", color:"var(--accent)",
            fontSize:13, fontWeight:600, cursor:"pointer",
          }}>Link Account</button>
        )}
      </div>
    </header>
  );
}

