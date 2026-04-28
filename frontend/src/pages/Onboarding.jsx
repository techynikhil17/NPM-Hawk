import React, { useState } from "react";
import { useNpmUser } from "../hooks/useNpmUser.js";

/* ── Animations ────────────────────────────────────────────────────── */
const css = `
@keyframes ob-fade-up {
  from { opacity:0; transform:translateY(20px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes ob-spin { to { transform:rotate(360deg); } }
@keyframes ob-pulse-ring {
  0%   { transform:scale(1);   opacity:.6; }
  100% { transform:scale(1.5); opacity:0; }
}
.ob-fade { animation: ob-fade-up .4s ease forwards; }
.ob-fade-1 { animation: ob-fade-up .4s .05s ease both; }
.ob-fade-2 { animation: ob-fade-up .4s .10s ease both; }
.ob-fade-3 { animation: ob-fade-up .4s .15s ease both; }
.ob-fade-4 { animation: ob-fade-up .4s .20s ease both; }
`;

function Spinner() {
  return (
    <div style={{
      width:18, height:18, border:"2px solid rgba(79,156,249,.25)",
      borderTopColor:"var(--accent)", borderRadius:"50%",
      animation:"ob-spin .7s linear infinite", flexShrink:0,
    }} />
  );
}

/* ── Left brand panel ──────────────────────────────────────────────── */
function BrandPanel() {
  return (
    <div style={{
      width:360, flexShrink:0,
      background:"linear-gradient(160deg,#0d1117 0%,#111827 100%)",
      borderRight:"1px solid var(--border)",
      display:"flex", flexDirection:"column",
      padding:"48px 40px", position:"relative", overflow:"hidden",
    }}>
      {/* Decorative glow */}
      <div style={{ position:"absolute", top:-80, left:-80, width:320, height:320,
        borderRadius:"50%", background:"radial-gradient(circle,rgba(79,156,249,.12) 0%,transparent 70%)",
        pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:-60, right:-60, width:240, height:240,
        borderRadius:"50%", background:"radial-gradient(circle,rgba(167,139,250,.1) 0%,transparent 70%)",
        pointerEvents:"none" }} />

      {/* Logo */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"auto" }}>
        <div style={{
          width:40, height:40, borderRadius:12,
          background:"linear-gradient(135deg,var(--accent) 0%,var(--purple) 100%)",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:20,
          boxShadow:"0 0 24px rgba(79,156,249,.35)",
        }}>🦅</div>
        <div>
          <div style={{ fontSize:16, fontWeight:800, color:"var(--text-primary)", letterSpacing:"-.02em" }}>NPM Hawk</div>
          <div style={{ fontSize:10, color:"var(--text-muted)", letterSpacing:".1em" }}>MONITOR</div>
        </div>
      </div>

      {/* Feature list */}
      <div style={{ marginTop:64, marginBottom:"auto" }}>
        <div style={{ fontSize:22, fontWeight:800, color:"var(--text-primary)", letterSpacing:"-.03em", marginBottom:8, lineHeight:1.25 }}>
          Your npm packages,<br /><span style={{ color:"var(--accent)" }}>always watched.</span>
        </div>
        <p style={{ fontSize:13, color:"var(--text-muted)", lineHeight:1.75, marginBottom:32 }}>
          Link your account and get real-time analytics, health scores, and security alerts.
        </p>
        {[
          { icon:"↓", label:"Download analytics" },
          { icon:"⚑", label:"Security scanning via OSV.dev" },
          { icon:"◎", label:"Health score 0–100" },
          { icon:"★", label:"GitHub stats integration" },
        ].map(f => (
          <div key={f.label} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
            <div style={{
              width:28, height:28, borderRadius:8, flexShrink:0,
              background:"var(--accent-dim)", border:"1px solid rgba(79,156,249,.2)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:12, color:"var(--accent)",
            }}>{f.icon}</div>
            <span style={{ fontSize:13, color:"var(--text-secondary)" }}>{f.label}</span>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:40 }}>
        Free forever · No account needed · npm registry only
      </div>
    </div>
  );
}

/* ── Step indicator ────────────────────────────────────────────────── */
function StepBar({ step, total = 3 }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:32 }}>
      {Array.from({ length: total }, (_, i) => {
        const n = i + 1;
        const done   = n < step;
        const active = n === step;
        return (
          <React.Fragment key={n}>
            <div style={{
              width:28, height:28, borderRadius:"50%", flexShrink:0,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:12, fontWeight:700,
              background: done ? "var(--green)" : active ? "var(--accent)" : "var(--bg-hover)",
              color: done || active ? "#fff" : "var(--text-muted)",
              border:`2px solid ${done ? "var(--green)" : active ? "var(--accent)" : "var(--border-bright)"}`,
              transition:"all .3s",
              boxShadow: active ? "0 0 16px var(--accent-glow)" : "none",
            }}>{done ? "✓" : n}</div>
            {i < total - 1 && (
              <div style={{
                flex:1, height:2, borderRadius:1,
                background: done ? "var(--green)" : "var(--border)",
                transition:"background .4s",
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ── Mode cards (Step 1) ───────────────────────────────────────────── */
function ModeCards({ onSelect }) {
  const [hovered, setHovered] = useState(null);
  const opts = [
    {
      key:"account", icon:"🔗",
      title:"Link npm account",
      desc:"Enter your npm username — we auto-discover all your packages.",
      badge:"Recommended",
    },
    {
      key:"manual", icon:"✏️",
      title:"Add manually",
      desc:"Paste specific package names you want to monitor.",
      badge:null,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontSize:22, fontWeight:800, color:"var(--text-primary)", letterSpacing:"-.02em", marginBottom:6 }}>
          How do you want to start?
        </h2>
        <p style={{ fontSize:13, color:"var(--text-muted)" }}>
          Choose how to connect your npm packages to the dashboard.
        </p>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {opts.map((opt, i) => (
          <button
            key={opt.key}
            className={`ob-fade-${i + 1}`}
            onClick={() => onSelect(opt.key)}
            onMouseEnter={() => setHovered(opt.key)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display:"flex", alignItems:"center", gap:16, padding:"18px 20px",
              background: hovered === opt.key ? "var(--bg-hover)" : "var(--bg-surface)",
              border:`1.5px solid ${hovered === opt.key ? "var(--accent)" : "var(--border-bright)"}`,
              borderRadius:14, textAlign:"left", cursor:"pointer",
              transition:"all .2s", color:"var(--text-primary)",
              boxShadow: hovered === opt.key ? "0 0 24px var(--accent-glow)" : "none",
            }}>
            <div style={{
              width:44, height:44, borderRadius:12, flexShrink:0,
              background: hovered === opt.key ? "var(--accent-dim)" : "var(--bg-panel)",
              border:`1px solid ${hovered === opt.key ? "rgba(79,156,249,.3)" : "var(--border)"}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:20, transition:"all .2s",
            }}>{opt.icon}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                <span style={{ fontSize:15, fontWeight:700 }}>{opt.title}</span>
                {opt.badge && (
                  <span style={{
                    fontSize:10, padding:"2px 7px", borderRadius:20, fontWeight:700,
                    background:"var(--green-dim)", color:"var(--green)",
                    border:"1px solid rgba(52,211,153,.2)",
                  }}>{opt.badge}</span>
                )}
              </div>
              <div style={{ fontSize:13, color:"var(--text-muted)", lineHeight:1.5 }}>{opt.desc}</div>
            </div>
            <div style={{ color:"var(--text-muted)", fontSize:18, transition:"transform .2s",
              transform: hovered === opt.key ? "translateX(4px)" : "none" }}>→</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Username step (Step 2 — account mode) ─────────────────────────── */
function UsernameStep({ onBack, onFound }) {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState(null);
  const { data, loading, error } = useNpmUser(query && query.length > 1 ? query : null);

  function search() { if (input.trim()) setQuery(input.trim()); }

  if (data) {
    return (
      <div className="ob-fade">
        {/* Found user card */}
        <div style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 18px",
          background:"var(--bg-panel)", border:"1.5px solid var(--green)", borderRadius:14,
          marginBottom:24, boxShadow:"0 0 20px rgba(52,211,153,.1)" }}>
          <div style={{
            width:48, height:48, borderRadius:"50%", flexShrink:0,
            background:"linear-gradient(135deg,var(--accent),var(--purple))",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:20, fontWeight:800, color:"#fff",
          }}>{query[0].toUpperCase()}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:700, color:"var(--text-primary)" }}>@{query}</div>
            <div style={{ fontSize:12, color:"var(--text-muted)" }}>{data.packageCount} packages found</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:"var(--green)" }} />
            <span style={{ fontSize:12, color:"var(--green)", fontWeight:600 }}>Verified</span>
          </div>
        </div>
        <button
          onClick={() => onFound(query, data)}
          style={{
            width:"100%", padding:"13px", borderRadius:12, border:"none",
            background:"linear-gradient(135deg,var(--accent) 0%,var(--purple) 100%)",
            color:"#fff", fontWeight:700, fontSize:15, cursor:"pointer",
            boxShadow:"0 4px 20px var(--accent-glow)",
          }}>
          Select packages to monitor →
        </button>
        <button onClick={() => { setQuery(null); }} style={{
          display:"block", margin:"12px auto 0", background:"none", border:"none",
          color:"var(--text-muted)", fontSize:13, cursor:"pointer",
        }}>Search a different username</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={onBack} style={{ background:"none", border:"none",
        color:"var(--text-muted)", cursor:"pointer", fontSize:13, marginBottom:20,
        padding:0, display:"flex", alignItems:"center", gap:4 }}>
        ← Back
      </button>
      <div className="ob-fade" style={{ marginBottom:24 }}>
        <h2 style={{ fontSize:22, fontWeight:800, color:"var(--text-primary)",
          letterSpacing:"-.02em", marginBottom:6 }}>Link your npm account</h2>
        <p style={{ fontSize:13, color:"var(--text-muted)" }}>
          Enter your npm username — we'll find all packages where you're listed as a maintainer.
        </p>
      </div>

      <div style={{ display:"flex", gap:10, marginBottom:8 }}>
        <div style={{ flex:1, position:"relative" }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && search()}
            placeholder="e.g. sindresorhus"
            style={{
              width:"100%", padding:"13px 14px", paddingLeft:40,
              background:"var(--bg-surface)", border:"1.5px solid var(--border-bright)",
              borderRadius:12, color:"var(--text-primary)", fontSize:14, outline:"none",
              transition:"border-color .2s",
            }}
            onFocus={e => e.target.style.borderColor = "var(--accent)"}
            onBlur={e => e.target.style.borderColor = "var(--border-bright)"}
          />
          <span style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)",
            fontSize:15, color:"var(--text-muted)" }}>@</span>
        </div>
        <button
          onClick={search}
          disabled={loading || !input.trim()}
          style={{
            padding:"13px 22px", borderRadius:12, border:"none",
            background:"var(--accent)", color:"#fff", fontWeight:700,
            fontSize:14, cursor: loading || !input.trim() ? "default" : "pointer",
            opacity: loading || !input.trim() ? 0.6 : 1,
            display:"flex", alignItems:"center", gap:8, transition:"opacity .2s",
          }}>
          {loading ? <><Spinner /> Searching…</> : "Search →"}
        </button>
      </div>
      {error && <p style={{ color:"var(--red)", fontSize:13, marginTop:8 }}>⚠️ {error}</p>}
    </div>
  );
}

/* ── Package picker (Step 3 — account mode) ─────────────────────────── */
function PackagePicker({ username, userData, onComplete, onBack }) {
  const [selected, setSelected] = useState([]);
  const pkgs = userData?.packages || [];

  function toggle(name) {
    setSelected(prev => prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]);
  }

  return (
    <div>
      <button onClick={onBack} style={{ background:"none", border:"none",
        color:"var(--text-muted)", cursor:"pointer", fontSize:13, marginBottom:20,
        padding:0, display:"flex", alignItems:"center", gap:4 }}>
        ← Back
      </button>

      <div className="ob-fade" style={{ marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
          <h2 style={{ fontSize:20, fontWeight:800, color:"var(--text-primary)", letterSpacing:"-.02em" }}>
            Select packages
          </h2>
          <button
            onClick={() => setSelected(pkgs.map(p => p.name))}
            style={{
              padding:"5px 12px", borderRadius:8, border:"1px solid var(--accent)",
              background:"var(--accent-dim)", color:"var(--accent)",
              fontSize:12, fontWeight:600, cursor:"pointer",
            }}>
            Select all
          </button>
        </div>
        <p style={{ fontSize:13, color:"var(--text-muted)" }}>
          {pkgs.length} packages found for <span style={{ color:"var(--accent)" }}>@{username}</span>
        </p>
      </div>

      <div style={{ maxHeight:260, overflowY:"auto", display:"flex", flexDirection:"column",
        gap:6, marginBottom:20, paddingRight:4 }}>
        {pkgs.map((pkg, i) => {
          const checked = selected.includes(pkg.name);
          return (
            <label
              key={pkg.name}
              className={`ob-fade-${Math.min(i + 1, 4)}`}
              style={{
                display:"flex", alignItems:"center", gap:12, padding:"11px 14px",
                background: checked ? "var(--accent-dim)" : "var(--bg-surface)",
                border:`1.5px solid ${checked ? "var(--accent)" : "var(--border)"}`,
                borderRadius:10, cursor:"pointer", transition:"all .15s",
              }}>
              <div style={{
                width:18, height:18, borderRadius:5, flexShrink:0,
                border:`2px solid ${checked ? "var(--accent)" : "var(--border-bright)"}`,
                background: checked ? "var(--accent)" : "transparent",
                display:"flex", alignItems:"center", justifyContent:"center",
                transition:"all .15s", fontSize:11, color:"#fff",
              }}>
                {checked ? "✓" : ""}
                <input type="checkbox" checked={checked} onChange={() => toggle(pkg.name)}
                  style={{ position:"absolute", opacity:0, width:0, height:0 }} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600, color:"var(--text-primary)" }}>{pkg.name}</div>
                {pkg.description && (
                  <div style={{ fontSize:11, color:"var(--text-muted)", overflow:"hidden",
                    textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{pkg.description}</div>
                )}
              </div>
              <div style={{ fontSize:11, color:"var(--text-muted)", flexShrink:0, fontFamily:"monospace" }}>
                v{pkg.version}
              </div>
            </label>
          );
        })}
      </div>

      <button
        onClick={() => onComplete({ username, packages: selected })}
        disabled={selected.length === 0}
        style={{
          width:"100%", padding:"13px", borderRadius:12, border:"none",
          background: selected.length
            ? "linear-gradient(135deg,var(--accent) 0%,var(--purple) 100%)"
            : "var(--bg-hover)",
          color: selected.length ? "#fff" : "var(--text-muted)",
          fontWeight:700, fontSize:15,
          cursor: selected.length ? "pointer" : "default",
          transition:"all .25s",
          boxShadow: selected.length ? "0 4px 20px var(--accent-glow)" : "none",
        }}>
        {selected.length > 0
          ? `Monitor ${selected.length} package${selected.length > 1 ? "s" : ""} →`
          : "Select at least one package"}
      </button>
      <p style={{ textAlign:"center", fontSize:12, color:"var(--text-muted)", marginTop:10 }}>
        You can add or remove packages any time from Settings
      </p>
    </div>
  );
}

/* ── Manual mode ─────────────────────────────────────────────────────── */
function ManualStep({ onBack, onComplete }) {
  const [val, setVal] = useState("");
  function finish() {
    const names = val.split(/[\n,\s]+/).map(s => s.trim()).filter(Boolean);
    if (names.length) onComplete({ username: null, packages: names });
  }
  return (
    <div>
      <button onClick={onBack} style={{ background:"none", border:"none",
        color:"var(--text-muted)", cursor:"pointer", fontSize:13, marginBottom:20,
        padding:0, display:"flex", alignItems:"center", gap:4 }}>
        ← Back
      </button>
      <div className="ob-fade" style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:22, fontWeight:800, color:"var(--text-primary)",
          letterSpacing:"-.02em", marginBottom:6 }}>Add packages manually</h2>
        <p style={{ fontSize:13, color:"var(--text-muted)" }}>
          Enter package names separated by commas, spaces, or new lines.
        </p>
      </div>
      <textarea
        value={val}
        onChange={e => setVal(e.target.value)}
        rows={6}
        placeholder={"express\nreact\n@myorg/my-lib"}
        style={{
          width:"100%", padding:"13px 14px",
          background:"var(--bg-surface)", border:"1.5px solid var(--border-bright)",
          borderRadius:12, color:"var(--text-primary)", fontSize:14, outline:"none",
          resize:"vertical", fontFamily:"var(--font-mono, monospace)",
          lineHeight:1.7, marginBottom:14, transition:"border-color .2s",
        }}
        onFocus={e => e.target.style.borderColor = "var(--accent)"}
        onBlur={e => e.target.style.borderColor = "var(--border-bright)"}
      />
      <button
        onClick={finish}
        disabled={!val.trim()}
        style={{
          width:"100%", padding:"13px", borderRadius:12, border:"none",
          background: val.trim()
            ? "linear-gradient(135deg,var(--accent) 0%,var(--purple) 100%)"
            : "var(--bg-hover)",
          color: val.trim() ? "#fff" : "var(--text-muted)",
          fontWeight:700, fontSize:15,
          cursor: val.trim() ? "pointer" : "default",
          transition:"all .25s",
          boxShadow: val.trim() ? "0 4px 20px var(--accent-glow)" : "none",
        }}>
        Start Monitoring →
      </button>
    </div>
  );
}

/* ── Welcome-back banner ─────────────────────────────────────────────── */
function WelcomeBack({ accounts, onResume }) {
  return (
    <div className="ob-fade" style={{
      padding:"16px 18px", borderRadius:14, marginBottom:24,
      background:"linear-gradient(135deg,rgba(79,156,249,.08) 0%,rgba(167,139,250,.06) 100%)",
      border:"1.5px solid rgba(79,156,249,.25)",
      boxShadow:"0 0 24px rgba(79,156,249,.07)",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
        <span style={{ fontSize:18 }}>👋</span>
        <span style={{ fontSize:14, fontWeight:700, color:"var(--text-primary)" }}>Welcome back!</span>
      </div>
      <p style={{ fontSize:13, color:"var(--text-muted)", marginBottom:12 }}>
        Your session expired but your data is safe. Re-link your account to restore access instantly.
      </p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:12 }}>
        {accounts.map(acc => (
          <button
            key={acc.username}
            onClick={() => onResume(acc.username)}
            style={{
              display:"flex", alignItems:"center", gap:8, padding:"7px 12px",
              borderRadius:10, border:"1px solid var(--accent)",
              background:"var(--accent-dim)", cursor:"pointer",
              fontSize:13, fontWeight:600, color:"var(--accent)",
            }}>
            <div style={{
              width:22, height:22, borderRadius:"50%",
              background:"linear-gradient(135deg,var(--accent),var(--purple))",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:11, fontWeight:800, color:"#fff",
            }}>{acc.username[0].toUpperCase()}</div>
            @{acc.username}
          </button>
        ))}
      </div>
      <p style={{ fontSize:11, color:"var(--text-muted)" }}>
        Or link a different account below ↓
      </p>
    </div>
  );
}

/* ── Root export ─────────────────────────────────────────────────────── */
export function Onboarding({ accounts = [], onComplete }) {
  // sub-view: null | "account" | "manual" | "pick"
  const [mode, setMode]         = useState(null);
  const [foundUser, setFoundUser] = useState(null);  // { query, data }
  const hasExisting = accounts.length > 0;

  const step = mode === null ? 1 : (mode === "account" && !foundUser) ? 2 : mode === "manual" ? 2 : 3;

  function handleResumeAccount(username) {
    // Pre-fill the username search in account mode
    setMode("account-prefill-" + username);
  }

  // If account mode was prefilled with a username, render UsernameStep with that pre-loaded
  // (For simplicity we just switch to account mode and let the user confirm)
  const resolvedMode = mode?.startsWith("account-prefill-") ? "account" : mode;

  return (
    <>
      <style>{css}</style>
      <div style={{
        minHeight:"100vh", display:"flex",
        background:"var(--bg-base)",
        fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif",
      }}>
        {/* Left brand panel — hidden on small screens */}
        <BrandPanel />

        {/* Right form panel */}
        <div style={{
          flex:1, display:"flex", alignItems:"center", justifyContent:"center",
          padding:"48px 40px", overflowY:"auto",
        }}>
          <div style={{ width:"100%", maxWidth:480 }}>
            {/* Step bar */}
            <StepBar step={step} total={resolvedMode === "manual" ? 2 : 3} />

            {/* Welcome-back banner */}
            {hasExisting && step === 1 && (
              <WelcomeBack accounts={accounts} onResume={handleResumeAccount} />
            )}

            {/* Step 1: choose mode */}
            {step === 1 && (
              <ModeCards onSelect={setMode} />
            )}

            {/* Step 2a: account username search */}
            {resolvedMode === "account" && !foundUser && (
              <UsernameStep
                onBack={() => setMode(null)}
                onFound={(q, data) => setFoundUser({ query: q, data })}
              />
            )}

            {/* Step 2b: manual */}
            {resolvedMode === "manual" && (
              <ManualStep
                onBack={() => setMode(null)}
                onComplete={onComplete}
              />
            )}

            {/* Step 3: package picker */}
            {resolvedMode === "account" && foundUser && (
              <PackagePicker
                username={foundUser.query}
                userData={foundUser.data}
                onComplete={onComplete}
                onBack={() => setFoundUser(null)}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
