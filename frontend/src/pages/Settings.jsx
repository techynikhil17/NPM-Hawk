import React, { useState } from "react";
import { useNpmUser } from "../hooks/useNpmUser.js";

function Section({ title, children }) {
  return (
    <div style={{ marginBottom:32 }}>
      <h2 style={{ fontSize:13, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:16, paddingBottom:8, borderBottom:"1px solid var(--border)" }}>{title}</h2>
      {children}
    </div>
  );
}

function LinkAccountPanel({ onLink }) {
  const [input, setInput] = useState("");
  const [query, setQuery]   = useState(null);
  const { data, loading, error } = useNpmUser(query);

  function handleSearch() { if (input.trim()) setQuery(input.trim()); }
  function handleLink() { onLink(query, data?.packages?.map(p=>p.name)||[]); setInput(""); setQuery(null); }

  return (
    <div style={{ background:"var(--bg-panel)", border:"1px solid var(--border)", borderRadius:12, padding:20 }}>
      <p style={{ fontSize:13, color:"var(--text-muted)", marginBottom:14 }}>Enter an npm username to link the account and import its packages.</p>
      <div style={{ display:"flex", gap:10, marginBottom:12 }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSearch()}
          placeholder="npm username…"
          style={{ flex:1, padding:"10px 14px", background:"var(--bg-surface)", border:"1px solid var(--border-bright)", borderRadius:9, color:"var(--text-primary)", fontSize:14, outline:"none" }} />
        <button onClick={handleSearch} disabled={loading} style={{ padding:"10px 18px", borderRadius:9, border:"none", background:"var(--accent)", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer", opacity:loading?.6:1 }}>
          {loading?"Searching…":"Search"}
        </button>
      </div>
      {error && <p style={{ color:"var(--red)", fontSize:13, marginBottom:8 }}>⚠️ {error}</p>}
      {data && (
        <div style={{ background:"var(--bg-surface)", borderRadius:10, padding:14, border:"1px solid var(--border-bright)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,var(--accent),var(--purple))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:800, color:"#fff" }}>{query[0].toUpperCase()}</div>
            <div>
              <div style={{ fontWeight:700, color:"var(--text-primary)" }}>{query}</div>
              <div style={{ fontSize:12, color:"var(--text-muted)" }}>{data.packageCount} packages on npm</div>
            </div>
            <button onClick={handleLink} style={{ marginLeft:"auto", padding:"7px 16px", borderRadius:8, border:"none", background:"var(--green)", color:"#000", fontWeight:700, fontSize:13, cursor:"pointer" }}>
              Link Account →
            </button>
          </div>
          <div style={{ maxHeight:160, overflowY:"auto", display:"flex", flexDirection:"column", gap:4 }}>
            {data.packages.slice(0,10).map(p=>(
              <div key={p.name} style={{ fontSize:12, color:"var(--text-secondary)", padding:"3px 0" }}>📦 {p.name}</div>
            ))}
            {data.packageCount > 10 && <div style={{ fontSize:12, color:"var(--text-muted)" }}>…and {data.packageCount-10} more</div>}
          </div>
        </div>
      )}
    </div>
  );
}

function AddManualPanel({ onAdd }) {
  const [val, setVal] = useState("");
  function handle() {
    const names = val.split(/[\n,\s]+/).map(s=>s.trim()).filter(Boolean);
    if (names.length) { onAdd(names); setVal(""); }
  }
  return (
    <div style={{ background:"var(--bg-panel)", border:"1px solid var(--border)", borderRadius:12, padding:20 }}>
      <p style={{ fontSize:13, color:"var(--text-muted)", marginBottom:12 }}>Add package names manually (comma, space, or line-separated).</p>
      <textarea value={val} onChange={e=>setVal(e.target.value)} rows={4}
        placeholder={"express\nreact\n@myorg/my-lib"}
        style={{ width:"100%", padding:"11px 13px", background:"var(--bg-surface)", border:"1px solid var(--border-bright)", borderRadius:9, color:"var(--text-primary)", fontSize:13, outline:"none", resize:"vertical", fontFamily:"monospace", marginBottom:10 }} />
      <button onClick={handle} disabled={!val.trim()} style={{ padding:"9px 20px", borderRadius:9, border:"none", background:"var(--accent)", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer", opacity:val.trim()?1:.5 }}>
        Add Packages
      </button>
    </div>
  );
}

export function Settings({ accounts, watchlist, onLinkAccount, onUnlinkAccount, onAddPackages, onRemovePackage }) {
  return (
    <div style={{ flex:1, overflowY:"auto", padding:32, maxWidth:720 }}>
      <h1 style={{ fontSize:22, fontWeight:800, color:"var(--text-primary)", marginBottom:6 }}>Settings</h1>
      <p style={{ fontSize:13, color:"var(--text-muted)", marginBottom:32 }}>Manage your linked npm accounts and monitored packages.</p>

      {/* Linked accounts */}
      <Section title="Linked npm Accounts">
        {accounts.length > 0 && (
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
            {accounts.map(acc => (
              <div key={acc.username} style={{ display:"flex", alignItems:"center", gap:12, background:"var(--bg-panel)", border:"1px solid var(--border)", borderRadius:12, padding:"14px 18px" }}>
                <div style={{ width:38, height:38, borderRadius:"50%", background:"linear-gradient(135deg,var(--accent),var(--purple))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, fontWeight:800, color:"#fff" }}>{acc.username[0].toUpperCase()}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:"var(--text-primary)" }}>{acc.username}</div>
                  <div style={{ fontSize:12, color:"var(--text-muted)" }}>Linked {new Date(acc.addedAt).toLocaleDateString()}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:"var(--green)" }} />
                  <span style={{ fontSize:12, color:"var(--green)" }}>Active</span>
                </div>
                <button onClick={()=>onUnlinkAccount(acc.username)} style={{ padding:"6px 14px", borderRadius:8, border:"1px solid var(--red)", background:"var(--red-dim)", color:"var(--red)", fontWeight:600, fontSize:12, cursor:"pointer" }}>
                  Unlink
                </button>
              </div>
            ))}
          </div>
        )}
        <LinkAccountPanel onLink={(username, pkgs) => { onLinkAccount(username); onAddPackages(pkgs, username); }} />
      </Section>

      {/* Monitored packages */}
      <Section title={`Monitored Packages (${watchlist.length})`}>
        <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
          {watchlist.length === 0 && <p style={{ fontSize:13, color:"var(--text-muted)" }}>No packages monitored yet.</p>}
          {watchlist.map(pkg => (
            <div key={pkg.name} style={{ display:"flex", alignItems:"center", gap:12, background:"var(--bg-panel)", border:"1px solid var(--border)", borderRadius:10, padding:"11px 14px" }}>
              <span style={{ fontSize:14, color:"var(--text-primary)", flex:1, fontWeight:500 }}>📦 {pkg.name}</span>
              <span style={{ fontSize:11, color:"var(--text-muted)", background:"var(--bg-hover)", padding:"3px 8px", borderRadius:6 }}>
                {pkg.source === "manual" ? "Manual" : `@${pkg.source}`}
              </span>
              <button onClick={()=>onRemovePackage(pkg.name)} style={{ padding:"5px 12px", borderRadius:7, border:"1px solid var(--border-bright)", background:"transparent", color:"var(--text-muted)", fontSize:12, cursor:"pointer" }}>
                Remove
              </button>
            </div>
          ))}
        </div>
        <AddManualPanel onAdd={pkgs => onAddPackages(pkgs, "manual")} />
      </Section>
    </div>
  );
}

