import React, { useEffect, useRef, useState } from "react";

/* ─── Scroll reveal ─────────────────────────────────────────────────── */
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); o.disconnect(); } }, { threshold });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return [ref, vis];
}

function Reveal({ children, delay = 0 }) {
  const [ref, vis] = useInView();
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)", transition: `opacity .5s ${delay}ms, transform .5s ${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─── Typewriter ────────────────────────────────────────────────────── */
function Typewriter({ text, speed = 80 }) {
  const [out, setOut] = useState("");
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => { i++; setOut(text.slice(0, i)); if (i >= text.length) clearInterval(t); }, speed);
    return () => clearInterval(t);
  }, [text]);
  return <>{out}<span style={{ borderRight: "2px solid #10b981", marginLeft: 1, animation: "cur .9s step-end infinite" }} /></>;
}

/* ─── Components ────────────────────────────────────────────────────── */
function Tag({ children }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 4, border: "1px solid #1f1f1f", background: "#111", fontSize: 12, color: "#888", fontFamily: "monospace", letterSpacing: ".04em" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 6px #10b981" }} />
      {children}
    </span>
  );
}

function PrimaryBtn({ children, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ padding: "11px 24px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "inherit", background: hover ? "#0ea572" : "#10b981", color: "#000", transition: "background .15s", letterSpacing: "-.01em" }}>
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ padding: "10px 24px", borderRadius: 6, border: "1px solid " + (hover ? "#333" : "#222"), cursor: "pointer", fontSize: 14, fontWeight: 500, fontFamily: "inherit", background: hover ? "#111" : "transparent", color: hover ? "#fff" : "#888", transition: "all .15s" }}>
      {children}
    </button>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #1f1f1f 20%, #1f1f1f 80%, transparent)" }} />;
}

/* ─── Nav ───────────────────────────────────────────────────────────── */
function Nav({ onEnter }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 56, display: "flex", alignItems: "center", padding: "0 32px", justifyContent: "space-between", background: scrolled ? "rgba(10,10,10,.95)" : "rgba(10,10,10,.7)", backdropFilter: "blur(12px)", borderBottom: scrolled ? "1px solid #1a1a1a" : "1px solid transparent", transition: "all .3s" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 18 }}>🦅</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: "-.02em" }}>NPM Hawk</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        {["Features", "Health Score", "Security"].map(l => (
          <a key={l} href="#" onClick={e => { e.preventDefault(); const id = l.toLowerCase().replace(/ /g, "-"); const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }}
            style={{ fontSize: 13, color: "#666", textDecoration: "none", transition: "color .15s" }}
            onMouseEnter={e => e.target.style.color = "#ccc"}
            onMouseLeave={e => e.target.style.color = "#666"}>
            {l}
          </a>
        ))}
      </div>
      <button onClick={onEnter} style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #1f1f1f", background: "#111", color: "#ccc", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "#1f1f1f"; e.currentTarget.style.color = "#ccc"; }}>
        Open Dashboard →
      </button>
    </nav>
  );
}

/* ─── Hero ──────────────────────────────────────────────────────────── */
function Hero({ onEnter }) {
  return (
    <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 24px 80px", textAlign: "center" }}>
      <Reveal>
        <Tag>v1.0 — Now in beta</Tag>
        <h1 style={{ fontSize: "clamp(36px,5.5vw,72px)", fontWeight: 800, color: "#fff", lineHeight: 1.08, letterSpacing: "-.04em", margin: "28px 0 20px", maxWidth: 760 }}>
          Monitor your npm packages.<br />
          <span style={{ color: "#10b981" }}>All of them.</span>
        </h1>
        <p style={{ fontSize: 17, color: "#666", lineHeight: 1.7, maxWidth: 500, margin: "0 auto 40px" }}>
          Link your npm account, auto-discover your packages, and get real-time analytics on downloads, health scores, and security vulnerabilities.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <PrimaryBtn onClick={onEnter}>Link npm Account →</PrimaryBtn>
          <GhostBtn onClick={onEnter}>Open Demo</GhostBtn>
        </div>
      </Reveal>

      {/* Terminal block */}
      <Reveal delay={200}>
        <div style={{ marginTop: 64, width: "100%", maxWidth: 600, borderRadius: 10, overflow: "hidden", border: "1px solid #1a1a1a", background: "#0d0d0d", textAlign: "left" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", gap: 8 }}>
            {["#ff5f56","#ffbd2e","#27c93f"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
            <span style={{ fontSize: 11, color: "#444", marginLeft: 8, fontFamily: "monospace" }}>npm-hawk — terminal</span>
          </div>
          <div style={{ padding: "20px 24px", fontFamily: "monospace", fontSize: 13, lineHeight: 1.8 }}>
            <div><span style={{ color: "#444" }}>$</span> <span style={{ color: "#888" }}>npm-hawk link</span> <span style={{ color: "#10b981" }}><Typewriter text="sindresorhus" /></span></div>
            <div style={{ color: "#444", marginTop: 8 }}>✓ Found <span style={{ color: "#ccc" }}>250 packages</span> on npm</div>
            <div style={{ color: "#444" }}>✓ Fetching download stats<span style={{ color: "#10b981" }}>...</span></div>
            <div style={{ color: "#444" }}>✓ Scanning for vulnerabilities<span style={{ color: "#10b981" }}>...</span></div>
            <div style={{ color: "#10b981", marginTop: 8 }}>Dashboard ready at localhost:5173</div>
          </div>
        </div>
      </Reveal>

      {/* Package stat pills */}
      <Reveal delay={300}>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 32, flexWrap: "wrap" }}>
          {[
            { name: "react", dl: "130M/wk", grade: "B" },
            { name: "lodash", dl: "98M/wk", grade: "A" },
            { name: "express", dl: "45M/wk", grade: "B+" },
          ].map(p => (
            <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: 8, border: "1px solid #1a1a1a", background: "#0d0d0d" }}>
              <span style={{ fontSize: 12, color: "#555", fontFamily: "monospace" }}>📦</span>
              <span style={{ fontSize: 13, color: "#ccc", fontWeight: 600 }}>{p.name}</span>
              <span style={{ fontSize: 12, color: "#555" }}>{p.dl}</span>
              <span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, background: "#0f2a1e", color: "#10b981", fontWeight: 700 }}>{p.grade}</span>
            </div>
          ))}
        </div>
      </Reveal>
      <style>{`@keyframes cur { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </section>
  );
}

/* ─── Features ──────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: "↓", title: "Download Analytics", desc: "Weekly, monthly, and all-time download counts straight from the npm registry. Watch trends shift in real time.", tag: "npm API" },
  { icon: "⚑", title: "Security Scanning", desc: "Every package checked against OSV.dev — Google's open-source vulnerability database. CRITICAL to MODERATE, all surfaced.", tag: "OSV.dev" },
  { icon: "◎", title: "Health Score 0–100", desc: "Five-dimension composite score: Maintenance, Popularity, Quality, Security, and Community. Sourced from npms.io.", tag: "npms.io" },
  { icon: "★", title: "GitHub Integration", desc: "Stars, forks, open issues, last push, and license from the GitHub REST API — no token required for public repos.", tag: "GitHub API" },
  { icon: "⇌", title: "Package Comparison", desc: "Select up to 5 packages, compare overlaid download trends, health gauges, and a full side-by-side table.", tag: "Up to 5" },
  { icon: "◈", title: "Account Linking", desc: "Enter your npm username — we auto-discover every package where you're listed as a maintainer. 250+ packages, no config.", tag: "Zero config" },
];

function Features() {
  return (
    <section id="features" style={{ scrollMarginTop: 64 }} style={{ padding: "100px 24px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Reveal>
          <div style={{ marginBottom: 56 }}>
            <p style={{ fontSize: 12, color: "#10b981", fontFamily: "monospace", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 12 }}>Features</p>
            <h2 style={{ fontSize: "clamp(24px,3vw,40px)", fontWeight: 700, color: "#fff", letterSpacing: "-.03em", maxWidth: 480 }}>
              Everything your packages need watched
            </h2>
          </div>
        </Reveal>
        <Divider />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))" }}>
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 60}>
              <div style={{ padding: "28px 24px", borderRight: "1px solid #141414", borderBottom: "1px solid #141414", transition: "background .2s", cursor: "default" }}
                onMouseEnter={e => e.currentTarget.style.background = "#0d0d0d"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <span style={{ fontSize: 18, color: "#10b981" }}>{f.icon}</span>
                  <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, border: "1px solid #1f1f1f", color: "#555", fontFamily: "monospace" }}>{f.tag}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#e0e0e0", marginBottom: 8, letterSpacing: "-.01em" }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <Divider />
      </div>
    </section>
  );
}

/* ─── Health Score ───────────────────────────────────────────────────── */
const DIMS = [
  { label: "Maintenance", pts: 25, desc: "Commit recency & release cadence", color: "#10b981" },
  { label: "Security",    pts: 25, desc: "Known CVEs from OSV.dev",          color: "#f87171" },
  { label: "Popularity",  pts: 20, desc: "Weekly download volume & trend",   color: "#fbbf24" },
  { label: "Quality",     pts: 20, desc: "TS support, tests, documentation", color: "#a78bfa" },
  { label: "Community",   pts: 10, desc: "GitHub stars, forks, issues",      color: "#67e8f9" },
];

function HealthSection() {
  const [active, setActive] = useState(null);
  const circ = 2 * Math.PI * 54;
  let offset = 0;

  return (
    <section id="health-score" style={{ scrollMarginTop: 64 }} style={{ padding: "100px 24px", background: "#080808" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        <Reveal>
          <p style={{ fontSize: 12, color: "#10b981", fontFamily: "monospace", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 12 }}>Health Score</p>
          <h2 style={{ fontSize: "clamp(22px,2.5vw,36px)", fontWeight: 700, color: "#fff", letterSpacing: "-.03em", marginBottom: 16 }}>How we calculate the score</h2>
          <p style={{ fontSize: 14, color: "#555", lineHeight: 1.8, marginBottom: 32 }}>
            A 0–100 composite score across five weighted dimensions. Data from <span style={{ color: "#888" }}>npms.io</span> and <span style={{ color: "#888" }}>OSV.dev</span>.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {DIMS.map(d => (
              <div key={d.label}
                onMouseEnter={() => setActive(d.label)}
                onMouseLeave={() => setActive(null)}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", borderRadius: 6, background: active === d.label ? "#111" : "transparent", transition: "background .15s", cursor: "default" }}>
                <div style={{ width: 3, height: 32, borderRadius: 2, background: active === d.label ? d.color : "#1f1f1f", transition: "background .15s", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: active === d.label ? "#e0e0e0" : "#888", transition: "color .15s" }}>{d.label}</div>
                  <div style={{ fontSize: 12, color: "#444" }}>{d.desc}</div>
                </div>
                <span style={{ fontSize: 12, fontFamily: "monospace", color: active === d.label ? d.color : "#333", transition: "color .15s" }}>{d.pts}pts</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", width: 200, height: 200 }}>
              <svg width="200" height="200" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="60" cy="60" r="54" fill="none" stroke="#111" strokeWidth="10" />
                {DIMS.map(d => {
                  const len = (d.pts / 100) * circ;
                  const gap = 3;
                  const el = (
                    <circle key={d.label} cx="60" cy="60" r="54" fill="none"
                      stroke={active === d.label || active === null ? d.color : d.color + "33"}
                      strokeWidth={active === d.label ? 12 : 9}
                      strokeDasharray={`${len - gap} ${circ - len + gap}`}
                      strokeDashoffset={-offset}
                      style={{ transition: "all .25s" }} />
                  );
                  offset += len;
                  return el;
                })}
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 40, fontWeight: 800, color: "#fff", lineHeight: 1, letterSpacing: "-.04em" }}>79</span>
                <span style={{ fontSize: 11, color: "#555", fontFamily: "monospace", marginTop: 2 }}>/100</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#10b981", marginTop: 4 }}>Grade B</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Security ───────────────────────────────────────────────────────── */
const VULNS = [
  { pkg: "qs",          sev: "HIGH",     id: "GHSA-g53w",  desc: "Prototype pollution via query string" },
  { pkg: "handlebars",  sev: "CRITICAL", id: "GHSA-hg79",  desc: "RCE via eval() in template engine"   },
  { pkg: "minimatch",   sev: "MODERATE", id: "GHSA-cph5",  desc: "Regular expression denial of service" },
];
const SEV = { CRITICAL: "#f87171", HIGH: "#fbbf24", MODERATE: "#a78bfa" };

function SecuritySection() {
  return (
    <section id="security" style={{ scrollMarginTop: 64 }} style={{ padding: "100px 24px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        <Reveal>
          <p style={{ fontSize: 12, color: "#10b981", fontFamily: "monospace", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 12 }}>Security</p>
          <h2 style={{ fontSize: "clamp(22px,2.5vw,36px)", fontWeight: 700, color: "#fff", letterSpacing: "-.03em", marginBottom: 16 }}>Know before your users do</h2>
          <p style={{ fontSize: 14, color: "#555", lineHeight: 1.8, marginBottom: 28 }}>
            We query <span style={{ color: "#888" }}>OSV.dev</span> — Google's open vulnerability database — for every package in your watchlist. Severity, CVE ID, and advisory links, all in one view.
          </p>
          {["Scanned on every dashboard load", "CRITICAL / HIGH / MODERATE levels", "GitHub Advisory links", "Zero setup, no token needed"].map(t => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#555", marginBottom: 10 }}>
              <span style={{ color: "#10b981", fontSize: 14 }}>✓</span> {t}
            </div>
          ))}
        </Reveal>

        <Reveal delay={120}>
          <div style={{ border: "1px solid #1a1a1a", borderRadius: 10, overflow: "hidden", background: "#0a0a0a" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #141414", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: "#555", fontFamily: "monospace" }}>vulnerability report</span>
              <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "#1a0a0a", color: "#f87171" }}>3 found</span>
            </div>
            {VULNS.map((v, i) => (
              <div key={v.id} style={{ padding: "14px 16px", borderBottom: i < VULNS.length - 1 ? "1px solid #111" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 3, background: SEV[v.sev] + "18", color: SEV[v.sev], fontWeight: 700, fontFamily: "monospace" }}>{v.sev}</span>
                  <span style={{ fontSize: 12, color: "#888", fontFamily: "monospace" }}>{v.pkg}</span>
                  <span style={{ fontSize: 10, color: "#333", marginLeft: "auto", fontFamily: "monospace" }}>{v.id}</span>
                </div>
                <div style={{ fontSize: 13, color: "#555" }}>{v.desc}</div>
              </div>
            ))}
            <div style={{ padding: "10px 16px", borderTop: "1px solid #111", fontSize: 11, color: "#333", fontFamily: "monospace" }}>
              Powered by OSV.dev · Updated in real-time
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Stats ──────────────────────────────────────────────────────────── */
function Stats() {
  return (
    <Reveal>
      <div style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", border: "1px solid #141414", borderRadius: 8, background: "#080808", display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
          {[
            { v: "250+", l: "Packages per account" },
            { v: "OSV", l: "Vulnerability database" },
            { v: "5×", l: "Dimensions in health score" },
            { v: "Free", l: "No account required" },
          ].map((s, i) => (
            <div key={i} style={{ padding: "32px 24px", textAlign: "center", borderRight: i < 3 ? "1px solid #141414" : "none" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: "-.04em", marginBottom: 6 }}>{s.v}</div>
              <div style={{ fontSize: 12, color: "#444", fontFamily: "monospace" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

/* ─── CTA ────────────────────────────────────────────────────────────── */
function CTA({ onEnter }) {
  return (
    <section style={{ padding: "100px 24px 120px", textAlign: "center" }}>
      <Divider />
      <Reveal>
        <div style={{ paddingTop: 80 }}>
          <h2 style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 800, color: "#fff", letterSpacing: "-.04em", marginBottom: 16 }}>
            Start in 30 seconds.
          </h2>
          <p style={{ fontSize: 15, color: "#555", marginBottom: 36 }}>No account. No credit card. Just your npm username.</p>
          <PrimaryBtn onClick={onEnter}>Link npm Account →</PrimaryBtn>
        </div>
      </Reveal>
    </section>
  );
}

/* ─── Root export ────────────────────────────────────────────────────── */
export function Landing({ onEnter }) {
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = "#0a0a0a";
    return () => { document.body.style.background = prev; };
  }, []);

  return (
    <div style={{ fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", background: "#0a0a0a", color: "#e0e0e0", minHeight: "100vh", backgroundImage: "radial-gradient(circle, #1c1c1c 1px, transparent 1px)", backgroundSize: "28px 28px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      {/* Radial fade to kill dots at edges */}
      <div style={{ position:"fixed", inset:0, background:"radial-gradient(ellipse 80% 80% at 50% 0%, rgba(16,185,129,0.04) 0%, transparent 60%)", pointerEvents:"none", zIndex:0 }} />
      <Nav onEnter={onEnter} />
      <div style={{ paddingTop: 56 }}>
        <Hero onEnter={onEnter} />
        <Divider />
        <Features />
        <HealthSection />
        <Divider />
        <SecuritySection />
        <Divider />
        <Stats />
        <CTA onEnter={onEnter} />
      </div>
    </div>
  );
}


