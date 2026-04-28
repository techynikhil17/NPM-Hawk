import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter } from "react-router-dom";
import { useWatchlist }   from "./hooks/useWatchlist.js";
import { Landing }        from "./pages/Landing.jsx";
import { Onboarding }     from "./pages/Onboarding.jsx";
import { Dashboard }      from "./pages/Dashboard.jsx";
import { Compare }        from "./pages/Compare.jsx";
import { Settings }       from "./pages/Settings.jsx";
import { Header }         from "./components/layout/Header.jsx";
import { Sidebar }        from "./components/layout/Sidebar.jsx";
import { usePackageData } from "./hooks/usePackageData.js";

// ── Inactivity-based soft-lock session (30 minutes) ───────────────────
const SESSION_KEY       = "npm-hawk:session";
const INACTIVITY_TTL    = 30 * 60 * 1000;  // 30 minutes
const ACTIVITY_EVENTS   = ["mousemove", "keydown", "scroll", "click", "touchstart"];

function touchSession()   { localStorage.setItem(SESSION_KEY, Date.now().toString()); }
function clearSession()   { localStorage.removeItem(SESSION_KEY); }
function isSessionAlive() {
  const ts = parseInt(localStorage.getItem(SESSION_KEY) || "0", 10);
  return ts > 0 && Date.now() - ts < INACTIVITY_TTL;
}

// ── Security Overview ─────────────────────────────────────────────────
function SecurityView({ watchlist }) {
  const allNames = watchlist.map(p => p.name);
  const { data, loading } = usePackageData(allNames);
  const allVulns = allNames.flatMap(name =>
    (data[name]?.security?.vulnerabilities || []).map(v => ({ ...v, package: name }))
  );
  return (
    <div style={{ padding:"32px 24px", maxWidth:820 }}>
      <h1 style={{ fontSize:20, fontWeight:800, color:"var(--text-primary)", marginBottom:4 }}>Security Overview</h1>
      <p style={{ fontSize:12, color:"var(--text-muted)", marginBottom:24 }}>
        {loading ? "Scanning…" : `${allVulns.length} vulnerabilities · ${allNames.filter(n=>data[n]&&!(data[n]?.security?.count)).length} clean`}
      </p>
      {allVulns.length === 0 && !loading && (
        <div style={{ display:"flex", alignItems:"center", gap:14, padding:24, background:"var(--bg-panel)", border:"1px solid var(--border)", borderRadius:14 }}>
          <span style={{ fontSize:36 }}>✅</span>
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:"var(--green)" }}>All packages clean</div>
            <div style={{ fontSize:13, color:"var(--text-muted)" }}>No known vulnerabilities found.</div>
          </div>
        </div>
      )}
      {allVulns.map(v => (
        <div key={v.id + v.package} style={{ display:"flex", gap:12, padding:"14px 18px", background:"var(--bg-panel)", border:"1px solid var(--border)", borderRadius:12, marginBottom:10 }}>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6, flexWrap:"wrap" }}>
              <span style={{ fontSize:13, fontWeight:700, color:"var(--accent)" }}>{v.package}</span>
              <span style={{ fontSize:11, padding:"2px 8px", borderRadius:6, background:"var(--red-dim)", color:"var(--red)", fontWeight:700 }}>{v.severity}</span>
              <span style={{ fontSize:11, color:"var(--text-muted)", fontFamily:"monospace" }}>{v.id}</span>
            </div>
            <div style={{ fontSize:13, color:"var(--text-secondary)" }}>{v.summary}</div>
          </div>
        </div>
      ))}
      {loading && <div style={{ fontSize:13, color:"var(--text-muted)", padding:12 }}>⏳ Loading…</div>}
    </div>
  );
}

// ── Main shell ─────────────────────────────────────────────────────────
function AppShell() {
  const { accounts, watchlist, packageNames, linkAccount, unlinkAccount, addPackages, removePackage } = useWatchlist();

  // Always start at landing on tab open — user must actively enter
  const [showLanding, setShowLanding]   = useState(true);
  const [page, setPage]                 = useState("dashboard");
  const [focusedPackage, setFocused]    = useState(null);

  // ── Activity tracking: touch session on any interaction ──────────────
  const activityDebounce = useRef(null);
  useEffect(() => {
    if (showLanding) return; // no tracking while on landing
    function onActivity() {
      clearTimeout(activityDebounce.current);
      activityDebounce.current = setTimeout(() => touchSession(), 300);
    }
    ACTIVITY_EVENTS.forEach(ev => document.addEventListener(ev, onActivity, { passive: true }));
    return () => {
      ACTIVITY_EVENTS.forEach(ev => document.removeEventListener(ev, onActivity));
      clearTimeout(activityDebounce.current);
    };
  }, [showLanding]);

  // ── Inactivity watcher: check every 60 s ─────────────────────────────
  useEffect(() => {
    if (showLanding) return;
    const interval = setInterval(() => {
      if (!isSessionAlive()) {
        // Soft lock: only clear session, keep accounts/watchlist data intact
        clearSession();
        setShowLanding(true);
        setPage("dashboard");
        setFocused(null);
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, [showLanding]);

  const { data: sidebarData } = usePackageData(packageNames);

  // ── CTA handler: smart route based on session + account state ─────────
  function handleEnterApp() {
    if (isSessionAlive() && accounts.length > 0) {
      // Session alive + already linked → go straight to dashboard
      setShowLanding(false);
      setPage("dashboard");
    } else {
      // No active session or no account → onboarding (data preserved for re-link)
      touchSession();
      setShowLanding(false);
      setPage("__onboarding__");
    }
  }

  function handleSignOut() {
    clearSession();
    setShowLanding(true);
    setPage("dashboard");
    setFocused(null);
  }

  function handleOnboardingComplete({ username, packages: pkgs }) {
    if (username) linkAccount(username);
    if (pkgs.length) addPackages(pkgs, username || "manual");
    touchSession();
    setPage("dashboard");
  }

  // ── Render ──────────────────────────────────────────────────────────
  if (showLanding) return <Landing onEnter={handleEnterApp} />;

  if (page === "__onboarding__" && watchlist.length === 0) {
    return <Onboarding accounts={accounts} onComplete={handleOnboardingComplete} />;
  }
  // If they were on onboarding but already have packages (re-link scenario), skip to dashboard
  if (page === "__onboarding__" && watchlist.length > 0) {
    touchSession();
    setPage("dashboard");
    return null;
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", overflow:"hidden" }}>
      <Header
        accounts={accounts} watchlist={watchlist}
        onAddPackage={name => addPackages([name], "manual")}
        onNavigate={p => { setPage(p); if (p !== "dashboard") setFocused(null); }}
        currentPage={page}
        onSignOut={handleSignOut}
      />
      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
        <Sidebar
          accounts={accounts} watchlist={watchlist} packageData={sidebarData}
          activePackage={focusedPackage}
          onSelectPackage={name => { setFocused(name); setPage("dashboard"); }}
          onNavigate={p => { setPage(p); if (p !== "dashboard") setFocused(null); }}
          currentPage={page}
        />
        <main style={{ flex:1, overflowY:"auto" }}>
          {page === "dashboard" && <Dashboard watchlist={watchlist} focusedPackage={focusedPackage} onClearFocus={() => setFocused(null)} />}
          {page === "compare"   && <Compare watchlist={watchlist} />}
          {page === "security"  && <SecurityView watchlist={watchlist} />}
          {page === "settings"  && (
            <Settings accounts={accounts} watchlist={watchlist}
              onLinkAccount={linkAccount} onUnlinkAccount={unlinkAccount}
              onAddPackages={addPackages} onRemovePackage={removePackage} />
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return <BrowserRouter><AppShell /></BrowserRouter>;
}
